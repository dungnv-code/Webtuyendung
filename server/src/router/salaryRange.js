const Router = require("express").Router();
const { salaryRangeController } = require("../controller/index");
const { body } = require("express-validator");
const { VerifyToken, TokenIsAdmin } = require('../middleware/verifyToken');
Router.post("/create", [VerifyToken, TokenIsAdmin],
    body("salaryRange").notEmpty().withMessage("Vui lòng nhập tên khoảng lương!"),
    salaryRangeController.create);
Router.put("/update/:ids", [VerifyToken, TokenIsAdmin],
    body("salaryRange").notEmpty().withMessage("Vui lòng nhập tên khoảng lương!"),
    salaryRangeController.update);
Router.get("/getAll", salaryRangeController.getAll);
Router.delete("/delete/:ids", [VerifyToken, TokenIsAdmin], salaryRangeController.delete);

module.exports = Router;