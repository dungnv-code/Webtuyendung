const useWorkType = require("../repository/WorkType");
const seedrandom = require("seedrandom");
const createWorktype = async (data) => {
    const existWorktype = await useWorkType.findByOne({ workType: data.workType });
    if (existWorktype) {
        throw new Error("Hình thức công việc đã tồn tại");
    }
    const worktype = await useWorkType.createWorktype(data);
    return {
        success: true,
        data: worktype,
    };
}

const updateWorktype = async (idw, data) => {
    const existworktype = await useWorkType.findByOne({ workType: data.workType });
    if (existworktype) {
        throw new Error("Hình thức công việc đã tồn tại");
    }
    const updatedworktype = await useWorkType.updatebyOne({ _id: idw }, { ...data });
    return {
        success: true,
        data: updatedworktype,
    };
}

const buildFilter = (queries) => {
    const filter = {};

    for (const key in queries) {
        const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);

        if (match) {
            const [, field, op] = match;
            filter[field] = filter[field] || {};
            filter[field][`$${op}`] = Number(queries[key]);
        }
        else if (key === "workType") {
            filter.workType = { $regex: queries[key], $options: "i" };
        }
        else {
            const value = queries[key];

            if (typeof value === "string" && value.includes(",")) {
                filter[key] = { $in: value.split(",") };
            } else {
                filter[key] = (!isNaN(value)) ? Number(value) : value;
            }
        }
    }
    return filter;
};

const getAllWorktype = async (queryParams) => {
    const excludeFields = ["limit", "sort", "page", "fields", "random", "seed"];
    const queries = { ...queryParams };

    excludeFields.forEach(el => delete queries[el]);

    const filter = buildFilter(queries);

    const limit = Number(queryParams.limit) || 20;
    const sort = queryParams.sort || "-createdAt";
    const page = Number(queryParams.page) || 1;
    const skip = (page - 1) * limit;
    const fields = queryParams.fields?.split(",").join(" ");
    const isRandom = queryParams.random === "true";
    const seed = queryParams.seed || "default-seed";

    // Job populate ví dụ
    // const populate = { path: "business", select: "name logo" };

    if (isRandom) {
        const rng = seedrandom(seed);

        const allJobs = await useWorkType.findAll(filter, { fields });

        const shuffled = allJobs
            .map(item => ({ item, sortKey: rng() }))
            .sort((a, b) => a.sortKey - b.sortKey)
            .map(el => el.item);

        const selected = shuffled.slice(skip, skip + limit);

        return {
            jobs: selected,
            total: allJobs.length,
            totalPages: Math.ceil(allJobs.length / limit),
            currentPage: page
        };
    }

    const [jobs, total] = await Promise.all([
        useWorkType.findAll(filter, { fields, sort, skip, limit }),
        useWorkType.countDocuments(filter)
    ]);

    return {
        jobs,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
}


const deleteWorktype = async (ids) => {
    const existworkType = await useWorkType.findByOne({ _id: ids });
    if (!existworkType) {
        throw new Error("Không tìm thấy hình thức công việc để xóa");
    }
    await useWorkType.deletebyOne({ _id: ids });
    return {
        success: true,
        mes: "Xóa hình thức công việc thành công",
    };
}

module.exports = {
    createWorktype,
    updateWorktype,
    getAllWorktype,
    deleteWorktype,
}