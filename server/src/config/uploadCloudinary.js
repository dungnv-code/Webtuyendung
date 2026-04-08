const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const cloudStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "tuyendung",
        resource_type: "auto",
        allowed_formats: ["jpg", "jpeg", "png", "pdf"],
        public_id: (req, file) => {
            const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
            return `${unique}`;
        },
    },
});

const uploadCloud = multer({ storage: cloudStorage });

const uploadSingle = (fieldName) => uploadCloud.single(fieldName);
const uploadArray = (fieldName, max) => uploadCloud.array(fieldName, max);
const uploadBusiness = uploadCloud.any();

const memoryStorage = multer.memoryStorage();

const uploadPDF = multer({
    storage: memoryStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF allowed!"), false);
        }
        cb(null, true);
    }
});

module.exports = {
    uploadCloud,
    uploadBusiness,
    uploadSingle,
    uploadArray,
    uploadPDF,
};