import { useState, useEffect } from "react";
import imglogin from "../../../assets/login.jpg";
import path from "../../../ultils/path";

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { login, forgotPassword, getUserSingle } from "../../../api/user";
import { useDispatch, useSelector } from "react-redux";
import { LogIn } from "../../../redux/userUser/userSlice";
import { getCurrent } from "../../../redux/userUser/asyncActionUser";
import Swal from "sweetalert2";
import Loading from "../../../component/loading/Loading";
import { jwtDecode } from "jwt-decode";
const styles = {

    container: {
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif",
        padding: "40px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    bgImage: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: "blur(6px)",
        transform: "scale(1.1)",
        zIndex: -1,
    },

    overlay: {
        width: "500px",
        padding: "40px 35px",
        minHeight: "450px",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(8px)",
        borderRadius: "15px",
        color: "white",
        textAlign: "center",
        boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
    },

    title: {
        fontSize: "24px",
        marginBottom: "8px",
        fontWeight: "600",
        color: "#00b14f",
    },

    subtitle: {
        fontSize: "14px",
        marginBottom: "18px",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    input: {
        width: "100%",
        padding: "11px",
        borderRadius: "10px",
        border: "none",
        fontSize: "14px",
        backgroundColor: "rgba(255,255,255,0.9)",
        outline: "none",
        transition: "0.25s",
    },

    inputFocus: {
        backgroundColor: "white",
        boxShadow: "0 0 0 2px #00b14f",
    },

    error: {
        color: "#ffb3b3",
        fontSize: "13px",
        marginTop: "8px",
        textAlign: "left",
    },
    button: {
        padding: "11px",
        borderRadius: "10px",
        background: "#00b14f",
        border: "none",
        color: "white",
        fontSize: "15px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "0.25s",
    },
};

const Login = () => {

    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState({
        email: "",
        password: ""
    });

    const [email, setEmail] = useState("");

    const [errors, setErrors] = useState({});
    const [focusField, setFocusField] = useState("");

    const showModal = () => {
        const modal = new window.bootstrap.Modal(document.getElementById("loginModal"));
        modal.show();
    };

    const hideModal = () => {
        const modalElement = document.getElementById("loginModal");
        const modal = window.bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.hide();
    };

    const handleOnSubmit = async () => {
        let newErrors = {};

        if (!inputValue.email) newErrors.email = "Email không được để trống";
        if (!inputValue.password) newErrors.password = "Mật khẩu không được để trống";
        if (inputValue.password && inputValue.password.length < 8)
            newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";

        if (inputValue.email && !/\S+@\S+\.\S+/.test(inputValue.email))
            newErrors.email = "Email không đúng định dạng";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);

        login(inputValue)
            .then(res => {
                setLoading(false);

                if (!res.data?.success) {
                    Swal.fire({
                        title: "Lỗi!",
                        text: res.data?.mes || "Đăng nhập thất bại!",
                        icon: "error",
                    });
                    return;
                }

                Swal.fire({
                    title: "Thành công!",
                    text: "Đăng nhập thành công!",
                    icon: "success",
                });
                setInputValue({ email: "", password: "" });
                localStorage.setItem("accessToken", res.data.accessToken);
                dispatch(LogIn(res.data));
                const decoded = jwtDecode(res.data.accessToken);
                const role = decoded.role;
                if (role === "ADMIN") {
                    navigate(path.DASHBOARDADMIN);
                } else if (role === "nhatuyendung" || role === "STAFF") {
                    navigate(path.DASHBOARDBUSINESS);
                } else {
                    setTimeout(() => {
                        dispatch(getCurrent())
                    }, 100);
                    const redirectPath = localStorage.getItem("redirectAfterLogin");
                    if (redirectPath && redirectPath !== "/login") {
                        localStorage.removeItem("redirectAfterLogin");
                        setTimeout(() => {
                            navigate(redirectPath);
                        }, 300);
                    } else {
                        navigate(path.HOME);
                    }
                }
            })
            .catch(err => {
                setLoading(false);
                Swal.fire({
                    title: "Lỗi!",
                    text: err?.mes || "Đăng nhập thất bại!",
                    icon: "error",
                });
            });
    };

    const [erremail, setErrEmail] = useState("");

    const hanleForgotEmail = () => {
        if (!email) {
            setErrEmail("Email không được để trống");
            return;
        }
        if (email && !/\S+@\S+\.\S+/.test(email)) {
            setErrEmail("Email không đúng định dạng");
            return;
        }
        setLoading(true);
        forgotPassword(email)
            .then(res => {
                setLoading(false);
                hideModal();
                navigate(path.FORGOT_PASSWORD)
            })
            .catch(err => {
                setLoading(false);
                Swal.fire({
                    title: "Lỗi!",
                    text: err.mes || "Gửi email thất bại!",
                    icon: "error",
                });
            });
    };

    return (
        <div style={styles.container}>
            {loading && <Loading />}
            <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">

                        {/* Header */}
                        <div
                            className="modal-header border-0 px-4 pt-4 pb-3"
                            style={{ background: "linear-gradient(135deg, #00b14f 0%, #007a35 100%)" }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-25"
                                    style={{ width: 44, height: 44, minWidth: 44 }}
                                >
                                    <i className="bi bi-envelope-at-fill text-white fs-5"></i>
                                </div>
                                <div>
                                    <h5 className="modal-title text-white fw-bold mb-0" id="loginModalLabel">
                                        Xác nhận email
                                    </h5>
                                    <small className="text-white opacity-75">Đặt lại mật khẩu qua email</small>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn-close btn-close-white ms-auto"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>

                        {/* Body */}
                        <div className="modal-body px-4 py-4">
                            <div className="alert alert-success border-0 rounded-3 d-flex align-items-start gap-2 py-2 px-3 mb-3"
                                style={{ backgroundColor: "#f0fdf4", color: "#166534" }}>
                                <i className="bi bi-info-circle-fill mt-1 flex-shrink-0" style={{ color: "#00b14f" }}></i>
                                <small>
                                    Hệ thống sẽ gửi mã xác nhận đến email của bạn. Vui lòng kiểm tra hộp thư sau khi gửi.
                                </small>
                            </div>

                            <label className="form-label fw-semibold text-secondary small text-uppercase mb-2">
                                Địa chỉ email
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className="bi bi-envelope-fill text-secondary"></i>
                                </span>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`form-control bg-light border-start-0 ${erremail ? "is-invalid" : email ? "is-valid" : ""}`}
                                    placeholder="example@email.com"
                                />
                                {erremail && (
                                    <div className="invalid-feedback d-flex align-items-center gap-1">
                                        <i className="bi bi-exclamation-circle-fill"></i> {erremail}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer border-0 px-4 pb-4 pt-0 gap-2">
                            <button
                                type="button"
                                className="btn btn-light border rounded-3 fw-semibold px-4"
                                data-bs-dismiss="modal"
                            >
                                <i className="bi bi-x-circle me-1"></i> Huỷ
                            </button>
                            <button
                                type="button"
                                onClick={hanleForgotEmail}
                                className="btn fw-semibold text-white rounded-3 px-4 flex-grow-1"
                                style={{ background: "linear-gradient(135deg, #00b14f 0%, #007a35 100%)", border: "none" }}
                            >
                                <i className="bi bi-send-fill me-1"></i> Gửi mã xác nhận
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <img src={imglogin} alt="Login" style={styles.bgImage} />

            <div style={styles.overlay}>
                <h1 style={styles.title}>Chào mừng đến với hệ thống tuyển dụng!</h1>
                <p style={styles.subtitle}>Vui lòng đăng nhập để tiếp tục.</p>

                <form
                    style={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleOnSubmit();
                    }}
                >
                    <div>
                        <input
                            type="text"
                            placeholder="Email"
                            value={inputValue.email}
                            onFocus={() => setFocusField("email")}
                            onBlur={() => setFocusField("")}
                            style={{
                                ...styles.input,
                                ...(focusField === "email" ? styles.inputFocus : {})
                            }}
                            onChange={(e) =>
                                setInputValue({ ...inputValue, email: e.target.value })
                            }
                        />
                        {errors.email && <p style={styles.error}>{errors.email}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={inputValue.password}
                            onFocus={() => setFocusField("password")}
                            onBlur={() => setFocusField("")}
                            style={{
                                ...styles.input,
                                ...(focusField === "password" ? styles.inputFocus : {})
                            }}
                            onChange={(e) =>
                                setInputValue({ ...inputValue, password: e.target.value })
                            }
                        />
                        {errors.password && <p style={styles.error}>{errors.password}</p>}
                    </div>

                    <button type="submit" style={styles.button}>
                        Đăng nhập
                    </button>
                </form>

                <div style={{ marginTop: "20px" }}>
                    <p>Chưa có tài khoản? <Link to={path.REGISTER}>Đăng ký ngay</Link></p>
                    <p>Quên mật khẩu? <Link onClick={showModal}>Khôi phục mật khẩu</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;