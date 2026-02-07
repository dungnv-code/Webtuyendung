const usePostpackage = require("../repository/Postpackage");
const seedrandom = require("seedrandom");
const createPostpackage = async (data) => {
    const existPostpackage = await usePostpackage.findByOne({ namePostPackage: data.namePostPackage });
    if (existPostpackage) {
        throw new Error("Gói đăng bài đã tồn tại");
    }
    const Postpackage = await usePostpackage.create(data);
    return {
        success: true,
        data: Postpackage,
    };
}

const updatePostpackage = async (idp, data) => {
    const isPostpackage = await usePostpackage.findByOne({ namePostPackage: data.namePostPackage });
    if (isPostpackage) {
        throw new Error("Gói đăng bài đã tồn tại");
    }
    const updatedPostpackage = await usePostpackage.updatebyOne({ _id: idp }, { ...data });
    return {
        success: true,
        data: updatedPostpackage,
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
        else if (key === "namePostPackage") {
            filter.namePostPackage = { $regex: queries[key], $options: "i" };
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

const getAllPostpackage = async (queryParams) => {
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

        const allJobs = await usePostpackage.findAll(filter, { fields });

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
        usePostpackage.findAll(filter, { fields, sort, skip, limit }),
        usePostpackage.countDocuments(filter)
    ]);

    return {
        jobs,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
}

const deletePostpackage = async (idp) => {
    const existPostpackage = await usePostpackage.findByOne({ _id: idp });
    if (!existPostpackage) {
        throw new Error("Không tìm thấy gói đăng bài để xóa");
    }
    await usePostpackage.deletebyOne({ _id: idp });
    return {
        success: true,
        mes: "Xóa gói đăng bài thành công",
    };
}

module.exports = {
    createPostpackage,
    updatePostpackage,
    getAllPostpackage,
    deletePostpackage,
}
