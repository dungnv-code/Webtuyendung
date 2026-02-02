const usePostpackage = require("../repository/Postpackage");

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

const getAllPostpackage = async () => {
    const Postpackage = await usePostpackage.findAll({});
    return {
        success: true,
        data: Postpackage,
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
