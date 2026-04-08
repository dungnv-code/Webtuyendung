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

const deletebyadminUser = async (idu) => {
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


const chatboxUser = async (data) => {
    try {

        const clientId = data.userId ?? data.ip ?? "anon";
        if (!checkRateLimit(clientId, 20)) {
            return {
                success: false,
                message: "Quá nhiều yêu cầu, vui lòng thử lại sau 1 phút.",
            };
        }

        const raw = data.message ?? "";
        if (!raw || raw.trim().length < 2) {
            return {
                success: true,
                reply: "Bạn hãy nhập rõ hơn, ví dụ: 'việc React tại Hà Nội'",
                jobs: [],
            };
        }

        const message = sanitizeInput(raw);

        if (message.length > 500) {
            return {
                success: true,
                reply: "Tin nhắn quá dài, vui lòng rút gọn dưới 500 ký tự.",
                jobs: [],
            };
        }

        const msgLower = message.toLowerCase().replace(/[?.,!]/g, "");
        const now = new Date();

        const synonyms = {
            cntt: "công nghệ thông tin",
            it: "công nghệ thông tin",
            hcm: "hồ chí minh",
            sg: "hồ chí minh",
            sài: "hồ chí minh",
            saigon: "hồ chí minh",
            dn: "đà nẵng",
            hn: "hà nội",
            dev: "developer",
            fe: "frontend",
            be: "backend",
            fs: "full-stack",
            fullstack: "full-stack",
        };

        const jobKeywords = [
            "việc", "job", "tuyển", "react", "node", "java", "python", "php",
            "frontend", "backend", "full-stack", "fullstack", "developer",
            "engineer", "kế toán", "marketing", "designer", "devops", "mobile",
            "senior", "junior", "fresher", "intern", "lập trình", "tester", "qa",
            "data", "analyst", "pm", "product manager",
        ];

        const careerKeywords = [
            "nghề", "ngành", "tư vấn", "chọn nghề", "nên học", "ngành hot",
            "ngành nào", "tương lai", "lương cao", "dễ xin việc", "nghề gì",
            "career", "học gì", "có nên học", "cơ hội",
        ];

        const isJobQuestion = matchesAny(msgLower, jobKeywords);
        const isCareerQuestion = matchesAny(msgLower, careerKeywords);

        if (!isJobQuestion && !isCareerQuestion) {
            return {
                success: true,
                reply:
                    "Tôi có thể giúp tìm việc hoặc tư vấn nghề nghiệp.\n" +
                    "Ví dụ: 'việc React Hà Nội' hoặc 'ngành nào đang hot 2024'.",
                jobs: [],
            };
        }

        if (isCareerQuestion && !isJobQuestion) {
            const fallback =
                "Hiện nay các ngành hot gồm: Công nghệ thông tin, Digital Marketing, " +
                "Thương mại điện tử, Data Analyst và Thiết kế UX/UI.";
            try {
                const reply = await callGroq({
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.6,
                    max_tokens: 300,
                    messages: [
                        {
                            role: "system",
                            content:
                                "Bạn là chuyên gia tư vấn nghề nghiệp cho website tuyển dụng Việt Nam.\n" +
                                "Quy tắc:\n" +
                                "- Trả lời bằng tiếng Việt, tối đa 4 câu\n" +
                                "- Nội dung thực tế, có số liệu nếu biết\n" +
                                "- Không bịa thông tin",
                        },
                        { role: "user", content: message },
                    ],
                });
                return { success: true, reply: reply ?? fallback, jobs: [] };
            } catch {
                return { success: true, reply: fallback, jobs: [] };
            }
        }

        const query = {
            status: "active",
            statusPause: false,
            deadline: { $gte: now },
        };

        const numberMatch = msgLower.match(/\d+/);
        const limitCount = numberMatch
            ? Math.min(Math.max(parseInt(numberMatch[0]), 1), 10)
            : 5;


        const locationMap = [
            { keys: ["hà nội", " hn "], regex: "Hà Nội" },
            { keys: ["đà nẵng", " dn "], regex: "Đà Nẵng" },
            { keys: ["hồ chí minh", "hcm", "sài gòn", "saigon"], regex: "Hồ Chí Minh" },
        ];
        for (const loc of locationMap) {
            if (loc.keys.some((k) => msgLower.includes(k))) {
                query.location = { $regex: loc.regex, $options: "i" };
                break;
            }
        }

        let sortOption = { createdAt: -1 };
        if (msgLower.includes("view cao") || msgLower.includes("xem nhiều")) {
            sortOption = { view: -1 };
        } else if (msgLower.includes("nộp nhiều") || msgLower.includes("ứng tuyển nhiều")) {
            sortOption = { numberUpload: -1 };
        }

        const stopWords = new Set([
            "các", "job", "jobs", "việc", "làm", "mới", "nhất", "tại",
            "tìm", "cần", "tuyển", "cho", "tôi", "giúp", "hãy", "một",
            "những", "có", "và", "hoặc", "ở", "từ",
        ]);


        const processedKeywords = msgLower
            .split(/\s+/)
            .filter((k) => k.length >= 2 && !stopWords.has(k))
            .map((k) => synonyms[k] ?? k)
            .filter((k, i, arr) => arr.indexOf(k) === i);
        if (processedKeywords.length > 0) {
            query.$text = { $search: processedKeywords.join(" ") };
        }

        let jobs = await queryJobs(query, sortOption, limitCount);

        if (jobs.length === 0) {
            const { $text, $or, ...baseQuery } = query;
            jobs = await userPostJobs
                .findAll(baseQuery)
                .sort({ createdAt: -1 })
                .limit(3)
                .select("title jobs location joblevel salaryRange numberUpload deadline createdAt");
        }

        if (jobs.length === 0) {
            return {
                success: true,
                reply:
                    "Hiện chưa tìm thấy công việc phù hợp.\n" +
                    "Bạn có thể thử: React, Marketing, Kế toán, Designer...",
                jobs: [],
            };
        }


        const context = jobs
            .map((j, i) => {
                const salary = j.salaryRange?.toString() || "Thỏa thuận";
                const deadline = j.deadline
                    ? new Date(j.deadline).toLocaleDateString("vi-VN")
                    : "Không rõ";
                return (
                    `[${i + 1}] ${j.title}\n` +
                    `  Ngành: ${j.jobs} | Địa điểm: ${j.location}\n` +
                    `  Lương: ${salary} | Hạn nộp: ${deadline} | Lượt xem: ${j.joblevel ?? 0}`
                );
            })
            .join("\n\n");

        let reply = `Tôi tìm thấy ${jobs.length} công việc phù hợp cho bạn.`;

        try {
            const aiReply = await callGroq({
                model: "llama-3.3-70b-versatile",
                temperature: 0.4,
                max_tokens: 300,
                messages: [
                    {
                        role: "system",
                        content:
                            "Bạn là chatbot tuyển dụng thân thiện.\n" +
                            "Quy tắc:\n" +
                            "- Chỉ trả lời về việc làm trong danh sách\n" +
                            "- Không bịa thêm thông tin\n" +
                            "- Tối đa 3 câu, tiếng Việt\n" +
                            "- Có thể gợi ý job nổi bật nhất",
                    },
                    {
                        role: "user",
                        content: `Câu hỏi: ${message}\n\nDanh sách việc làm:\n${context}`,
                    },
                ],
            });
            if (aiReply) reply = aiReply;
        } catch (aiErr) {
            console.warn("[chatboxUser] AI error:", aiErr.message);
        }

        return { success: true, reply, jobs };

    } catch (error) {
        console.error("[chatboxUser] Unhandled error:", error);
        return { success: false, message: error.message };
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