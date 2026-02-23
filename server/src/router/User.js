const Route = require('express').Router();
const { userController } = require('../controller');
const { body } = require("express-validator");
const { VerifyToken, TokenIsAdmin, TokenIsNhaTuyenDung } = require('../middleware/verifyToken');
const { uploadSingle } = require("../config/uploadCloudinary");

Route.post('/Login', body("email").isEmail().withMessage("Email khônng hợp lệ"),
    body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
    body("password").isLength({ min: 6 }).withMessage("Mật khẩu phải có tối thiểu 6 có kí tự"),
    userController.Login);

Route.post("/Register",
    body("username").notEmpty().withMessage("Vui lòng nhập tên người dùng"),
    body("email").notEmpty().withMessage("Vui lòng nhập email"),
    body("email").isEmail().withMessage("Vui lòng nhập đúng định dạng email"),
    body("password").notEmpty().withMessage("Vui lòng nhập mật khẩu"),
    body("password").isLength({ min: 8 }).withMessage("Mật khẩu phải có tối thiểu 8 có kí tự"),
    body("phone").notEmpty().withMessage("Vui lòng nhập số điện thoại"),
    body("phone").isLength({ min: 10, max: 10 }).withMessage("Số điện thoại phải đúng 10 số"),
    body("phone").isNumeric().withMessage("Số điện thoại phải là số"),
    body("role").notEmpty().withMessage("Vui lòng nhập vai trò người dùng"),
    userController.Register);

Route.post("/finalRegister", userController.finalRegister);
Route.post("/Logout", userController.Logout);
Route.post("/forgotPassword",
    body("email").notEmpty().withMessage("Vui lòng nhập email"),
    body("email").isEmail().withMessage("Vui lòng nhập đúng định dạng email"),
    userController.forgotPassword);
Route.post("/resetPassword",
    body("otp").notEmpty().withMessage("Vui lòng nhập mã OTP"),
    body("newpassword").notEmpty().withMessage("Vui lòng nhập mật khẩu"),
    body("newpassword").isLength({ min: 8 }).withMessage("Mật khẩu phải có tối thiểu 8 có kí tự"),
    userController.resetPassword);

Route.post("/refreshToken", userController.refreshToken);
Route.get("/getSingle", [VerifyToken], userController.getSingle);
Route.get("/getAll", [VerifyToken, TokenIsAdmin], userController.getAll);
Route.delete("/deletebyadmin/:idu", [VerifyToken, TokenIsAdmin], userController.deletebyadmin);
Route.put("/update/:idu", [VerifyToken], uploadSingle("avatar"), userController.update);
Route.post("/changePassword",
    [VerifyToken],
    body("oldpassword").notEmpty().withMessage("Vui lòng nhập mật khẩu cũ"),
    body("newpassword").notEmpty().withMessage("Vui lòng nhập mật khẩu mới"),
    body("newpassword").isLength({ min: 8 }).withMessage("Mật khẩu phải có tối thiểu 8 có kí tự"),
    userController.changePassword);
Route.get("/getDetailBusiness", [VerifyToken, TokenIsNhaTuyenDung], userController.getDetailBusiness);
Route.post("/createStaff", [VerifyToken, TokenIsNhaTuyenDung], userController.createStaff)

module.exports = Route;