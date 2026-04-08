import { useState } from "react";
import Loading from "../../../component/loading/Loading";
import { resetPassword } from "../../../api/user";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigator = useNavigate();
    const [inputValue, setInputValue] = useState({
        otp: "",
        newpassword: "",
        comfirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleResetPassword = (e) => {
        e.preventDefault();

        let newErrors = {};

        if (!inputValue.otp) {
            newErrors.otp = "Vui lòng nhập code xác nhận";
        } else if (inputValue.otp.length !== 5) {
            newErrors.otp = "Code xác nhận phải có 5 ký tự";
        }
        if (!inputValue.newpassword) {
            newErrors.newpassword = "Vui lòng nhập mật khẩu mới";
        } else if (inputValue.newpassword.length < 8) {
            newErrors.newpassword = "Mật khẩu mới phải có ít nhất 8 ký tự";
        }
        if (!inputValue.comfirmPassword) {
            newErrors.comfirmPassword = "Vui lòng xác nhận mật khẩu mới";
        } else if (inputValue.comfirmPassword !== inputValue.newpassword) {
            newErrors.comfirmPassword = "Mật khẩu xác nhận không khớp";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);
        resetPassword({ otp: inputValue.otp, newpassword: inputValue.newpassword })
            .then(() => {
                setLoading(false);
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: "Mật khẩu của bạn đã được đổi thành công!",
                });
                setInputValue({ otp: "", newpassword: "", comfirmPassword: "" });
                navigator("/login");
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Thất bại",
                    text: error.mes || "Đã có lỗi xảy ra, vui lòng thử lại sau!",
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            {loading && <Loading />}

            <div className="card shadow-lg border-0 rounded-4" style={{ width: "100%", maxWidth: "460px" }}>
                {/* Card Header */}
                <div
                    className="card-header border-0 rounded-top-4 text-white text-center py-4"
                    style={{ background: "linear-gradient(135deg, #00b14f 0%, #007a35 100%)" }}
                >
                    <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white mb-3"
                        style={{ width: 56, height: 56 }}
                    >
                        <i className="bi bi-shield-lock-fill fs-4" style={{ color: "#00b14f" }}></i>
                    </div>
                    <h4 className="fw-bold mb-1">Đặt lại mật khẩu</h4>
                    <p className="mb-0 opacity-75 small">Nhập mã OTP và mật khẩu mới của bạn</p>
                </div>

                {/* Card Body */}
                <div className="card-body px-4 py-4">
                    <form onSubmit={handleResetPassword} noValidate>

                        {/* OTP Field */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary small text-uppercase ls-1">
                                Mã xác nhận (OTP)
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className="bi bi-key-fill text-secondary"></i>
                                </span>
                                <input
                                    type="text"
                                    value={inputValue.otp}
                                    maxLength={5}
                                    onChange={(e) =>
                                        setInputValue({ ...inputValue, otp: e.target.value })
                                    }
                                    className={`form-control border-start-0 bg-light text-center fw-bold fs-5 letter-spacing-wide ${errors.otp ? "is-invalid" : inputValue.otp.length === 5 ? "is-valid" : ""}`}
                                    placeholder="• • • • •"
                                    style={{ letterSpacing: "0.5em" }}
                                />
                                {errors.otp && (
                                    <div className="invalid-feedback d-flex align-items-center gap-1">
                                        <i className="bi bi-exclamation-circle-fill"></i> {errors.otp}
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr className="text-muted opacity-25 my-3" />

                        {/* New Password Field */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">
                                Mật khẩu mới
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className="bi bi-lock-fill text-secondary"></i>
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={inputValue.newpassword}
                                    onChange={(e) =>
                                        setInputValue({ ...inputValue, newpassword: e.target.value })
                                    }
                                    className={`form-control bg-light border-start-0 border-end-0 ${errors.newpassword ? "is-invalid" : inputValue.newpassword.length >= 8 ? "is-valid" : ""}`}
                                    placeholder="Tối thiểu 8 ký tự"
                                />
                                <button
                                    type="button"
                                    className="input-group-text bg-light border-start-0"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-secondary`}></i>
                                </button>
                                {errors.newpassword && (
                                    <div className="invalid-feedback d-flex align-items-center gap-1">
                                        <i className="bi bi-exclamation-circle-fill"></i> {errors.newpassword}
                                    </div>
                                )}
                            </div>
                            {/* Password strength hint */}
                            {inputValue.newpassword.length > 0 && inputValue.newpassword.length < 8 && (
                                <div className="mt-1">
                                    <div className="progress" style={{ height: 4 }}>
                                        <div
                                            className="progress-bar bg-danger"
                                            style={{ width: `${(inputValue.newpassword.length / 8) * 50}%` }}
                                        ></div>
                                    </div>
                                    <small className="text-muted">Cần thêm {8 - inputValue.newpassword.length} ký tự nữa</small>
                                </div>
                            )}
                            {inputValue.newpassword.length >= 8 && (
                                <div className="mt-1">
                                    <div className="progress" style={{ height: 4 }}>
                                        <div className="progress-bar bg-success" style={{ width: "100%" }}></div>
                                    </div>
                                    <small className="text-success">Mật khẩu hợp lệ</small>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold text-secondary small text-uppercase">
                                Xác nhận mật khẩu
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className="bi bi-lock-fill text-secondary"></i>
                                </span>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={inputValue.comfirmPassword}
                                    onChange={(e) =>
                                        setInputValue({ ...inputValue, comfirmPassword: e.target.value })
                                    }
                                    className={`form-control bg-light border-start-0 border-end-0 ${errors.comfirmPassword ? "is-invalid" : inputValue.comfirmPassword && inputValue.comfirmPassword === inputValue.newpassword ? "is-valid" : ""}`}
                                    placeholder="Nhập lại mật khẩu"
                                />
                                <button
                                    type="button"
                                    className="input-group-text bg-light border-start-0"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    tabIndex={-1}
                                >
                                    <i className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"} text-secondary`}></i>
                                </button>
                                {errors.comfirmPassword && (
                                    <div className="invalid-feedback d-flex align-items-center gap-1">
                                        <i className="bi bi-exclamation-circle-fill"></i> {errors.comfirmPassword}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="d-grid">
                            <button
                                type="submit"
                                className="btn btn-lg fw-semibold text-white rounded-3 d-flex align-items-center justify-content-center gap-2"
                                style={{ background: "linear-gradient(135deg, #00b14f 0%, #007a35 100%)", border: "none" }}
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
                                        Xác nhận đặt lại mật khẩu
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Back to login */}
                        <div className="text-center mt-3">
                            <a href="/login" className="text-decoration-none small" style={{ color: "#00b14f" }}>
                                <i className="bi bi-arrow-left me-1"></i>
                                Quay lại đăng nhập
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
