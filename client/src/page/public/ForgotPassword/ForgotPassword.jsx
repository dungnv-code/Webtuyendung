import { useState } from "react";
import Loading from "../../../component/loading/Loading";
import { resetPassword } from "../../../api/user"
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
            .then((response) => {
                setLoading(false);
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: "Mật khẩu của bạn đã được đổi thành công!",
                });
                setInputValue({
                    otp: "",
                    newpassword: "",
                    comfirmPassword: "",
                });
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
        <div>
            {loading && <Loading />}

            <form onSubmit={handleResetPassword}>
                <div>
                    <h2 className="text-center mb-4">Quên mật khẩu</h2>
                </div>

                <label className="text-muted mb-2">
                    <b>Nhập code xác nhận của bạn bên dưới:</b>
                </label>
                <input
                    type="text"
                    value={inputValue.otp}
                    maxLength={5}
                    onChange={(e) =>
                        setInputValue({ ...inputValue, otp: e.target.value })
                    }
                    className="form-control form-control-lg text-center fw-semibold"
                    placeholder="Nhập code xác nhận"
                />
                {errors.otp && <p className="text-danger">{errors.otp}</p>}

                <label className="text-muted mb-2 mt-3">
                    <b>Nhập mật khẩu mới của bạn bên dưới:</b>
                </label>
                <input
                    type="password"
                    value={inputValue.newpassword}
                    onChange={(e) =>
                        setInputValue({ ...inputValue, newpassword: e.target.value })
                    }
                    className="form-control form-control-lg fw-semibold"
                    placeholder="Nhập mật khẩu mới"
                />
                {errors.newpassword && <p className="text-danger">{errors.newpassword}</p>}
                <label className="text-muted mb-2 mt-3">
                    <b>Xác nhận lại mật khẩu mới của bạn bên dưới:</b>
                </label>
                <input
                    type="password"
                    value={inputValue.comfirmPassword}
                    onChange={(e) =>
                        setInputValue({ ...inputValue, comfirmPassword: e.target.value })
                    }
                    className="form-control form-control-lg fw-semibold mt-3"
                    placeholder="Xác nhận mật khẩu mới"
                />
                {errors.comfirmPassword && <p className="text-danger">{errors.comfirmPassword}</p>}
                <button
                    type="submit"
                    className="btn text-white"
                    style={{ backgroundColor: "#00b14f", marginTop: "15px" }}
                >
                    <i className="bi bi-check2-circle"></i> Xác nhận
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;