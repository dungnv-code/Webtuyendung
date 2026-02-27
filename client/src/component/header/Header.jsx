import path from '../../ultils/path';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/topcv-logo.png';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { getCurrent } from "../../redux/userUser/asyncActionUser";
import { LogOut } from "../../redux/userUser/userSlice";
import { logout } from "../../api/user";

const Header = () => {
    const User = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const handleAuth = async () => {
            if (!User.token) {
                setIsChecking(false);
                return;
            }
            try {
                const decode = jwtDecode(User.token);
                // Điều hướng theo role
                if (decode.role === "ADMIN") {
                    navigate(path.DASHBOARDADMIN);
                } else if (decode.role === "nhatuyendung" || decode.role === "STAFF") {
                    navigate(path.DASHBOARDBUSINESS);
                } else {
                    await dispatch(getCurrent());
                }
            } catch (err) {
                console.error("Decode Token Error:", err);
                dispatch(LogOut());
            }

            setIsChecking(false);
        };

        handleAuth();
    }, []);

    if (isChecking) return null;

    const hanleClickLogout = async () => {
        try {
            await logout();
            dispatch(LogOut());
            navigate(path.LOGIN);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">

                    {/* Logo */}
                    <Link className="navbar-brand" to={path.HOME}>
                        <img src={logo} alt="Logo" width="100" height="40" />
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">

                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item"><Link className="nav-link" to={path.HOME}>Trang chủ</Link></li>
                            <li className="nav-item"><Link className="nav-link" to={path.JOB}>Công việc</Link></li>
                            <li className="nav-item"><Link className="nav-link" to={path.COMPANY}>Công ty</Link></li>
                            <li className="nav-item"><Link className="nav-link" to={path.INTRODUCTION}>Giới thiệu</Link></li>
                        </ul>

                        {/* RIGHT SIDE */}
                        {User?.isLogIn ? (
                            <div className="d-flex align-items-center gap-2 ms-auto">

                                <div className="dropdown">
                                    <button
                                        className="btn p-0 border-0 bg-transparent d-flex align-items-center"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <img
                                            src={User?.current?.avatar || "https://via.placeholder.com/40"}
                                            alt="avatar"
                                            className="rounded-circle border"
                                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                        />
                                        <i className="bi bi-caret-down-fill ms-2"></i>
                                    </button>

                                    <ul className="dropdown-menu dropdown-menu-end shadow">
                                        <li><button className="dropdown-item">Thông tin cá nhân</button></li>
                                        <li><button className="dropdown-item">Đổi mật khẩu</button></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button
                                                className="dropdown-item text-danger fw-semibold"
                                                onClick={hanleClickLogout}
                                            >
                                                Đăng xuất
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex gap-2 ms-auto">
                                <Link className="btn btn-outline-primary" to={path.LOGIN}>Đăng nhập</Link>
                                <Link className="btn btn-outline-primary" to={path.REGISTER}>Đăng ký</Link>
                            </div>
                        )}
                    </div>

                </div>
            </nav>
        </>
    );
};

export default Header;