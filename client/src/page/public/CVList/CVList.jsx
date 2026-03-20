import { listCVupload } from "../../../api/user";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import path from "../../../ultils/path";

const statusMap = {
    pendding: { label: "Chờ phản hồi", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", dot: "#f59e0b" },
    unactive: { label: "Đã từ chối", color: "#f43f5e", bg: "rgba(244,63,94,0.1)", dot: "#f43f5e" },
    active: { label: "Chấp nhận · Liên hệ", color: "#10b981", bg: "rgba(16,185,129,0.1)", dot: "#10b981" },
};

const CVList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await listCVupload();
                if (res.success) setData(res.data);
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .cv-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 60%, #fff0f6 100%);
                    padding: 3rem 1rem;
                    font-family: 'Inter', sans-serif;
                }

                .cv-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #1e1b4b;
                    text-align: center;
                    margin-bottom: 0.35rem;
                    letter-spacing: -0.02em;
                }

                .cv-sub {
                    text-align: center;
                    font-size: 0.8rem;
                    color: #9ca3af;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 2.5rem;
                }

                /* ── Card ── */
                .cv-card {
                    background: #fff;
                    border-radius: 16px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 4px 20px rgba(99,102,241,0.06);
                    padding: 1.4rem 1.5rem 1.2rem;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .cv-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 32px rgba(99,102,241,0.13);
                }

                /* top accent bar */
                .cv-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #6366f1, #f472b6);
                    border-radius: 16px 16px 0 0;
                }

                .cv-job-title {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.98rem;
                    font-weight: 600;
                    color: #1e1b4b;
                    text-decoration: none;
                    display: block;
                    margin-bottom: 0.5rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    transition: color 0.2s;
                }

                .cv-job-title:hover { color: #6366f1; }

                .cv-company {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.82rem;
                    color: #6366f1;
                    text-decoration: none;
                    font-weight: 500;
                    margin-bottom: 0.75rem;
                    transition: opacity 0.2s;
                }

                .cv-company:hover { opacity: 0.75; }

                .cv-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 0.9rem;
                }

                .cv-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    background: #f3f4f6;
                    border-radius: 999px;
                    padding: 0.25rem 0.7rem;
                    font-size: 0.75rem;
                    color: #374151;
                    font-weight: 400;
                }

                .cv-chip i { color: #9ca3af; font-size: 0.7rem; }

                /* ── Divider ── */
                .cv-divider {
                    border: none;
                    border-top: 1px dashed #e5e7eb;
                    margin: 0.75rem 0 0.6rem;
                }

                /* ── Status badge ── */
                .cv-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    border-radius: 999px;
                    padding: 0.28rem 0.75rem;
                    font-size: 0.73rem;
                    font-weight: 500;
                    margin-top: 0.2rem;
                }

                .cv-status-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                /* ── Empty state ── */
                .cv-empty {
                    text-align: center;
                    color: #9ca3af;
                    padding: 4rem 0;
                }

                .cv-empty i {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    display: block;
                    color: #d1d5db;
                }

                /* ── Loading ── */
                .cv-loading {
                    text-align: center;
                    padding: 5rem 0;
                    color: #6366f1;
                }

                .cv-spinner {
                    width: 36px;
                    height: 36px;
                    border: 3px solid #e0e7ff;
                    border-top-color: #6366f1;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin: 0 auto 1rem;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            <div className="cv-page">
                <h2 className="cv-heading">CV đã ứng tuyển</h2>
                <p className="cv-sub">Theo dõi trạng thái hồ sơ của bạn</p>

                {loading ? (
                    <div className="cv-loading">
                        <div className="cv-spinner" />
                        <p style={{ fontSize: "0.85rem" }}>Đang tải dữ liệu...</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className="cv-empty">
                        <i className="fa-regular fa-folder-open" />
                        <p>Bạn chưa ứng tuyển vào công việc nào.</p>
                    </div>
                ) : (
                    <div className="row g-3" style={{ maxWidth: 1100, margin: "0 auto" }}>
                        {data.map(job => (
                            <div key={job._id} className="col-12 col-md-6 col-lg-4">
                                <div className="cv-card">

                                    {/* Title */}
                                    <Link to={`${path.JOB}/${job._id}`} className="cv-job-title">
                                        {job.title}
                                    </Link>

                                    {/* Company */}
                                    <Link to={`${path.COMPANY}/${job.business._id}`} className="cv-company">
                                        <i className="fa-solid fa-building" style={{ fontSize: "0.75rem" }} />
                                        {job.business?.nameBusiness}
                                    </Link>

                                    {/* Meta chips */}
                                    <div className="cv-meta">
                                        <span className="cv-chip">
                                            <i className="fa-solid fa-location-dot" />
                                            {job.location}
                                        </span>
                                        <span className="cv-chip">
                                            <i className="fa-solid fa-calendar-xmark" />
                                            {new Date(job.deadline).toLocaleDateString("vi-VN")}
                                        </span>
                                    </div>

                                    {/* CV statuses */}
                                    {job.listCV.map(cv => {
                                        const s = statusMap[cv.status] || statusMap["pendding"];
                                        return (
                                            <div key={cv._id}>
                                                <hr className="cv-divider" />
                                                <span
                                                    className="cv-status"
                                                    style={{ background: s.bg, color: s.color }}
                                                >
                                                    <span className="cv-status-dot" style={{ background: s.dot }} />
                                                    {s.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default CVList;
