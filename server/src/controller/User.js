const { validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
const userSevicer = require("../sevicers/User")

const { EventEmitter } = require("node:events");
const myEvent = new EventEmitter();

myEvent.on("event.Register.user", (param) => {
    console.log("Event Register user triggered with param:", param);
})

class ControllerUser {
    Login = asyncHandler(async (req, res) => {
        // const { email, password } = req.body;

        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }

        const reponse = await userSevicer.LoginUser(req.body);
        const { refreshToken, ...data } = reponse;

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            data,
        });
    });

    Register = asyncHandler(async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }

        const reponse = await userSevicer.RegisterUser(req.body);
        res.status(200).json(reponse);
    });

    finalRegister = asyncHandler(async (req, res) => {
        console.log("finalRegister called with token:", req.params.token);
        const token = req.params.token;
        const reponse = await userSevicer.finalRegisterUser(token);
        res.status(200).json(reponse);
    });

    Logout = asyncHandler(async (req, res) => {
        const cookie = req.cookies;
        if (!cookie || !cookie.refreshToken) throw new Error('Không tìm thấy refresh token trong cookies')

        await userSevicer.LogoutUser(cookie.refreshToken);
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        })
        res.status(200).json({
            Success: true,
            mes: "Đăng xuất thành công",
        }
        );
    });

    refreshToken = asyncHandler(async (req, res) => {
        const cookie = req.cookies;
        if (!cookie || !cookie.refreshToken) throw new Error('Không tìm thấy refresh token trong cookies')
        const reponse = await userSevicer.refreshTokenUser(cookie.refreshToken);

        res.cookie("refreshToken", reponse.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            data: reponse.data,
        });
    });

    forgotPassword = asyncHandler(async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const reponse = await userSevicer.forgotPasswordUser(req.body.email);
        res.status(200).json(reponse);
    });

    resetPassword = asyncHandler(async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const reponse = await userSevicer.resetPasswordUser(req.body);
        res.status(200).json(reponse);
    });
    getSingle = asyncHandler(async (req, res) => {
        const { id } = req.user;
        const reponse = await userSevicer.getSingleUser(id);
        res.status(200).json(reponse);
    });

    getAll = asyncHandler(async (req, res) => {
        const reponse = await userSevicer.getAllUser();
        res.status(200).json(reponse);
    });

    deletebyadmin = asyncHandler(async (req, res) => {
        const { idu } = req.params;
        const reponse = await userSevicer.deletebyadminUser(idu);
        res.status(200).json(reponse);
    });

    update = asyncHandler(async (req, res) => {
        const { id } = req.user;

        const updateData = { ...req.body };

        if (req.file) {
            updateData.avatar = req.file.path;
        } else {
            // Chỉ xóa nếu client gửi avatar rỗng
            if ("avatar" in updateData) {
                delete updateData.avatar;
            }
        }

        const updatedUser = await userSevicer.updateUser(id, updateData);

        return res.status(200).json({
            success: true,
            updatedUser
        });
    });
    changePassword = asyncHandler(async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const { id } = req.user;
        const reponse = await userSevicer.changePasswordUser(id, req.body);
        res.status(200).json(reponse);
    });
}

module.exports = new ControllerUser();