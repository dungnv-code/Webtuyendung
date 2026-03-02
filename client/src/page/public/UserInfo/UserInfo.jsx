import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "../../../component/loading/Loading";
import { updateUser } from "../../../api/user";
import { toast } from "react-toastify";
import { getCurrent } from "../../../redux/userUser/asyncActionUser";

const UserInfo = () => {
    const User = useSelector(state => state.user.current);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        avatar: "",
        username: "",
        email: "",
        phone: "",
        avatarFile: null,
    });

    useEffect(() => {
        if (User) {
            setFormData({
                avatar: User.avatar,
                username: User.username,
                email: User.email,
                phone: User.phone,
                avatarFile: null
            });
        }
    }, [User]);

    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) newErrors.username = "Username không được để trống!";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email không hợp lệ!";
        if (!/^[0-9]{9,11}$/.test(formData.phone)) newErrors.phone = "Số điện thoại phải 9 - 11 số!";

        if (formData.avatarFile) {
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!validTypes.includes(formData.avatarFile.type)) newErrors.avatar = "Chỉ chấp nhận JPG, PNG, WEBP";

            if (formData.avatarFile.size > 3 * 1024 * 1024)
                newErrors.avatar = "Ảnh phải nhỏ hơn 3MB!";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                avatar: URL.createObjectURL(file),
                avatarFile: file,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Vui lòng kiểm tra lại thông tin!");
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            if (formData.avatarFile) data.append("avatar", formData.avatarFile);
            data.append("username", formData.username);
            data.append("email", formData.email);
            data.append("phone", formData.phone);

            const response = await updateUser(User._id, data);

            if (response?.success) {
                toast.success("Cập nhật thành công!");
                dispatch(getCurrent(response.data));
            } else {
                toast.error("Cập nhật thất bại!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-4">
            {loading && <Loading />}

            <div className="card border-primary shadow p-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
                <h3 className="text-center mb-4 text-primary fw-bold">
                    Cập nhật thông tin người dùng
                </h3>

                <form onSubmit={handleSubmit}>

                    {/* Avatar */}
                    <div className="text-center mb-3">
                        <img
                            src={formData.avatar}
                            alt="avatar"
                            className="rounded-circle border border-primary"
                            style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        />
                    </div>

                    {/* Upload Avatar */}
                    <div className="mb-3">
                        <label className="form-label text-primary fw-semibold">Đổi Avatar</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={`form-control ${errors.avatar ? "is-invalid" : ""}`}
                        />
                        {errors.avatar && <div className="invalid-feedback">{errors.avatar}</div>}
                    </div>

                    {/* Username */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-primary">Username</label>
                        <input
                            type="text"
                            name="username"
                            className={`form-control ${errors.username ? "is-invalid" : ""}`}
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-primary">Email</label>
                        <input
                            type="email"
                            name="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    {/* Phone */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-primary">Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>

                    {/* Submit */}
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                        Cập nhật
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserInfo;