const usePostJobs = require("../repository/PostJobs");
const seedrandom = require("seedrandom");
const useBusiness = require("../repository/Business");
const useUser = require("../repository/User");
const pdf = require("pdf-parse-fork");
const cloudinary = require("cloudinary").v2;
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const PostJob = require("../modal/PostJobs")
const sendMail = require("../ulti/sendMail");
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

    await useUser.updateMany(
        { wishlistJBusiness: businessId },
        {
            $push: {
                notifications: {
                    $each: [{
                        title: `Việc làm mới từ ${business.nameBusiness || "doanh nghiệp"}`,
                        message: `Có job mới: ${data.title}`,
                    }],
                    $position: 0
                }
            }
        }
    );

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


function cleanCV(text) {
    return text
        .replace(/\[.*?\]\(.*?\)/g, "")
        .replace(/mailto:/gi, "")
        .replace(/https?:\/\/\S+/g, "")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/[^\S\n]{3,}/g, "  ")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[•·●▪▸►→\-–—]{1,2}\s*/g, "- ")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/(\d{4})\s*[-–—]\s*(present|now|hiện tại|nay)/gi, "$1 - Present")
        .trim();
}

function safeParseJSON(raw = "") {
    try {
        let clean = raw
            .replace(/```json\s*/gi, "")
            .replace(/```\s*/g, "")
            .trim();
        const start = clean.indexOf("{");
        const end = clean.lastIndexOf("}");
        if (start !== -1 && end > start) {
            clean = clean.slice(start, end + 1);
        }
        return JSON.parse(clean);
    } catch {
        return null;
    }
}

const clampScore = (v) => Math.min(10, Math.max(0, Number(v) || 0));

const safeScore = (obj) =>
    obj && typeof obj.score === "number" ? clampScore(obj.score) : 0;

const normalizeSkill = (s = "") =>
    s.toLowerCase()
        .replace(/\.js$/, "")
        .replace(/js$/, "")
        .replace(/[.\-_\s]+/g, "")
        .trim();
const SCORE_WEIGHTS = {
    skills: 0.25,
    experience: 0.25,
    title: 0.15,
    projectSkills: 0.20,
    softSkills: 0.05,
    cvPresentation: 0.05,
    education: 0.03,
    language: 0.02,
};

const FIELD_SIMILARITY_THRESHOLD = 0.25;

const GROUP_KEYWORDS = {
    Developer: ["developer", "engineer", "frontend", "backend", "fullstack", "web", "mobile", "software", "devops", "cloud", "platform"],
    Analyst: ["analyst", "data analyst", "business analyst", "system analyst", "data scientist", "bi"],
    Design: ["designer", "ui", "ux", "graphic", "product design"],
    Marketing: ["marketing", "seo", "content", "growth", "livestream", "digital", "campaign", "brand", "copywriter"],
    Sales: ["sales", "business development", "account", "presales"],
    HR: ["hr", "recruiter", "human resource", "talent", "people ops"],
    PM: ["product manager", "project manager", "scrum master", "agile"],
};

const detectGroup = (title = "") => {
    const t = title.toLowerCase();
    for (const [g, kws] of Object.entries(GROUP_KEYWORDS)) {
        if (kws.some((k) => t.includes(k))) return g;
    }
    return "Other";
};

const fieldSimilarity = (cvGroup, jdGroup) => {
    if (cvGroup === jdGroup) return 1;
    if (cvGroup === "Other" || jdGroup === "Other") return 0.5;
    return 0;
};

const calcWeightedScore = (data) => {
    const components = {
        skills: safeScore(data.skills),
        experience: safeScore(data.experience),
        title: safeScore(data.title),
        projectSkills: safeScore(data.projectSkills),
        softSkills: safeScore(data.softSkills),
        cvPresentation: safeScore(data.cvPresentation),
        education: safeScore(data.education),
        language: safeScore(data.language),
    };

    const raw = Object.entries(SCORE_WEIGHTS).reduce(
        (sum, [key, weight]) => sum + (components[key] ?? 0) * weight,
        0
    );

    return Math.round(clampScore(raw) * 10) / 10;
};

function buildEmptyResult(summary, title = { job: "", cv: "", score: 0 }) {
    return {
        score: 0, title,
        experience: {}, position: {}, skills: {},
        projectSkills: {}, projects: [], softSkills: {},
        cvPresentation: {}, education: {}, language: {},
        summary
    };
}

async function groqJSON(systemPrompt, userContent, temperature = 0) {
    const res = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent }
        ]
    });
    const raw = res.choices?.[0]?.message?.content || "";
    return safeParseJSON(raw);
}

const CV_JD_PARSE_SCHEMA = `{
  "cv": {
    "currentTitle": "string max 6 words",
    "totalYearsExp": 0,
    "skills": ["string"],
    "education": "string",
    "languages": ["string"],
    "hasPersonalInfo": false,
    "hasExperience": false,
    "hasSkills": false,
    "hasEducation": false,
    "hasProjects": false,
    "projectCount": 0,
    "experienceSummary": "string 1 sentence",
    "projectSummary": "string 1 sentence",
    "experienceEntries": [
      {
        "company": "string",
        "title": "string",
        "from": "YYYY-MM or year",
        "to": "YYYY-MM or year or Present",
        "durationMonths": 0,
        "responsibilities": ["string"],
        "technologiesUsed": ["string"]
      }
    ],
    "highestEducation": "High School|Associate|Bachelor|Master|PhD|Other",
    "gpa": "string or null",
    "certifications": ["string"],
    "achievementKeywords": ["string"],
    "careerGap": false,
    "lastActiveYear": 0
  },
  "jd": {
    "jobTitle": "string max 6 words",
    "jobGroup": "Developer|Analyst|Design|Marketing|Sales|HR|PM|Other",
    "requiredSkills": ["string"],
    "niceToHaveSkills": ["string"],
    "requiredYearsExp": 0,
    "requiredEducation": "string",
    "requiredLanguages": ["string"],
    "seniorityLevel": "Intern|Junior|Mid|Senior|Lead|Manager",
    "keyResponsibilities": ["string"],
    "domainKeywords": ["string"]
  }
}`;

const SCORE_SCHEMA = `{
  "score": 0,
  "title": {
    "job": "", "cv": "", "score": 0, "reasoning": ""
  },
  "experience": {
    "job": "", "cv": "", "score": 0, "reasoning": "",
    "relevantYears": 0,
    "seniorityMatch": "Under|Match|Over",
    "careerProgression": "Ascending|Flat|Descending|Mixed"
  },
  "position": { "job": "", "cv": "", "score": 0, "reasoning": "" },
  "skills": {
    "job": [], "cv": [], "matched": [], "missing": [], "score": 0,
    "semanticMatches": [{ "jd": "", "cv": "" }],
    "coveragePercent": 0
  },
  "projectSkills": {
    "skills": [], "matchedWithJob": [], "missingFromJob": [], "score": 0,
    "projectComplexity": "Low|Medium|High"
  },
  "softSkills": {
    "scores": {
      "communication": 0, "teamwork": 0,
      "problemSolving": 0, "leadership": 0, "adaptability": 0
    },
    "cv": [], "relevantToJob": [], "score": 0,
    "evidencedSoftSkills": ["string"]
  },
  "cvPresentation": {
    "scores": {
      "clarity": 0, "experienceDesc": 0,
      "logicFlow": 0, "projectDesc": 0
    },
    "structure": "", "clarity": "", "score": 0,
    "weaknesses": ["string"]
  },
  "projects": [],
  "education": { "cv": "", "score": 0, "meetsRequirement": true },
  "language":  { "cv": "", "score": 0, "detectedLanguages": [] },
  "summary":   "",
  "redFlags":  ["string"],
  "strengths": ["string"]
}`;

function smartTruncateCV(text, maxChars = 10000) {
    if (text.length <= maxChars) return text;
    const headSize = Math.round(maxChars * 0.6);
    const tailSize = maxChars - headSize;
    const head = text.slice(0, headSize);
    const tail = text.slice(-tailSize);
    return `${head}\n\n...[section truncated for length]...\n\n${tail}`;
}


function validateCVSections(cv) {
    if (!cv.hasPersonalInfo) {
        return "CV thiếu thông tin cá nhân (tên, liên hệ)";
    }
    if (!cv.hasExperience && !cv.hasProjects) {
        return "CV cần có ít nhất kinh nghiệm làm việc hoặc dự án";
    }
    if (!cv.hasSkills) {
        return "CV thiếu mục kỹ năng";
    }
    return null;
}

const clampSection = (obj) => {
    if (!obj) return {};
    const result = { ...obj };
    if ("score" in result) result.score = clampScore(result.score);
    if ("scores" in result && typeof result.scores === "object") {
        result.scores = Object.fromEntries(
            Object.entries(result.scores).map(([k, v]) => [k, clampScore(v)])
        );
    }
    return result;
};


const matchCVWithJD = async (cvText, jdText) => {
    try {

        const cvCleaned = cleanCV(cvText);
        const jdCleaned = cleanCV(jdText);

        const cvRaw = smartTruncateCV(cvCleaned, 10000);
        const jdRaw = jdCleaned.slice(0, 4000);

        const parsed = await groqJSON(
            `You are an expert CV and Job Description parser.
Read both documents carefully and extract structured data.
Rules:
- Extract ALL skills mentioned anywhere (summary, experience, projects, skills section)
- For experienceEntries: estimate durationMonths from date ranges; if "Present" use current month
- For technologiesUsed: include tools, frameworks, languages mentioned in that role
- achievementKeywords: look for numbers, %, KPIs, awards, scale (e.g. "10x", "1M users")
- careerGap: true if any gap > 12 months between roles
- lastActiveYear: year of most recent role or project
- hasPersonalInfo: true if name or contact info present
- hasExperience: true if any work history section found
- hasProjects: true if any personal/academic/freelance projects found

Return ONLY valid JSON matching this exact schema:
${CV_JD_PARSE_SCHEMA}`,
            `CV:\n${cvRaw}\n\nJOB DESCRIPTION:\n${jdRaw}`
        );

        if (!parsed?.cv || !parsed?.jd) {
            return buildEmptyResult("Lỗi parse CV/JD — AI trả về dữ liệu không hợp lệ");
        }

        const { cv, jd } = parsed;

        const validationError = validateCVSections(cv);
        if (validationError) {
            return buildEmptyResult(validationError);
        }

        const cvGroup = detectGroup(cv.currentTitle);
        const jdGroup = jd.jobGroup !== "Other" ? jd.jobGroup : detectGroup(jd.jobTitle);
        const similarity = fieldSimilarity(cvGroup, jdGroup);

        if (similarity === 0) {
            return buildEmptyResult("Lĩnh vực CV và JD không tương đồng", {
                job: jd.jobTitle || "",
                cv: cv.currentTitle || "",
                score: 0,
            });
        }

        const cvSkillsNorm = cv.skills.map(normalizeSkill);
        const jdSkillsNorm = jd.requiredSkills.map(normalizeSkill);


        const data = await groqJSON(
            `You are a senior technical recruiter scoring a CV against a Job Description.

Scoring scale (0-10):
- 0-2 = Missing or completely irrelevant
- 3-5 = Weak or partial match
- 6-8 = Good match with minor gaps
- 9-10 = Excellent or perfect match

Scoring rules:
- Skill aliases count as matches: ReactJS=React, NodeJS=Node.js, Postgres=PostgreSQL, K8s=Kubernetes
- Project experience counts as ~60% of formal work experience if no full-time role exists
- Penalize unexplained career gaps > 12 months in experience score
- Reward measurable achievements (%, numbers, user scale, revenue impact)
- For experience score: compare jd.requiredYearsExp vs cv.totalYearsExp in relevant domain
- coveragePercent in skills = (matched.length / jd.requiredSkills.length) * 100
- For softSkills: only count if there is written evidence in CV (not just claimed)
- For cvPresentation: score based on clarity, quantity of detail, logical flow, use of metrics
- projectComplexity: Low = simple CRUD, Medium = real users/integrations, High = scale/architecture
- seniorityMatch: compare jd.seniorityLevel vs cv experience level
- careerProgression: look at title changes across experienceEntries

Fill redFlags array with any of:
- Unexplained employment gaps > 12 months
- Job hopping (< 12 months average per role with 3+ roles)
- CV title unrelated to JD
- No measurable results mentioned
- Skills listed but no evidence in experience

Fill strengths array with any of:
- Strong skill coverage (>80% matched)
- Impressive project scale or complexity
- Relevant domain experience
- Measurable achievements
- Matching seniority level

Return ONLY valid JSON matching this exact schema:
${SCORE_SCHEMA}`,
            `CV_PARSED:
${JSON.stringify({ ...cv, skills_normalized: cvSkillsNorm }, null, 2)}

JD_PARSED:
${JSON.stringify({ ...jd, requiredSkills_normalized: jdSkillsNorm }, null, 2)}`,
            0.1
        );

        if (!data) {
            return buildEmptyResult("AI trả sai format khi scoring");
        }

        const fieldPenalty = similarity;
        const weightedScore = calcWeightedScore(data);
        const finalScore = Math.round(weightedScore * fieldPenalty * 100) / 10;

        return {
            score: finalScore,
            fieldSimilarity: similarity,

            title: clampSection(data.title) || { job: jd.jobTitle, cv: cv.currentTitle, score: 0 },
            experience: clampSection(data.experience) || {},
            position: clampSection(data.position) || {},
            skills: clampSection(data.skills) || {},
            projectSkills: clampSection(data.projectSkills) || {},
            softSkills: clampSection(data.softSkills) || {},
            cvPresentation: clampSection(data.cvPresentation) || {},
            education: clampSection(data.education) || {},
            language: clampSection(data.language) || {},

            projects: data.projects || [],
            redFlags: data.redFlags || [],
            strengths: data.strengths || [],
            summary: data.summary || "",

            _meta: {
                cvGroup,
                jdGroup,
                fieldPenalty,
                cvEntries: cv.experienceEntries?.length ?? 0,
                cvCertCount: cv.certifications?.length ?? 0,
                careerGap: cv.careerGap ?? false,
                lastActive: cv.lastActiveYear ?? null,
            },
        };

    } catch (error) {
        console.error("Error matching CV:", error);
        return buildEmptyResult("Lỗi hệ thống khi phân tích CV");
    }
};

const uploadCVPostjobs = async (idp, id, req) => {
    if (!req.file) throw new Error("Không nhận được file!");
    if (req.file.mimetype !== "application/pdf") throw new Error("Chỉ chấp nhận file PDF!");

    const post = await usePostJobs.findByOne({ _id: idp });
    if (!post) throw new Error("Không tìm thấy bài đăng!");
    if (post.status === "pendding") throw new Error("Bài đăng chưa được kiểm duyệt!");
    if (post.statusPause) throw new Error("Bài đăng đang trong trạng thái tạm ẩn!");

    const existingCV = (post.listCV || []).find(cv => cv.idUser.toString() === id.toString());
    console.log(existingCV?.status);
    if (existingCV && existingCV.status !== "pendding") throw new Error("CV đã được xử lý, không thể cập nhật!");
    if (post.deadline && new Date(post.deadline) < new Date()) throw new Error("Công việc này đã hết hạn nộp CV!");

    const cloud = await uploadToCloudinary(req.file.buffer);

    let pdfText = "";
    try {
        const pdfData = await pdf(req.file.buffer);
        pdfText = pdfData.text || "";
    } catch (err) {
        console.log("Lỗi parse PDF:", err.message);
    }

    const cleanText = cleanCV(pdfText).slice(0, 8000);
    const jdText = cleanCV(post.description || post.title || "").slice(0, 2000);

    let aiAnalysis = { score: 0 };
    try {
        aiAnalysis = await matchCVWithJD(cleanText, jdText);
    } catch {
        aiAnalysis = buildEmptyResult("Lỗi AI");
    }
    console.log("AI Analysis Result:", aiAnalysis);
    const score = Number(aiAnalysis?.score) || 0;
    let evaluate = "";
    if (score >= 90) evaluate = "Xuất sắc (Ưu tiên)";
    else if (score >= 75) evaluate = "Rất tốt (Phù hợp)";
    else if (score >= 50) evaluate = "Tiềm năng (Cần xem xét)";
    else if (score >= 25) evaluate = "Trung bình (Cân nhắc)";
    else if (score >= 10) evaluate = "Kém (Không khớp)";
    else evaluate = "Rất tệ / Dữ liệu không liên quan";

    if (existingCV) {
        await usePostJobs.updatebyOne(
            { _id: idp, "listCV._id": existingCV._id },
            {
                $set: {
                    "listCV.$.fileCV": cloud.secure_url,
                    "listCV.$.pdfText": cleanText,
                    "listCV.$.ratio": score,
                    "listCV.$.evaluate": evaluate,
                    "listCV.$.status": "pendding",
                    "listCV.$.updatedAt": new Date()
                }
            }
        );
    } else {
        await usePostJobs.updatebyOne(
            { _id: idp },
            {
                $push: {
                    listCV: {
                        idUser: id,
                        description: req.body?.description || "",
                        fileCV: cloud.secure_url,
                        pdfText: cleanText,
                        ratio: score,
                        evaluate,
                        status: "pendding",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                },
                $set: { numberUpload: (post.numberUpload || 0) + 1 }
            }
        );
    }

    return {
        success: true,
        mes: existingCV ? "Cập nhật CV thành công!" : "Ứng tuyển thành công!",
        aiScore: score
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

const ChangeStatusCVPostjobs = async (idp, idUser, idcv, data) => {
    const { status } = data;
    const { message } = data;
    await usePostJobs.updatebyOne(
        { _id: idp, "listCV._id": idcv },
        {
            $set: { "listCV.$.status": status }
        }
    );
    const userBusiness = await useUser.findByOne({ _id: idUser });
    const postJob = await usePostJobs.findByOne({ _id: idp })
        .populate("listCV.idUser", "email")
        .populate("business", "nameBusiness");
    if (!postJob) {
        throw new Error("Không tìm thấy bài đăng");
    }
    const cv = postJob.listCV.find(
        item => item._id.toString() === idcv
    );
    const companyName = postJob.business?.nameBusiness || "Công ty";
    const jobTitle = postJob.title || "Vị trí tuyển dụng";
    if (message != null && message.trim() !== "") {
        const html = `
    <h3>Thông báo kết quả ứng tuyển</h3>
    <p>Xin chào ${cv.idUser?.username || "Ứng viên"},</p>
    <p>Bạn đã ứng tuyển vào vị trí <b>${jobTitle}</b> tại <b>${companyName}</b>.</p>
    <p>Chúng tôi rất tiếc phải thông báo rằng CV của bạn hiện chưa phù hợp với yêu cầu của vị trí này.</p>
    ${message ? `<p><b>Lý do:</b> ${message}</p>` : ""}
    <p>Hy vọng sẽ có cơ hội hợp tác với bạn trong tương lai.</p>
    <br/>
    <p>Trân trọng,</p>
    <p><b>${companyName}</b></p>
`;
        await sendMail({
            email: cv.idUser?.email,
            subject: "Kết quả ứng tuyển",
            html: html
        });
    }

    if (status !== "pending") {
        const notify = {
            title: "Phản hồi về ứng tuyển",
            message: `Ứng tuyển "${postJob.title}" ${status === "unactive" ? "đã bị từ chối" : "đã được duyệt"}. ${message || ""}`,
        };

        await useUser.updatebyOne(
            { _id: cv.idUser?._id },
            {
                $push: {
                    notifications: {
                        $each: [notify],
                        $position: 0
                    }
                }
            }
        );
    }

    if (!cv) {
        throw new Error("Không tìm thấy CV");
    }

    return {
        success: true,
        message: "Cập nhật trạng thái CV thành công",
        businessEmail: userBusiness?.email || null,
        userEmail: cv.idUser?.email || null,
        data: cv
    };
};

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