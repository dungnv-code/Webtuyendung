const Router = require("express").Router();
const { WorktypeController } = require("../controller/index");
const { body } = require("express-validator");
const { VerifyToken, TokenIsAdmin } = require('../middleware/verifyToken');
Router.post("/create", [VerifyToken, TokenIsAdmin],
    body("workType").notEmpty().withMessage("Vui lòng nhập hình thức công việc"),
    WorktypeController.create);
Router.put("/update/:idw", [VerifyToken, TokenIsAdmin],
    body("workType").notEmpty().withMessage("Vui lòng nhập hình thức công việc"),
    WorktypeController.update);
Router.get("/getAll", WorktypeController.getAll);
Router.delete("/delete/:idw", [VerifyToken, TokenIsAdmin], WorktypeController.delete);

module.exports = Router;