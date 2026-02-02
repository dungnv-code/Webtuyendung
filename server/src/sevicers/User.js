const bcrypt = require("bcrypt");
const userRepository = require("../repository/User")
const jwt = require("jsonwebtoken");
const makeNumberToken = require("../ulti/makeToken");
const sendMail = require("../ulti/sendMail");
const crypto = require("crypto");

const genateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "3h" });
}

const genateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
}

const RegisterUser = async (data) => {
    const { username, email, password, mobile, role } = data;

    const isCheckemail = await userRepository.findByOne({ email });
    if (isCheckemail) {
        return { mes: "Email đã tồn tại!" };
    }

    const token = makeNumberToken(5);
    const emailEdi = btoa(email) + "@" + token;

    const reponse = await userRepository.createUser({
        username, email: emailEdi, password: bcrypt.hashSync(password, 10), mobile, role
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
        await userRepository.deleteUser({ email: emailEdi });
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

    const accessToken = genateAccessToken({ id: user._id, role: user.role });
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
    const newAccessToken = genateAccessToken({ id: user._id, role: user.role });
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
    const user = await userRepository.findByOne({ _id: id }).select('-refreshToken -password');
    if (!user) {
        throw new Error("Không tìm thấy user");
    }
    return {
        success: true,
        data: user,
    };
}

const getAllUser = async () => {
    const users = await userRepository.findAll({}).select('-refreshToken -password');
    return {
        success: true,
        data: users,
    }
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
        throw new Error("Mât khẩu cũ không đúng");
    }
    user.password = bcrypt.hashSync(newpassword, 10);
    await user.save();
    return {
        success: true,
        mes: "Đổi mật khẩu thành công",
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
    updateUser,
    changePasswordUser,
};