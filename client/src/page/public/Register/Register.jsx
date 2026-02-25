import { useState } from "react";
import imglogin from "../../../assets/login.jpg";
import path from "../../../ultils/path";
import { Link, useNavigate } from "react-router-dom";
import { register, finalRegister } from "../../../api/user";
import Swal from "sweetalert2";
import Loading from "../../../component/loading/Loading";
const styles = {
    container: {
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 0",
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
        padding: "45px 35px",
        minHeight: "620px",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(8px)",
        borderRadius: "15px",
        color: "white",
        textAlign: "center",
        boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
    },
    title: {
        fontSize: "26px",
        marginBottom: "10px",
        color: "#00b14f",
        fontWeight: "600",
    },
    subtitle: {
        fontSize: "14px",
        opacity: 0.9,
        marginBottom: "25px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    input: {
        width: "100%",
        padding: "12px",
        borderRadius: "10px",
        border: "none",
        backgroundColor: "rgba(255,255,255,0.9)",
        fontSize: "15px",
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
        padding: "12px",
        borderRadius: "10px",
        background: "#00b14f",
        border: "none",
        color: "white",
        fontSize: "16px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "0.25s",
    },
};

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        role: "ungvien"
    });

    const [code, setCode] = useState("");

    const [errors, setErrors] = useState({});
    const [focusField, setFocusField] = useState("");

    const showModal = () => {
        const modal = new window.bootstrap.Modal(document.getElementById("registerModal"));
        modal.show();
    };

    const hideModal = () => {
        const modalElement = document.getElementById("registerModal");
        const modal = window.bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.hide();
    };

    const handleOnSubmit = () => {
        let newErrors = {};

        if (!inputValue.username) newErrors.username = "Tên đăng nhập không được để trống";
        if (!inputValue.email) newErrors.email = "Email không được để trống";
        if (inputValue.email && !/\S+@\S+\.\S+/.test(inputValue.email)) newErrors.email = "Email không đúng định dạng";

        if (!inputValue.password) newErrors.password = "Mật khẩu không được để trống";
        if (inputValue.password.length < 8) newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";

        if (inputValue.password !== inputValue.confirmPassword)
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";

        if (!inputValue.phone) newErrors.phone = "Số điện thoại không được để trống";
        else if (!/^\d{10}$/.test(inputValue.phone))
            newErrors.phone = "Số điện thoại phải gồm đúng 10 chữ số";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const data = {
                username: inputValue.username,
                email: inputValue.email,
                password: inputValue.password,
                phone: inputValue.phone,
                role: inputValue.role
            }
            setLoading(true);
            register(data)
                .then((res) => {
                    if (res.success) {
                        setLoading(false);
                        showModal();
                    } else {
                        setLoading(false);
                        Swal.fire({
                            icon: "error",
                            title: "Đăng ký thất bại",
                            text: res.mes || "Đã có lỗi xảy ra. Vui lòng thử lại.",
                            confirmButtonText: "OK",
                        });
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    Swal.fire({
                        icon: "error",
                        title: "Đăng ký thất bại",
                        text: err.response?.mes || "Đã có lỗi xảy ra. Vui lòng thử lại.",
                        confirmButtonText: "OK",
                    });
                });
        }
    };


    const hanleComformCode = () => {
        setLoading(true);
        finalRegister(code)
            .then((res) => {
                if (res.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Đăng ký thành công",
                        text: res.mes || "Bạn đã đăng ký thành công. Vui lòng đăng nhập.",
                        confirmButtonText: "OK",
                    }).then(() => {
                        setLoading(false);
                        hideModal();
                        navigate(path.LOGIN);
                    });
                } else {
                    setLoading(false);
                    Swal.fire({
                        icon: "error",
                        title: "Xác nhận thất bại",
                        text: res.mes || "Mã xác nhận không đúng. Vui lòng thử lại.",
                        confirmButtonText: "OK",
                    });
                }
            })
            .catch((err) => {
                setLoading(false);
                Swal.fire({
                    icon: "error",
                    title: "Xác nhận thất bại",
                    text: err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.",
                    confirmButtonText: "OK",
                });
            });
    };

    return (
        <div style={styles.container}>
            {loading && <Loading />}
            <div className="modal fade" id="registerModal" tabIndex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
                <div className="modal-dialog ">
                    <div className="modal-content shadow-lg border-0 rounded-3">

                        <div className="modal-header text-white rounded-top-3" style={{ backgroundColor: "#00b14f" }}>
                            <h5 className="modal-title" id="registerModalLabel">
                                <i className="bi bi-envelope-check"></i>Hoàn tất đăng ký
                            </h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                            <p className="text-muted mb-2">
                                Hệ thống đã gửi mã xác nhận đến email của bạn. Vui lòng nhập mã bên dưới:
                            </p>

                            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="form-control form-control-lg text-center fw-semibold"
                                placeholder="Nhập mã xác nhận" />
                        </div>

                        <div className="modal-footer d-flex justify-content-between">
                            <button type="button" className="btn btn-light border" data-bs-dismiss="modal">
                                <i className="bi bi-x-circle"></i> Huỷ
                            </button>

                            <button type="button" onClick={hanleComformCode} className="btn" style={{ backgroundColor: "#00b14f" }}>
                                <i className="bi bi-check2-circle"></i> Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <img src={imglogin} style={styles.bgImage} />

            <div style={styles.overlay}>
                <h1 style={styles.title}>Chào mừng bạn!</h1>
                <p style={styles.subtitle}>
                    Tạo tài khoản để nhận được những cơ hội nghề nghiệp tốt nhất.
                </p>

                <form
                    style={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleOnSubmit();
                    }}
                >
                    {/* Username */}
                    <div>
                        <input
                            type="text"
                            placeholder="Tên đăng nhập"
                            value={inputValue.username}
                            onFocus={() => setFocusField("username")}
                            onBlur={() => setFocusField("")}
                            style={{
                                ...styles.input,
                                ...(focusField === "username" ? styles.inputFocus : {})
                            }}
                            onChange={(e) =>
                                setInputValue({ ...inputValue, username: e.target.value })
                            }
                        />
                        {errors.username && <p style={styles.error}>{errors.username}</p>}
                    </div>

                    {/* Email */}
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

                    {/* Password */}
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
                    {/* Confirm password */}
                    <div>
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            value={inputValue.confirmPassword}
                            onFocus={() => setFocusField("confirmPassword")}
                            onBlur={() => setFocusField("")}
                            style={{
                                ...styles.input,
                                ...(focusField === "confirmPassword" ? styles.inputFocus : {})
                            }}
                            onChange={(e) =>
                                setInputValue({ ...inputValue, confirmPassword: e.target.value })
                            }
                        />
                        {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <input
                            type="text"
                            placeholder="Số điện thoại"
                            value={inputValue.phone}
                            onFocus={() => setFocusField("phone")}
                            onBlur={() => setFocusField("")}
                            style={{
                                ...styles.input,
                                ...(focusField === "phone" ? styles.inputFocus : {})
                            }}
                            onChange={(e) =>
                                setInputValue({ ...inputValue, phone: e.target.value })
                            }
                        />
                        {errors.phone && <p style={styles.error}>{errors.phone}</p>}
                    </div>

                    {/* Role */}
                    <select
                        value={inputValue.role}
                        style={styles.input}
                        onChange={(e) =>
                            setInputValue({ ...inputValue, role: e.target.value })
                        }
                    >
                        <option value="ungvien">Ứng viên</option>
                        <option value="nhatuyendung">Nhà tuyển dụng</option>
                    </select>

                    <button type="submit" style={styles.button}>
                        Đăng ký
                    </button>
                </form>
            </div>
        </div>

    );
};

export default Register;