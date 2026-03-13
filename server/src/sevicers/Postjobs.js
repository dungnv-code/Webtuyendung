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
                resource_type: "raw",
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
    data.imageCover = business.imageAvatarBusiness
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

        if (arrayFields.includes(key)) {

            const schemaType = schema[key].instance;

            if (schemaType === "Array") {
                filter[key] = { $in: list };
            } else {
                filter.$or = list.map(v => ({ [key]: v }));
            }

            continue;
        }
        if (rawKey.includes("[")) {

            const field = rawKey.split("[")[0];
            const op = rawKey.split("[")[1].replace("]", "");

            if (!filter[field]) filter[field] = {};

            filter[field][`$${op}`] = isNaN(value) ? value : Number(value);

            continue;
        }

        if (key === "title") {

            const keyword = value.trim();

            filter[key] = {
                $regex: keyword,
                $options: "i"
            };

            continue;
        }

        filter[key] = value;

    }

    return filter;
};

const detectOperator = (key) => {
    const match = key.match(/(.+)\[(gt|gte|lt|lte|eq|ne)\]$/);
    if (!match) return null;
    return {
        field: match[1],
        op: `$${match[2]}`
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

    const statusPause = !post.statusPause;

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
            temperature: 0.05,
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `
Bạn là AI tuyển dụng chuyên phân tích CV và Job Description.
QUY TẮC QUAN TRỌNG:
- Chỉ trả về JSON hợp lệ
- Không viết giải thích
- Không markdown
- Không text ngoài JSON
BƯỚC 0: KIỂM TRA TÀI LIỆU
Xác định tài liệu CV DATA có phải là CV cá nhân hay không.
CV hợp lệ thường chứa các thông tin như:
- Thông tin cá nhân
- Kinh nghiệm làm việc
- Kỹ năng
- Học vấn
- Dự án
- Chứng chỉ
Nếu tài liệu KHÔNG phải CV cá nhân
(ví dụ: portfolio, company profile, proposal, tài liệu marketing, báo cáo...)
=> TRẢ VỀ JSON NGAY LẬP TỨC:
{
 "score": 0,
 "reason": "Tài liệu không phải CV cá nhân",
 "title": {
   "job": "",
   "cv": "",
   "score": 0
 }
}
KHÔNG PHÂN TÍCH BẤT KỲ TRƯỜNG NÀO KHÁC.
BƯỚC 1: KIỂM TRA TITLE
1. Trích xuất:
jobTitle: title chính của Job Description  
cvTitle: title nghề nghiệp chính của CV (thường nằm ở phần Profile / Title / Experience)
2. Chuẩn hóa title về nhóm nghề nghiệp (career group):
Developer group: Frontend Developer, Backend Developer, Fullstack Developer, 
                 Software Engineer, Web Developer, Mobile Developer
Analyst group:   Business Analyst, System Analyst, Data Analyst
Design group:    UI Designer, UX Designer, Graphic Designer
Marketing group: Marketing, Digital Marketing, SEO, Content Marketing
Sales group:     Sales, Business Development
HR group:        HR, Recruiter
3. So sánh nhóm nghề nghiệp — KIỂM TRA TRƯỚC KHI LÀM BẤT CỨ ĐIỀU GÌ KHÁC:
BƯỚC BẮT BUỘC - PHẢI THỰC HIỆN ĐẦU TIÊN:
- Xác định jobGroup = career group của jobTitle
- Xác định cvGroup   = career group của cvTitle
- Nếu jobGroup ≠ cvGroup → DỪNG NGAY, trả về JSON bên dưới, KHÔNG làm gì thêm
{
  "score": 0,
  "reason": "Job title và CV title khác lĩnh vực",
  "title": {
    "job": "<jobTitle>",
    "cv": "<cvTitle>",
    "score": 0
  }
}
TUYỆT ĐỐI KHÔNG phân tích skills / experience / projects / education / language / summary
TUYỆT ĐỐI KHÔNG cộng điểm từ các mục khác
TUYỆT ĐỐI KHÔNG trả về score > 0 khi jobGroup ≠ cvGroup
Ví dụ minh họa:
- jobTitle: "Fullstack Developer"  → jobGroup: Developer
- cvTitle:  "System Analyst"       → cvGroup:  Analyst
- Developer ≠ Analyst              → score: 0, DỪNG NGAY
Chỉ tiếp tục phân tích chi tiết khi jobGroup = cvGroup.

BƯỚC 2: PHÂN TÍCH CV
A. TRÍCH XUẤT THÔNG TIN CV
Trích xuất chính xác các mục sau từ CV:
- title:         Chức danh nghề nghiệp chính
- experience:    Số năm kinh nghiệm + các vị trí đã làm
- position:      Cấp bậc hiện tại (Junior / Middle / Senior / Lead)
- skills:        Kỹ năng kỹ thuật (hard skills)
- projectSkills: Kỹ năng thể hiện qua dự án thực tế
- projects:      Danh sách dự án + công nghệ sử dụng
- education:     Trình độ học vấn + chuyên ngành
- language:      Ngôn ngữ + mức độ thành thạo
B. ĐÁNH GIÁ KỸ NĂNG MỀM (Soft Skills)
Dựa trên cách mô tả trong CV, đánh giá:
- communication:    Khả năng diễn đạt rõ ràng trong CV
- teamwork:         Đề cập làm việc nhóm / phối hợp team
- problemSolving:   Mô tả giải quyết vấn đề cụ thể
- leadership:       Kinh nghiệm dẫn dắt / mentor / lead
- adaptability:     Làm việc nhiều domain / công nghệ khác nhau
C. ĐÁNH GIÁ TRÌNH BÀY CV (CV Presentation)
- clarity:          Cấu trúc CV rõ ràng, dễ đọc
- experienceDesc:   Mô tả kinh nghiệm cụ thể, có số liệu
- logicFlow:        Trình bày logic, mạch lạc
- projectDesc:      Dự án nêu rõ công nghệ + vai trò + kết quả
CHẤM ĐIỂM TỪNG TIÊU CHÍ (0-10)
Thang điểm:
0-2  : Không có / Không phù hợp
3-5  : Có nhưng yếu / Phù hợp thấp
6-8  : Đáp ứng tốt
9-10 : Xuất sắc / Phù hợp rất cao
Yêu cầu chấm điểm KHÁCH QUAN:
- Đối chiếu trực tiếp với yêu cầu Job Description
- Không suy đoán nếu CV không đề cập rõ → chấm thấp
- Có bằng chứng cụ thể từ CV mới chấm cao
========================
TÍNH ĐIỂM TỔNG (0-100)
Công thức:
score = (skills        * 0.25)
      + (projectSkills * 0.25)
      + (experience    * 0.20)
      + (softSkills    * 0.10)
      + (cvPresentation* 0.10)
      + (education     * 0.05)
      + (language      * 0.05)
Trong đó:
- softSkills     = trung bình của 5 soft skill scores
- cvPresentation = trung bình của 4 presentation scores
`
                },
                {
                    role: "user",
                    content: `
JOB DATA:
${jdText}
CV DATA:
${cvText}
Trả về JSON theo format:
{
 "score": 0,
 "title": {"job": "", "cv": "", "score": 0},
 "experience": {"job": "", "cv": "", "score": 0},
 "position": {"job": "", "cv": "", "score": 0},
 "skills": {"job": [], "cv": [], "matched": [], "missing": [], "score": 0},
 "projectSkills": {"skills": [], "matchedWithJob": [], "missingFromJob": [], "score": 0},
 "softSkills": {"cv": [], "relevantToJob": [], "score": 0},
 "cvPresentation": {"structure": "", "clarity": "", "score": 0},
 "projects": [],
 "education": {"cv": "", "score": 0},
 "language": {"cv": "", "score": 0},
 "summary": ""
}
`
                }
            ]
        });

        const raw = chatCompletion.choices?.[0]?.message?.content || "{}";

        try {

            const data = JSON.parse(raw);

            return {
                score: data.score || 0,
                title: data.title || {},
                experience: data.experience || {},
                position: data.position || {},
                skills: data.skills || {},
                projectSkills: data.projectSkills || {},
                projects: data.projects || [],
                education: data.education || {},
                language: data.language || {},
                summary: data.summary || ""
            };

        } catch (err) {

            console.error("JSON parse error:", err);
            console.log("RAW AI:", raw);

            return {
                score: 0,
                title: {},
                experience: {},
                position: {},
                skills: {},
                projectSkills: {},
                projects: [],
                education: {},
                language: {},
                summary: "AI trả JSON không hợp lệ"
            };
        }

    } catch (error) {

        console.error("Error matching CV:", error);

        return {
            score: 0,
            title: {},
            experience: {},
            position: {},
            skills: {},
            projectSkills: {},
            projects: [],
            education: {},
            language: {},
            summary: "Lỗi hệ thống khi phân tích"
        };
    }
};

const uploadCVPostjobs = async (idp, id, req) => {
    if (!req.file) throw new Error("Không nhận được file!");

    const post = await usePostJobs.findByOne({ _id: idp });
    if (!post) throw new Error("Không tìm thấy bài đăng!");

    if (post.status == "pendding") {
        throw new Error("Bài đăng chưa được kiểm duyệt!");
    }

    if (post.statusPause) {
        throw new Error("Bài đăng đang trong trạng thái tạm ẩn!");
    }

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

    const aiAnalysis = await matchCVWithJD(pdfText, post || "");
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
        evaluate = "Rất tệ / Dữ liệu không liên quan";
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

    console.log(aiAnalysis)

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