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
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "7h" });
}

const genateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
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
    // lấy phần base64
    const encoded = user.email.split("@")[0];

    let decoded = "";
    try {
        decoded = Buffer.from(encoded, "base64").toString("utf8");
    } catch (error) {
        throw new Error("Email mã hoá không hợp lệ.");
    }
    // lưu email đã decode
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
    const token = makeNumberToken(5); // ví dụ: 48392

    // Hash OTP trước khi lưu
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
    // Tìm user theo OTP hash + còn hạn
    const user = await userRepository.findByOne({
        resetpasswordOtp: hashedOtp,
        resetpasswordOtpExpire: { $gt: Date.now() }
    });

    if (!user)
        throw new Error("OTP không chính xác hoặc đã hết hạn");

    // Đổi mật khẩu
    user.password = bcrypt.hashSync(newpassword, 10);

    // Xoá OTP để không dùng lại nữa
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

    // Job populate ví dụ
    // const populate = { path: "business", select: "name logo" };

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

    // Chỉ cho phép cập nhật 1 số field
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
        { new: true } // quan trọng để lấy user sau khi cập nhật
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

    // 2. Tạo password random
    const generatedPassword = makeNumberToken(8);

    // 3. Hash mật khẩu
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // 4. Tạo user
    const newUser = await userRepository.createUser({
        username: data.username,
        email,
        phone: data.phone,
        role: "STAFF",
        password: hashedPassword,
        business: businessId
    });

    // 5. Gửi email mật khẩu cho nhân viên
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
            { listCV: { $elemMatch: { idUser } } },   // lọc job có CV của user
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
            listCV: job.listCV.filter(
                cv => cv.idUser.toString() === idUser.toString()
            )
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

const chatboxUser = async (data) => {
    try {

        const { message } = data;

        if (!message || message.trim().length < 2) {
            return {
                success: true,
                reply: "Bạn hãy nhập rõ hơn ví dụ: 'việc React tại Hà Nội'",
                jobs: []
            };
        }

        const messageLower = message.toLowerCase().replace(/[?.,!]/g, "");
        const now = new Date();

        // synonym từ viết tắt
        const synonyms = {
            cntt: "công nghệ thông tin",
            it: "công nghệ thông tin",
            hcm: "hồ chí minh",
            sg: "hồ chí minh",
            dn: "đà nẵng",
            hn: "hà nội"
        };

        // keyword tìm việc
        const jobKeywords = [
            "việc",
            "job",
            "tuyển",
            "react",
            "node",
            "java",
            "frontend",
            "backend",
            "kế toán",
            "marketing",
            "developer",
            "engineer"
        ];

        // keyword tư vấn nghề
        const careerKeywords = [
            "nghề",
            "ngành",
            "tư vấn",
            "chọn nghề",
            "nên học",
            "ngành hot",
            "ngành nào",
            "tương lai",
            "lương cao",
            "dễ xin việc",
            "nghề gì",
            "career"
        ];

        const isJobQuestion = jobKeywords.some(k => messageLower.includes(k));
        const isCareerQuestion = careerKeywords.some(k => messageLower.includes(k));

        if (!isJobQuestion && !isCareerQuestion) {
            return {
                success: true,
                reply: "Tôi có thể giúp tìm việc hoặc tư vấn nghề nghiệp. Ví dụ: 'việc React Hà Nội' hoặc 'ngành nào đang hot'.",
                jobs: []
            };
        }

        // =============================
        // TƯ VẤN NGHỀ NGHIỆP (AI)
        // =============================

        if (isCareerQuestion && !isJobQuestion) {

            try {

                const chatCompletion = await groq.chat.completions.create({
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.6,
                    messages: [
                        {
                            role: "system",
                            content: `
Bạn là chuyên gia tư vấn nghề nghiệp cho website tuyển dụng.

Quy tắc:
- Trả lời ngắn gọn
- Tối đa 4 câu
- Nội dung thực tế
- Có thể gợi ý ngành đang tuyển nhiều
`
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                });

                return {
                    success: true,
                    reply: chatCompletion.choices[0].message.content,
                    jobs: []
                };

            } catch (aiError) {

                console.log("AI error:", aiError.message);

                return {
                    success: true,
                    reply: "Hiện nay các ngành hot gồm Công nghệ thông tin, Digital Marketing, Thương mại điện tử và Data Analyst.",
                    jobs: []
                };

            }

        }

        // =============================
        // TÌM JOB TRONG DATABASE
        // =============================

        let query = {
            status: "active",
            statusPause: false,
            deadline: { $gte: now }
        };

        let sortOption = { createdAt: -1 };
        let limitCount = 5;

        // số lượng job
        const numberMatch = messageLower.match(/\d+/);
        if (numberMatch) {
            limitCount = parseInt(numberMatch[0]);
        }

        // location filter

        if (messageLower.includes("hà nội") || messageLower.includes(" hn")) {
            query.location = { $regex: "Hà Nội", $options: "i" };
        }

        if (messageLower.includes("đà nẵng") || messageLower.includes(" dn")) {
            query.location = { $regex: "Đà Nẵng", $options: "i" };
        }

        if (
            messageLower.includes("hồ chí minh") ||
            messageLower.includes("hcm") ||
            messageLower.includes("sài gòn")
        ) {
            query.location = { $regex: "Hồ Chí Minh", $options: "i" };
        }

        // sort

        if (messageLower.includes("view cao") || messageLower.includes("xem nhiều")) {
            sortOption = { view: -1 };
        }

        if (messageLower.includes("nộp nhiều") || messageLower.includes("ứng tuyển nhiều")) {
            sortOption = { numberUpload: -1 };
        }

        // stop words

        const stopWords = [
            "các",
            "job",
            "jobs",
            "việc",
            "làm",
            "mới",
            "nhất",
            "tại",
            "tìm",
            "cần",
            "tuyển"
        ];

        let rawKeywords = messageLower
            .split(/\s+/)
            .filter(k => k.length >= 2 && !stopWords.includes(k));

        const processedKeywords = rawKeywords.map(k => synonyms[k] || k);

        if (processedKeywords.length > 0) {

            query.$or = [];

            processedKeywords.forEach(k => {

                query.$or.push(
                    { title: { $regex: k, $options: "i" } },
                    { jobs: { $regex: k, $options: "i" } },
                    { skills: { $regex: k, $options: "i" } },
                    { description: { $regex: k, $options: "i" } }
                );

            });

        }

        // =============================
        // QUERY DATABASE
        // =============================

        let jobs = await userPostJobs.findAll(query)
            .sort(sortOption)
            .limit(limitCount)
            .select("title jobs location joblevel numberUpload deadline");

        if (jobs.length === 0) {

            delete query.$or;

            jobs = await userPostJobs
                .findAll(query)
                .sort({ createdAt: -1 })
                .limit(3);

        }

        if (jobs.length === 0) {

            return {
                success: true,
                reply: "Hiện chưa tìm thấy công việc phù hợp. Bạn có thể thử tìm: React, Marketing, Kế toán...",
                jobs: []
            };

        }

        const context = jobs.map((j, i) => {

            const salary = j.salaryRange ? j.salaryRange.toString() : "Thỏa thuận";
            return `
Job ${i + 1}
Tiêu đề: ${j.title}
Ngành: ${j.jobs}
Địa điểm: ${j.location}
Lượt xem: ${j.joblevel}
`;

        }).join("\n");

        let reply = "Tôi đã tìm thấy một số công việc phù hợp cho bạn.";

        try {

            const chatCompletion = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                temperature: 0.4,
                messages: [
                    {
                        role: "system",
                        content: `
Bạn là chatbot của website tuyển dụng.

Quy tắc:
- Chỉ trả lời về việc làm
- Chỉ dựa vào danh sách job
- Không bịa thông tin
- Trả lời tối đa 3 câu
- Giọng thân thiện
`
                    },
                    {
                        role: "user",
                        content: `
Câu hỏi: ${message}

Danh sách job:
${context}
`
                    }
                ]
            });

            reply = chatCompletion.choices[0].message.content;

        } catch (aiError) {

            console.log("AI error:", aiError.message);

        }

        return {
            success: true,
            reply,
            jobs
        };

    } catch (error) {

        console.log("Chatbox error:", error);

        return {
            success: false,
            message: error.message
        };
    }
};

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
};