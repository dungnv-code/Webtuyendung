const { validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
const PostpackageSevicer = require("../sevicers/Postpackage");

class PostpackageController {

    create = asyncHandler(async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const reponse = await PostpackageSevicer.createPostpackage(req.body);
        res.status(200).json(reponse);
    });

    update = asyncHandler(async (req, res) => {
        const { idp } = req.params;
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const reponse = await PostpackageSevicer.updatePostpackage(idp, req.body);
        res.status(200).json(reponse);
    });

    getAll = asyncHandler(async (req, res) => {
        const reponse = await PostpackageSevicer.getAllPostpackage(req.query);
        res.status(200).json(reponse);
    });

    delete = asyncHandler(async (req, res) => {
        const { idp } = req.params;
        const reponse = await PostpackageSevicer.deletePostpackage(idp);
        res.status(200).json(reponse);
    });
}

module.exports = new PostpackageController();