const Router = require("express").Router();
const { InvoidController } = require("../controller/index");
const { body } = require("express-validator");
const { VerifyToken, TokenIsNhaTuyenDung } = require('../middleware/verifyToken');
Router.post("/create", [VerifyToken, TokenIsNhaTuyenDung],
    body("title").notEmpty().withMessage("Vui lòng nhập tiêu đề hoá đơn"),
    InvoidController.create);

Router.get("/getAll", InvoidController.getAll);


module.exports = Router;