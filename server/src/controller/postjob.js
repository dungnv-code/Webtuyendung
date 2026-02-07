const { validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const PostjobsSevicer = require("../sevicers/Postjobs");
class PostJobController {
    create = asyncHandler(async (req, res) => {
        const { businessId } = req.user;
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const { title } = req.body;
        const slug = slugify(title, { lower: true, strict: true });
        const reponse = await PostjobsSevicer.createPostjobs(businessId, { ...req.body, slug });
        res.status(200).json(reponse);
    });

    update = asyncHandler(async (req, res) => {
        const { idp } = req.params;
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const { title } = req.body;
        const slug = slugify(title, { lower: true, strict: true });
        const reponse = await PostjobsSevicer.updatePostjobs(idp, { ...req.body, slug });
        res.status(200).json(reponse);
    });

    getAll = asyncHandler(async (req, res) => {
        const reponse = await PostjobsSevicer.getAllPostjobs(req.query);
        res.status(200).json(reponse);
    });

    delete = asyncHandler(async (req, res) => {
        const { idp } = req.params;
        const reponse = await PostjobsSevicer.deletePostjobs(idp);
        res.status(200).json(reponse);
    });
}

module.exports = new PostJobController();