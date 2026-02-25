const useJob = require("../repository/Jobs");
const seedrandom = require("seedrandom");

const createJob = async (data) => {
    const existJob = await useJob.findByOne({ slug: data.slug });
    if (existJob) {
        throw new Error("Công việc đã tồn tại");
    }
    const job = await useJob.create(data);
    return {
        success: true,
        data: job,
    };
}

const updateJob = async (idj, data) => {
    const existJob = await useJob.findByOne({ _id: idj });
    if (!existJob) {
        throw new Error("Không tìm thấy công việc");
    }
    const updatedJob = await useJob.updatebyOne({ _id: idj }, data);
    return {
        success: true,
        data: updatedJob,
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
        else if (key === "title") {
            filter.title = { $regex: queries[key], $options: "i" };
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

const getAllJobs = async (queryParams) => {
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

        const allJobs = await useJob.findAll(filter, { fields });

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
        useJob.findAll(filter, { fields, sort, skip, limit }),
        useJob.countDocuments(filter)
    ]);

    return {
        data: jobs,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
};


const deleteJob = async (idj) => {
    const existJob = await useJob.findByOne({ _id: idj });
    if (!existJob) {
        throw new Error("Không tìm thấy công việc để xóa");
    }
    await useJob.deletebyOne({ _id: idj });
    return {
        success: true,
        mes: "Xóa công việc thành công",
    };
}

module.exports = {
    createJob,
    updateJob,
    getAllJobs,
    deleteJob,
};