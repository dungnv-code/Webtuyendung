const Router = require("express").Router();
const { ExperienceController } = require("../controller/index");
const { body } = require("express-validator");
const { VerifyToken, TokenIsAdmin } = require('../middleware/verifyToken');
Router.post("/create", [VerifyToken, TokenIsAdmin],
    body("experience").notEmpty().withMessage("Vui lòng nhập nhóm kinh nghiệm!"),
    ExperienceController.create);
Router.put("/update/:ide", [VerifyToken, TokenIsAdmin],
    body("experience").notEmpty().withMessage("Vui lòng nhập nhóm kinh nghiệm!"),
    ExperienceController.update);
Router.get("/getAll", ExperienceController.getAll);
Router.delete("/delete/:ide", [VerifyToken, TokenIsAdmin], ExperienceController.delete);

module.exports = Router;