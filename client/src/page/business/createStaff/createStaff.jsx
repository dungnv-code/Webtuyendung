import { useState } from "react";
import Swal from "sweetalert2";
import Loading from "../../../component/loading/Loading";
import { createStaffBusiness } from "../../../api/business";
const createStaff = () => {
    const [inputValue, setInputValue] = useState({
        username: "",
        email: "",
        phone: "",
    });

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({});

    const handleChange = (e) => {
        setInputValue({ ...inputValue, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newError = {};

        if (!inputValue.username.trim()) {
            newError.username = "Vui lòng nhập tên nhân viên!";
        }

        if (!inputValue.email.trim()) {
            newError.email = "Vui lòng nhập email!";
        } else if (!/\S+@\S+\.\S+/.test(inputValue.email)) {
            newError.email = "Email không hợp lệ!";
        }

        if (!inputValue.phone.trim()) {
            newError.phone = "Vui lòng nhập số điện thoại!";
        } else if (!/^[0-9]{8,12}$/.test(inputValue.phone)) {
            newError.phone = "Số điện thoại không hợp lệ!";
        }

        setError(newError);

        if (Object.keys(newError).length > 0) return;

        setLoading(true);
        try {
            const repon = await createStaffBusiness(inputValue);

            if (repon?.success) {
                Swal.fire({
                    icon: "success",
                    title: "Thêm nhân viên thành công!",
                    timer: 1800,
                    showConfirmButton: false,
                });

                // Reset form sau khi thêm
                setInputValue({
                    username: "",
                    email: "",
                    phone: "",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Thêm nhân viên thất bại!",
                    text: repon?.message || "Lỗi không xác định!",
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Lỗi server!",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            {loading && <Loading />}
            <h3 className="fw-bold mb-3">Thêm ứng viên</h3>
            <form onSubmit={handleSubmit} className="row g-3">
                {/* Username */}
                <div className="col-md-12">
                    <label className="form-label fw-semibold">Tên ứng viên</label>
                    <input
                        type="text"
                        className="form-control"
                        name="username"
                        placeholder="Nhập tên ứng viên..."
                        value={inputValue.username}
                        onChange={handleChange}
                    />
                    {error.username && (
                        <span className="text-danger">{error.username}</span>
                    )}
                </div>

                {/* Email */}
                <div className="col-md-6">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Email..."
                        value={inputValue.email}
                        onChange={handleChange}
                    />
                    {error.email && <span className="text-danger">{error.email}</span>}
                </div>

                {/* Phone */}
                <div className="col-md-6">
                    <label className="form-label fw-semibold">Số điện thoại</label>
                    <input
                        type="text"
                        className="form-control"
                        name="phone"
                        placeholder="Số điện thoại..."
                        value={inputValue.phone}
                        onChange={handleChange}
                    />
                    {error.phone && <span className="text-danger">{error.phone}</span>}
                </div>

                {/* Submit */}
                <div className="col-12 mt-2">
                    <button className="btn btn-primary px-4" type="submit">
                        Thêm ứng viên
                    </button>
                </div>
            </form>
        </div>
    );
};

export default createStaff;