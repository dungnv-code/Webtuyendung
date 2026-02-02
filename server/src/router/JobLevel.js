const Router = require("express").Router();
const { jobLevelController } = require("../controller/index");
const { body } = require("express-validator");
const { VerifyToken, TokenIsAdmin } = require('../middleware/verifyToken');
Router.post("/create", [VerifyToken, TokenIsAdmin],
    body("nameLevel").notEmpty().withMessage("Vui lòng nhập tên cấp bậc"),
    jobLevelController.create);
Router.put("/update/:idl", [VerifyToken, TokenIsAdmin],
    body("nameLevel").notEmpty().withMessage("Vui lòng nhập tên cấp bậc"),
    jobLevelController.update);
Router.get("/getAll", jobLevelController.getAll);
Router.delete("/delete/:idl", [VerifyToken, TokenIsAdmin], jobLevelController.delete);

module.exports = Router;