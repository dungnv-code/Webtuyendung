const { validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
const InvoidSevicer = require("../sevicers/Invoid");
class InvoidController {
    create = asyncHandler(async (req, res) => {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const { businessId } = req.user
        const reponse = await InvoidSevicer.createInvoid(businessId, req.body);
        res.status(200).json(reponse);
    });

    getAll = asyncHandler(async (req, res) => {
        const reponse = await InvoidSevicer.getAllInvoid(req.query);
        res.status(200).json(reponse);
    });

}

module.exports = new InvoidController();