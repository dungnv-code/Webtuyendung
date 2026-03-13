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

    const [loading, setLoading] = useState(false);
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
        <div className="container mt-5">
            {loading && <Loading />}

            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-8">

                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">

                            <h3 className="fw-bold text-center mb-4">
                                <i className="fa-solid fa-user-plus me-2 text-primary"></i>
                                Thêm nhân viên
                            </h3>

                            <form onSubmit={handleSubmit} className="row g-3">

                                {/* Username */}
                                <div className="col-12">
                                    <label className="form-label fw-semibold">
                                        Tên nhân viên
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        placeholder="Nhập tên nhân viên..."
                                        value={inputValue.username}
                                        onChange={handleChange}
                                    />
                                    {error.username && (
                                        <small className="text-danger">
                                            {error.username}
                                        </small>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="Email..."
                                        value={inputValue.email}
                                        onChange={handleChange}
                                    />
                                    {error.email && (
                                        <small className="text-danger">
                                            {error.email}
                                        </small>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phone"
                                        placeholder="Số điện thoại..."
                                        value={inputValue.phone}
                                        onChange={handleChange}
                                    />
                                    {error.phone && (
                                        <small className="text-danger">
                                            {error.phone}
                                        </small>
                                    )}
                                </div>

                                <div className="col-12 mt-3 d-grid">
                                    <button
                                        className="btn btn-primary fw-semibold"
                                        type="submit"
                                    >
                                        <i className="fa-solid fa-plus me-2"></i>
                                        Thêm nhân viên
                                    </button>
                                </div>

                            </form>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default createStaff;