const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const VerifyToken = asyncHandler((req, res, next) => {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (!accessToken) {
        throw new Error('Vui lòng đăng nhập để tiếp tục!!!');
    }

    jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            throw new Error('Token không hợp lệ hoặc đã hết hạn, vui lòng đăng nhập lại!!!');
        }
        req.user = user;
        next();
    });
})

const TokenIsAdmin = asyncHandler((req, res, next) => {

    const { role } = req.user;

    if (role === "ADMIN") {
        return next();
    }

    return res.status(401).json({
        success: false,
        mes: 'Bạn không có quyền truy cập tài nguyên này'
    });

})

const TokenIsNhaTuyenDung = asyncHandler((req, res, next) => {

    const { role } = req.user;

    if (role === "nhatuyendung") {
        return next();
    }

    return res.status(401).json({
        success: false,
        mes: 'Bạn không có quyền truy cập tài nguyên này'
    });

})

module.exports = { VerifyToken, TokenIsAdmin, TokenIsNhaTuyenDung };