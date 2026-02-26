import path from '../../ultils/path';
import { Link } from 'react-router-dom';
import logo from '../../assets/topcv-logo.png';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode"
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getCurrent } from "../../redux/userUser/asyncActionUser"
import { LogOut } from "../../redux/userUser/userSlice"
import { logout } from "../../api/user";
const Header = () => {
    let User = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isChecking, setIsChecking] = useState(true);


    useEffect(() => {
        const checkAuth = async () => {
            if (User.isLogIn) {
                const decode = jwtDecode(User.token);

                if (decode.role === "ADMIN") {
                    navigate(path.DASHBOARDADMIN);
                } else if (decode.role === "nhatuyendung" || decode.role === "STAFF") {
                    navigate(path.DASHBOARDBUSINESS);
                } else {
                    await dispatch(getCurrent());
                }
            }

            setIsChecking(false);
        };
        checkAuth();
    }, []);

    if (isChecking) return null;

    const hanleClickLogout = async () => {
        try {
            dispatch(LogOut());
            await logout();
            navigate(path.LOGIN)
        } catch (error) {

        }
    }

    return <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">

                {/* Logo bên trái */}
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
                        <li className="nav-item">
                            <Link className="nav-link" to={path.HOME}>Trang chủ</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={path.JOB}>Công việc</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={path.COMPANY}>Công ty</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={path.INTRODUCTION}>Giới thiệu</Link>
                        </li>
                    </ul>

                    {/* Login bên phải */}
                    {
                        User?.isLogIn ? <>
                            <div className="d-flex align-items-center gap-2 ms-auto">
                                <div className="dropdown ms-auto">

                                    <button
                                        className="btn p-0 border-0 bg-transparent d-flex align-items-center"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{ cursor: "pointer" }}
                                    >
                                        <img
                                            src={User?.current?.avatar}
                                            alt="avatar"
                                            className="rounded-circle border"
                                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                        />
                                        <i className="bi bi-caret-down-fill ms-2"></i>
                                    </button>

                                    <ul className="dropdown-menu dropdown-menu-end shadow">
                                        <li>
                                            <button className="dropdown-item">Thông tin cá nhân</button>
                                        </li>

                                        <li>
                                            <button className="dropdown-item">Đổi mật khẩu</button>
                                        </li>

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

                                <Link
                                    className="btn btn-outline-danger fw-semibold px-3"
                                    onClick={hanleClickLogout}
                                >
                                    Đăng xuất
                                </Link>
                            </div>
                        </>
                            : <div className="d-flex gap-2 ms-auto">
                                <Link className="btn btn-outline-primary" to={path.LOGIN}>
                                    Đăng nhập
                                </Link>
                                <Link className="btn btn-outline-primary" to={path.REGISTER}>
                                    Đăng ký
                                </Link>
                            </div>
                    }
                </div>

            </div>
        </nav >
    </>
}

export default Header;