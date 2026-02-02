const Router = require("express").Router();
const { jobsController } = require("../controller/index");
const { body } = require("express-validator");
const { VerifyToken, TokenIsAdmin } = require('../middleware/verifyToken');
Router.post("/create", [VerifyToken, TokenIsAdmin],
    body("title").notEmpty().withMessage("Vui lòng nhập tiêu đề công việc"),
    jobsController.create);
Router.put("/update/:idj", [VerifyToken, TokenIsAdmin],
    body("title").notEmpty().withMessage("Vui lòng nhập tiêu đề công việc"),
    jobsController.update);
Router.get("/getAll", jobsController.getAll);
Router.delete("/delete/:idj", [VerifyToken, TokenIsAdmin], jobsController.delete);

module.exports = Router;