const useSkill = require("../repository/Skills");
const seedrandom = require("seedrandom");
const createSkill = async (data) => {
    const existJob = await useSkill.findByOne({ nameskill: data.nameskill });
    if (existJob) {
        throw new Error("Kĩ năng đã tồn tại");
    }
    const skill = await useSkill.create(data);
    return {
        success: true,
        data: skill,
    };
}

const updateSkill = async (ids, data) => {
    const existskill = await useSkill.findByOne({ _id: ids });
    if (!existskill) {
        throw new Error("Không tìm thấy kĩ năng");
    }
    const updatedskill = await useSkill.updatebyOne({ _id: ids }, { ...data, job: new mongoose.Types.ObjectId(data.job) });
    return {
        success: true,
        data: updatedskill,
    };
}

// ---------------------- BUILD FILTER ----------------------
const buildFilter = (queries) => {
    const filter = {};

    for (const key in queries) {

        // Bỏ qua filter dạng flatten (job_title, job.title)
        if (key.includes("_") || key.includes(".")) continue;

        filter[key] = { $regex: queries[key], $options: "i" };
    }

    return filter;
};


// ---------------------- FLATTEN HELPERS ----------------------
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


// ---------------------- FLATTEN QUERY PARSER ----------------------
const convertFlattenQuery = (queryParams, populate = []) => {
    const flatFilters = {};

    for (const key in queryParams) {

        // Case 1: job.title
        if (key.includes(".")) {
            const [path, field] = key.split(".");
            const isPopulated = populate?.some(p => p.path === path);

            if (isPopulated) {
                flatFilters[`${path}_${field}`] = queryParams[key];
            }
            continue;
        }

        // Case 2: job_title
        if (key.includes("_")) {
            const [path] = key.split("_");
            const isPopulated = populate?.some(p => p.path === path);

            if (isPopulated) {
                flatFilters[key] = queryParams[key];
            }
        }
    }

    return flatFilters;
};


// ---------------------- APPLY FLATTEN FILTER ----------------------
const applyFlattenFilter = (items, flatFilters = {}) => {
    return items.filter(item => {

        for (const key in flatFilters) {
            const expected = String(flatFilters[key]).toLowerCase().normalize("NFC");
            const actual = String(item[key] ?? "").toLowerCase().normalize("NFC");

            if (actual !== expected) return false;
        }

        return true;
    });
};


// ---------------------- MAIN FUNCTION ----------------------
const getAllSkill = async (queryParams) => {
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
        useSkill.findAll(filter, { fields, sort, skip, limit, populate }),
        useSkill.countDocuments(filter)
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

const deleteSkill = async (ids) => {
    const existJob = await useSkill.findByOne({ _id: ids });
    if (!existJob) {
        throw new Error("Không tìm thấy kĩ năng để xóa");
    }
    await useSkill.deletebyOne({ _id: ids });
    return {
        success: true,
        mes: "Xóa kĩ năng thành công",
    };
}

module.exports = {
    createSkill,
    updateSkill,
    getAllSkill,
    deleteSkill,
}