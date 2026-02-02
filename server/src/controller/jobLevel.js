const { validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
const jobLevelSevicer = require("../sevicers/Level");
const slugify = require('slugify');
class LevelController {

    create = asyncHandler(async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }

        const slug = slugify(req.body.nameLevel, { lower: true, strict: true });
        const reponse = await jobLevelSevicer.createLevel({ ...req.body, slug });
        res.status(200).json(reponse);
    });

    update = asyncHandler(async (req, res) => {
        const { idl } = req.params;
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const slug = slugify(req.body.nameLevel, { lower: true, strict: true });
        const reponse = await jobLevelSevicer.updateLevel(idl, { ...req.body, slug });
        res.status(200).json(reponse);
    });

    getAll = asyncHandler(async (req, res) => {
        const reponse = await jobLevelSevicer.getAllLevel();
        res.status(200).json(reponse);
    });

    delete = asyncHandler(async (req, res) => {
        const { idl } = req.params;
        const reponse = await jobLevelSevicer.deleteLevel(idl);
        res.status(200).json(reponse);
    });
}

module.exports = new LevelController();