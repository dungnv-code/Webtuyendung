const Router = require("express").Router();
const { PostJobController } = require("../controller/index");
const { body } = require("express-validator");
const { uploadSingle, uploadPDF } = require("../config/uploadCloudinary");
const { VerifyToken, TokenIsAdmin, TokenIsNhaTuyenDung, TokenIsNhaTuyenDungOrStaff } = require('../middleware/verifyToken');
Router.post("/create", [VerifyToken, TokenIsNhaTuyenDungOrStaff],
    body("title").notEmpty().withMessage("Vui lòng nhập tiêu đề bài đăng công việc"),
    PostJobController.create);
Router.put("/update/:idp", [VerifyToken, TokenIsNhaTuyenDungOrStaff],
    PostJobController.update);
Router.get("/getAll", PostJobController.getAll);
Router.get("/getDetail/:idp", PostJobController.getDetail);
Router.delete("/delete/:idp", [VerifyToken, TokenIsNhaTuyenDungOrStaff], PostJobController.delete);
Router.put("/changeStatus/:idp", [VerifyToken, TokenIsAdmin], PostJobController.changeStatus);
Router.put("/changeStatusPause/:idp", [VerifyToken, TokenIsNhaTuyenDung], PostJobController.changeStatusPause);
Router.get("/getCVPostJobs/:idp", [VerifyToken, TokenIsNhaTuyenDungOrStaff], PostJobController.getCVPostJobs);
Router.put("/uploadCV/:idp", [VerifyToken], uploadPDF.single("fileCV"), PostJobController.uploadCV);
Router.put("/ChangeStatusCV/:idp/:idcv", [VerifyToken, TokenIsNhaTuyenDungOrStaff], PostJobController.ChangeStatusCV);
module.exports = Router;