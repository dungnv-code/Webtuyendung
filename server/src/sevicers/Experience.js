const useExperience = require("../repository/Experience.js");

const createExperience = async (data) => {
    const existExperience = await useExperience.findByOne({ slug: data.slug });
    if (existExperience) {
        throw new Error("Nhóm kinh nghiệm với slug này đã tồn tại");
    }
    const Experience = await useExperience.create(data);
    return {
        success: true,
        data: Experience,
    };
}

const updateExperience = async (ide, data) => {
    const existExperience = await useExperience.findByOne({ _id: ide });
    if (!existExperience) {
        throw new Error("Không tìm thấy nhóm kinh nghiệm");
    }
    const updatedExperience = await useExperience.updatebyOne({ _id: ide }, data);
    return {
        success: true,
        data: updatedExperience,
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
        else if (key === "experience") {
            filter.experience = { $regex: queries[key], $options: "i" };
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

const getAllExperience = async (queryParams) => {
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

        const allJobs = await useExperience.findAll(filter, { fields });

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
        useExperience.findAll(filter, { fields, sort, skip, limit }),
        useExperience.countDocuments(filter)
    ]);

    return {
        jobs,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
}

const deleteExperience = async (ide) => {
    const existExperience = await useExperience.findByOne({ _id: ide });
    if (!existExperience) {
        throw new Error("Không tìm thấy nhóm kinh nghiệm để xóa");
    }
    await useExperience.deletebyOne({ _id: ide });
    return {
        success: true,
        mes: "Xóa nhóm kinh nghiệm thành công",
    };
}

module.exports = {
    createExperience,
    updateExperience,
    getAllExperience,
    deleteExperience,
};