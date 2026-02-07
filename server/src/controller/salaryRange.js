const { validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const SalaryRangeSevicer = require("../sevicers/SalaryRange");
class SalaryRangeController {
    create = asyncHandler(async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const { salaryRange } = req.body;
        const slug = slugify(salaryRange, { lower: true, strict: true });
        const reponse = await SalaryRangeSevicer.createSalaryRange({ ...req.body, slug });
        res.status(200).json(reponse);
    });

    update = asyncHandler(async (req, res) => {
        const { ids } = req.params;
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const { salaryRange } = req.body;
        const slug = slugify(salaryRange, { lower: true, strict: true });
        const reponse = await SalaryRangeSevicer.updateSalaryRange(ids, { ...req.body, slug });
        res.status(200).json(reponse);
    });

    getAll = asyncHandler(async (req, res) => {
        const reponse = await SalaryRangeSevicer.getAllSalaryRange(req.query);
        res.status(200).json(reponse);
    });

    delete = asyncHandler(async (req, res) => {
        const { ids } = req.params;
        const reponse = await SalaryRangeSevicer.deleteSalaryRange(ids);
        res.status(200).json(reponse);
    });
}

module.exports = new SalaryRangeController();