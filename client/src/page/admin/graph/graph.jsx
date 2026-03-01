import { useEffect, useState } from "react";
import { getAllInvoidAdmin } from "../../../api/job";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

const Graph = () => {
    const [dailyData, setDailyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const repo = await getAllInvoidAdmin({});
            const invoices = repo.Invoids || [];

            const groupedDaily = {};
            const groupedMonthly = {};

            invoices.forEach((item) => {
                const date = item.createdAt.split("T")[0]; // YYYY-MM-DD
                const month = date.substring(0, 7); // YYYY-MM

                // Daily
                if (!groupedDaily[date]) groupedDaily[date] = 0;
                groupedDaily[date] += item.totalPrice;

                // Monthly
                if (!groupedMonthly[month]) groupedMonthly[month] = 0;
                groupedMonthly[month] += item.totalPrice;
            });

            // Format daily
            const formattedDaily = Object.keys(groupedDaily).map((date) => ({
                date,
                total: groupedDaily[date],
            }));

            // Format monthly
            const formattedMonthly = Object.keys(groupedMonthly).map((month) => ({
                month,
                total: groupedMonthly[month],
            }));

            setDailyData(formattedDaily.reverse());
            setMonthlyData(formattedMonthly.reverse());
        };

        fetchData();
    }, []);

    return (
        <div className="container py-4">

            {/* ---------------- TITLE ---------------- */}
            <h2 className="fw-bold text-center mb-4">Thống kê doanh thu</h2>

            {/* ----------------- DAILY GRAPH ----------------- */}
            <div className="card shadow-lg border-0 rounded-4 mb-5">
                <div className="card-body">
                    <h5 className="mb-3">Doanh thu theo ngày</h5>

                    <div style={{ width: "100%", height: "380px" }}>
                        <ResponsiveContainer>
                            <LineChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#0d6efd"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ----------------- MONTHLY GRAPH ----------------- */}
            <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body">
                    <h5 className="mb-3">Doanh thu theo tháng</h5>

                    <div style={{ width: "100%", height: "380px" }}>
                        <ResponsiveContainer>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#dc3545"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Graph;