const { validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
const BusinessSevicer = require("../sevicers/Business");
class BusinessController {
    create = asyncHandler(async (req, res) => {
        const { id } = req.user;
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }

        const updateData = { ...req.body };

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                updateData[file.fieldname] = file.path;
            });
        } else {
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === "") {
                    delete updateData[key];
                }
            });
        }

        const reponse = await BusinessSevicer.createBusiness(id, updateData);
        res.status(200).json(reponse);
    });

    update = asyncHandler(async (req, res) => {
        const { idb } = req.params;
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ errors: err.array() });
        }
        const updateData = { ...req.body };

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                updateData[file.fieldname] = file.path;
            });
        } else {
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === "") {
                    delete updateData[key];
                }
            });
        }
        const reponse = await BusinessSevicer.updateBusiness(idb, updateData);
        res.status(200).json(reponse);
    });

    getAll = asyncHandler(async (req, res) => {
        const reponse = await BusinessSevicer.getAllBusiness(req.query);
        res.status(200).json(reponse);
    });

    delete = asyncHandler(async (req, res) => {
        const { idb } = req.params;
        const reponse = await BusinessSevicer.deleteBusiness(idb);
        res.status(200).json(reponse);
    });

    getDetail = asyncHandler(async (req, res) => {
        const { idb } = req.params;
        const reponse = await BusinessSevicer.getDetailBusiness(idb);
        res.status(200).json(reponse);
    });

    getDetailbyNTD = asyncHandler(async (req, res) => {
        const { businessId } = req.user;
        const reponse = await BusinessSevicer.getDetailbyNTDBusiness(businessId);
        res.status(200).json(reponse);
    })

    getStaffs = asyncHandler(async (req, res) => {
        const { businessId } = req.user;
        const reponse = await BusinessSevicer.getStaffsUser(businessId);
        res.status(200).json(reponse);
    })

    changeStatus = asyncHandler(async (req, res) => {
        const { idb } = req.params;
        const reponse = await BusinessSevicer.changeStatusBusiness(idb);
        res.status(200).json(reponse);
    })
}

module.exports = new BusinessController();