const Router = require("express").Router();
const { skillController } = require("../controller/index");
const { body } = require("express-validator");
const { VerifyToken, TokenIsAdmin } = require('../middleware/verifyToken');
Router.post("/create", [VerifyToken, TokenIsAdmin],
    body("nameskill").notEmpty().withMessage("Vui lòng nhập tiêu đề kĩ năng"),
    skillController.create);
Router.put("/update/:ids", [VerifyToken, TokenIsAdmin],
    body("nameskill").notEmpty().withMessage("Vui lòng nhập tiêu đề kĩ năng"),
    skillController.update);
Router.get("/getAll", skillController.getAll);
Router.delete("/delete/:ids", [VerifyToken, TokenIsAdmin], skillController.delete);

module.exports = Router;