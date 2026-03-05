const usePostJobs = require("../repository/PostJobs");
const seedrandom = require("seedrandom");
const useBusiness = require("../repository/Business");
const useUser = require("../repository/User");
const pdf = require("pdf-parse-fork");
const cloudinary = require("cloudinary").v2;
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const PostJob = require("../modal/PostJobs")
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",   // Để upload PDF
                folder: "cv_pdf"
            },
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
        stream.end(fileBuffer);
    });
};

const createPostjobs = async (businessId, id, data) => {
    const existPostJobs = await usePostJobs.findByOne({ title: data.title });
    if (existPostJobs) {
        throw new Error("Bài đăng công việc đã tồn tại");
    }

    const exitUser = await useUser.findByOne({ _id: id });
    if (!exitUser) {
        throw new Error("Không tìm thấy người dùng");
    }

    const business = await useBusiness.findByOne({ _id: businessId });
    if (!business) {
        throw new Error("Doanh nghiệp không tồn tại");
    }

    if (!business.statusBusiness) {
        throw new Error("Doanh nghiệp chưa được kiểm duyệt!");
    }

    if (data.postPackage == 0) {
        if (business.normalPosts <= 0) {
            throw new Error("Bạn đã hết lượt đăng bình thường");
        }
    }

    if (data.postPackage == 1) {
        if (business.featuredPosts <= 0) {
            throw new Error("Bạn đã hết lượt đăng nổi bật");
        }
    }

    const convertDate = (str) => {
        const [day, month, year] = str.split("/");
        return new Date(`${year}-${month}-${day}`);
    };

    data.deadline = convertDate(data.deadline);
    data.imageCover = business.imageCoverBusiness
    data.business = businessId;
    data.userPost = exitUser.username;

    const PostJobs = await usePostJobs.create(data);

    if (PostJobs) {
        if (data.postPackage == 0) {
            business.normalPosts -= 1;
        } else if (data.postPackage == 1) {
            business.featuredPosts -= 1;
        }
        await business.save();
    }

    return {
        success: true,
        message: "Tạo bài đăng thành công",
        data: PostJobs,
    };
};


const updatePostjobs = async (idp, id, data) => {
    const existPostJobs = await usePostJobs.findByOne({ _id: idp });
    if (!existPostJobs) {
        throw new Error("Không tìm thấy bài đăng công việc");
    }
    const existUser = await useUser.findByOne({ _id: id });
    if (!existUser) {
        throw new Error("Không tìm thấy người đăng bài!");
    }
    data.userPost = existUser.username
    const updatedPostJobs = await usePostJobs.updatebyOne({ _id: idp }, data);
    return {
        success: true,
        data: updatedPostJobs,
    };
}


const buildFilter = (queries) => {

    const filter = {};

    const arrayFields = ["experience", "joblevel", "workType"];

    const schema = PostJob.schema.paths;

    for (const rawKey in queries) {

        let key = rawKey.replace("[]", "");
        let value = queries[rawKey];

        if (value === "" || value === null || value === undefined) continue;

        const list = Array.isArray(value)
            ? value
            : String(value).includes(",")
                ? value.split(",")
                : [value];

        // ==============================
        // ARRAY FIELD
        // ==============================
        if (arrayFields.includes(key)) {

            const schemaType = schema[key].instance;

            if (schemaType === "Array") {
                filter[key] = { $in: list };
            } else {
                filter.$or = list.map(v => ({ [key]: v }));
            }

            continue;
        }

        // ==============================
        // OPERATOR FIELD
        // ==============================
        if (rawKey.includes("[")) {

            const field = rawKey.split("[")[0];
            const op = rawKey.split("[")[1].replace("]", "");

            if (!filter[field]) filter[field] = {};

            filter[field][`$${op}`] = isNaN(value) ? value : Number(value);

            continue;
        }

        // ==============================
        // SEARCH TITLE (partial search)
        // ==============================
        if (key === "title") {

            const keyword = value.trim();

            filter[key] = {
                $regex: keyword,
                $options: "i"
            };

            continue;
        }

        // ==============================
        // DEFAULT
        // ==============================
        filter[key] = value;

    }

    return filter;
};

const detectOperator = (key) => {
    const match = key.match(/(.+)\[(gt|gte|lt|lte|eq|ne)\]$/);
    if (!match) return null;
    return {
        field: match[1],          // salaryRange_min
        op: `$${match[2]}`        // $gt
    };
};


const parseOperatorValue = (raw) => {
    if (typeof raw === "object") {
        const ops = {};
        Object.keys(raw).forEach(op => {
            ops[`$${op}`] = isNaN(raw[op]) ? raw[op] : Number(raw[op]);
        });
        return ops;
    }
    return raw;
};

const flattenPopulate = (item, populations = []) => {
    populations.forEach(pop => {
        const path = pop.path;

        if (item[path] && typeof item[path] === "object") {
            for (const key in item[path]) {
                const newKey = `${path}_${key}`;
                item[newKey] = item[path][key];
            }
            delete item[path];
        }
    });
    return item;
};

const flattenPopulateArray = (items, populations = []) => {
    if (!Array.isArray(items)) return items;
    return items.map(item => flattenPopulate(item, populations));
};


const convertFlattenQuery = (queryParams, populate = []) => {
    const flatFilters = {};

    for (const key in queryParams) {
        const raw = queryParams[key];

        const opInfo = detectOperator(key);
        if (opInfo) {
            const { field, op } = opInfo;

            const [popPath] = field.split("_");
            const isPopulated = populate.some(p => p.path === popPath);

            if (isPopulated) {
                if (!flatFilters[field]) flatFilters[field] = {};
                flatFilters[field][op] = isNaN(raw) ? raw : Number(raw);
            }
            continue;
        }

        if (key.includes(".")) {
            const [path, field] = key.split(".");
            const isPopulated = populate.some(p => p.path === path);

            if (isPopulated) {
                flatFilters[`${path}_${field}`] = parseOperatorValue(raw);
            }
            continue;
        }

        if (key.includes("_")) {
            const [path] = key.split("_");
            const isPopulated = populate.some(p => p.path === path);

            if (isPopulated) {
                flatFilters[key] = parseOperatorValue(raw);
            }
        }
    }

    return flatFilters;
};


const applyFlattenFilter = (items, flatFilters = {}) => {
    return items.filter(item => {

        for (const key in flatFilters) {
            const rule = flatFilters[key];
            const actualValue = item[key];

            if (actualValue === null) {

                continue;
            }

            if (actualValue === undefined) {
                return false;
            }

            if (typeof rule === "object" && !Array.isArray(rule)) {

                for (const op in rule) {
                    let expected = rule[op];

                    const a = isNaN(actualValue) ? actualValue : Number(actualValue);
                    const b = isNaN(expected) ? expected : Number(expected);

                    switch (op) {
                        case "$gt": if (!(a > b)) return false; break;
                        case "$gte": if (!(a >= b)) return false; break;
                        case "$lt": if (!(a < b)) return false; break;
                        case "$lte": if (!(a <= b)) return false; break;
                        case "$eq": if (!(a == b)) return false; break;
                        case "$ne": if (!(a != b)) return false; break;
                    }
                }
            } else {

                if (
                    String(actualValue).toLowerCase() !==
                    String(rule).toLowerCase()
                ) return false;
            }
        }

        return true;
    });
};


const getAllPostjobs = async (queryParams) => {

    const excludeFields = ["limit", "sort", "page", "fields", "random", "seed", "populate", "flatten"];
    const queries = { ...queryParams };
    excludeFields.forEach(el => delete queries[el]);

    const filter = buildFilter(queries);

    const limit = Number(queryParams.limit) || 20;
    const sort = queryParams.sort || "-createdAt";
    const page = Number(queryParams.page) || 1;
    const skip = (page - 1) * limit;
    const fields = queryParams.fields?.split(",").join(" ");
    const flatten = queryParams.flatten === "true";

    let populate = null;
    if (queryParams.populate) {
        populate = queryParams.populate.split(";").map(p => {
            const [path, select] = p.split(":");
            return {
                path: path.trim(),
                select: select ? select.replace(/,/g, " ") : undefined
            };
        });
    }

    let [jobs, total] = await Promise.all([
        usePostJobs.findAll(filter, { fields, sort, skip, limit, populate }),
        usePostJobs.countDocuments(filter)
    ]);

    if (flatten && populate) {
        jobs = flattenPopulateArray(jobs, populate);
        const flatFilters = convertFlattenQuery(queryParams, populate);
        if (Object.keys(flatFilters).length > 0) {
            jobs = applyFlattenFilter(jobs, flatFilters);
        }
    }
    return {
        data: jobs,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
};

const getDetailPostjobs = async (idp) => {

    const detailPostJobs = await usePostJobs.updatebyOne(
        { _id: idp },
        { $inc: { view: 1 } },
        { new: true }
    ).populate("business salaryRange");

    return {
        success: true,
        data: detailPostJobs,
    };
};

const deletePostjobs = async (idp) => {
    const existPostJobs = await usePostJobs.findByOne({ _id: idp });
    if (!existPostJobs) {
        throw new Error("Không tìm thấy bài đăng công việc để xóa");
    }
    await usePostJobs.deletebyOne({ _id: idp });
    return {
        success: true,
        mes: "Xóa bài đăng công việc thành công",
    };
}

const changeStatusPostjobs = async (idp) => {
    const user = await usePostJobs.findByOne({ _id: idp });
    if (!user) {
        throw new Error("Không tìm thấy bài đăng !");
    }
    let status = "";

    if (user.status == "pendding") {
        status = "active"
    } else {
        status = "pendding"
    }

    await usePostJobs.updatebyOne({ _id: idp }, { status });
    return {
        success: true,
        mes: "Thay đổi trạng thái thành công!",
    };
};

const changeStatusPausePostjobs = async (idp) => {
    // Tìm bài đăng theo ID
    const post = await usePostJobs.findByOne({ _id: idp });

    if (!post) {
        throw new Error("Không tìm thấy bài đăng để cập nhật!");
    }

    // Toggle trạng thái
    const statusPause = !post.statusPause;

    // Cập nhật
    await usePostJobs.updatebyOne({ _id: idp }, { statusPause });

    return {
        success: true,
        mes: "Thay đổi trạng thái thành công!",
    };
};


const matchCVWithJD = async (cvText, jdText) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `Bạn là chuyên gia Technical Recruiter. Nhiệm vụ: Chấm điểm CV dựa trên JD.
          QUY TẮC: 
          1. Score = 0 nếu dữ liệu là báo cáo, danh sách hàng hóa hoặc không phải CV người thật.
          2. Score 85-100: Khớp hoàn toàn kỹ năng (ReactJS, PHP, Ruby) & >5 năm kinh nghiệm.
          3. Score 40-60: Thiếu 1 kỹ năng chính hoặc kinh nghiệm < 3 năm.
          4. Trả về đúng định dạng JSON.`
                },
                {
                    role: "user",
                    content: `PHÂN TÍCH:
          JD: ${jdText}
          ---
          CV: ${cvText}
          ---
          YÊU CẦU JSON:
          {
            "score": number,
            "match_details": { "skills": "string", "exp": "string", "location": "string" },
            "strengths": [],
            "weaknesses": [],
            "summary": "string"
          }`
                }
            ]
        });
        const result = JSON.parse(chatCompletion.choices[0].message.content);
        return result;
    } catch (error) {
        console.error("Lỗi Groq AI:", error.message);
        return { score: 0, strengths: [], weaknesses: [], summary: "Lỗi hệ thống." };
    }
};

const uploadCVPostjobs = async (idp, id, req) => {
    if (!req.file) throw new Error("Không nhận được file!");

    const post = await usePostJobs.findByOne({ _id: idp });
    if (!post) throw new Error("Không tìm thấy bài đăng!");

    const hasApplied = post.listCV.some(cv => cv.idUser.toString() === id.toString());

    if (hasApplied) {
        throw new Error("Bạn đã nộp CV cho công việc này rồi! Không thể nộp thêm.");
    }

    const now = new Date();
    if (post.deadline && new Date(post.deadline) < now) {
        throw new Error("Công việc này đã hết hạn nộp CV!");
    }

    const cloud = await uploadToCloudinary(req.file.buffer);
    const numberUploadNext = (post.numberUpload || 0) + 1;
    let pdfText = "";
    try {
        const pdfData = await pdf(req.file.buffer);
        pdfText = pdfData.text || "";
    } catch (err) {
        console.log("Lỗi parse PDF:", err.message);
    }

    const aiAnalysis = await matchCVWithJD(pdfText, post.description || "");
    let evaluate = "";
    if (aiAnalysis.score >= 90) {
        evaluate = "Xuất sắc (Ưu tiên)";
    } else if (aiAnalysis.score >= 75) {
        evaluate = "Rất tốt (Phù hợp)";
    } else if (aiAnalysis.score >= 50) {
        evaluate = "Tiềm năng (Cần xem xét)";
    } else if (aiAnalysis.score >= 25) {
        evaluate = "Trung bình (Cân nhắc)";
    } else if (aiAnalysis.score >= 10) {
        evaluate = "Kém (Không khớp)";
    } else {
        evaluate = "Rất tệ / Dữ liệu rác";
    }

    const updatedPost = await usePostJobs.updatebyOne(
        { _id: idp },
        {
            $push: {
                listCV: {
                    idUser: id,
                    description: req.body.description || "",
                    fileCV: cloud.secure_url,
                    pdfText: pdfText,
                    ratio: aiAnalysis.score,
                    evaluate,
                    createdAt: new Date()
                }
            },
            $set: {
                numberUpload: numberUploadNext
            }
        }
    );

    return {
        success: true,
        mes: "Ứng tuyển thành công!",
        aiScore: aiAnalysis?.score || 0 // Trả về điểm cho FE hiển thị
    };
};

const getCVPostJobsPostjobs = async (idp, params = {}) => {

    const post = await usePostJobs.findByOne({ _id: idp })
        .populate({
            path: 'listCV.idUser',
            select: 'username email phone'
        });

    if (!post) {
        throw new Error("Không tìm thấy bài đăng hoặc bài đăng đã bị xóa!");
    }

    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const skip = (page - 1) * limit;

    let candidates = post.listCV || [];
    candidates.sort((a, b) => b.ratio - a.ratio);

    const total = candidates.length;
    const totalPages = Math.ceil(total / limit);

    const paginatedData = candidates.slice(skip, skip + limit);
    return {
        success: true,
        jobTitle: post.title,
        total,
        totalPages,
        currentPage: page,
        data: paginatedData
    };
};

const ChangeStatusCVPostjobs = async (idp, idcv, data) => {
    const { status } = data
    const update = await usePostJobs.updatebyOne(
        { _id: idp, "listCV._id": idcv },
        {
            $set: { "listCV.$.status": status }
        }
    );

    return {
        success: true,
        message: "Cập nhật trạng thái CV thành công",
        data: update
    };
}

module.exports = {
    createPostjobs,
    updatePostjobs,
    getAllPostjobs,
    deletePostjobs,
    getDetailPostjobs,
    changeStatusPostjobs,
    changeStatusPausePostjobs,
    uploadCVPostjobs,
    getCVPostJobsPostjobs,
    ChangeStatusCVPostjobs,
}