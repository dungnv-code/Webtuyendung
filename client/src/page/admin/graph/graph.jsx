import { useEffect, useState } from "react";
import { getAllInvoidAdmin } from "../../../api/job";
import {
    AreaChart, Area,
    XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

const CustomTooltip = ({ active, payload, label, color }) => {
    if (active && payload?.length) {
        return (
            <div style={{
                background: "#fff", borderRadius: 10, padding: "0.6rem 1rem",
                border: "1px solid #eef0f6", boxShadow: "0 4px 16px rgba(99,102,241,0.12)",
                fontFamily: "'Inter',sans-serif", fontSize: "0.82rem"
            }}>
                <p style={{ color: "#9ca3af", marginBottom: 3 }}>{label}</p>
                <p style={{ color, fontWeight: 700, margin: 0 }}>${payload[0].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

const Graph = () => {
    const [dailyData, setDailyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [mode, setMode] = useState("daily");

    useEffect(() => {
        const fetchData = async () => {
            const repo = await getAllInvoidAdmin({});
            const invoices = repo.Invoids || [];

            const groupedDaily = {};
            const groupedMonthly = {};

            invoices.forEach(item => {
                const date = item.createdAt.split("T")[0];
                const month = date.substring(0, 7);
                groupedDaily[date] = (groupedDaily[date] || 0) + item.totalPrice;
                groupedMonthly[month] = (groupedMonthly[month] || 0) + item.totalPrice;
            });

            const formattedDaily = Object.keys(groupedDaily)
                .sort()
                .map(date => ({ date, total: groupedDaily[date] }));
            const formattedMonthly = Object.keys(groupedMonthly)
                .sort()
                .map(month => ({ month, total: groupedMonthly[month] }));

            setDailyData(formattedDaily);
            setMonthlyData(formattedMonthly);
        };
        fetchData();
    }, []);

    const isDaily = mode === "daily";
    const data = isDaily ? dailyData : monthlyData;
    const dataKey = isDaily ? "date" : "month";
    const total = data.reduce((s, d) => s + d.total, 0);

    const color = isDaily ? "#6366f1" : "#f43f5e";
    const colorEnd = isDaily ? "#06b6d4" : "#f97316";
    const gradId = isDaily ? "areaGradBlue" : "areaGradRed";
    const lineId = isDaily ? "lineGradBlue" : "lineGradRed";

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@300;400;500&display=swap');

                .gr-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 55%, #fff7ed 100%);
                    padding: 1rem 2rem;
                    font-family: 'Inter', sans-serif;
                }

                .gr-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem; font-weight: 700; color: #1e1b4b;
                    text-align: center; margin-bottom: 0.35rem; letter-spacing: -0.02em;
                }

                .gr-sub {
                    text-align: center; font-size: 0.8rem; color: #9ca3af;
                    letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2rem;
                }

                /* Toggle */
                .gr-toggle-wrap {
                    display: flex; justify-content: center; margin-bottom: 0.5rem;
                }

                .gr-toggle {
                    display: flex;
                    background: #f1f5f9;
                    border-radius: 12px;
                    padding: 4px;
                    gap: 4px;
                }

                .gr-toggle-btn {
                    padding: 0.45rem 1.4rem;
                    border-radius: 9px;
                    border: none;
                    cursor: pointer;
                    font-family: 'Sora', sans-serif;
                    font-size: 0.8rem;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    background: transparent;
                    color: #94a3b8;
                    display: flex; align-items: center; gap: 0.4rem;
                }

                .gr-toggle-btn.active-blue {
                    background: #fff;
                    color: #6366f1;
                    box-shadow: 0 2px 8px rgba(99,102,241,0.15);
                }

                .gr-toggle-btn.active-red {
                    background: #fff;
                    color: #f43f5e;
                    box-shadow: 0 2px 8px rgba(244,63,94,0.15);
                }


                .gr-summary-card {
                    display: flex; align-items: center; gap: 1rem;
                    background: #fff; border-radius: 16px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 4px 20px rgba(99,102,241,0.06);
                    padding: 0.5rem 1rem;
                    margin-bottom: 0.5rem;
                    position: relative; overflow: hidden;
                    transition: all 0.3s ease;
                }

                .gr-summary-card::after {
                    content: ''; position: absolute;
                    bottom: 0; left: 0; right: 0; height: 3px;
                    border-radius: 0 0 16px 16px;
                    transition: background 0.3s ease;
                }

                .gr-summary-card.blue::after  { background: linear-gradient(90deg, #6366f1, #06b6d4); }
                .gr-summary-card.red::after   { background: linear-gradient(90deg, #f43f5e, #f97316); }

                .gr-summary-icon {
                    width: 46px; height: 46px; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1rem; flex-shrink: 0;
                    transition: all 0.3s ease;
                }

                .gr-summary-icon.blue { background: rgba(99,102,241,0.1); color: #6366f1; }
                .gr-summary-icon.red  { background: rgba(244,63,94,0.1);  color: #f43f5e; }

                .gr-summary-label {
                    font-size: 0.7rem; color: #9ca3af;
                    text-transform: uppercase; letter-spacing: 0.08em;
                    font-weight: 500; margin-bottom: 0.2rem;
                }

                .gr-summary-value {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.35rem; font-weight: 700; color: #1e1b4b;
                }

                /* Chart card */
                .gr-chart-card {
                    background: #fff; border-radius: 20px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.07);
                    padding: 2rem;
                    position: relative; overflow: hidden;
                }

                .gr-chart-card::before {
                    content: ''; position: absolute;
                    top: 0; left: 0; right: 0; height: 3px;
                    border-radius: 20px 20px 0 0;
                    transition: background 0.3s ease;
                }

                .gr-chart-card.blue::before { background: linear-gradient(90deg, #6366f1, #06b6d4); }
                .gr-chart-card.red::before  { background: linear-gradient(90deg, #f43f5e, #f97316); }

                .gr-chart-header {
                    display: flex; align-items: flex-start;
                    justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;
                }

                .gr-chart-title {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.95rem; font-weight: 600; color: #1e1b4b; margin-bottom: 0.2rem;
                }

                .gr-chart-desc { font-size: 0.75rem; color: #9ca3af; }

                .gr-chart-badge {
                    font-size: 0.72rem; font-weight: 600; border-radius: 999px;
                    padding: 0.25rem 0.75rem; display: inline-flex; align-items: center; gap: 0.3rem;
                }

                .gr-chart-badge.blue { background: rgba(99,102,241,0.1); color: #6366f1; }
                .gr-chart-badge.red  { background: rgba(244,63,94,0.1);  color: #f43f5e; }
            `}</style>

            <div className="gr-page">
                <h2 className="gr-heading mb-2">Thống kê doanh thu</h2>

                <div className="gr-toggle-wrap">
                    <div className="gr-toggle">
                        <button
                            className={`gr-toggle-btn ${mode === "daily" ? "active-blue" : ""}`}
                            onClick={() => setMode("daily")}
                        >
                            <i className="fa-solid fa-calendar-day" />
                            Theo ngày
                        </button>
                        <button
                            className={`gr-toggle-btn ${mode === "monthly" ? "active-red" : ""}`}
                            onClick={() => setMode("monthly")}
                        >
                            <i className="fa-solid fa-calendar-month" />
                            Theo tháng
                        </button>
                    </div>
                </div>

                {/* Summary card */}
                <div className={`gr-summary-card ${isDaily ? "blue" : "red"}`}>
                    <div className={`gr-summary-icon ${isDaily ? "blue" : "red"}`}>
                        <i className={`fa-solid ${isDaily ? "fa-calendar-day" : "fa-calendar-month"}`} />
                    </div>
                    <div>
                        <p className="gr-summary-label">
                            Tổng doanh thu {isDaily ? "theo ngày" : "theo tháng"} (tích lũy)
                        </p>
                        <p className="gr-summary-value">${total.toLocaleString()}</p>
                    </div>
                </div>

                {/* Chart */}
                <div className={`gr-chart-card ${isDaily ? "blue" : "red"}`}>
                    <div className="gr-chart-header">
                        <div>
                            <p className="gr-chart-title">
                                Doanh thu theo {isDaily ? "ngày" : "tháng"}
                            </p>
                            <p className="gr-chart-desc">
                                Tổng doanh thu ghi nhận từng {isDaily ? "ngày" : "tháng"} trong hệ thống
                            </p>
                        </div>
                        <span className={`gr-chart-badge ${isDaily ? "blue" : "red"}`}>
                            <i className="fa-solid fa-circle" style={{ fontSize: "0.5rem" }} />
                            {data.length} {isDaily ? "ngày" : "tháng"}
                        </span>
                    </div>

                    <ResponsiveContainer width="100%" height={360}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id={lineId} x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor={color} />
                                    <stop offset="100%" stopColor={colorEnd} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey={dataKey}
                                tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "Inter" }}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "Inter" }}
                            />
                            <Tooltip content={<CustomTooltip color={color} />} />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke={`url(#${lineId})`}
                                strokeWidth={3}
                                fill={`url(#${gradId})`}
                                dot={{ fill: color, r: 4, strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 6, fill: colorEnd, stroke: "#fff", strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
};

export default Graph;
