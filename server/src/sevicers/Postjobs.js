const usePostJobs = require("../repository/PostJobs");
const seedrandom = require("seedrandom");
const useBusiness = require("../repository/Business");
const createPostjobs = async (businessId, data) => {

    // 1. Kiểm tra bài đăng trùng
    const existPostJobs = await usePostJobs.findByOne({ title: data.title });
    if (existPostJobs) {
        throw new Error("Bài đăng công việc đã tồn tại");
    }

    // 2. Kiểm tra doanh nghiệp tồn tại
    const business = await useBusiness.findByOne({ _id: businessId });
    if (!business) {
        throw new Error("Doanh nghiệp không tồn tại");
    }

    // 3. Kiểm tra lượt đăng
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

    // 4. Gán doanh nghiệp cho bài đăng
    const convertDate = (str) => {
        const [day, month, year] = str.split("/");
        return new Date(`${year}-${month}-${day}`);
    };

    data.deadline = convertDate(data.deadline);
    data.business = businessId;

    // 5. Tạo bài đăng
    const PostJobs = await usePostJobs.create(data);

    // 6. Trừ lượt đăng sau khi tạo thành công
    if (PostJobs) {
        if (data.postPackage == 0) {
            business.normalPosts -= 1;
        } else if (data.postPackage == 1) {
            business.featuredPosts -= 1;
        }
        await business.save();
    }

    // 7. Trả về kết quả
    return {
        success: true,
        message: "Tạo bài đăng thành công",
        data: PostJobs,
    };
};


const updatePostjobs = async (idp, data) => {
    const existPostJobs = await usePostJobs.findByOne({ _id: idp });
    if (!existPostJobs) {
        throw new Error("Không tìm thấy bài đăng công việc");
    }
    const updatedPostJobs = await usePostJobs.updatebyOne({ _id: idp }, data);
    return {
        success: true,
        data: updatedPostJobs,
    };
}

// =======================================================================
// --------------------------  BUILD FILTER (MONGO) -----------------------
// =======================================================================

const buildFilter = (queries) => {
    const filter = {};

    for (const key in queries) {

        // Bỏ qua query dạng flatten
        if (key.includes("_") || key.includes(".")) continue;

        const value = queries[key];

        // Nếu dạng toán tử: ?min[gt]=1000
        if (typeof value === "object" && !Array.isArray(value)) {
            filter[key] = {};
            for (const op in value) {
                const mongoOp = `$${op}`;
                filter[key][mongoOp] = isNaN(value[op]) ? value[op] : Number(value[op]);
            }
        } else {
            // Tag thường → regex search
            filter[key] = { $regex: value, $options: "i" };
        }
    }

    return filter;
};


// =======================================================================
// ---------------------- OPERATOR DETECTOR (IMPORTANT) ------------------
// =======================================================================
// Detect dạng key: salaryRange_min[gt]

const detectOperator = (key) => {
    const match = key.match(/(.+)\[(gt|gte|lt|lte|eq|ne)\]$/);
    if (!match) return null;

    return {
        field: match[1],          // salaryRange_min
        op: `$${match[2]}`        // $gt
    };
};


// =======================================================================
// -------------------------  FLATTEN HELPERS ----------------------------
// =======================================================================

// Parse toán tử
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

// Nhúng populate vào object chính
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


// =======================================================================
// ---------------  CHUYỂN QUERY FLATTEN + HỖ TRỢ TOÁN TỬ ---------------
// =======================================================================

const convertFlattenQuery = (queryParams, populate = []) => {
    const flatFilters = {};

    for (const key in queryParams) {
        const raw = queryParams[key];

        // 👉 1) Detect toán tử dạng salaryRange_min[gt]
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

        // 👉 2) Dạng . (business.name)
        if (key.includes(".")) {
            const [path, field] = key.split(".");
            const isPopulated = populate.some(p => p.path === path);

            if (isPopulated) {
                flatFilters[`${path}_${field}`] = parseOperatorValue(raw);
            }
            continue;
        }

        // 👉 3) Dạng gạch dưới (business_name)
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


// =======================================================================
// ------------------ APPLY FLATTEN FILTER (TOÁN TỬ) ---------------------
// =======================================================================

const applyFlattenFilter = (items, flatFilters = {}) => {
    return items.filter(item => {

        for (const key in flatFilters) {
            const rule = flatFilters[key];
            const actualValue = item[key];

            // ⭐ CHỈ THÊM ĐÚNG CHỖ NÀY:
            if (actualValue === null) {
                // salaryRange_max = null --> chỉ chấp nhận khi operator là $gte (trường hợp max >= value)
                // nghĩa là null = vô hạn => luôn đúng
                continue;
            }

            if (actualValue === undefined) {
                return false;
            }

            // Nếu là dạng toán tử
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
                // Text exact compare
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

    // Build filter MongoDB
    const filter = buildFilter(queries);

    // Paging + sort
    const limit = Number(queryParams.limit) || 20;
    const sort = queryParams.sort || "-createdAt";
    const page = Number(queryParams.page) || 1;
    const skip = (page - 1) * limit;
    const fields = queryParams.fields?.split(",").join(" ");
    const flatten = queryParams.flatten === "true";

    // Populate
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

    // Query DB
    let [jobs, total] = await Promise.all([
        usePostJobs.findAll(filter, { fields, sort, skip, limit, populate }),
        usePostJobs.countDocuments(filter)
    ]);

    // Flatten + filter
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
    const detailPostJobs = await usePostJobs.findByOne({ _id: idp });
    return {
        success: true,
        data: detailPostJobs,
    };
}

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

module.exports = {
    createPostjobs,
    updatePostjobs,
    getAllPostjobs,
    deletePostjobs,
    getDetailPostjobs
}