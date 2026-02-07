const { validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
const ExperienceSevicer = require("../sevicers/Experience.js");
const slugify = require('slugify');
class ExperienceController {

    create = asyncHandler(async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }

        const slug = slugify(req.body.experience, { lower: true, strict: true });
        const reponse = await ExperienceSevicer.createExperience({ ...req.body, slug });
        res.status(200).json(reponse);
    });

    update = asyncHandler(async (req, res) => {
        const { ide } = req.params;
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const slug = slugify(req.body.experience, { lower: true, strict: true });
        const reponse = await ExperienceSevicer.updateExperience(ide, { ...req.body, slug });
        res.status(200).json(reponse);
    });

    getAll = asyncHandler(async (req, res) => {
        const reponse = await ExperienceSevicer.getAllExperience(req.query);
        res.status(200).json(reponse);
    });

    delete = asyncHandler(async (req, res) => {
        const { ide } = req.params;
        const reponse = await ExperienceSevicer.deleteExperience(ide);
        res.status(200).json(reponse);
    });
}

module.exports = new ExperienceController();