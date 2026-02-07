const { validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
const skillSevicer = require("../sevicers/skill");
class SkillController {
    create = asyncHandler(async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const reponse = await skillSevicer.createSkill({ ...req.body });
        res.status(200).json(reponse);
    });

    update = asyncHandler(async (req, res) => {
        const { ids } = req.params;
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const reponse = await skillSevicer.updateSkill(ids, { ...req.body });
        res.status(200).json(reponse);
    });

    getAll = asyncHandler(async (req, res) => {
        const reponse = await skillSevicer.getAllSkill(req.query);
        res.status(200).json(reponse);
    });

    delete = asyncHandler(async (req, res) => {
        const { ids } = req.params;
        const reponse = await skillSevicer.deleteSkill(ids);
        res.status(200).json(reponse);
    });
}

module.exports = new SkillController();