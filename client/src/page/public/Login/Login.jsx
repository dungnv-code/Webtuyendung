import { useState } from "react";
import imglogin from "../../../assets/login.jpg";
import path from "../../../ultils/path";
import { Link } from "react-router-dom";
import { login } from "../../../api/user";
import { useDispatch } from "react-redux";
import { LogIn } from "../../../redux/userUser/userSlice";
import Swal from "sweetalert2";

const styles = {
    container: {
        position: "relative",
        width: "100%",
        minHeight: "100vh",   // ⭐ Gọn hơn — vừa khít màn hình
        fontFamily: "Segoe UI, sans-serif",
        padding: "40px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // ⭐ Giữa màn hình đẹp
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
        padding: "40px 35px",       // ⭐ Giảm padding
        minHeight: "450px",         // ⭐ Form cao đẹp hơn
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
    const [inputValue, setInputValue] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [focusField, setFocusField] = useState("");

    const handleOnSubmit = () => {
        let newErrors = {};

        if (!inputValue.email) newErrors.email = "Email không được để trống";
        if (!inputValue.password) newErrors.password = "Mật khẩu không được để trống";
        if (inputValue.password.length < 8) newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
        if (inputValue.email && !/\S+@\S+\.\S+/.test(inputValue.email))
            newErrors.email = "Email không đúng định dạng";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            login(inputValue)
                .then(res => {
                    Swal.fire({
                        title: "Thành công!",
                        text: "Đăng nhập thành công!",
                        icon: "success",
                    });
                    setInputValue({ email: "", password: "" });
                    dispatch(LogIn(res.data));
                })
                .catch(err => {
                    Swal.fire({
                        title: "Lỗi!",
                        text: err.mes || "Đăng nhập thất bại!",
                        icon: "error",
                    });
                });
        }
    };

    return (
        <div style={styles.container}>
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
                    <p>Quên mật khẩu? <Link to={path.FORGOT_PASSWORD}>Khôi phục mật khẩu</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;