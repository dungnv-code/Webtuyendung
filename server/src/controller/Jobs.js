const { validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const jobsSevicer = require("../sevicers/Jobs");
class JobController {
    create = asyncHandler(async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const { title } = req.body;
        const slug = slugify(title, { lower: true, strict: true });
        const reponse = await jobsSevicer.createJob({ ...req.body, slug });
        res.status(200).json(reponse);
    });

    update = asyncHandler(async (req, res) => {
        const { idj } = req.params;
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const { title } = req.body;
        const slug = slugify(title, { lower: true, strict: true });
        const reponse = await jobsSevicer.updateJob(idj, { ...req.body, slug });
        res.status(200).json(reponse);
    });

    getAll = asyncHandler(async (req, res) => {
        const reponse = await jobsSevicer.getAllJobs(req.query);
        res.status(200).json(reponse);
    });

    delete = asyncHandler(async (req, res) => {
        const { idj } = req.params;
        const reponse = await jobsSevicer.deleteJob(idj);
        res.status(200).json(reponse);
    });
}

module.exports = new JobController();