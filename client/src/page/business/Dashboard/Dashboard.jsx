import { useEffect, useState } from "react";
import { getDashboardBusiness } from "../../../api/business";
import {
    BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, Tooltip,
    CartesianGrid, ResponsiveContainer
} from "recharts";

const DashboardBusiness = () => {
    const [data, setData] = useState({});
    const [jobChart, setJobChart] = useState([]);
    const [revenueChart, setRevenueChart] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const repo = await getDashboardBusiness({});
                if (!repo) return;
                setData(repo);

                const jobCounter = {};
                repo.postJobs?.forEach(item => {
                    jobCounter[item.jobs] = (jobCounter[item.jobs] || 0) + 1;
                });
                setJobChart(Object.keys(jobCounter).map(k => ({ name: k, count: jobCounter[k] })));

                const revCounter = {};
                repo.invoid?.forEach(item => {
                    const date = item.createdAt.split("T")[0];
                    revCounter[date] = (revCounter[date] || 0) + item.totalPrice;
                });
                setRevenueChart(
                    Object.keys(revCounter).sort().map(d => ({ date: d, total: revCounter[d] }))
                );
            } catch (err) {
                console.log("Error fetch dashboard:", err);
            }
        };
        fetchAllData();
    }, []);

    const totalRevenue = data.invoid?.reduce((s, i) => s + i.totalPrice, 0) ?? 0;
    const activeJobs = data.postJobs?.filter(j => j.status === "active").length ?? 0;
    const totalCV = data.postJobs?.reduce((s, j) => s + (j.listCV?.length ?? 0), 0) ?? 0;
    const activeStaff = data.staff?.filter(s => s.status === "Active").length ?? 0;

    const TooltipBar = ({ active, payload, label }) => active && payload?.length ? (
        <div style={{ background: "#fff", border: "1px solid #eef0f6", borderRadius: 12, padding: "0.6rem 1rem", boxShadow: "0 4px 16px rgba(99,102,241,0.12)", fontFamily: "'Inter',sans-serif", fontSize: "0.8rem" }}>
            <p style={{ color: "#9ca3af", marginBottom: 2, fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
            <p style={{ color: "#6366f1", fontWeight: 700, margin: 0 }}>{payload[0].value} bài</p>
        </div>
    ) : null;

    const TooltipArea = ({ active, payload, label }) => active && payload?.length ? (
        <div style={{ background: "#fff", border: "1px solid #eef0f6", borderRadius: 12, padding: "0.6rem 1rem", boxShadow: "0 4px 16px rgba(249,115,22,0.12)", fontFamily: "'Inter',sans-serif", fontSize: "0.8rem" }}>
            <p style={{ color: "#9ca3af", marginBottom: 2, fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
            <p style={{ color: "#f97316", fontWeight: 700, margin: 0 }}>${payload[0].value?.toLocaleString()}</p>
        </div>
    ) : null;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .db-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 55%, #fff7ed 100%);
                    padding: 1rem 1.5rem;
                    font-family: 'Inter', sans-serif;
                }

                .db-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem; font-weight: 700;
                    color: #1e1b4b; letter-spacing: -0.02em; margin-bottom: 0.3rem;
                }

                .db-sub {
                    font-size: 0.8rem; color: #9ca3af;
                    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2rem;
                }

                /* KPI cards */
             .db-kpi-grid {
               display: grid;
               grid-template-columns: repeat(4, 1fr); /* ← fix cứng 4 cột */
               gap: 1rem;
               margin-bottom: 1.75rem;
            }

            @media (max-width: 900px) {
            .db-kpi-grid { grid-template-columns: repeat(2, 1fr); }
            }

            @media (max-width: 500px) {
             .db-kpi-grid { grid-template-columns: 1fr; }
            }

                .db-kpi {
                    background: #fff; border-radius: 16px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 4px 16px rgba(99,102,241,0.07);
                    padding: 1.15rem 1.3rem;
                    display: flex; align-items: center; gap: 0.85rem;
                    position: relative; overflow: hidden;
                    transition: transform 0.15s, box-shadow 0.15s;
                    cursor: default;
                }

                .db-kpi:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(99,102,241,0.12);
                }

                .db-kpi::before {
                    content: ''; position: absolute;
                    top: 0; left: 0; right: 0; height: 3px;
                    border-radius: 16px 16px 0 0;
                }

                .db-kpi.kpi-purple::before { background: #6366f1; }
                .db-kpi.kpi-orange::before { background: #f97316; }
                .db-kpi.kpi-green::before  { background: #10b981; }
                .db-kpi.kpi-red::before    { background: #ef4444; }

                .db-kpi-icon {
                    width: 42px; height: 42px; border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1rem; flex-shrink: 0;
                }

                .db-kpi-icon.purple { background: rgba(99,102,241,0.12); color: #6366f1; }
                .db-kpi-icon.orange { background: rgba(249,115,22,0.12);  color: #f97316; }
                .db-kpi-icon.green  { background: rgba(16,185,129,0.12);  color: #10b981; }
                .db-kpi-icon.red    { background: rgba(239,68,68,0.12);   color: #ef4444; }

                .db-kpi-label {
                    font-size: 0.7rem; color: #9ca3af;
                    text-transform: uppercase; letter-spacing: 0.08em;
                    font-weight: 500;
                    margin-bottom: 0.15rem;
                }

                .db-kpi-value {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.4rem; font-weight: 700; color: #1e1b4b; line-height: 1;
                    margin: 0;
                }

                /* Chart card */
                .db-card {
                    background: #fff; border-radius: 20px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.08);
                    padding: 1.75rem; position: relative; overflow: hidden;
                    margin-bottom: 1.25rem;
                }

                .db-card::before {
                    content: ''; position: absolute;
                    top: 0; left: 0; right: 0; height: 3px;
                    background: linear-gradient(90deg, #6366f1, #f97316);
                    border-radius: 20px 20px 0 0;
                }

                .db-section {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.69rem; font-weight: 600;
                    letter-spacing: 0.12em; text-transform: uppercase;
                    color: #6366f1; margin: 0 0 1.1rem;
                    display: flex; align-items: center; gap: 0.5rem;
                }

                .db-section::after {
                    content: ''; flex: 1; height: 1px;
                    background: linear-gradient(90deg, #e0e7ff, transparent);
                }

                .db-divider {
                    border: none; border-top: 1px dashed #e5e7eb;
                    margin: 0 0 1.25rem;
                }

                .db-chart-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.25rem; margin-bottom: 1.25rem;
                }

                @media (max-width: 768px) {
                    .db-chart-row { grid-template-columns: 1fr; }
                }

                /* Staff table */
                .db-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 0.83rem; }
                .db-table thead tr { background: #f5f3ff; }
                .db-table th {
                    font-family: 'Sora', sans-serif; font-size: 0.67rem; font-weight: 600;
                    letter-spacing: 0.1em; text-transform: uppercase; color: #6366f1;
                    padding: 0.65rem 1rem; text-align: left;
                    border-bottom: 1.5px solid #e0e7ff;
                }
                .db-table th:first-child { border-radius: 10px 0 0 0; }
                .db-table th:last-child  { border-radius: 0 10px 0 0; }
                .db-table tbody tr:hover { background: #fafafa; }
                .db-table td {
                    padding: 0.65rem 1rem; color: #374151;
                    vertical-align: middle; border-bottom: 1px solid #f3f4f6;
                }
                .db-table tbody tr:last-child td { border-bottom: none; }

                .db-avatar {
                    width: 30px; height: 30px; border-radius: 50%;
                    object-fit: cover; border: 2px solid #e0e7ff;
                }

                .db-chip {
                    display: inline-block;
                    background: rgba(99,102,241,0.1); color: #6366f1;
                    border-radius: 999px; padding: 0.15rem 0.6rem;
                    font-size: 0.71rem; font-weight: 500;
                }

                .db-status {
                    display: inline-flex; align-items: center; gap: 0.3rem;
                    border-radius: 999px; padding: 0.18rem 0.65rem;
                    font-size: 0.71rem; font-weight: 500;
                }
                .db-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
                .db-status.active   { background: rgba(16,185,129,0.1); color: #059669; }
                .db-status.active .db-status-dot   { background: #10b981; }
                .db-status.inactive { background: rgba(244,63,94,0.1);  color: #f43f5e; }
                .db-status.inactive .db-status-dot { background: #f43f5e; }
            `}</style>

            <div className="db-page">

                {/* Header */}
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#a5b4fc)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="fa-solid fa-gauge-high text-white" />
                    </div>
                    <div>
                        <h2 className="db-heading mb-0">Dashboard Doanh Nghiệp</h2>
                        <p className="db-sub mb-0">Thống kê hoạt động tổng quan</p>
                    </div>
                </div>


                <div className="db-kpi-grid">
                    {[
                        { cls: "purple", icon: "fa-solid fa-file-lines", label: "Tổng bài đăng", value: data.postJobs?.length ?? 0 },
                        { cls: "green", icon: "fa-solid fa-circle-check", label: "Bài đang active", value: activeJobs },
                        { cls: "orange", icon: "fa-solid fa-receipt", label: "Tổng chi tiêu", value: `$${totalRevenue.toLocaleString()}` },
                        { cls: "purple", icon: "fa-solid fa-users", label: "Nhân viên", value: data.staff?.length ?? 0 },
                    ].map((k, i) => (
                        <div key={i} className={`db-kpi kpi-${k.cls}`}>
                            <div className={`db-kpi-icon ${k.cls}`}>
                                <i className={k.icon} />
                            </div>
                            <div>
                                <p className="db-kpi-label">{k.label}</p>
                                <p className="db-kpi-value">{k.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="db-chart-row">

                    <div className="db-card">
                        <p className="db-section"><i className="fa-solid fa-chart-bar" /> Bài đăng theo ngành</p>
                        <hr className="db-divider" />
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={jobChart} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="name" tick={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <Tooltip content={<TooltipBar />} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
                                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={44} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>


                    <div className="db-card">
                        <p className="db-section"><i className="fa-solid fa-chart-line" />Chi tiêu theo ngày</p>
                        <hr className="db-divider" />
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={revenueChart} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="date" tick={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <Tooltip content={<TooltipArea />} />
                                <Area type="monotone" dataKey="total" stroke="#f97316" strokeWidth={2.5} fill="url(#revGrad)"
                                    dot={{ r: 4, fill: "#f97316", strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 6, fill: "#f97316", stroke: "#fff", strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>


                <div className="db-card">
                    <p className="db-section"><i className="fa-solid fa-chart-line"></i>Danh sách nhân viên</p>
                    <hr className="db-divider" />
                    <div style={{ overflowX: "auto" }}>
                        <table className="db-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Nhân viên</th>
                                    <th>Email</th>
                                    <th>SĐT</th>
                                    <th>Vai trò</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày tạo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.staff?.length > 0 ? data.staff.map((s, i) => (
                                    <tr key={s._id}>
                                        <td style={{ color: "#9ca3af", fontWeight: 500 }}>{i + 1}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <img src={s.avatar} className="db-avatar" alt="" />
                                                <span style={{ fontWeight: 600, color: "#1e1b4b" }}>{s.username}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: "0.8rem", color: "#6b7280" }}>{s.email}</td>
                                        <td style={{ fontSize: "0.8rem", color: "#6b7280" }}>{s.phone}</td>
                                        <td><span className="db-chip">{s.role}</span></td>
                                        <td>
                                            <span className={`db-status ${s.status === "Active" ? "active" : "inactive"}`}>
                                                <span className="db-status-dot" />
                                                {s.status}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
                                            {new Date(s.createdAt).toLocaleDateString("vi-VN")}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="text-center text-muted py-4">
                                            <i className="bi bi-people fs-3 d-block mb-2 text-secondary opacity-50" />
                                            Không có nhân viên nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="db-card">
                    <p className="db-section"><i className="fa-solid fa-file-lines" />Danh sách bài đăng</p>
                    <hr className="db-divider" />
                    <div style={{ overflowX: "auto" }}>
                        <table className="db-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tiêu đề</th>
                                    <th>Ngành nghề</th>
                                    <th>Địa điểm</th>
                                    <th>Lượt xem</th>
                                    <th>CV nhận</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.postJobs?.length > 0 ? data.postJobs.map((j, i) => (
                                    <tr key={j._id}>
                                        <td style={{ color: "#9ca3af", fontWeight: 500 }}>{i + 1}</td>
                                        <td style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600, color: "#1e1b4b" }} title={j.title}>
                                            {j.title}
                                        </td>
                                        <td><span className="db-chip">{j.jobs}</span></td>
                                        <td style={{ fontSize: "0.8rem", color: "#6b7280" }}>{j.location}</td>
                                        <td style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                                            <i className="fa-solid fa-eye me-1" /> {j.view ?? 0}
                                        </td>
                                        <td style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                                            <i className="fa-solid fa-file-user me-1" /> {j.listCV?.length ?? 0}
                                        </td>
                                        <td>
                                            <span className={`db-status ${j.status === "active" ? "active" : "inactive"}`}>
                                                <span className="db-status-dot" />
                                                {j.status === "active" ? "Active" : "Chờ duyệt"}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="text-center text-muted py-4">Không có bài đăng nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    );
};

export default DashboardBusiness;
