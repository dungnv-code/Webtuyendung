import path from "../../ultils/path";
import { NavLink, useNavigate } from "react-router-dom";
import {
    HomeOutlined, AppstoreOutlined, UserOutlined, RiseOutlined, LoginOutlined, LineChartOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from "react";
import { LogOut } from "../../redux/userUser/userSlice";
import { logout, getUserSingle } from "../../api/user";
import { useDispatch, useSelector } from "react-redux";

const Adminsibar = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.isLogIn) navigate(path.LOGIN);
    }, []);

    useEffect(() => {
        const fetchGetUser = async () => {
            try {
                const response = await getUserSingle();
                if (response.data.role !== "ADMIN") navigate(path.LOGIN);
            } catch (err) { }
        };
        fetchGetUser();
    }, [user.isLogIn]);

    const handleClickLogout = async () => {
        try {
            dispatch(LogOut());
            await logout();
        } catch (error) {
            console.log("Logout error:", error);
        }
    };

    const menuGroups = [
        {
            label: "Tổng quan",
            items: [
                { text: "Dashboard tổng quan", icon: <AppstoreOutlined />, to: path.DASHBOARDADMIN },
                { text: "Thống kê doanh thu", icon: <LineChartOutlined />, to: path.GRAPHADMIN },
            ]
        },
        {
            label: "Người dùng & Doanh nghiệp",
            items: [
                { text: "Quản lý người dùng", icon: <UserOutlined />, to: path.USERADMIN },
                { text: "Quản lý doanh nghiệp", icon: <i className="fa-solid fa-building" />, to: path.COMPANYADMIN },
            ]
        },
        {
            label: "Danh mục công việc",
            items: [
                { text: "Ngành nghề", icon: <i className="fa-solid fa-briefcase" />, to: path.JOBADMIN },
                { text: "Kỹ năng", icon: <i className="fa-solid fa-lightbulb" />, to: path.SKILLADMIN },
                { text: "Cấp bậc", icon: <RiseOutlined />, to: path.LEVELADMIN },
                { text: "Hình thức", icon: <i className="fa-solid fa-laptop-house" />, to: path.STYLEJOBADMIN },
                { text: "Khoảng lương", icon: <i className="fa-solid fa-money-bill-wave" />, to: path.SALARYRANGEADMIN },
                { text: "Kinh nghiệm", icon: <i className="fa-solid fa-user-clock" />, to: path.EXPADMIN },
            ]
        },
        {
            label: "Nội dung",
            items: [
                { text: "Gói bài đăng", icon: <i className="fa-solid fa-box" />, to: path.PACKETPOSTADMIN },
                { text: "Bài đăng", icon: <i className="fa-solid fa-file-lines" />, to: path.POSTADMIN },
            ]
        },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .asb-nav {
                    width: 290px;
                    min-width: 290px;
                    height: 100vh;
                    position: fixed;
                    top: 0; left: 0;
                    background: #fff;
                    border-right: 1px solid #eef0f6;
                    box-shadow: 4px 0 24px rgba(99,102,241,0.07);
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                    scrollbar-width: none;
                    z-index: 100;
                    font-family: 'Inter', sans-serif;
                }

                .asb-nav::-webkit-scrollbar { display: none; }

                /* ── Brand ── */
                .asb-brand {
                    padding: 1.75rem 1.5rem 1.25rem;
                    border-bottom: 1px solid #f3f4f6;
                    flex-shrink: 0;
                }

                .asb-brand-inner {
                    display: flex;
                    align-items: center;
                    gap: 0.65rem;
                }

                .asb-logo {
                    width: 36px; height: 36px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #6366f1, #f97316);
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }

                .asb-logo i { color: #fff; font-size: 0.88rem; }

                .asb-brand-text {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.95rem; font-weight: 700;
                    color: #1e1b4b; line-height: 1.2;
                }

                .asb-brand-sub {
                    font-size: 0.67rem; color: #9ca3af;
                    font-weight: 400; letter-spacing: 0.05em;
                    text-transform: uppercase;
                }

                .asb-role {
                    margin-top: 0.75rem;
                    display: inline-flex; align-items: center; gap: 0.35rem;
                    background: rgba(249,115,22,0.08);
                    color: #f97316; border-radius: 999px;
                    padding: 0.22rem 0.7rem; font-size: 0.68rem;
                    font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
                }

                .asb-role-dot {
                    width: 5px; height: 5px; border-radius: 50%;
                    background: #f97316; flex-shrink: 0;
                }

                /* ── Scroll area ── */
                .asb-scroll {
                    flex: 1;
                    overflow-y: auto;
                    scrollbar-width: none;
                    padding-bottom: 0.5rem;
                }

                .asb-scroll::-webkit-scrollbar { display: none; }

                /* ── Group ── */
                .asb-group { padding: 0 0.75rem; margin-top: 0.5rem; }

                .asb-group-label {
                    font-size: 0.61rem; font-weight: 600;
                    letter-spacing: 0.12em; text-transform: uppercase;
                    color: #c4c9d4; padding: 0.9rem 0.85rem 0.3rem;
                }

                .asb-ul { list-style: none; padding: 0; margin: 0; }
                .asb-li { margin-bottom: 2px; }

                /* ── Links ── */
                .asb-link {
                    display: flex; align-items: center; gap: 0.65rem;
                    padding: 0.62rem 0.85rem; border-radius: 10px;
                    text-decoration: none; color: #6b7280;
                    font-size: 0.84rem; font-weight: 400;
                    transition: background 0.17s, color 0.17s, transform 0.17s;
                    position: relative;
                }

                .asb-link:hover {
                    background: #fff7ed;
                    color: #f97316;
                    transform: translateX(2px);
                }

                .asb-link.active {
                    background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(249,115,22,0.07));
                    color: #6366f1;
                    font-weight: 600;
                }

                .asb-link.active::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 20%; bottom: 20%;
                    width: 3px; border-radius: 999px;
                    background: linear-gradient(180deg, #6366f1, #f97316);
                }

                /* ── Icon box ── */
                .asb-icon {
                    width: 27px; height: 27px; border-radius: 7px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.77rem; background: #f3f4f6;
                    flex-shrink: 0; color: #9ca3af;
                    transition: background 0.17s, color 0.17s;
                }

                .asb-link:hover .asb-icon {
                    background: rgba(249,115,22,0.1);
                    color: #f97316;
                }

                .asb-link.active .asb-icon {
                    background: rgba(99,102,241,0.12);
                    color: #6366f1;
                }

                /* ── Footer / Logout ── */
                .asb-footer {
                    padding: 0.75rem;
                    border-top: 1px solid #f3f4f6;
                    flex-shrink: 0;
                }

                .asb-logout {
                    display: flex; align-items: center; gap: 0.65rem;
                    padding: 0.62rem 0.85rem; border-radius: 10px;
                    text-decoration: none; color: #9ca3af;
                    font-size: 0.84rem; font-weight: 400;
                    width: 100%; background: none; border: none;
                    cursor: pointer; font-family: 'Inter', sans-serif;
                    transition: background 0.17s, color 0.17s;
                }

                .asb-logout:hover {
                    background: rgba(244,63,94,0.07);
                    color: #f43f5e;
                }

                .asb-logout:hover .asb-logout-icon {
                    background: rgba(244,63,94,0.1);
                    color: #f43f5e;
                }

                .asb-logout-icon {
                    width: 27px; height: 27px; border-radius: 7px;
                    display: flex; align-items: center; justify-content: center;
                    background: #f3f4f6; color: #9ca3af; font-size: 0.77rem;
                    flex-shrink: 0; transition: background 0.17s, color 0.17s;
                }
            `}</style>

            <nav className="asb-nav">
                {/* Brand */}
                <div className="asb-brand">
                    <div className="asb-brand-inner">
                        <div className="asb-logo">
                            <i className="fa-solid fa-shield-halved" />
                        </div>
                        <div>
                            <p className="asb-brand-text">Admin Panel</p>
                            <p className="asb-brand-sub">Hệ thống quản trị</p>
                        </div>
                    </div>
                    <div className="asb-role">
                        <span className="asb-role-dot" />
                        Administrator
                    </div>
                </div>

                {/* Grouped menu */}
                <div className="asb-scroll">
                    {menuGroups.map((group, gi) => (
                        <div className="asb-group" key={gi}>
                            <p className="asb-group-label">{group.label}</p>
                            <ul className="asb-ul">
                                {group.items.map((item, ii) => (
                                    <li className="asb-li" key={ii}>
                                        <NavLink
                                            to={item.to}
                                            className={({ isActive }) => `asb-link${isActive ? " active" : ""}`}
                                        >
                                            <span className="asb-icon">{item.icon}</span>
                                            {item.text}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Logout */}
                <div className="asb-footer">
                    <NavLink to={path.LOGIN} className="asb-logout" onClick={handleClickLogout}>
                        <span className="asb-logout-icon"><LoginOutlined /></span>
                        Đăng xuất
                    </NavLink>
                </div>
            </nav>
        </>
    );
};

export default Adminsibar;
