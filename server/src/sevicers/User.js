const bcrypt = require("bcrypt");
const userRepository = require("../repository/User")
const userPostJobs = require("../repository/PostJobs")
const jwt = require("jsonwebtoken");
const makeNumberToken = require("../ulti/makeToken");
const sendMail = require("../ulti/sendMail");
const crypto = require("crypto");
const seedrandom = require("seedrandom");

const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const genateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "500d" });
}

const genateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "500d" });
}

const RegisterUser = async (data) => {
    const { username, email, password, phone, role } = data;

    const isCheckemail = await userRepository.findByOne({ email });
    if (isCheckemail) {
        return { mes: "Email đã tồn tại!" };
    }

    const token = makeNumberToken(5);
    const emailEdi = btoa(email) + "@" + token;

    const reponse = await userRepository.createUser({
        username, email: emailEdi, password: bcrypt.hashSync(password, 10), phone, role
    })

    if (reponse) {
        const html = `<h2>Mật khẩu đăng kí</h2></br><b><blockquite>${token}</blockquite></b>`;
        const data = {
            email,
            html,
            subject: "Xác nhận đăng kí account tại Tuyển Dụng",
        }
        const rs = await sendMail(data);
    }

    setInterval(async () => {
        await userRepository.deletebyOne({ email: emailEdi });
    }, 3 * 60 * 1000);

    return {
        success: true,
        mes: "Vui lòng kiểm tra code trong email để hoàn tất đăng kí",
    }
}

const finalRegisterUser = async (data) => {
    const token = data;

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const re = new RegExp('@' + escapeRegex(token) + '$', 'i');

    const user = await userRepository.findByOne({ email: { $regex: re } });

    if (!user) {
        throw new Error('Mã đăng kí đã hết hạn hoặc không chính xác!');
    }

    if (!user.email.includes("@")) {
        throw new Error("Email trong DB sai định dạng.");
    }

    const encoded = user.email.split("@")[0];

    let decoded = "";
    try {
        decoded = Buffer.from(encoded, "base64").toString("utf8");
    } catch (error) {
        throw new Error("Email mã hoá không hợp lệ.");
    }

    user.email = decoded;
    await user.save();

    return {
        success: true,
        mes: "Đăng kí thành công",
    };
}

const LogoutUser = async (refreshToken) => {
    const user = await userRepository.findByOne({ refreshToken });
    if (!user) {
        throw new Error("Không tìm thấy user để đăng xuất");
    }
    user.refreshToken = "";
    await user.save();
    return;
}

const LoginUser = async (data) => {
    const { email, password } = data;

    const user = await userRepository.findByOne({ email });
    if (!user) {
        throw new Error("Email không tồn tại!");
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Mât khẩu không đúng");
    }

    const accessToken = genateAccessToken({ id: user._id, role: user.role, businessId: user.business || null });
    const refreshToken = genateRefreshToken({ id: user._id });
    user.refreshToken = refreshToken;
    await user.save();
    return {
        accessToken,
        refreshToken,
        success: true,
        mes: `Đăng nhập thành công`,
    };
}

const forgotPasswordUser = async (email) => {
    const user = await userRepository.findByOne({ email });
    if (!user) {
        throw new Error("Email không tồn tại!");
    }
    const token = makeNumberToken(5);
    const crypto = require("crypto");
    const hashedOtp = crypto.createHash("sha256").update(token).digest("hex");
    // Lưu vào DB
    user.resetpasswordOtp = hashedOtp;
    user.resetpasswordOtpExpire = Date.now() + 3 * 60 * 1000;
    await user.save();
    // Email HTML
    const html = `
        <h2>Mã xác nhận đặt lại mật khẩu</h2>
        <p>Vui lòng nhập mã bên dưới vào hệ thống để đổi mật khẩu:</p>
        <h1 style="letter-spacing: 5px;">${token}</h1>
        <p>Mã có hiệu lực trong <b>3 phút</b>.</p>
    `;

    await sendMail({
        email,
        html,
        subject: "Mã xác nhận đặt lại mật khẩu tại Tuyển Dụng",
    });

    return {
        success: true,
        mes: "Vui lòng kiểm tra email để lấy mã OTP",
    };
}

const resetPasswordUser = async ({ otp, newpassword }) => {
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await userRepository.findByOne({
        resetpasswordOtp: hashedOtp,
        resetpasswordOtpExpire: { $gt: Date.now() }
    });

    if (!user)
        throw new Error("OTP không chính xác hoặc đã hết hạn");

    user.password = bcrypt.hashSync(newpassword, 10);

    user.resetpasswordOtp = undefined;
    user.resetpasswordOtpExpire = undefined;

    await user.save();

    return {
        success: true,
        mes: "Đổi mật khẩu thành công"
    };
}

const refreshTokenUser = async (refreshToken) => {
    const user = await userRepository.findByOne({ refreshToken });
    if (!user) {
        throw new Error("Không tìm thấy user");
    }
    const newAccessToken = genateAccessToken({ id: user._id, role: user.role, businessId: user.business || null });
    const newRefreshToken = genateRefreshToken({ id: user._id });
    user.refreshToken = newRefreshToken;
    await user.save();
    return {
        data: {
            success: true,
            accessToken: newAccessToken,
        },
        refreshToken: newRefreshToken,
    };
}

const getSingleUser = async (id) => {
    const user = await userRepository.findByOne({ _id: id }).select('-refreshToken -password -resetpasswordOtp -resetpasswordOtpExpire');
    if (!user) {
        throw new Error("Không tìm thấy user");
    }
    return {
        success: true,
        data: user,
    };
}

const buildFilter = (queries) => {
    const filter = {};

    for (const key in queries) {
        const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);

        if (match) {
            const [, field, op] = match;
            filter[field] = filter[field] || {};
            filter[field][`$${op}`] = Number(queries[key]);
        }
        else if (key === "username") {
            filter.username = { $regex: queries[key], $options: "i" };
        }
        else {
            const value = queries[key];

            if (typeof value === "string" && value.includes(",")) {
                filter[key] = { $in: value.split(",") };
            } else {
                filter[key] = (!isNaN(value)) ? Number(value) : value;
            }
        }
    }
    return filter;
};

const getAllUser = async (queryParams) => {
    const excludeFields = ["limit", "sort", "page", "fields", "random", "seed"];
    const queries = { ...queryParams };

    excludeFields.forEach(el => delete queries[el]);

    const filter = buildFilter(queries);

    const limit = Number(queryParams.limit) || 20;
    const sort = queryParams.sort || "-createdAt";
    const page = Number(queryParams.page) || 1;
    const skip = (page - 1) * limit;
    const fields = queryParams.fields?.split(",").join(" ");
    const isRandom = queryParams.random === "true";
    const seed = queryParams.seed || "default-seed";

    if (isRandom) {
        const rng = seedrandom(seed);

        const allJobs = await userRepository.findAll(filter, { fields });

        const shuffled = allJobs
            .map(item => ({ item, sortKey: rng() }))
            .sort((a, b) => a.sortKey - b.sortKey)
            .map(el => el.item);

        const selected = shuffled.slice(skip, skip + limit);

        return {
            jobs: selected,
            total: allJobs.length,
            totalPages: Math.ceil(allJobs.length / limit),
            currentPage: page
        };
    }

    const [jobs, total] = await Promise.all([
        userRepository.findAll(filter, { fields, sort, skip, limit }),
        userRepository.countDocuments(filter)
    ]);

    return {
        data: jobs,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
}

const deleteUser = async (idu) => {
    const user = await userRepository.findByOne({ _id: idu });
    if (!user) {
        throw new Error("Không tìm thấy user để xóa");
    }
    await userRepository.deletebyOne({ _id: idu });
    return {
        success: true,
        mes: "Xóa user thành công",
    };
};

const deletebyadminUser = async (idu) => {
    const user = await userRepository.findByOne({ _id: idu });
    if (!user) {
        throw new Error("Không tìm thấy user để xóa");
    }

    if (user.role === "STAFF") {
        throw new Error("Không thể xóa tài khoản nhân viên, vui lòng liên hệ doanh nghiệp để xóa");
    }

    const existedInCV = await userPostJobs.findByOne({
        "listCV.idUser": idu
    });

    if (existedInCV) {
        throw new Error("Người dùng đã ứng tuyển không thể xóa");
    }

    await userRepository.deletebyOne({ _id: idu });

    return {
        success: true,
        mes: "Xóa user thành công",
    };
};


const changeStatusUser = async (idu) => {
    const user = await userRepository.findByOne({ _id: idu });
    if (!user) {
        throw new Error("Không tìm thấy user để xóa");
    }
    let status = "";

    if (user.status == "Active") {
        status = "Block"
    } else {
        status = "Active"
    }

    await userRepository.updatebyOne({ _id: idu }, { status });
    return {
        success: true,
        mes: "Thay đổi trạng thái thành công!",
    };
};

const updateUser = async (idu, data) => {
    const user = await userRepository.findByOne({ _id: idu });
    if (!user) {
        throw new Error("Không tìm thấy user để cập nhật");
    }

    const allowed = ["username", "phone", "avatar"];
    const safeData = {};

    allowed.forEach(field => {
        if (data[field] !== undefined) {
            safeData[field] = data[field];
        }
    });

    const updated = await userRepository.updatebyOne(
        { _id: idu },
        { $set: safeData },
        { new: true }
    );

    return {
        success: true,
        data: updated,
        mes: "Cập nhật user thành công",
    };
};

const changePasswordUser = async (idu, { oldpassword, newpassword }) => {
    const user = await userRepository.findByOne({ _id: idu });
    if (!user) {
        throw new Error("Không tìm thấy user để đổi mật khẩu");
    }
    const isPasswordValid = bcrypt.compareSync(oldpassword, user.password);
    if (!isPasswordValid) {
        throw new Error("Mật khẩu cũ không đúng");
    }
    user.password = bcrypt.hashSync(newpassword, 10);
    await user.save();
    return {
        success: true,
        mes: "Đổi mật khẩu thành công",
    };
}

const getDetailBusinessUser = async (iduser) => {
    const Business = await userRepository.findByOne({ _id: iduser }).populate('business');
    if (!Business) {
        throw new Error("Không tìm thấy Doanh nghiệp");
    }
    return {
        success: true,
        data: Business.business,
    };
}

const createStaffUser = async (businessId, data) => {
    const { email } = data;
    const exist = await userRepository.findByOne({ email: email });
    if (exist) {
        throw new Error("Email đã tồn tại");
    }
    const count = await userRepository.findAll({ business: businessId });
    console.log(count.length);
    if (count.length >= 5) {
        throw new Error("Doanh nghiệp đã đạt giới hạn 5 tài khoản");
    }
    const generatedPassword = makeNumberToken(8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const newUser = await userRepository.createUser({
        username: data.username,
        email,
        phone: data.phone,
        role: "STAFF",
        password: hashedPassword,
        business: businessId
    });

    const html = `
            <h2>Xin chào ${data.username}</h2>
            <p>Bạn đã được thêm vào hệ thống tuyển dụng công ty.</p>
            <p><b>Email:</b> ${data.email}</p>
            <p><b>Mật khẩu:</b> ${generatedPassword}</p>
            <p>Bạn có thể đăng nhập và vui lòng không chia mật khẩu.</p>
        `
    await sendMail({
        email,
        html,
        subject: "Mật khẩu tại Tuyển Dụng",
    });

    return {
        success: true,
        message: "Tạo nhân viên thành công. Mật khẩu đã gửi vào email.",
        staffId: newUser._id
    };
};

const createWishListJobUser = async (idUser, idJob) => {

    const user = await userRepository.findByOne({ _id: idUser });
    if (!user) throw new Error("Không tìm thấy user!");

    const index = user.wishlistJob.indexOf(idJob);

    if (index === -1) {

        user.wishlistJob.push(idJob);
        await user.save();

        return {
            success: true,
            message: "Đã thêm vào danh sách yêu thích",
        };
    } else {

        user.wishlistJob.splice(index, 1);
        await user.save();

        return {
            success: true,
            message: "Đã xoá khỏi danh sách yêu thích",
            isLiked: false
        };
    }
};

const createWishListBusinessUser = async (idUser, idJob) => {

    const user = await userRepository.findByOne({ _id: idUser });
    if (!user) throw new Error("Không tìm thấy user!");

    const index = user.wishlistJBusiness.indexOf(idJob);

    if (index === -1) {

        user.wishlistJBusiness.push(idJob);
        await user.save();

        return {
            success: true,
            message: "Đã thêm vào danh sách yêu thích",
        };
    } else {

        user.wishlistJBusiness.splice(index, 1);
        await user.save();

        return {
            success: true,
            message: "Đã xoá khỏi danh sách yêu thích",
            isLiked: false
        };
    }
};

const checkWishlistJobUser = async (idUser, idJob) => {
    const user = await userRepository.findByOne({ _id: idUser });

    const isLiked = user.wishlistJob.includes(idJob);

    return {
        success: true,
        isLiked
    };
}

const checkWishlistBusinessUser = async (idUser, idJob) => {
    const user = await userRepository.findByOne({ _id: idUser });
    const isLiked = user.wishlistJBusiness.includes(idJob);
    return {
        success: true,
        isLiked
    };
}

const wishlistjobUser = async (idUser) => {
    const user = await userRepository.findByOne({ _id: idUser })
        .populate("wishlistJob");
    if (!user) throw new Error("User not found");
    return {
        success: true,
        data: user.wishlistJob
    };
}

const wishlistbusinessUser = async (idUser) => {
    const user = await userRepository.findByOne({ _id: idUser })
        .populate("wishlistJBusiness");
    if (!user) throw new Error("User not found");

    return {
        success: true,
        data: user.wishlistJBusiness
    };
}

const listCVuploadUser = async (idUser) => {
    try {
        const jobs = await userPostJobs.findAll(
            { listCV: { $elemMatch: { idUser } } },
            {
                imageCover: 1,
                title: 1,
                salaryRange: 1,
                joblevel: 1,
                workType: 1,
                location: 1,
                business: 1,
                deadline: 1,
                createdAt: 1,
                listCV: 1
            }
        )
            .sort({ deadline: 1 })
            .populate("business", "nameBusiness addressBusiness imageAvatarBusiness")
            .lean();

        if (!jobs || jobs.length === 0) {
            return {
                success: true,
                data: []
            };
        }

        const result = jobs.map(job => ({
            ...job,
            listCV: job.listCV
                .filter(cv => cv.idUser.toString() === idUser.toString())
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }));

        return {
            success: true,
            data: result
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};



const _rateLimitStore = new Map();

function checkRateLimit(clientId, maxPerMinute = 20) {
    const now = Date.now();
    const record = _rateLimitStore.get(clientId) ?? { count: 0, reset: now + 60_000 };
    if (now > record.reset) {
        record.count = 0;
        record.reset = now + 60_000;
    }
    record.count++;
    _rateLimitStore.set(clientId, record);
    return record.count <= maxPerMinute;
}

function sanitizeInput(str = "") {
    return str
        .replace(/[<>"'`\\]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

async function callGroq(params, timeoutMs = 6000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await groq.chat.completions.create({ ...params });
        return res.choices[0]?.message?.content ?? null;
    } catch (err) {
        if (err.name === "AbortError") throw new Error("AI timeout");
        throw err;
    } finally {
        clearTimeout(timer);
    }
}

function matchesAny(text, keywords) {
    return keywords.some((k) =>
        new RegExp(`(^|\\s)${k}(\\s|$)`, "i").test(text)
    );
}

function buildRegexOr(keywords) {
    return keywords.flatMap((k) => [
        { title: { $regex: k, $options: "i" } },
        { jobs: { $regex: k, $options: "i" } },
        { skills: { $regex: k, $options: "i" } },
        { description: { $regex: k, $options: "i" } },
    ]);
}

async function queryJobs(query, sortOption, limitCount) {
    try {
        return await userPostJobs
            .findAll(query)
            .sort(sortOption)
            .limit(limitCount)
            .select("title jobs location joblevel salaryRange numberUpload deadline createdAt");
    } catch (err) {

        if (err.code === 27 || err.codeName === "IndexNotFound") {
            console.warn("[chatboxUser] Text index chưa có, dùng $regex fallback.");
            const { $text, ...regexQuery } = query;
            if ($text?.$search) {
                const kws = $text.$search.split(" ").filter(Boolean);
                regexQuery.$or = buildRegexOr(kws);
            }
            return await userPostJobs
                .findAll(regexQuery)
                .sort(sortOption)
                .limit(limitCount)
                .select("title jobs location joblevel salaryRange numberUpload deadline createdAt");
        }
        throw err;
    }
}



const CONSTANTS = {
    MAX_MESSAGE_LENGTH: 500,
    MIN_MESSAGE_LENGTH: 2,
    RATE_LIMIT_COUNT: 20,
    DEFAULT_JOB_LIMIT: 5,
    MAX_JOB_LIMIT: 10,
};

const SYNONYMS = {
    cntt: "công nghệ thông tin",
    it: "công nghệ thông tin",
    hcm: "hồ chí minh",
    sg: "hồ chí minh",
    "sài gòn": "hồ chí minh",
    saigon: "hồ chí minh",
    dn: "đà nẵng",
    "da nang": "đà nẵng",
    hn: "hà nội",
    "ha noi": "hà nội",
    dev: "developer",
    fe: "frontend",
    be: "backend",
    fs: "full-stack",
    fullstack: "full-stack",
    "full stack": "full-stack",
    ui: "designer",
    ux: "designer",
    "ui/ux": "designer",
    ba: "business analyst",
    pm: "product manager",
    po: "product owner",
    hr: "nhân sự",
    "nhân sự": "hr",
    acc: "kế toán",
    accountant: "kế toán",
    mk: "marketing",
    mkt: "marketing",
    sale: "kinh doanh",
    "kinh doanh": "sales",
    "bán hàng": "sales",
    intern: "thực tập",
    "thực tập sinh": "intern",
    tts: "intern",
    fresher: "fresher",
    "mới ra trường": "fresher",
    senior: "senior",
    "sr.": "senior",
    junior: "junior",
    "jr.": "junior",
    mid: "middle",
    lead: "team lead",
    "trưởng nhóm": "team lead",
};

const KEYWORD_SETS = {
    job: new Set([
        "việc", "job", "jobs", "tuyển", "tuyển dụng", "ứng tuyển",
        "react", "node", "nodejs", "java", "python", "php", "ruby", "golang", "go",
        "swift", "kotlin", "flutter", "dart", "c#", "dotnet", ".net",
        "typescript", "javascript", "vue", "angular", "nextjs", "nuxt",
        "frontend", "backend", "full-stack", "fullstack", "developer", "engineer",
        "kế toán", "marketing", "designer", "devops", "mobile", "android", "ios",
        "senior", "junior", "fresher", "intern", "tts", "thực tập",
        "lập trình", "tester", "qa", "qc", "data", "analyst", "ba",
        "product manager", "pm", "scrum", "agile", "kinh doanh", "sales", "sale",
        "nhân sự", "hr", "kế toán", "accountant", "digital", "seo", "content",
    ]),
    career: new Set([
        "nghề", "ngành", "tư vấn", "chọn nghề", "nên học", "ngành hot",
        "ngành nào", "tương lai", "lương cao", "dễ xin việc", "nghề gì",
        "career", "học gì", "có nên học", "cơ hội", "lộ trình", "roadmap",
        "học như thế nào", "bắt đầu từ đâu", "kỹ năng cần", "yêu cầu",
        "mức lương", "xu hướng", "triển vọng", "nên chọn",
    ]),
};

const LOCATION_MAP = [
    { keys: ["hà nội", " hn ", "ha noi"], label: "Hà Nội" },
    { keys: ["đà nẵng", " dn ", "da nang"], label: "Đà Nẵng" },
    { keys: ["hồ chí minh", "hcm", "sài gòn", "saigon", "ho chi minh"], label: "Hồ Chí Minh" },
    { keys: ["cần thơ", "can tho"], label: "Cần Thơ" },
    { keys: ["hải phòng", "hai phong"], label: "Hải Phòng" },
];

const STOP_WORDS = new Set([
    "các", "job", "jobs", "việc", "làm", "mới", "nhất", "tại",
    "tìm", "cần", "tuyển", "cho", "tôi", "giúp", "hãy", "một",
    "những", "có", "và", "hoặc", "ở", "từ", "xem", "hiện",
    "với", "về", "trong", "của", "là", "được", "đang", "sẽ",
    "rất", "này", "đó", "vậy", "nào", "nhiều", "ít", "thêm",
]);

const matchesKeywordSet = (text, keywordSet) => {
    for (const kw of keywordSet) {
        if (text.includes(kw)) return true;
    }
    return false;
};

const normalizeInput = (raw) => {
    let text = raw.toLowerCase().replace(/[?.,!;:""'']/g, " ").replace(/\s+/g, " ").trim();
    const sortedSynonyms = Object.entries(SYNONYMS).sort((a, b) => b[0].length - a[0].length);
    for (const [from, to] of sortedSynonyms) {
        text = text.replace(new RegExp(`\\b${from}\\b`, "g"), to);
    }
    return text;
};

const detectIntent = (normalizedMsg) => {
    const isJob = matchesKeywordSet(normalizedMsg, KEYWORD_SETS.job);
    const isCareer = matchesKeywordSet(normalizedMsg, KEYWORD_SETS.career);
    return { isJob, isCareer, isMixed: isJob && isCareer };
};

const JOB_SELECT_FIELDS = "title jobs location joblevel salaryRange numberUpload deadline createdAt view";

const buildJobQuery = (normalizedMsg, now) => {
    const baseQuery = {
        status: "active",
        statusPause: false,
        deadline: { $gte: now },
    };

    for (const loc of LOCATION_MAP) {
        if (loc.keys.some((k) => normalizedMsg.includes(k))) {
            baseQuery.location = { $regex: loc.label, $options: "i" };
            break;
        }
    }

    const levelMap = {
        senior: "Senior", junior: "Junior", fresher: "Fresher",
        intern: "Intern", "thực tập": "Intern", middle: "Middle", lead: "Lead",
    };
    for (const [key, val] of Object.entries(levelMap)) {
        if (normalizedMsg.includes(key)) {
            baseQuery.joblevel = { $regex: val, $options: "i" };
            break;
        }
    }

    if (normalizedMsg.includes("lương cao") || normalizedMsg.includes("lương tốt")) {
        baseQuery["salaryRange.min"] = { $gte: 15000000 };
    }

    let sortOption = { createdAt: -1 };
    if (normalizedMsg.includes("view cao") || normalizedMsg.includes("xem nhiều")) {
        sortOption = { view: -1 };
    } else if (normalizedMsg.includes("nộp nhiều") || normalizedMsg.includes("ứng tuyển nhiều")) {
        sortOption = { numberUpload: -1 };
    } else if (normalizedMsg.includes("lương cao")) {
        sortOption = { "salaryRange.max": -1 };
    }

    const keywords = normalizedMsg
        .split(/\s+/)
        .filter((k) => k.length >= 2 && !STOP_WORDS.has(k))
        .filter((k, i, arr) => arr.indexOf(k) === i);

    const numberMatch = normalizedMsg.match(/\d+/);
    const limitCount = numberMatch
        ? Math.min(Math.max(parseInt(numberMatch[0]), 1), CONSTANTS.MAX_JOB_LIMIT)
        : CONSTANTS.DEFAULT_JOB_LIMIT;

    return { baseQuery, sortOption, limitCount, keywords };
};

const queryJobsWithFallback = async (baseQuery, keywords, sortOption, limitCount) => {
    if (keywords.length > 0) {
        try {
            const textQuery = { ...baseQuery, $text: { $search: keywords.join(" ") } };
            const results = await userPostJobs
                .findAll(textQuery)
                .sort(sortOption)
                .limit(limitCount)
                .select(JOB_SELECT_FIELDS);

            if (results.length > 0) return { jobs: results, strategy: "text" };
        } catch (err) {
            if (!err.message?.includes("text index")) {
                throw err;
            }
            console.warn("[queryJobsWithFallback] Text index unavailable, using $regex fallback.");
        }
    }

    if (keywords.length > 0) {
        try {
            const regexConditions = keywords.map((kw) => {
                const pattern = { $regex: kw, $options: "i" };
                return { $or: [{ title: pattern }, { jobs: pattern }] };
            });

            const regexQuery = {
                ...baseQuery,
                $or: regexConditions.flatMap((c) => c.$or),
            };

            const results = await userPostJobs
                .findAll(regexQuery)
                .sort(sortOption)
                .limit(limitCount)
                .select(JOB_SELECT_FIELDS);

            if (results.length > 0) return { jobs: results, strategy: "regex" };
        } catch (err) {
            console.warn("[queryJobsWithFallback] $regex query failed:", err.message);
        }
    }

    try {
        const results = await userPostJobs
            .findAll(baseQuery)
            .sort({ createdAt: -1 })
            .limit(3)
            .select(JOB_SELECT_FIELDS);

        return { jobs: results, strategy: "base" };
    } catch (err) {
        console.warn("[queryJobsWithFallback] Base query also failed:", err.message);
        return { jobs: [], strategy: "none" };
    }
};

const formatJobContext = (jobs) =>
    jobs.map((j, i) => {
        const salary = j.salaryRange
            ? typeof j.salaryRange === "object"
                ? `${(j.salaryRange.min / 1e6).toFixed(0)}–${(j.salaryRange.max / 1e6).toFixed(0)}tr`
                : j.salaryRange.toString()
            : "Thỏa thuận";
        const deadline = j.deadline
            ? new Date(j.deadline).toLocaleDateString("vi-VN")
            : "Không rõ";
        return (
            `[${i + 1}] ${j.title} | ${j.jobs} | ${j.location}\n` +
            `    Lương: ${salary} | Cấp: ${j.joblevel ?? "—"} | Hạn: ${deadline}`
        );
    }).join("\n");

const AI_SYSTEM = {
    jobAdvisor: `Bạn là chatbot tuyển dụng Việt Nam, thân thiện và ngắn gọn.
Quy tắc:
- Chỉ nhận xét về job trong danh sách, không bịa thêm
- Tối đa 3 câu, tiếng Việt
- Nêu job nổi bật và lý do ngắn gọn`,

    careerAdvisor: `Bạn là chuyên gia tư vấn nghề nghiệp Việt Nam.
Quy tắc:
- Trả lời thực tế, có số liệu nếu biết, tối đa 4 câu
- Không bịa thông tin, tiếng Việt`,
};

const chatboxUser = async (data) => {
    try {
        const clientId = data.userId ?? data.ip ?? "anon";
        if (!checkRateLimit(clientId, CONSTANTS.RATE_LIMIT_COUNT)) {
            return {
                success: false,
                message: "Quá nhiều yêu cầu, vui lòng thử lại sau 1 phút.",
            };
        }

        const raw = data.message ?? "";
        if (!raw || raw.trim().length < CONSTANTS.MIN_MESSAGE_LENGTH) {
            return {
                success: true,
                reply: "Bạn hãy nhập rõ hơn. Ví dụ: 'việc React tại Hà Nội' hoặc 'ngành IT nên học gì'",
                jobs: [],
            };
        }

        const sanitized = sanitizeInput(raw);
        if (sanitized.length > CONSTANTS.MAX_MESSAGE_LENGTH) {
            return {
                success: true,
                reply: `Tin nhắn quá dài (tối đa ${CONSTANTS.MAX_MESSAGE_LENGTH} ký tự), vui lòng rút gọn.`,
                jobs: [],
            };
        }

        const normalizedMsg = normalizeInput(sanitized);
        const { isJob, isCareer } = detectIntent(normalizedMsg);

        if (!isJob && !isCareer) {
            return {
                success: true,
                reply:
                    "Tôi có thể giúp bạn:\n" +
                    "• Tìm việc: 'việc React Hà Nội', 'senior backend lương cao'\n" +
                    "• Tư vấn nghề: 'ngành IT có nên học không', 'lộ trình trở thành DevOps'",
                jobs: [],
            };
        }

        const now = new Date();
        let jobs = [];
        let reply = "";

        if (isCareer) {
            const careerFallback =
                "Các ngành hot hiện nay: Công nghệ thông tin (đặc biệt AI/ML, Cloud, Cybersecurity), " +
                "Digital Marketing, Data Analyst, UX/UI Design và Thương mại điện tử.";
            try {
                reply = await callGroq({
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.6,
                    max_tokens: 300,
                    messages: [
                        { role: "system", content: AI_SYSTEM.careerAdvisor },
                        { role: "user", content: sanitized },
                    ],
                }) ?? careerFallback;
            } catch {
                reply = careerFallback;
            }

            if (!isJob) {
                return { success: true, reply, jobs: [] };
            }
        }

        const { baseQuery, sortOption, limitCount, keywords } = buildJobQuery(normalizedMsg, now);
        const { jobs: foundJobs, strategy } = await queryJobsWithFallback(baseQuery, keywords, sortOption, limitCount);
        jobs = foundJobs;

        if (strategy === "regex") {
            console.info("[chatboxUser] Used $regex fallback (text index unavailable).");
        } else if (strategy === "base") {
            console.info("[chatboxUser] No keyword match, returning latest jobs by baseQuery.");
        }

        if (jobs.length === 0) {
            return {
                success: true,
                reply:
                    `Chưa tìm thấy công việc phù hợp với "${sanitized}".\n` +
                    "Thử từ khóa khác: React, Python, Marketing, Kế toán, Designer...",
                jobs: [],
            };
        }

        if (!reply) {
            const context = formatJobContext(jobs);
            try {
                reply = await callGroq({
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.4,
                    max_tokens: 250,
                    messages: [
                        { role: "system", content: AI_SYSTEM.jobAdvisor },
                        {
                            role: "user",
                            content: `Câu hỏi: ${sanitized}\n\nJob tìm được:\n${context}`,
                        },
                    ],
                }) ?? `Tìm thấy ${jobs.length} việc làm phù hợp cho bạn.`;
            } catch {
                reply = `Tìm thấy ${jobs.length} việc làm phù hợp cho bạn.`;
            }
        } else {
            reply += `\n\nDưới đây là ${jobs.length} công việc liên quan bạn có thể tham khảo:`;
        }
        return { success: true, reply, jobs };
    } catch (error) {
        console.error("[chatboxUser] Unhandled error:", error);
        return {
            success: false,
            message: "Đã xảy ra lỗi, vui lòng thử lại.",
        };
    }
};


const getNotificationsUser = async (idUser) => {
    const user = await userRepository.findByOne({ _id: idUser });
    if (!user) {
        throw new Error("Không tìm thấy user");
    }
    return {
        success: true,
        data: user.notifications || [],
    };
}

const markNotificationAsReadUser = async (idUser) => {
    const user = await userRepository.findByOne({ _id: idUser });
    if (!user) {
        throw new Error("Không tìm thấy user");
    }
    user.notifications = user.notifications.map(n => ({ ...n, isRead: true }));
    await user.save();
    return {
        success: true,
        mes: "Đã đánh dấu tất cả thông báo là đã đọc",
    };
}

module.exports = {
    RegisterUser,
    LoginUser,
    finalRegisterUser,
    LogoutUser,
    forgotPasswordUser,
    resetPasswordUser,
    refreshTokenUser,
    getSingleUser,
    getAllUser,
    deleteUser,
    deletebyadminUser,
    changeStatusUser,
    updateUser,
    changePasswordUser,
    getDetailBusinessUser,
    createStaffUser,
    createWishListJobUser,
    createWishListBusinessUser,
    checkWishlistJobUser,
    checkWishlistBusinessUser,
    wishlistjobUser,
    wishlistbusinessUser,
    listCVuploadUser,
    chatboxUser,
    getNotificationsUser,
    markNotificationAsReadUser,
};