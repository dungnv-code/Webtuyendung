import path from "../../ultils/path";
import { NavLink, useNavigate } from "react-router-dom";
import {
    HomeOutlined, AreaChartOutlined, LoginOutlined,
    FundViewOutlined, ShoppingCartOutlined, HistoryOutlined
} from '@ant-design/icons';
import { LogOut } from "../../redux/userUser/userSlice";
import { logout, getUserSingle } from "../../api/user";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const Businesssibar = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [datatoken, setDatatoken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.isLogIn) navigate(path.LOGIN);
    }, []);

    useEffect(() => {
        const fetchGetUser = async () => {
            try {
                const reponse = await getUserSingle();
                if (!["nhatuyendung", "STAFF"].includes(reponse.data.role)) {
                    navigate(path.LOGIN);
                }
            } catch (err) { }
        };
        fetchGetUser();
    }, [user.isLogIn]);

    useEffect(() => {
        if (user.token) {
            const decode = jwtDecode(user.token);
            setDatatoken(decode);
        }
    }, []);

    const handleClickLogout = async () => {
        try {
            dispatch(LogOut());
            await logout();
        } catch (error) {
            console.log("Logout error:", error);
        }
    };

    const isOwner = datatoken?.role === "nhatuyendung";
    const isStaff = datatoken?.role === "STAFF";
    const hasBusiness = datatoken?.businessId != null;

    const navItems = [
        {
            show: true,
            to: path.DASHBOARDBUSINESS,
            icon: <i className="fa-solid fa-gauge-high " />,
            label: "Dashboard",
        },
        {
            show: isOwner && !hasBusiness,
            to: path.CREATEBUSINESS,
            icon: <AreaChartOutlined />,
            label: "Tạo công ty",
        },
        {
            show: isOwner && hasBusiness,
            to: path.MANAGERINFOBUSI,
            icon: <i className="fa-solid fa-circle-info" />,
            label: "Thông tin doanh nghiệp",
        },
        {
            show: isOwner && hasBusiness,
            to: path.MANAGERSTAFF,
            icon: <i className="fa-solid fa-users" />,
            label: "Quản lý nhân viên",
        },
        {
            show: isOwner && hasBusiness,
            to: path.CREATESTAFF,
            icon: <i className="fa-solid fa-user-plus" />,
            label: "Thêm nhân viên",
        },
        {
            show: (isOwner || isStaff) && hasBusiness,
            to: path.BUSINESSPOSTJOB,
            icon: <i className="fa-solid fa-pen-to-square" />,
            label: "Tạo bài đăng",
        },
        {
            show: (isOwner || isStaff) && hasBusiness,
            to: path.MANAGERPOSTJOB,
            icon: <i className="fa-solid fa-file-lines" />,
            label: "Quản lý bài đăng",
        },
        {
            show: isOwner && hasBusiness,
            to: path.BUSINESSBUYPOSTJOB,
            icon: <i className="fa-solid fa-cart-shopping" />,
            label: "Mua lượt đăng",
        },
        {
            show: isOwner && hasBusiness,
            to: path.HISTORYBUY,
            icon: <i className="fa-solid fa-money-bill-transfer" />,
            label: "Lịch sử giao dịch",
        },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
                .bsb-nav {
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

                .bsb-nav::-webkit-scrollbar { display: none; }

                /* ── Brand ── */
                .bsb-brand {
                    padding: 1.75rem 1.5rem 1.25rem;
                    border-bottom: 1px solid #f3f4f6;
                }

                .bsb-brand-inner {
                    display: flex;
                    align-items: center;
                    gap: 0.65rem;
                }

                .bsb-logo {
                    width: 36px; height: 36px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #6366f1, #10b981);
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }

                .bsb-logo i { color: #fff; font-size: 0.9rem; }

                .bsb-brand-text {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: #1e1b4b;
                    line-height: 1.2;
                }

                .bsb-brand-sub {
                    font-size: 0.67rem;
                    color: #9ca3af;
                    font-weight: 400;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                }

                /* ── Role badge ── */
                .bsb-role {
                    margin: 0.75rem 1.25rem 0;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    background: rgba(99,102,241,0.08);
                    color: #6366f1;
                    border-radius: 999px;
                    padding: 0.22rem 0.7rem;
                    font-size: 0.68rem;
                    font-weight: 600;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    width: fit-content;
                }

                .bsb-role-dot {
                    width: 5px; height: 5px;
                    border-radius: 50%;
                    background: #6366f1;
                    flex-shrink: 0;
                }

                /* ── Section label ── */
                .bsb-section-label {
                    font-size: 0.62rem;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #c4c9d4;
                    padding: 1rem 1.5rem 0.35rem;
                }

                /* ── Nav list ── */
                .bsb-ul {
                    list-style: none;
                    padding: 0.5rem 0.75rem;
                    margin: 0;
                    flex: 1;
                }

                .bsb-li { margin-bottom: 2px; }

                .bsb-link {
                    display: flex;
                    align-items: center;
                    gap: 0.65rem;
                    padding: 0.65rem 0.85rem;
                    border-radius: 10px;
                    text-decoration: none;
                    color: #6b7280;
                    font-size: 0.85rem;
                    font-weight: 400;
                    transition: background 0.18s, color 0.18s, transform 0.18s;
                    position: relative;
                }

                .bsb-link:hover {
                    background: #f5f3ff;
                    color: #6366f1;
                    transform: translateX(2px);
                }

                .bsb-link.active {
                    background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(16,185,129,0.08));
                    color: #6366f1;
                    font-weight: 600;
                }

                /* active left bar */
                .bsb-link.active::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 20%; bottom: 20%;
                    width: 3px;
                    border-radius: 999px;
                    background: linear-gradient(180deg, #6366f1, #10b981);
                }

                .bsb-link-icon {
                    width: 28px; height: 28px;
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.8rem;
                    background: #f3f4f6;
                    flex-shrink: 0;
                    transition: background 0.18s, color 0.18s;
                    color: #9ca3af;
                }

                .bsb-link:hover .bsb-link-icon {
                    background: rgba(99,102,241,0.12);
                    color: #6366f1;
                }

                .bsb-link.active .bsb-link-icon {
                    background: rgba(99,102,241,0.15);
                    color: #6366f1;
                }

                /* ── Logout section ── */
                .bsb-footer {
                    padding: 0.75rem;
                    border-top: 1px solid #f3f4f6;
                }

                .bsb-logout {
                    display: flex;
                    align-items: center;
                    gap: 0.65rem;
                    padding: 0.65rem 0.85rem;
                    border-radius: 10px;
                    text-decoration: none;
                    color: #9ca3af;
                    font-size: 0.85rem;
                    font-weight: 400;
                    width: 100%;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    transition: background 0.18s, color 0.18s;
                }

                .bsb-logout:hover {
                    background: rgba(244,63,94,0.07);
                    color: #f43f5e;
                }

                .bsb-logout:hover .bsb-logout-icon {
                    background: rgba(244,63,94,0.1);
                    color: #f43f5e;
                }

                .bsb-logout-icon {
                    width: 28px; height: 28px;
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    background: #f3f4f6; color: #9ca3af;
                    font-size: 0.8rem; flex-shrink: 0;
                    transition: background 0.18s, color 0.18s;
                }
            `}</style>

            <nav className="bsb-nav">

                <div className="bsb-brand">
                    <div className="bsb-brand-inner">
                        <div className="bsb-logo">
                            <i className="fa-solid fa-building" />
                        </div>
                        <div>
                            <p className="bsb-brand-text">Doanh nghiệp</p>
                            <p className="bsb-brand-sub">Quản lý tuyển dụng</p>
                        </div>
                    </div>

                    {datatoken && (
                        <div className="bsb-role">
                            <span className="bsb-role-dot" />
                            {datatoken.role === "nhatuyendung" ? "Nhà tuyển dụng" : "Nhân viên"}
                        </div>
                    )}
                </div>

                <p className="bsb-section-label">Menu chính</p>
                <ul className="bsb-ul">
                    {navItems.filter(item => item.show).map((item, i) => (
                        <li className="bsb-li" key={i}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) => `bsb-link${isActive ? " active" : ""}`}
                            >
                                <span className="bsb-link-icon">{item.icon}</span>
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="bsb-footer">
                    <NavLink
                        to={path.LOGIN}
                        className="bsb-logout"
                        onClick={handleClickLogout}
                    >
                        <span className="bsb-logout-icon"><LoginOutlined /></span>
                        Đăng xuất
                    </NavLink>
                </div>
            </nav>
        </>
    );
};

export default Businesssibar;
