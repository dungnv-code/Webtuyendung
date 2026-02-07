const useLevel = require("../repository/Level");
const seedrandom = require("seedrandom");
const createLevel = async (data) => {
    const existlevel = await useLevel.findByOne({ nameLevel: data.nameLevel });
    if (existlevel) {
        throw new Error("Cấp bậc đã tồn tại");
    }
    const level = await useLevel.create(data);
    return {
        success: true,
        data: level,
    };
}

const updateLevel = async (idl, data) => {
    const islevel = await useLevel.findByOne({ nameLevel: data.nameLevel });
    if (islevel) {
        throw new Error("Cấp bậc đã tồn tại");
    }
    const updatedlevel = await useLevel.updatebyOne({ _id: idl }, { ...data });
    return {
        success: true,
        data: updatedlevel,
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
        else if (key === "nameLevel") {
            filter.nameLevel = { $regex: queries[key], $options: "i" };
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


const getAllLevel = async (queryParams) => {
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

        const allJobs = await useLevel.findAll(filter, { fields });

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
        useLevel.findAll(filter, { fields, sort, skip, limit }),
        useLevel.countDocuments(filter)
    ]);

    return {
        jobs,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
}

const deleteLevel = async (idl) => {
    const existJob = await useLevel.findByOne({ _id: idl });
    if (!existJob) {
        throw new Error("Không tìm thấy cấp bậc để xóa");
    }
    await useLevel.deletebyOne({ _id: idl });
    return {
        success: true,
        mes: "Xóa cấp bậc thành công",
    };
}

module.exports = {
    createLevel,
    updateLevel,
    getAllLevel,
    deleteLevel,
}
