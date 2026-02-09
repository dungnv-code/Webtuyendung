const useInvoid = require("../repository/Invoid");
const useBusiness = require("../repository/Business")
const seedrandom = require("seedrandom");

const createInvoid = async (businessId, data) => {
    // Kiểm tra doanh nghiệp có tồn tại không
    const business = await useBusiness.findByOne({ _id: businessId });
    if (!business) {
        throw new Error("Doanh nghiệp không tồn tại!");
    }

    // Tính total tiền
    const total = data.price * data.amount;
    data.totalPrice = total;
    data.business = businessId; // gán businessId vào invoice

    // Tạo hoá đơn
    const invoice = await useInvoid.create(data);

    // Cập nhật số lượng post cho doanh nghiệp
    if (invoice && data.typeInvoid === "BASIC") {
        business.normalPosts += data.value * data.amount; // hoặc += data.amount tùy business rule
    }

    if (invoice && data.typeInvoid === "PREMIUM") {
        business.featuredPosts += data.value * data.amount;
    }

    // Lưu lại business đã update
    await business.save();

    return {
        success: true,
        invoice,
    };
};

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

const getAllInvoid = async (queryParams) => {
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

    if (isRandom) {
        const rng = seedrandom(seed);

        const allInvoids = await useInvoid.findAll(filter, { fields });

        const shuffled = allInvoids
            .map(item => ({ item, sortKey: rng() }))
            .sort((a, b) => a.sortKey - b.sortKey)
            .map(el => el.item);

        const selected = shuffled.slice(skip, skip + limit);

        return {
            Invoids: selected,
            total: allInvoids.length,
            totalPages: Math.ceil(allInvoids.length / limit),
            currentPage: page
        };
    }

    const [Invoids, total] = await Promise.all([
        useInvoid.findAll(filter, { fields, sort, skip, limit }),
        useInvoid.countDocuments(filter)
    ]);

    return {
        Invoids,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
};


module.exports = {
    createInvoid,
    getAllInvoid,
};