const Router = require("express").Router();
const { PostJobController } = require("../controller/index");
const { body } = require("express-validator");
const { VerifyToken, TokenIsAdmin, TokenIsNhaTuyenDungOrStaff } = require('../middleware/verifyToken');
Router.post("/create", [VerifyToken, TokenIsNhaTuyenDungOrStaff],
    body("title").notEmpty().withMessage("Vui lòng nhập tiêu đề bài đăng công việc"),

    PostJobController.create);
Router.put("/update/:idp", [VerifyToken, TokenIsNhaTuyenDungOrStaff],
    PostJobController.update);
Router.get("/getAll", PostJobController.getAll);
Router.get("/getDetail/:idp", PostJobController.getDetail);
Router.delete("/delete/:idp", [VerifyToken, TokenIsNhaTuyenDungOrStaff], PostJobController.delete);

module.exports = Router;