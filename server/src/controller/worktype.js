const { validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
const worktypeSevicer = require("../sevicers/worktype");
const slugify = require('slugify');
class WorktypeController {
    create = asyncHandler(async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const slug = slugify(req.body.workType, { lower: true, strict: true });
        const reponse = await worktypeSevicer.createWorktype({ ...req.body, slug });
        res.status(200).json(reponse);
    });
    update = asyncHandler(async (req, res) => {
        const { idw } = req.params;
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const slug = slugify(req.body.workType, { lower: true, strict: true });
        const reponse = await worktypeSevicer.updateWorktype(idw, { ...req.body, slug });
        res.status(200).json(reponse);
    });
    getAll = asyncHandler(async (req, res) => {
        const reponse = await worktypeSevicer.getAllWorktype();
        res.status(200).json(reponse);
    });
    delete = asyncHandler(async (req, res) => {
        const { idw } = req.params;
        const reponse = await worktypeSevicer.deleteWorktype(idw);
        res.status(200).json(reponse);
    });
}

module.exports = new WorktypeController();