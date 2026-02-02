const Router = require("express").Router();
const { PostpackageController } = require("../controller/index");
const { body } = require("express-validator");
const { VerifyToken, TokenIsAdmin } = require('../middleware/verifyToken');
Router.post("/create", [VerifyToken, TokenIsAdmin],
    body("namePostPackage").notEmpty().withMessage("Vui lòng nhập tên gói tin đăng"),
    body("valuePostPackage").isInt({ gt: 0 }).withMessage("Vui lòng nhập số lượng tin đăng hợp lệ"),
    body("typePostPackage").isIn(["BASIC", "PREMIUM"]).withMessage("Vui lòng chọn loại gói tin đăng hợp lệ"),
    body("price").isFloat({ gt: 0 }).withMessage("Vui lòng nhập giá gói tin đăng hợp lệ"),
    PostpackageController.create);
Router.put("/update/:idp", [VerifyToken, TokenIsAdmin],
    PostpackageController.update);
Router.get("/getAll", PostpackageController.getAll);
Router.delete("/delete/:idp", [VerifyToken, TokenIsAdmin], PostpackageController.delete);

module.exports = Router;