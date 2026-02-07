const useSalaryRange = require("../repository/SalaryRange");
const seedrandom = require("seedrandom");
const createSalaryRange = async (data) => {
    const existSalaryRange = await useSalaryRange.findByOne({ salaryRange: data.salaryRange });
    if (existSalaryRange) {
        throw new Error("Khoảng lương đã tồn tại");
    }
    const SalaryRange = await useSalaryRange.create(data);
    return {
        success: true,
        data: SalaryRange,
    };
}

const updateSalaryRange = async (idl, data) => {
    const isSalaryRange = await useSalaryRange.findByOne({ salaryRange: data.salaryRange });
    if (isSalaryRange) {
        throw new Error("Khoảng lương đã tồn tại");
    }
    const updatedSalaryRange = await useSalaryRange.updatebyOne({ _id: idl }, { ...data });
    return {
        success: true,
        data: updatedSalaryRange,
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
        else if (key === "salaryRange") {
            filter.salaryRange = { $regex: queries[key], $options: "i" };
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

const getAllSalaryRange = async (queryParams) => {
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

        const allJobs = await useSalaryRange.findAll(filter, { fields });

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
        useSalaryRange.findAll(filter, { fields, sort, skip, limit }),
        useSalaryRange.countDocuments(filter)
    ]);

    return {
        jobs,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
}

const deleteSalaryRange = async (idl) => {
    const existSalaryRange = await useSalaryRange.findByOne({ _id: idl });
    if (!existSalaryRange) {
        throw new Error("Không tìm thấy khoảng lương để xóa");
    }
    await useSalaryRange.deletebyOne({ _id: idl });
    return {
        success: true,
        mes: "Xóa khoảng lương thành công",
    };
}

module.exports = {
    createSalaryRange,
    updateSalaryRange,
    getAllSalaryRange,
    deleteSalaryRange,
}
