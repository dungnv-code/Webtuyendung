const useBusiness = require("../repository/Business.js");
const usePostJobs = require("../repository/PostJobs.js");
const useInvoid = require("../repository/Invoid.js")
const createBusiness = async (id, data) => {
    const existBusiness = await useBusiness.findByOne({ slug: data.slug });
    if (existBusiness) {
        throw new Error("Doanh nghiệp này đã tồn tại!");
    }
    const Business = await useBusiness.create(data);
    await useBusiness.updatebyOneUser({ _id: id }, { business: Business._id });

    return {
        success: true,
        data: Business,
    };
}

const updateBusiness = async (idb, data) => {
    const existBusiness = await useBusiness.findByOne({ _id: idb });
    if (!existBusiness) {
        throw new Error("Không tìm thấy Doanh nghiệp để cập nhật");
    }
    const updatedBusiness = await useBusiness.updatebyOne({ _id: idb }, data);
    return {
        success: true,
        data: updatedBusiness,
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
        else if (key === "nameBusiness") {
            filter.nameBusiness = { $regex: queries[key], $options: "i" };
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

const getAllBusiness = async (queryParams) => {
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

        const allJobs = await useBusiness.findAll(filter, { fields });

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
        useBusiness.findAll(filter, { fields, sort, skip, limit }),
        useBusiness.countDocuments(filter)
    ]);

    return {
        jobs,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
}

const deleteBusiness = async (idb) => {
    const existBusiness = await useBusiness.findByOne({ _id: idb });
    if (!existBusiness) {
        throw new Error("Không tìm thấy Doanh nghiệp để xóa");
    }
    await useBusiness.deletebyOne({ _id: idb });
    return {
        success: true,
        mes: "Xóa Doanh nghiệp thành công",
    };
}

const getDetailBusiness = async (idb) => {
    const Business = await useBusiness.findByOne({ _id: idb });
    if (!Business) {
        throw new Error("Không tìm thấy Doanh nghiệp");
    }
    return {
        success: true,
        data: Business,
    };
}

const getDetailbyNTDBusiness = async (businessId) => {
    const Business = await useBusiness.findByOne({ _id: businessId, });
    if (Business.length == 0) {
        throw new Error("Không tìm thấy doanh nghiệp!");
    }
    return {
        success: true,
        data: Business,
    };
}

const getStaffsUser = async (businessId) => {
    const Business = await useBusiness.findAllUser({ business: businessId, role: "STAFF" }).select("-refreshToken -password");
    if (Business.length == 0) {
        throw new Error("Không tìm thấy nhân viên doanh nghiệp!");
    }
    return {
        success: true,
        data: Business,
    };
}

const getPostJobsBusiness = async (businessId) => {
    const Business = await usePostJobs.findAll({ business: businessId }).select("-refreshToken -password");
    if (Business.length == 0) {
        throw new Error("Chưa có bài viết nào!");
    }
    return {
        success: true,
        data: Business,
    };
}

const getInvoidsBusiness = async (businessId) => {
    const Business = await useInvoid.findAll({ business: businessId }).select("-refreshToken -password");
    if (Business.length == 0) {
        throw new Error("Chưa có hoá đơn nào!");
    }
    return {
        success: true,
        data: Business,
    };
}

const changeStatusBusiness = async (idb) => {
    // 1. Tìm business
    const business = await useBusiness.findByOne({ _id: idb });
    if (!business) {
        throw new Error("Không tìm thấy doanh nghiệp!");
    }

    // 2. Toggle status
    const newStatus = !business.statusBusiness;

    // 3. Update
    const updatedBusiness = await useBusiness.updatebyOne(
        { _id: idb },
        { statusBusiness: newStatus }
    );

    return {
        success: true,
        data: updatedBusiness,
    };
};


module.exports = {
    createBusiness,
    updateBusiness,
    getAllBusiness,
    deleteBusiness,
    getDetailBusiness,
    getDetailbyNTDBusiness,
    getStaffsUser,
    getPostJobsBusiness,
    getInvoidsBusiness,
    changeStatusBusiness,
};