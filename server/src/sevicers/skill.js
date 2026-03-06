const useSkill = require("../repository/Skills");
const seedrandom = require("seedrandom");
const mongoose = require("mongoose")
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


const buildFilter = (queries = {}, populate = []) => {

    const filter = {};

    for (const key in queries) {

        const value = queries[key];

        if (!value) continue;

        // ignore populate filter (job.title)
        if (key.includes(".") || key.includes("_")) {

            const [path] = key.split(/[._]/);

            const isPopulate = populate?.some(p => p.path === path);

            if (isPopulate) continue;
        }

        // _id filter
        if (key === "_id") {

            if (mongoose.Types.ObjectId.isValid(value)) {
                filter._id = new mongoose.Types.ObjectId(value);
            }

            continue;
        }

        // normal regex filter
        filter[key] = {
            $regex: value,
            $options: "i"
        };
    }

    return filter;
};



// ---------------------- FLATTEN POPULATE ----------------------
const flattenPopulate = (item, populations = []) => {

    const newItem = { ...item };

    populations.forEach(pop => {

        const path = pop.path;

        if (newItem[path] && typeof newItem[path] === "object") {

            const obj = newItem[path];

            for (const key in obj) {

                const newKey = `${path}_${key}`;

                newItem[newKey] = obj[key];
            }

            delete newItem[path];
        }

    });

    return newItem;
};



// ---------------------- FLATTEN ARRAY ----------------------
const flattenPopulateArray = (items, populations = []) => {

    if (!Array.isArray(items)) return items;

    return items.map(item => flattenPopulate(item, populations));
};



// ---------------------- PARSE FLATTEN QUERY ----------------------
const convertFlattenQuery = (queryParams, populate = []) => {

    const flatFilters = {};

    for (const key in queryParams) {

        // case job.title
        if (key.includes(".")) {

            const [path, field] = key.split(".");

            const isPopulated = populate?.some(p => p.path === path);

            if (isPopulated) {
                flatFilters[`${path}_${field}`] = queryParams[key];
            }

            continue;
        }

        // case job_title
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

            const expected = String(flatFilters[key])
                .toLowerCase()
                .normalize("NFC");

            const actual = String(item[key] ?? "")
                .toLowerCase()
                .normalize("NFC");

            if (!actual.includes(expected)) return false;
        }

        return true;
    });
};


const getAllSkill = async (queryParams) => {

    const excludeFields = [
        "limit",
        "sort",
        "page",
        "fields",
        "random",
        "seed",
        "populate",
        "flatten"
    ];

    const queries = { ...queryParams };

    excludeFields.forEach(el => delete queries[el]);



    // ---------------------- PARSE POPULATE ----------------------
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



    // ---------------------- BUILD FILTER ----------------------
    const filter = buildFilter(queries, populate);



    // ---------------------- PAGINATION ----------------------
    const limit = Number(queryParams.limit) || 20;
    const sort = queryParams.sort || "-createdAt";
    const page = Number(queryParams.page) || 1;
    const skip = (page - 1) * limit;

    const fields = queryParams.fields?.split(",").join(" ");

    const flatten =
        queryParams.flatten === true ||
        queryParams.flatten === "true";



    // ---------------------- FETCH DATA ----------------------
    let jobs = await useSkill.findAll(filter, {
        fields,
        sort,
        populate
    });



    // ---------------------- FLATTEN PROCESS ----------------------
    if (flatten && populate) {

        jobs = flattenPopulateArray(jobs, populate);

        const flatFilters = convertFlattenQuery(queryParams, populate);

        if (Object.keys(flatFilters).length > 0) {

            jobs = applyFlattenFilter(jobs, flatFilters);

        }
    }



    // ---------------------- PAGINATION AFTER FILTER ----------------------
    const total = jobs.length;

    const paginatedJobs = jobs.slice(skip, skip + limit);



    return {
        data: paginatedJobs,
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