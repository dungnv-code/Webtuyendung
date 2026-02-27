import path from "../../ultils/path";
import { NavLink } from "react-router-dom";
import {
    HomeOutlined, AreaChartOutlined, UserOutlined, ProjectOutlined, ScheduleOutlined, RiseOutlined
    , DollarOutlined, FieldTimeOutlined, CodeSandboxOutlined, LoginOutlined, ContainerOutlined, AccountBookTwoTone

} from '@ant-design/icons';

import { LogOut } from "../../redux/userUser/userSlice"
import { logout } from "../../api/user";
import { useDispatch } from "react-redux";
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

import { useState } from "react";

const Adminsibar = () => {
    const [hoverIndex, setHoverIndex] = useState(null);
    const dispatch = useDispatch();

    const handleClickLogout = async () => {
        try {
            dispatch(LogOut());
            await logout();
        } catch (error) {
            console.log("Logout error:", error);
        }
    };

    const menuItems = [
        { text: "Trang chủ", icon: <HomeOutlined />, to: path.DASHBOARDADMIN },
        { text: "Đồ thị", icon: <AreaChartOutlined />, to: path.GRAPHADMIN },
        { text: "Quản lí người dùng", icon: <UserOutlined />, to: path.USERADMIN },
        { text: "Quản lí loại công việc", icon: <ProjectOutlined />, to: path.JOBADMIN },
        { text: "Quản lí kĩ năng", icon: <ScheduleOutlined />, to: path.SKILLADMIN },
        { text: "Quản lí cấp bậc", icon: <RiseOutlined />, to: path.LEVELADMIN },
        { text: "Quản lí hình thức ", icon: <AccountBookTwoTone />, to: path.STYLEJOBADMIN },
        { text: "Quản lí khoảng lương", icon: <DollarOutlined />, to: path.SALARYRANGEADMIN },
        { text: "Quản lí kinh nghiệm", icon: <FieldTimeOutlined />, to: path.EXPADMIN },
        { text: "Quản lí các gói bài đăng", icon: <CodeSandboxOutlined />, to: path.PACKETPOSTADMIN },
        { text: "Quản lí doanh nghiệp", icon: <ContainerOutlined />, to: path.COMPANYADMIN },
        { text: "Quản lí bài đăng", icon: <ContainerOutlined />, to: path.POSTADMIN },
        { text: "Đăng xuất", icon: <LoginOutlined />, to: path.LOGIN, Click: handleClickLogout },
    ];

    return (
        <nav style={sidebarStyle.container}>
            <h2 style={sidebarStyle.brand}>ADMIN</h2>

            <ul style={sidebarStyle.ul}>
                {menuItems.map((item, index) => (
                    <li key={index} style={sidebarStyle.li}>
                        <NavLink
                            to={item.to ?? "#"}
                            style={({ isActive }) => ({
                                ...sidebarStyle.link,
                                ...(hoverIndex === index ? sidebarStyle.hover : {}),
                                ...(isActive ? sidebarStyle.active : {}),
                            })}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                            onClick={item?.Click}
                        >
                            {item.icon && <span className="icon">{item.icon}</span>}
                            {item.text}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Adminsibar;