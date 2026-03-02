import { useEffect, useState } from "react";
import { statisticAll } from "../../../api/job";


import {
    BarChart, Bar,
    LineChart, Line,
    XAxis, YAxis, Tooltip,
    CartesianGrid, ResponsiveContainer
} from "recharts";

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
                    Object.keys(jobCounter).map(key => ({
                        name: key,
                        count: jobCounter[key],
                    }))
                );

                const revenueCounter = {};
                repo.invoid?.forEach(item => {
                    revenueCounter[item.typeInvoid] =
                        (revenueCounter[item.typeInvoid] || 0) + item.totalPrice;
                });

                setInvoidChart(
                    Object.keys(revenueCounter).map(key => ({
                        name: key,
                        revenue: revenueCounter[key],
                    }))
                );

            } catch (err) {
                console.log("Error fetch statistic:", err);
            }
        };

        fetchAllData();
    }, []);

    return (
        <div className="container py-4">

            <h1 className="text-center mb-4">📊 Dashboard Tổng Quan</h1>

            {/* ====== BOOTSTRAP GRID THỐNG KÊ ====== */}
            <div className="row g-3">

                <StatBox title="Tổng Bài Đăng" count={data.postjob?.length} color="primary" />
                <StatBox title="Tổng Hóa Đơn" count={data.invoid?.length} color="success" />
                <StatBox title="Người Dùng" count={data.user?.length} color="danger" />
                <StatBox title="Lĩnh Vực Nghề" count={data.jobs?.length} color="warning" />
                <StatBox title="Cấp Bậc" count={data.level?.length} color="info" />
                <StatBox title="Mức Lương" count={data.salaryRange?.length} color="secondary" />
                <StatBox title="Kỹ Năng" count={data.skills?.length} color="dark" />
                <StatBox title="Hình Thức Làm Việc" count={data.worktype?.length} color="primary" />
                <StatBox title="Gói Đăng" count={data.postpackage?.length} color="success" />

            </div>

            {/* ====== BIỂU ĐỒ ====== */}
            <div className="mt-5">
                <h3 className="text-center">📌 Số bài đăng theo lĩnh vực</h3>
                <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={postjobChart}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#0d6efd" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-5">
                <h3 className="text-center">💰 Doanh thu từng gói đăng</h3>
                <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={invoidChart}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#dc3545" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

/* Component BOOTSTRAP CARD */
const StatBox = ({ title, count = 0, color }) => (
    <div className="col-md-4">
        <div className={`card text-white bg-${color} shadow`}>
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <h2 className="card-text fw-bold">{count}</h2>
            </div>
        </div>
    </div>
);

export default DashboardAdmin;