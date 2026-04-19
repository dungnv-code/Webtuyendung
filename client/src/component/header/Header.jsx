import path from '../../ultils/path';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/icon_logo.png';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { getCurrent } from "../../redux/userUser/asyncActionUser";
import { LogOut } from "../../redux/userUser/userSlice";
import { logout, getNotifications, markNotificationAsRead } from "../../api/user";

const Header = () => {
    const User = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await getNotifications();
                setNotifications(res?.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        if (User?.isLogIn) fetchNotifications();
    }, [User?.isLogIn]);

    useEffect(() => {
        const handleAuth = async () => {
            if (!User.token) { setIsChecking(false); return; }
            try {
                const decode = jwtDecode(User.token);
                if (decode.role === "ADMIN" || decode.role === "nhatuyendung" || decode.role === "STAFF") {
                    await logout(); dispatch(LogOut());
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
            localStorage.setItem("accessToken", "");
            navigate(path.LOGIN);
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAsRead = async () => {
        try {
            await markNotificationAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <nav className="navbar navbar-expand-lg sticky-top shadow-sm"
            style={{ background: "#fff", borderBottom: "2px solid #e8f5e9" }}>
            <div className="container">
                <Link className="navbar-brand me-4" to={path.HOME}>
                    <img src={logo} alt="Logo" height="60" style={{ objectFit: "contain" }} />
                </Link>

                <button
                    className="navbar-toggler border-0 shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="mainNavbar">

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
                        {[
                            { label: "Trang chủ", to: path.HOME },
                            { label: "Công việc", to: path.JOB },
                            { label: "Công ty", to: path.COMPANY },
                        ].map((item) => (
                            <li className="nav-item" key={item.to}>
                                <Link
                                    onMouseEnter={e => { e.currentTarget.style.background = "#e8f5e9"; e.currentTarget.style.color = "#1b5e20"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2e7d32"; }}
                                    className="nav-link px-3 py-2 rounded-2 fw-medium"
                                    to={item.to}
                                    style={{ color: "#2e7d32", fontSize: "0.92rem", transition: "background 0.15s, color 0.15s" }}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li className="nav-item"
                            onMouseEnter={e => { e.currentTarget.style.background = "#e8f5e9"; e.currentTarget.style.color = "#1b5e20"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2e7d32"; }}
                        >
                            <a
                                href="/cv-builder.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="nav-link px-3 py-2 rounded-2 fw-medium"
                                style={{ color: "#2e7d32" }}
                            >
                                Mẫu CV
                            </a>
                        </li>
                    </ul>

                    {User?.isLogIn ? (
                        <div className="d-flex align-items-center gap-3 ms-auto">

                            <div className="dropdown">
                                <button
                                    className="btn btn-light border rounded-circle p-2 position-relative"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{ width: "40px", height: "40px" }}

                                >
                                    <i className="fa-regular fa-bell" style={{ color: "#198754" }}></i>
                                    {unreadCount > 0 && (
                                        <span
                                            className="position-absolute badge rounded-pill bg-danger"
                                            style={{ fontSize: "0.6rem", top: "-4px", right: "-4px", minWidth: "16px", height: "16px", lineHeight: "16px", padding: "0 4px" }}
                                        >
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                <div
                                    className="dropdown-menu dropdown-menu-end border rounded-3 p-0 mt-2"
                                    style={{ width: "340px", borderColor: "rgba(0,0,0,0.1)" }}
                                >

                                    <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="fw-medium" style={{ fontSize: "14px" }}>Thông báo</span>
                                            {unreadCount > 0 && (
                                                <span
                                                    className="badge rounded-pill"
                                                    style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: "11px", fontWeight: 500 }}
                                                >
                                                    {unreadCount} mới
                                                </span>
                                            )}
                                        </div>
                                        <button className="btn btn-link p-0 text-decoration-none text-success" style={{ fontSize: "12px" }} onClick={handleMarkAsRead}>
                                            Đọc tất cả
                                        </button>
                                    </div>

                                    <div style={{ overflowY: "auto", maxHeight: "360px" }}>
                                        {notifications.length === 0 ? (
                                            <div className="text-center text-muted py-4" style={{ fontSize: "13px" }}>
                                                Không có thông báo
                                            </div>
                                        ) : (
                                            notifications.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="d-flex gap-2 px-3 py-3 border-bottom"
                                                    style={{ background: item.isRead ? "#fff" : "#f6fdf7", cursor: "pointer", transition: "background 0.15s" }}
                                                    onMouseEnter={e => e.currentTarget.style.background = item.isRead ? "#f8f9fa" : "#edf7ee"}
                                                    onMouseLeave={e => e.currentTarget.style.background = item.isRead ? "#fff" : "#f6fdf7"}
                                                >
                                                    <div style={{
                                                        width: "8px", height: "8px", borderRadius: "50%",
                                                        background: item.isRead ? "transparent" : "#198754",
                                                        flexShrink: 0, marginTop: "4px"
                                                    }} />

                                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                        <div className="d-flex align-items-start justify-content-between gap-2">
                                                            <span
                                                                className={item.isRead ? "" : "fw-medium"}
                                                                style={{ fontSize: "13px", lineHeight: "1.4", color: "#212529" }}
                                                            >
                                                                {item.title}
                                                            </span>
                                                            <span style={{ fontSize: "11px", color: "#aaa", whiteSpace: "nowrap", flexShrink: 0 }}>
                                                                {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                                                            </span>
                                                        </div>
                                                        <p className="mb-0 mt-1 text-muted" style={{ fontSize: "12px", lineHeight: "1.5" }}>
                                                            {item.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="text-center py-2 border-top">
                                        <a href="#" className="text-decoration-none text-success fw-medium" style={{ fontSize: "12px" }}>
                                            Xem tất cả thông báo
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="dropdown">
                                <button
                                    className="btn p-0 border-0 bg-transparent d-flex align-items-center gap-2"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <img
                                        src={User?.current?.avatar || "https://via.placeholder.com/40"}
                                        alt="avatar"
                                        className="rounded-circle"
                                        style={{ width: "38px", height: "38px", objectFit: "cover", border: "2px solid #a5d6a7" }}
                                    />
                                    <div className="text-start d-none d-lg-block">
                                        <div className="fw-semibold lh-sm"
                                            style={{ fontSize: "0.85rem", color: "#1b5e20", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {User?.current?.name || "Tài khoản"}
                                        </div>
                                        <div className="text-muted" style={{ fontSize: "0.72rem" }}>Ứng viên</div>
                                    </div>
                                    <i className="fa-solid fa-chevron-down ms-1" style={{ fontSize: "0.65rem", color: "#888" }}></i>
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2"
                                    style={{ minWidth: "220px", padding: "8px" }}>

                                    <li className="px-3 py-2 mb-1">
                                        <div className="d-flex align-items-center gap-2">
                                            <img
                                                src={User?.current?.avatar || "https://via.placeholder.com/40"}
                                                alt="avatar"
                                                className="rounded-circle"
                                                style={{ width: "36px", height: "36px", objectFit: "cover", border: "2px solid #a5d6a7" }}
                                            />
                                            <div>
                                                <div className="fw-semibold" style={{ fontSize: "0.85rem", color: "#1b5e20" }}>
                                                    {User?.current?.name || "Tài khoản"}
                                                </div>
                                                <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                                                    {User?.current?.email || ""}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li><hr className="dropdown-divider my-1" /></li>
                                    {[
                                        { icon: "fa-user", label: "Thông tin cá nhân", to: path.USERINFO },
                                        { icon: "fa-file-lines", label: "Hồ sơ đã nộp", to: path.CVLIST },
                                        { icon: "fa-heart", label: "Việc làm yêu thích", to: path.WISHLISTJOB },
                                        { icon: "fa-building", label: "Doanh nghiệp theo dõi", to: path.WISHLISTBUSINESS },
                                        { icon: "fa-lock", label: "Đổi mật khẩu", to: path.CHANGEPASSWORD },
                                    ].map((item) => (
                                        <li key={item.to}>
                                            <Link
                                                to={item.to}
                                                className="dropdown-item rounded-2 py-2 px-3"
                                                style={{ fontSize: "0.875rem", color: "#333" }}
                                            >
                                                <i className={`fa-solid ${item.icon} me-2`} style={{ width: "16px", color: "#4caf50" }}></i>
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                    <li><hr className="dropdown-divider my-1" /></li>
                                    <li>
                                        <button
                                            className="dropdown-item rounded-2 py-2 px-3 fw-semibold"
                                            style={{ fontSize: "0.875rem", color: "#d32f2f" }}
                                            onClick={hanleClickLogout}
                                        >
                                            <i className="fa-solid fa-right-from-bracket me-2"></i>
                                            Đăng xuất
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center gap-2 ms-auto">
                            <Link
                                className="btn btn-outline-success rounded-pill px-4 fw-semibold"
                                style={{ fontSize: "0.875rem" }}
                                to={path.LOGIN}
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                className="btn btn-success rounded-pill px-4 fw-semibold shadow-sm"
                                style={{ fontSize: "0.875rem" }}
                                to={path.REGISTER}
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;