const { validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const PostjobsSevicer = require("../sevicers/Postjobs");
class PostJobController {
    create = asyncHandler(async (req, res) => {
        const { businessId } = req.user;
        const { id } = req.user;
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const { title } = req.body;
        const slug = slugify(title, { lower: true, strict: true });
        const reponse = await PostjobsSevicer.createPostjobs(businessId, id, { ...req.body, slug });
        res.status(200).json(reponse);
    });

    update = asyncHandler(async (req, res) => {
        const { idp } = req.params;
        const { id } = req.user;
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const { title } = req.body;
        const slug = slugify(title, { lower: true, strict: true });
        const reponse = await PostjobsSevicer.updatePostjobs(idp, id, { ...req.body, slug });
        res.status(200).json(reponse);
    });

    getAll = asyncHandler(async (req, res) => {
        let query = { ...req.query };
        if (query.statusPause === "true") {
            query.statusPause = true;
        } else if (query.statusPause === "false") {
            query.statusPause = false;
        } else {
            delete query.statusPause;
        }
        const response = await PostjobsSevicer.getAllPostjobs(query);
        res.status(200).json(response);
    });

    getDetail = asyncHandler(async (req, res) => {
        const { idp } = req.params;
        const reponse = await PostjobsSevicer.getDetailPostjobs(idp);
        res.status(200).json(reponse);
    });

    delete = asyncHandler(async (req, res) => {
        const { idp } = req.params;
        const reponse = await PostjobsSevicer.deletePostjobs(idp);
        res.status(200).json(reponse);
    });

    changeStatus = asyncHandler(async (req, res) => {
        const { idp } = req.params;
        const reponse = await PostjobsSevicer.changeStatusPostjobs(idp);
        res.status(200).json(reponse);
    });

    changeStatusPause = asyncHandler(async (req, res) => {
        const { idp } = req.params;
        const reponse = await PostjobsSevicer.changeStatusPausePostjobs(idp);
        res.status(200).json(reponse);
    });

    uploadCV = asyncHandler(async (req, res) => {
        const { idp } = req.params;
        const { id } = req.user;
        const response = await PostjobsSevicer.uploadCVPostjobs(idp, id, req);
        res.status(200).json(response);
    });

    getCVPostJobs = asyncHandler(async (req, res) => {
        const { idp } = req.params;
        const response = await PostjobsSevicer.getCVPostJobsPostjobs(idp, req.query);
        res.status(200).json(response);
    });
}

module.exports = new PostJobController();