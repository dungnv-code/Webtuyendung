import { useState } from "react";
import { toast } from "react-toastify";
import { changePasswordUser } from "../../../api/user";

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldpassword: "",
        newpassword: "",
        confirmpassword: "",
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.oldpassword || !formData.newpassword || !formData.confirmpassword) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (formData.newpassword.length < 8) {
            toast.error("Mật khẩu mới phải ít nhất 8 ký tự!");
            return;
        }

        if (formData.newpassword !== formData.confirmpassword) {
            toast.error("Xác nhận mật khẩu không khớp!");
            return;
        }

        try {
            const res = await changePasswordUser({
                oldpassword: formData.oldpassword,
                newpassword: formData.newpassword,
            });

            if (res?.success) {
                toast.success("Đổi mật khẩu thành công!");
                setFormData({ oldpassword: "", newpassword: "", confirmpassword: "" });
            }
        } catch (err) {
            toast.error("Lỗi server!");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-4 mx-auto" style={{ maxWidth: "450px" }}>
                <h3 className="text-center fw-bold mb-4 text-primary">
                    🔐 Đổi mật khẩu
                </h3>

                <form onSubmit={handleSubmit}>

                    {/* Old Password */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Mật khẩu cũ</label>
                        <input
                            type="password"
                            name="oldpassword"
                            value={formData.oldpassword}
                            onChange={handleInputChange}
                            className="form-control form-control-lg"
                            placeholder="Nhập mật khẩu cũ"
                        />
                    </div>

                    {/* New Password */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Mật khẩu mới</label>
                        <input
                            type="password"
                            name="newpassword"
                            value={formData.newpassword}
                            onChange={handleInputChange}
                            className="form-control form-control-lg"
                            placeholder="Nhập mật khẩu mới"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            name="confirmpassword"
                            value={formData.confirmpassword}
                            onChange={handleInputChange}
                            className="form-control form-control-lg"
                            placeholder="Nhập lại mật khẩu"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 fw-semibold"
                        style={{
                            background: "linear-gradient(45deg, #0d6efd, #6610f2)",
                            border: "none"
                        }}
                    >
                        Đổi mật khẩu
                    </button>

                </form>
            </div>
        </div>
    );
};

export default ChangePassword;