const bcrypt = require("bcrypt");
const userRepository = require("../repository/User")
const jwt = require("jsonwebtoken");
const makeNumberToken = require("../ulti/makeToken");
const sendMail = require("../ulti/sendMail");
const crypto = require("crypto");
const seedrandom = require("seedrandom");
const genateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "3h" });
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
    createStaffUser
};