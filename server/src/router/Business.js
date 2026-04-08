const Router = require("express").Router();
const { BusinessController } = require("../controller/index");
const { body } = require("express-validator");
const { VerifyToken, TokenIsAdmin, TokenIsNhaTuyenDung, TokenIsNhaTuyenDungOrStaff } = require('../middleware/verifyToken');
const { uploadBusiness } = require("../config/uploadCloudinary");

Router.post("/create", [VerifyToken, TokenIsNhaTuyenDung],

    uploadBusiness,
    BusinessController.create);
Router.put("/update", uploadBusiness, [VerifyToken, TokenIsNhaTuyenDung],
    BusinessController.update);
Router.get("/getAll", BusinessController.getAll);
Router.delete("/delete/:idb", [VerifyToken, TokenIsNhaTuyenDung], BusinessController.delete);
Router.get("/getDetail/:idb", BusinessController.getDetail);
Router.get("/getDetailbyNTD", [VerifyToken, TokenIsNhaTuyenDungOrStaff], BusinessController.getDetailbyNTD);
Router.get("/getStaffs", [VerifyToken, TokenIsNhaTuyenDung], BusinessController.getStaffs);
Router.get("/getPostJobs", [VerifyToken, TokenIsNhaTuyenDungOrStaff], BusinessController.getPostJobs);
Router.get("/getPostJobsUser/:idb", BusinessController.getPostJobsUser);
Router.get("/getInvoids", [VerifyToken, TokenIsNhaTuyenDung], BusinessController.getInvoids);
Router.put("/changeStatus/:idb", [VerifyToken, TokenIsAdmin], BusinessController.changeStatus)
Router.get("/getDashboard", [VerifyToken, TokenIsNhaTuyenDungOrStaff], BusinessController.getDashboard)
module.exports = Router;