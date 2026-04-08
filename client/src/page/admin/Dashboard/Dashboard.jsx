import { useEffect, useState } from "react";
import { statisticAll } from "../../../api/job";
import {
    BarChart, Bar,
    LineChart, Line,
    XAxis, YAxis, Tooltip,
    CartesianGrid, ResponsiveContainer
} from "recharts";

import {
    AppstoreOutlined
} from '@ant-design/icons';

const DashboardAdmin = () => {
    const [data, setData] = useState({});
    const [postjobChart, setPostjobChart] = useState([]);
    const [invoidChart, setInvoidChart] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const repo = await statisticAll({});
                if (!repo) return;
                setData(repo);

                const jobCounter = {};
                repo.postjob?.forEach(item => {
                    jobCounter[item.jobs] = (jobCounter[item.jobs] || 0) + 1;
                });
                setPostjobChart(
                    Object.keys(jobCounter).map(key => ({ name: key, count: jobCounter[key] }))
                );

                const revenueCounter = {};
                repo.invoid?.forEach(item => {
                    revenueCounter[item.typeInvoid] =
                        (revenueCounter[item.typeInvoid] || 0) + item.totalPrice;
                });
                setInvoidChart(
                    Object.keys(revenueCounter).map(key => ({ name: key, revenue: revenueCounter[key] }))
                );
            } catch (err) {
                console.log("Error fetch statistic:", err);
            }
        };
        fetchAllData();
    }, []);

    const totalRevenue = invoidChart.reduce((s, i) => s + i.revenue, 0);

    const stats = [
        { title: "Tổng bài đăng", value: data.postjob?.length, icon: "fa-solid fa-file-lines", cls: "purple" },
        { title: "Hóa đơn", value: data.invoid?.length, icon: "fa-solid fa-receipt", cls: "orange" },
        { title: "Người dùng", value: data.user?.length, icon: "fa-solid fa-users", cls: "green" },
        { title: "Lĩnh vực nghề", value: data.jobs?.length, icon: "fa-solid fa-briefcase", cls: "red" },
        { title: "Cấp bậc", value: data.level?.length, icon: "fa-solid fa-chart-simple", cls: "purple" },
        { title: "Mức lương", value: data.salaryRange?.length, icon: "fa-solid fa-sack-dollar", cls: "orange" },
        { title: "Kỹ năng", value: data.skills?.length, icon: "fa-solid fa-wand-magic-sparkles", cls: "green" },
        { title: "Hình thức làm việc", value: data.worktype?.length, icon: "fa-solid fa-clock", cls: "red" },
        { title: "Gói đăng", value: data.postpackage?.length, icon: "fa-solid fa-box-open", cls: "purple" },
    ];

    const CustomTooltipBar = ({ active, payload, label }) => {
        if (active && payload?.length) return (
            <div style={{ background: "#fff", border: "1px solid #eef0f6", borderRadius: 12, padding: "0.6rem 1rem", boxShadow: "0 4px 16px rgba(99,102,241,0.12)", fontFamily: "'Inter',sans-serif", fontSize: "0.8rem" }}>
                <p style={{ color: "#9ca3af", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.68rem", fontWeight: 600 }}>{label}</p>
                <p style={{ color: "#6366f1", fontWeight: 700, margin: 0 }}>{payload[0].value} bài đăng</p>
            </div>
        );
        return null;
    };

    const CustomTooltipLine = ({ active, payload, label }) => {
        if (active && payload?.length) return (
            <div style={{ background: "#fff", border: "1px solid #eef0f6", borderRadius: 12, padding: "0.6rem 1rem", boxShadow: "0 4px 16px rgba(249,115,22,0.12)", fontFamily: "'Inter',sans-serif", fontSize: "0.8rem" }}>
                <p style={{ color: "#9ca3af", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.68rem", fontWeight: 600 }}>{label}</p>
                <p style={{ color: "#f97316", fontWeight: 700, margin: 0 }}>${payload[0].value?.toLocaleString()}</p>
            </div>
        );
        return null;
    };

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
                    font-size: 1.7rem; font-weight: 700;
                    color: #1e1b4b; letter-spacing: -0.02em; margin-bottom: 0.3rem;
                }

                .db-sub {
                    font-size: 0.8rem; color: #9ca3af;
                    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem;
                }

                .db-kpi-strip {
                    display: flex; gap: 1rem;
                    margin-bottom: 1.5rem; flex-wrap: wrap;
                }

                .db-kpi {
                    flex: 1; min-width: 160px;
                    background: #fff; border-radius: 16px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 4px 16px rgba(99,102,241,0.07);
                    padding: 1.15rem 1.4rem;
                    position: relative; overflow: hidden;
                }

                .db-kpi::before {
                    content: ''; position: absolute;
                    top: 0; left: 0; right: 0; height: 3px;
                    border-radius: 16px 16px 0 0;
                }

                .db-kpi.kpi-purple::before { background: #6366f1; }
                .db-kpi.kpi-orange::before { background: #f97316; }
                .db-kpi.kpi-green::before  { background: #10b981; }

                .db-kpi-label {
                    font-size: 0.7rem; font-weight: 600;
                    text-transform: uppercase; letter-spacing: 0.1em;
                    color: #9ca3af; margin-bottom: 0.4rem;
                }

                .db-kpi-value {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.75rem; font-weight: 700;
                    color: #1e1b4b; line-height: 1; margin-bottom: 0.3rem;
                }

                .db-kpi-sub {
                    font-size: 0.72rem; color: #9ca3af;
                    display: flex; align-items: center; gap: 0.3rem;
                    margin: 0;
                }

                .db-stat-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 1rem; margin-bottom: 2rem;
                }

                .db-stat {
                    background: #fff; border-radius: 14px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 4px 16px rgba(99,102,241,0.06);
                    padding: 1rem 1.2rem;
                    display: flex; align-items: center; gap: 0.85rem;
                    transition: transform 0.15s, box-shadow 0.15s;
                    cursor: default;
                }

                .db-stat:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(99,102,241,0.12);
                }

                .db-stat-icon {
                    width: 40px; height: 40px; border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1rem; flex-shrink: 0;
                }

                .db-stat-icon.purple { background: rgba(99,102,241,0.12); color: #6366f1; }
                .db-stat-icon.orange { background: rgba(249,115,22,0.12);  color: #f97316; }
                .db-stat-icon.green  { background: rgba(16,185,129,0.12);  color: #10b981; }
                .db-stat-icon.red    { background: rgba(239,68,68,0.12);   color: #ef4444; }

                .db-stat-label {
                    font-size: 0.7rem; color: #9ca3af;
                    text-transform: uppercase; letter-spacing: 0.07em;
                    font-weight: 500; margin-bottom: 0.1rem;
                }

                .db-stat-value {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.25rem; font-weight: 700; color: #1e1b4b;
                    margin: 0;
                }

                .db-card {
                    background: #fff; border-radius: 20px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.08);
                    padding: 1.75rem; position: relative; overflow: hidden;
                    margin-bottom: 1.5rem;
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
                    color: #6366f1; margin: 0 0 0.4rem;
                    display: flex; align-items: center; gap: 0.5rem;
                }

                .db-section::after {
                    content: ''; flex: 1; height: 1px;
                    background: linear-gradient(90deg, #e0e7ff, transparent);
                }

                .db-chart-title {
                    font-family: 'Sora', sans-serif;
                    font-size: 1rem; font-weight: 700;
                    color: #1e1b4b; margin-bottom: 1.25rem;
                }

                .db-divider {
                    border: none; border-top: 1px dashed #e5e7eb;
                    margin: 0.75rem 0 1.25rem;
                }

                .db-chart-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem; margin-bottom: 1.5rem;
                }

                @media (max-width: 768px) {
                    .db-chart-row { grid-template-columns: 1fr; }
                    .db-kpi-strip { flex-direction: column; }
                }
            `}</style>

            <div className="db-page">

                {/* Header */}
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#a5b4fc)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <AppstoreOutlined />
                    </div>
                    <div>
                        <h2 className="db-heading mb-0">Dashboard Tổng Quan</h2>
                        <p className="db-sub mb-0">Thống kê hoạt động</p>
                    </div>
                </div>
                <div className="db-kpi-strip">
                    <div className="db-kpi kpi-purple">
                        <p className="db-kpi-label">Tổng bài đăng</p>
                        <p className="db-kpi-value">{data.postjob?.length ?? 0}</p>
                        <p className="db-kpi-sub">
                            <i className="fa-solid fa-file-lines" style={{ color: "#6366f1" }} />
                            Tất cả bài tuyển dụng
                        </p>
                    </div>
                    <div className="db-kpi kpi-orange">
                        <p className="db-kpi-label">Tổng doanh thu</p>
                        <p className="db-kpi-value">${totalRevenue.toLocaleString()}</p>
                        <p className="db-kpi-sub">
                            <i className="fa-solid fa-receipt" style={{ color: "#f97316" }} />
                            Từ {data.invoid?.length ?? 0} hóa đơn
                        </p>
                    </div>
                    <div className="db-kpi kpi-green">
                        <p className="db-kpi-label">Người dùng</p>
                        <p className="db-kpi-value">{data.user?.length ?? 0}</p>
                        <p className="db-kpi-sub">
                            <i className="fa-solid fa-users" style={{ color: "#10b981" }} />
                            Tài khoản đã đăng ký
                        </p>
                    </div>
                </div>

                <div className="db-stat-grid">
                    {stats.map((s, i) => (
                        <div className="db-stat" key={i}>
                            <div className={`db-stat-icon ${s.cls}`}>
                                <i className={s.icon} />
                            </div>
                            <div>
                                <p className="db-stat-label">{s.title}</p>
                                <p className="db-stat-value">{s.value ?? 0}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="db-chart-row">
                    <div className="db-card">
                        <p className="db-section">
                            <i className="fa-solid fa-chart-bar" />Bài đăng theo lĩnh vực
                        </p>
                        <hr className="db-divider" />
                        <p className="db-chart-title">Số bài đăng theo ngành nghề</p>
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={postjobChart} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="name" tick={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltipBar />} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
                                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={48} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="db-card">
                        <p className="db-section">
                            <i className="fa-solid fa-chart-line" />Doanh thu theo gói
                        </p>
                        <hr className="db-divider" />
                        <p className="db-chart-title">Tổng doanh thu theo loại hóa đơn</p>
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={invoidChart} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="name" tick={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltipLine />} />
                                <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5}
                                    dot={{ r: 5, fill: "#f97316", strokeWidth: 0 }} activeDot={{ r: 7 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Full-width bar chart */}
                <div className="db-card">
                    <p className="db-section">
                        <i className="fa-solid fa-boxes-stacked" />Tổng quan hệ thống
                    </p>
                    <hr className="db-divider" />
                    <p className="db-chart-title">So sánh số liệu các danh mục</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                            layout="vertical"
                            data={[
                                { name: "Lĩnh vực", value: data.jobs?.length ?? 0 },
                                { name: "Cấp bậc", value: data.level?.length ?? 0 },
                                { name: "Mức lương", value: data.salaryRange?.length ?? 0 },
                                { name: "Kỹ năng", value: data.skills?.length ?? 0 },
                                { name: "Hình thức", value: data.worktype?.length ?? 0 },
                                { name: "Gói đăng", value: data.postpackage?.length ?? 0 },
                            ]}
                            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                            <XAxis type="number" tick={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" width={80} tick={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                            <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                                <div style={{ background: "#fff", border: "1px solid #eef0f6", borderRadius: 12, padding: "0.6rem 1rem", boxShadow: "0 4px 16px rgba(99,102,241,0.12)", fontFamily: "'Inter',sans-serif", fontSize: "0.8rem" }}>
                                    <p style={{ color: "#9ca3af", marginBottom: 2, fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                                    <p style={{ color: "#10b981", fontWeight: 700, margin: 0 }}>{payload[0].value} mục</p>
                                </div>
                            ) : null} cursor={{ fill: "rgba(16,185,129,0.05)" }} />
                            <Bar dataKey="value" fill="#10b981" radius={[0, 6, 6, 0]} maxBarSize={28} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div >
        </>
    );
};

export default DashboardAdmin;
