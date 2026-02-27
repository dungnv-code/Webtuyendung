import path from "../../ultils/path";
import { NavLink } from "react-router-dom";
import {
    HomeOutlined, AreaChartOutlined, UserOutlined, ProjectOutlined,
    ScheduleOutlined, RiseOutlined, LoginOutlined
} from '@ant-design/icons';

import { LogOut } from "../../redux/userUser/userSlice"
import { logout } from "../../api/user";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const sidebarStyle = {
    container: {
        background: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(14px)",
        color: "#e2e8f0",
        width: "23%",
        height: "100vh",
        padding: "22px 0",
        position: "fixed",
        top: 0,
        left: 0,
        borderRight: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "6px 0 20px rgba(0,0,0,0.35)",
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
    },
    containerHideScroll: `
        ::-webkit-scrollbar {
            width: 0px;
            background: transparent;
        }
    `,
    brand: {
        textAlign: "center",
        color: "#a5f3fc",
        fontSize: "2rem",
        fontWeight: 800,
        letterSpacing: "2px",
        marginBottom: "25px",
        textShadow: "0 0 10px rgba(0,255,255,0.5)",
    },
    ul: {
        padding: 0,
        marginTop: "20px",
        listStyle: "none",
        width: "100%",
    },
    li: {
        marginBottom: "12px",
    },
    link: {
        color: "#cbd5e1",
        fontSize: "1.07rem",
        padding: "14px 22px",
        margin: "10px 14px",
        borderRadius: "14px",
        textDecoration: "none",
        display: "flex",
        gap: "14px",
        alignItems: "center",
        transition: "0.25s ease",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.05)",
    },
    hover: {
        background: "rgba(94,234,212,0.18)",
        color: "#fff",
        transform: "translateX(6px)",
        boxShadow: "0 4px 12px rgba(94,234,212,0.25)",
    },
    active: {
        background: "linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)",
        color: "#fff",
        fontWeight: 600,
        border: "1px solid rgba(255,255,255,0.25)",
        boxShadow: "0 4px 16px rgba(6,182,212,0.45)",
    }
};

const Businesssibar = () => {
    const [hoverIndex, setHoverIndex] = useState(null);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [datatoken, setDatatoken] = useState();
    const handleClickLogout = async () => {
        try {
            dispatch(LogOut());
            await logout();
        } catch (error) {
            console.log("Logout error:", error);
        }
    };

    useEffect(() => {
        const decode = jwtDecode(user.token)
        setDatatoken(decode)
        console.log(decode)
    }, [])

    return (
        <nav style={sidebarStyle.container}>
            <h2 style={sidebarStyle.brand}>Doanh nghiệp</h2>

            <ul style={sidebarStyle.ul}>
                {/* Trang chủ */}
                <li style={sidebarStyle.li}>
                    <NavLink
                        to={path.DASHBOARDBUSINESS}
                        style={({ isActive }) => ({
                            ...sidebarStyle.link,
                            ...(hoverIndex === 0 ? sidebarStyle.hover : {}),
                            ...(isActive ? sidebarStyle.active : {}),
                        })}
                        onMouseEnter={() => setHoverIndex(0)}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        <HomeOutlined />
                        Trang chủ
                    </NavLink>
                </li>

                {/* Tạo công ty */}
                {
                    datatoken?.role == "nhatuyendung" && datatoken?.businessId == null && <li style={sidebarStyle.li}>
                        <NavLink
                            to={path.CREATEBUSINESS}
                            style={({ isActive }) => ({
                                ...sidebarStyle.link,
                                ...(hoverIndex === 1 ? sidebarStyle.hover : {}),
                                ...(isActive ? sidebarStyle.active : {}),
                            })}
                            onMouseEnter={() => setHoverIndex(1)}
                            onMouseLeave={() => setHoverIndex(null)}
                        >
                            <AreaChartOutlined />
                            Tạo công ty
                        </NavLink>
                    </li>
                }


                {
                    datatoken?.role === "nhatuyendung" && datatoken?.businessId != null &&
                    <>
                        <li style={sidebarStyle.li}>
                            <NavLink
                                to={path.MANAGERINFOBUSI}
                                style={({ isActive }) => ({
                                    ...sidebarStyle.link,
                                    ...(hoverIndex === 2 ? sidebarStyle.hover : {}),
                                    ...(isActive ? sidebarStyle.active : {}),
                                })}
                                onMouseEnter={() => setHoverIndex(2)}
                                onMouseLeave={() => setHoverIndex(null)}
                            >
                                <AreaChartOutlined />
                                Thông tin doanh nghiệp
                            </NavLink>
                        </li>

                        <li style={sidebarStyle.li}>
                            <NavLink
                                to={path.MANAGERSTAFF}
                                style={({ isActive }) => ({
                                    ...sidebarStyle.link,
                                    ...(hoverIndex === 3 ? sidebarStyle.hover : {}),
                                    ...(isActive ? sidebarStyle.active : {}),
                                })}
                                onMouseEnter={() => setHoverIndex(3)}
                                onMouseLeave={() => setHoverIndex(null)}
                            >
                                <UserOutlined />
                                Quản lí nhân viên
                            </NavLink>
                        </li>

                        <li style={sidebarStyle.li}>
                            <NavLink
                                to={path.CREATESTAFF}
                                style={({ isActive }) => ({
                                    ...sidebarStyle.link,
                                    ...(hoverIndex === 4 ? sidebarStyle.hover : {}),
                                    ...(isActive ? sidebarStyle.active : {}),
                                })}
                                onMouseEnter={() => setHoverIndex(4)}
                                onMouseLeave={() => setHoverIndex(null)}
                            >
                                <ProjectOutlined />
                                Thêm nhân viên
                            </NavLink>
                        </li>

                        <li style={sidebarStyle.li}>
                            <NavLink
                                to={path.BUSINESSBUYPOSTJOB}
                                style={({ isActive }) => ({
                                    ...sidebarStyle.link,
                                    ...(hoverIndex === 6 ? sidebarStyle.hover : {}),
                                    ...(isActive ? sidebarStyle.active : {}),
                                })}
                                onMouseEnter={() => setHoverIndex(6)}
                                onMouseLeave={() => setHoverIndex(null)}
                            >
                                <RiseOutlined />
                                Mua lượt đăng
                            </NavLink>
                        </li>

                        <li style={sidebarStyle.li}>
                            <NavLink
                                to={path.HISTORYBUY}
                                style={({ isActive }) => ({
                                    ...sidebarStyle.link,
                                    ...(hoverIndex === 7 ? sidebarStyle.hover : {}),
                                    ...(isActive ? sidebarStyle.active : {}),
                                })}
                                onMouseEnter={() => setHoverIndex(7)}
                                onMouseLeave={() => setHoverIndex(null)}
                            >
                                <RiseOutlined />
                                Lịch sử giao dịch
                            </NavLink>
                        </li>
                    </>
                }

                {
                    (datatoken?.role === "nhatuyendung" || datatoken?.role === "STAFF") &&
                    datatoken?.businessId != null &&
                    <li style={sidebarStyle.li}>
                        <NavLink
                            to={path.BUSINESSPOSTJOB}
                            style={({ isActive }) => ({
                                ...sidebarStyle.link,
                                ...(hoverIndex === 5 ? sidebarStyle.hover : {}),
                                ...(isActive ? sidebarStyle.active : {}),
                            })}
                            onMouseEnter={() => setHoverIndex(5)}
                            onMouseLeave={() => setHoverIndex(null)}
                        >
                            <ScheduleOutlined />
                            Quản lí bài đăng
                        </NavLink>
                    </li>
                }

                <li style={sidebarStyle.li}>
                    <NavLink
                        to={path.LOGIN}
                        style={({ isActive }) => ({
                            ...sidebarStyle.link,
                            ...(hoverIndex === 8 ? sidebarStyle.hover : {}),
                            ...(isActive ? sidebarStyle.active : {}),
                        })}
                        onMouseEnter={() => setHoverIndex(8)}
                        onMouseLeave={() => setHoverIndex(null)}
                        onClick={handleClickLogout}
                    >
                        <LoginOutlined />
                        Đăng xuất
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Businesssibar;