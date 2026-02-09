const Router = require("express").Router();
const { BusinessController } = require("../controller/index");
const { body } = require("express-validator");
const { VerifyToken, TokenIsAdmin, TokenIsNhaTuyenDung } = require('../middleware/verifyToken');
const { uploadBusiness } = require("../config/uploadCloudinary");

Router.post("/create", [VerifyToken, TokenIsNhaTuyenDung],
    // body("nameBusiness").notEmpty().withMessage("Vui lòng nhập tên doanh nghiệp!"),
    // body("taxiCodeBusiness").notEmpty().withMessage("Vui lòng nhập mã số thuế doanh nghiệp!"),
    // body("addressBusiness").notEmpty().withMessage("Vui lòng nhập địa chỉ doanh nghiệp!"),
    // body("FieldBusiness").notEmpty().withMessage("Vui lòng nhập lĩnh vực doanh nghiệp!"),
    // body("phoneBusiness").notEmpty().withMessage("Vui lòng nhập số điện thoại doanh nghiệp!"),
    // body("certification").notEmpty().withMessage("Vui lòng tải lên giấy chứng nhận doanh nghiệp!"),
    uploadBusiness,
    BusinessController.create);
Router.put("/update/:idb", uploadBusiness, [VerifyToken, TokenIsNhaTuyenDung],
    BusinessController.update);
Router.get("/getAll", [VerifyToken, TokenIsAdmin], BusinessController.getAll);
Router.delete("/delete/:idb", [VerifyToken, TokenIsNhaTuyenDung], BusinessController.delete);
Router.get("/getDetail/:idb", [VerifyToken, TokenIsNhaTuyenDung], BusinessController.getDetail);
Router.get("/getDetailbyNTD", [VerifyToken, TokenIsNhaTuyenDung], BusinessController.getDetailbyNTD);
Router.get("/getStaffs", [VerifyToken, TokenIsNhaTuyenDung], BusinessController.getStaffs);
Router.get("/getPostJobs", [VerifyToken, TokenIsNhaTuyenDung], BusinessController.getPostJobs);
Router.get("/getInvoids", [VerifyToken, TokenIsNhaTuyenDung], BusinessController.getInvoids);
Router.put("/changeStatus/:idb", [VerifyToken, TokenIsAdmin], BusinessController.changeStatus)

module.exports = Router;