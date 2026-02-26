import { useState, useEffect } from "react";
import imglogin from "../../../assets/login.jpg";
import path from "../../../ultils/path";
import { Link } from "react-router-dom";
import { login, forgotPassword, getUserSingle } from "../../../api/user";
import { useDispatch, useSelector } from "react-redux";
import { LogIn } from "../../../redux/userUser/userSlice";
import { getCurrent } from "../../../redux/userUser/asyncActionUser";
import Swal from "sweetalert2";
import Loading from "../../../component/loading/Loading";
import { useNavigate } from "react-router-dom";
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
        opacity: 0.9,
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

    const handleOnSubmit = () => {
        let newErrors = {};

        // ===== VALIDATION =====
        if (!inputValue.email) newErrors.email = "Email không được để trống";
        if (!inputValue.password) newErrors.password = "Mật khẩu không được để trống";
        if (inputValue.password && inputValue.password.length < 8)
            newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";

        if (inputValue.email && !/\S+@\S+\.\S+/.test(inputValue.email))
            newErrors.email = "Email không đúng định dạng";

        setErrors(newErrors);

        // Nếu có lỗi thì dừng luôn
        if (Object.keys(newErrors).length > 0) return;

        // ===== CALL API =====
        setLoading(true);

        login(inputValue)
            .then(res => {
                setLoading(false);

                // Nếu API trả success: false → báo lỗi
                if (!res.data?.success) {
                    Swal.fire({
                        title: "Lỗi!",
                        text: res.data?.mes || "Đăng nhập thất bại!",
                        icon: "error",
                    });
                    return;
                }

                // === Đăng nhập thành công ===
                Swal.fire({
                    title: "Thành công!",
                    text: "Đăng nhập thành công!",
                    icon: "success",
                });

                setInputValue({ email: "", password: "" });

                dispatch(LogIn(res.data));

                const decoded = jwtDecode(res.data.accessToken);
                const role = decoded.role;
                if (role === "ADMIN") {
                    navigate(path.DASHBOARDADMIN);
                } else if (role === "nhatuyendung" || role === "STAFF") {
                    navigate(path.DASHBOARDBUSINESS);
                } else {
                    navigate(path.HOME);
                    dispatch(getCurrent)
                }
            })
            .catch(err => {
                setLoading(false);
                Swal.fire({
                    title: "Lỗi!",
                    text: err?.response?.data?.mes || "Đăng nhập thất bại!",
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
                <div className="modal-dialog ">
                    <div className="modal-content shadow-lg border-0 rounded-3">

                        <div className="modal-header text-white rounded-top-3" style={{ backgroundColor: "#00b14f" }}>
                            <h5 className="modal-title" id="loginModalLabel">
                                <i className="bi bi-envelope-check"></i>Vui lòng nhập email xác nhận
                            </h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                            <p className="text-muted mb-2">
                                Hệ thống sẽ gửi mã xác nhận đến email của bạn. Vui lòng nhập email của bạn bên dưới:
                            </p>

                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control form-control-lg text-center fw-semibold"
                                placeholder="Nhập email xác nhận" />
                            {erremail && <p className="text-danger mt-2">{erremail}</p>}
                        </div>

                        <div className="modal-footer d-flex justify-content-between">
                            <button type="button" className="btn btn-light border" data-bs-dismiss="modal">
                                <i className="bi bi-x-circle"></i> Huỷ
                            </button>

                            <button type="button" onClick={hanleForgotEmail} className="btn" style={{ backgroundColor: "#00b14f" }}>
                                <i className="bi bi-check2-circle"></i> Xác nhận
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