import { useState } from "react";
import { toast } from "react-toastify";
import { changePasswordUser } from "../../../api/user";

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldpassword: "",
        newpassword: "",
        confirmpassword: "",
    });

    const [show, setShow] = useState({
        oldpassword: false,
        newpassword: false,
        confirmpassword: false,
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleShow = (field) => {
        setShow((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const getPasswordStrength = (pwd) => {
        if (!pwd) return null;
        if (pwd.length < 6) return { label: "Yếu", color: "danger", width: "33%" };
        if (pwd.length < 8) return { label: "Trung bình", color: "warning", width: "66%" };
        return { label: "Mạnh", color: "success", width: "100%" };
    };

    const strength = getPasswordStrength(formData.newpassword);

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

        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { name: "oldpassword", label: "Mật khẩu hiện tại", icon: "bi-lock-fill", placeholder: "Nhập mật khẩu hiện tại" },
        { name: "newpassword", label: "Mật khẩu mới", icon: "bi-lock-fill", placeholder: "Tối thiểu 8 ký tự" },
        { name: "confirmpassword", label: "Xác nhận mật khẩu", icon: "bi-shield-lock-fill", placeholder: "Nhập lại mật khẩu mới" },
    ];

    return (
        <div className="card border-0 rounded-4 shadow-sm overflow-hidden">

            {/* Header */}
            <div
                className="px-4 pt-4 pb-3 d-flex align-items-center gap-3"
                style={{ background: "linear-gradient(135deg, #00b14f 0%, #007a35 100%)" }}
            >
                <div
                    className="d-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-25"
                    style={{ width: 48, height: 48, minWidth: 48 }}
                >
                    <i className="bi bi-shield-lock-fill text-white fs-5"></i>
                </div>
                <div>
                    <h5 className="text-white fw-bold mb-0">Đổi mật khẩu</h5>
                    <small className="text-white opacity-75">Cập nhật mật khẩu tài khoản của bạn</small>
                </div>
            </div>

            {/* Body */}
            <div className="card-body px-4 py-4">

                {/* Security tip */}
                <div
                    className="d-flex align-items-start gap-2 rounded-3 p-3 mb-4 small"
                    style={{ backgroundColor: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}
                >
                    <i className="bi bi-lightbulb-fill mt-1 flex-shrink-0" style={{ color: "#00b14f" }}></i>
                    <span>Mật khẩu mạnh nên có ít nhất <strong>8 ký tự</strong>, kết hợp chữ hoa, chữ thường và số.</span>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {fields.map(({ name, label, icon, placeholder }, idx) => (
                        <div className="mb-3" key={name}>
                            <label className="form-label fw-semibold text-secondary small text-uppercase mb-1">
                                {label}
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className={`bi ${icon} text-secondary`}></i>
                                </span>
                                <input
                                    type={show[name] ? "text" : "password"}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleInputChange}
                                    className={`form-control bg-light border-start-0 border-end-0 ${name === "confirmpassword" && formData.confirmpassword
                                        ? formData.confirmpassword === formData.newpassword
                                            ? "is-valid"
                                            : "is-invalid"
                                        : ""
                                        }`}
                                    placeholder={placeholder}
                                />
                                <button
                                    type="button"
                                    className="input-group-text bg-light border-start-0"
                                    onClick={() => toggleShow(name)}
                                    tabIndex={-1}
                                >
                                    <i className={`bi ${show[name] ? "bi-eye-slash" : "bi-eye"} text-secondary`}></i>
                                </button>
                                {name === "confirmpassword" && formData.confirmpassword && formData.confirmpassword !== formData.newpassword && (
                                    <div className="invalid-feedback d-flex align-items-center gap-1">
                                        <i className="bi bi-exclamation-circle-fill"></i> Mật khẩu không khớp
                                    </div>
                                )}
                            </div>

                            {/* Password strength bar (only for newpassword) */}
                            {name === "newpassword" && formData.newpassword && strength && (
                                <div className="mt-2">
                                    <div className="progress rounded-pill" style={{ height: 5 }}>
                                        <div
                                            className={`progress-bar bg-${strength.color} rounded-pill`}
                                            style={{ width: strength.width, transition: "width 0.3s ease" }}
                                        ></div>
                                    </div>
                                    <div className="d-flex justify-content-between mt-1">
                                        <small className={`text-${strength.color} fw-semibold`}>
                                            Độ mạnh: {strength.label}
                                        </small>
                                        {formData.newpassword.length < 8 && (
                                            <small className="text-muted">
                                                Cần thêm {8 - formData.newpassword.length} ký tự
                                            </small>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    <hr className="text-muted opacity-25 my-4" />

                    <div className="d-grid">
                        <button
                            type="submit"
                            className="btn btn-lg fw-semibold text-white rounded-3 d-flex align-items-center justify-content-center gap-2"
                            style={{
                                background: "linear-gradient(135deg, #00b14f 0%, #007a35 100%)",
                                border: "none",
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check2-circle fs-5"></i>
                                    Cập nhật mật khẩu
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
