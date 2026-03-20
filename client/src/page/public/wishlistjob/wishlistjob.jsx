import { useState, useEffect } from "react";
import { wishlistjob } from "../../../api/user";
import { Link } from "react-router-dom";
import path from "../../../ultils/path";

const Wishlistjob = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await wishlistjob();
                setData(res.data || []);
            } catch (error) {
                console.log("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const getDaysRemaining = (deadline) => {
        const distance = new Date(deadline).getTime() - Date.now();
        if (distance <= 0) return { label: "Đã hết hạn", expired: true };
        const days = Math.ceil(distance / (1000 * 60 * 60 * 24));
        return { label: `Còn ${days} ngày`, expired: false };
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .wj-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 60%, #fff7ed 100%);
                    padding: 3rem 1rem;
                    font-family: 'Inter', sans-serif;
                }

                .wj-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #1e1b4b;
                    text-align: center;
                    margin-bottom: 0.35rem;
                    letter-spacing: -0.02em;
                }

                .wj-sub {
                    text-align: center;
                    font-size: 0.8rem;
                    color: #9ca3af;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 2.5rem;
                }

                /* ── Grid ── */
                .wj-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.25rem;
                    max-width: 1100px;
                    margin: 0 auto;
                }

                /* ── Card ── */
                .wj-card {
                    background: #fff;
                    border-radius: 18px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 4px 20px rgba(99,102,241,0.06);
                    padding: 1.25rem 1.3rem 1.1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.85rem;
                    transition: transform 0.22s, box-shadow 0.22s;
                    position: relative;
                    overflow: hidden;
                }

                .wj-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 14px 36px rgba(99,102,241,0.13);
                }

                /* top accent bar */
                .wj-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #6366f1, #f97316);
                    border-radius: 18px 18px 0 0;
                }

                /* ── Top row: image + info ── */
                .wj-top {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                }

                .wj-img {
                    width: 52px;
                    height: 52px;
                    border-radius: 12px;
                    object-fit: cover;
                    flex-shrink: 0;
                    border: 1px solid #e5e7eb;
                    background: #f3f4f6;
                }

                .wj-info {
                    flex: 1;
                    min-width: 0;
                }

                .wj-title {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #1e1b4b;
                    text-decoration: none;
                    display: block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-bottom: 0.45rem;
                    transition: color 0.2s;
                    line-height: 1.3;
                }

                .wj-title:hover { color: #6366f1; }

                .wj-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .wj-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-size: 0.74rem;
                    color: #6b7280;
                    background: #f9fafb;
                    border-radius: 999px;
                    padding: 0.2rem 0.65rem;
                    width: fit-content;
                    max-width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .wj-chip i {
                    color: #a5b4fc;
                    font-size: 0.68rem;
                    flex-shrink: 0;
                }

                /* ── Divider ── */
                .wj-divider {
                    border: none;
                    border-top: 1px dashed #e5e7eb;
                    margin: 0;
                }

                /* ── Footer row ── */
                .wj-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.5rem;
                }

                /* workType badge */
                .wj-badge {
                    font-size: 0.71rem;
                    font-weight: 500;
                    padding: 0.22rem 0.7rem;
                    border-radius: 999px;
                    background: rgba(99,102,241,0.1);
                    color: #6366f1;
                    letter-spacing: 0.02em;
                    white-space: nowrap;
                }

                /* deadline */
                .wj-deadline {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    font-size: 0.73rem;
                    font-weight: 500;
                    border-radius: 999px;
                    padding: 0.22rem 0.7rem;
                }

                .wj-deadline.active {
                    background: rgba(16,185,129,0.1);
                    color: #059669;
                }

                .wj-deadline.expired {
                    background: rgba(244,63,94,0.1);
                    color: #f43f5e;
                }

                .wj-deadline i { font-size: 0.65rem; }

                /* ── Loading ── */
                .wj-loading {
                    text-align: center;
                    padding: 5rem 0;
                    color: #6366f1;
                }

                .wj-spinner {
                    width: 36px;
                    height: 36px;
                    border: 3px solid #e0e7ff;
                    border-top-color: #6366f1;
                    border-radius: 50%;
                    animation: wjspin 0.8s linear infinite;
                    margin: 0 auto 1rem;
                }

                @keyframes wjspin { to { transform: rotate(360deg); } }

                /* ── Empty ── */
                .wj-empty {
                    text-align: center;
                    color: #9ca3af;
                    padding: 4rem 0;
                    grid-column: 1 / -1;
                }

                .wj-empty i {
                    font-size: 2.5rem;
                    display: block;
                    margin-bottom: 0.75rem;
                    color: #d1d5db;
                }
            `}</style>

            <div className="wj-page">
                <h2 className="wj-heading">Công việc yêu thích</h2>
                <p className="wj-sub">Những vị trí bạn đang quan tâm</p>

                {loading ? (
                    <div className="wj-loading">
                        <div className="wj-spinner" />
                        <p style={{ fontSize: "0.85rem" }}>Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <div className="wj-grid">
                        {data.length === 0 ? (
                            <div className="wj-empty">
                                <i className="fa-regular fa-heart" />
                                <p>Chưa có công việc yêu thích nào.</p>
                            </div>
                        ) : (
                            data.map((job) => {
                                const deadline = getDaysRemaining(job.deadline);
                                return (
                                    <div className="wj-card" key={job._id}>
                                        {/* Top row */}
                                        <div className="wj-top">
                                            <img src={job.imageCover} className="wj-img" alt="" />
                                            <div className="wj-info">
                                                <Link to={`${path.JOB}/${job._id}`} className="wj-title">
                                                    {job.title}
                                                </Link>
                                                <div className="wj-meta">
                                                    <span className="wj-chip">
                                                        <i className="fa-solid fa-layer-group" />
                                                        {job.joblevel}
                                                    </span>
                                                    <span className="wj-chip">
                                                        <i className="fa-solid fa-location-dot" />
                                                        {job.location}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <hr className="wj-divider" />

                                        {/* Footer */}
                                        <div className="wj-footer">
                                            <span className="wj-badge">{job.workType}</span>
                                            <span className={`wj-deadline ${deadline.expired ? "expired" : "active"}`}>
                                                <i className="fa-solid fa-clock" />
                                                {deadline.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Wishlistjob;
