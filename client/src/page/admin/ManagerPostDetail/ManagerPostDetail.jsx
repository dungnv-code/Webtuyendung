import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { changeStatusPostjobs, getDetailPostjobs } from "../../../api/job";
import { toast } from "react-toastify";
import { SwapOutlined } from "@ant-design/icons";

const ManagerPostDetail = () => {
    const { idp } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusLoading, setStatusLoading] = useState(false);

    const fetchPostDetail = async () => {
        try {
            const res = await getDetailPostjobs(idp);
            setPost(res.data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPostDetail(); }, [idp]);

    const handleChangeStatus = async () => {
        if (!post) return;
        setStatusLoading(true);
        try {
            await changeStatusPostjobs(post._id);
            await fetchPostDetail();
            toast.success("Cập nhật trạng thái thành công!");
        } catch (err) {
            toast.error("Cập nhật trạng thái thất bại!");
        } finally {
            setStatusLoading(false);
        }
    };

    const statusMap = !post ? {} :
        post.status === "active" ? { label: "Đã duyệt", cls: "approved", bg: "rgba(16,185,129,0.1)", color: "#059669", dot: "#10b981" } :
            post.status === "rejected" ? { label: "Đã từ chối", cls: "rejected", bg: "rgba(244,63,94,0.1)", color: "#f43f5e", dot: "#f43f5e" } :
                { label: "Chờ kiểm duyệt", cls: "pending", bg: "rgba(245,158,11,0.1)", color: "#d97706", dot: "#f59e0b" };

    if (loading) return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
            <div className="spinner-border" style={{ color: "#6366f1" }} role="status" />
            <p className="mt-3 text-muted small">Đang tải dữ liệu...</p>
        </div>
    );


    if (!post) return (
        <div className="d-flex flex-column align-items-center justify-content-center text-muted" style={{ minHeight: "60vh" }}>
            <i className="fa-regular fa-file-lines fs-1 mb-3" style={{ color: "#d1d5db" }} />
            <p>Không tìm thấy bài đăng!</p>
        </div>
    );

    const infoRows = [
        { icon: "fa-heading", label: "Tiêu đề", val: post.title },
        { icon: "fa-link", label: "Slug", val: <code className="text-muted small">{post.slug}</code> },
        { icon: "fa-briefcase", label: "Ngành nghề", val: post.jobs },
        { icon: "fa-user-clock", label: "Kinh nghiệm", val: post.experience },
        { icon: "fa-medal", label: "Cấp bậc", val: post.joblevel },
        { icon: "fa-laptop-house", label: "Hình thức làm việc", val: post.workType },
        { icon: "fa-dollar-sign", label: "Mức lương", val: post.salaryRange?.salaryRange },
        { icon: "fa-location-dot", label: "Địa điểm", val: post.location },
        { icon: "fa-users", label: "Số lượng tuyển", val: post.quantity },
        { icon: "fa-calendar-xmark", label: "Deadline", val: new Date(post.deadline).toLocaleDateString("vi-VN") },
        { icon: "fa-calendar", label: "Ngày tạo", val: new Date(post.createdAt).toLocaleString("vi-VN") },
        { icon: "fa-calendar-check", label: "Ngày cập nhật", val: new Date(post.updatedAt).toLocaleString("vi-VN") },
    ];

    const Section = ({ icon, children }) => (
        <div className="d-flex align-items-center gap-2 mb-3">
            <i className={`fa-solid ${icon}`} style={{ color: "#6366f1", fontSize: 13 }} />
            <span style={{ fontFamily: "'Sora',sans-serif", fontSize: "0.69rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6366f1" }}>
                {children}
            </span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,#e0e7ff,transparent)" }} />
        </div>
    );

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .mpd-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 55%, #f0fdf4 100%);
                    padding: 1rem 1rem;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .mpd-inner { width: 100%; max-width: 860px; }

                .mpd-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem; font-weight: 700;
                    color: #1e1b4b; letter-spacing: -0.02em;
                    margin-bottom: 0.3rem;
                }

                .mpd-sub {
                    font-size: 0.8rem; color: #9ca3af;
                    letter-spacing: 0.1em; text-transform: uppercase;
                    margin-bottom: 1rem;
                }

                /* Same card style as mp-card in ManagerPost */
                .mpd-card {
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.08);
                    padding: 1.75rem;
                    position: relative;
                    overflow: hidden;
                    margin-bottom: 1rem;
                }

                .mpd-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 3px;
                    background: linear-gradient(90deg, #6366f1, #10b981);
                    border-radius: 20px 20px 0 0;
                }

                /* Row items */
                .mpd-row-item {
                    display: flex; align-items: flex-start; gap: 0.75rem;
                    padding: 0.6rem 0; border-bottom: 1px solid #f3f4f6;
                }
                .mpd-row-item:last-child { border-bottom: none; }

                .mpd-icon-box {
                    width: 30px; height: 30px; border-radius: 8px;
                    background: rgba(99,102,241,0.08); color: #6366f1;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px; flex-shrink: 0; margin-top: 2px;
                }

                .mpd-label {
                    font-size: 10px; text-transform: uppercase;
                    letter-spacing: 0.07em; color: #9ca3af;
                    font-weight: 500; margin-bottom: 2px;
                }

                .mpd-value { font-size: 0.85rem; color: #1e1b4b; font-weight: 500; }

                /* Skill chip — same as mp-chip */
                .mpd-chip {
                    display: inline-block;
                    background: rgba(99,102,241,0.1);
                    color: #6366f1; border-radius: 999px;
                    padding: 0.2rem 0.7rem;
                    font-size: 0.72rem; font-weight: 500;
                }

                /* Biz avatar */
                .mpd-biz-avatar {
                    width: 52px; height: 52px; border-radius: 12px;
                    object-fit: cover; border: 2px solid #e0e7ff; flex-shrink: 0;
                }

                /* Description box */
                .mpd-desc {
                    background: #f9fafb; border-radius: 12px;
                    border: 1px solid #e5e7eb;
                    padding: 1rem 1.2rem;
                    font-size: 0.85rem; color: #374151; line-height: 1.75;
                }
                .mpd-desc img { max-width: 100%; border-radius: 8px; }

                /* Action button — same gradient as mp-btn-primary */
                .mpd-btn {
                    display: inline-flex; align-items: center; gap: 0.45rem;
                    padding: 0.65rem 1.3rem; border-radius: 10px; border: none;
                    background: linear-gradient(135deg, #6366f1, #10b981);
                    color: #fff;
                    font-family: 'Sora', sans-serif;
                    font-size: 0.82rem; font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.15s, box-shadow 0.15s;
                    box-shadow: 0 4px 14px rgba(99,102,241,0.22);
                }
                .mpd-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(99,102,241,0.32);
                }
                .mpd-btn:disabled { opacity: 0.55; cursor: not-allowed; }
            `}</style>

            <div className="mpd-page">
                <div className="mpd-inner">
                    <h2 className="mpd-heading">Chi tiết bài đăng tuyển dụng</h2>
                    <p className="mpd-sub">Thông tin &amp; trạng thái kiểm duyệt</p>

                    <div className="mpd-card">
                        <Section icon="fa-building">Doanh nghiệp</Section>

                        <div className="d-flex align-items-center gap-3 mb-3">
                            {post.business?.imageAvatarBusiness && (
                                <img src={post.business.imageAvatarBusiness} className="mpd-biz-avatar" alt="" />
                            )}
                            <div>
                                <p className="fw-bold mb-0" style={{ fontFamily: "'Sora',sans-serif", color: "#1e1b4b" }}>
                                    {post.business?.nameBusiness}
                                </p>
                                <p className="mb-0 small" style={{ color: "#6366f1" }}>{post.business?.FieldBusiness}</p>
                            </div>
                        </div>

                        <div className="row row-cols-1 row-cols-sm-3 g-2">
                            {[
                                { icon: "fa-location-dot", label: "Địa chỉ", val: post.business?.addressBusiness },
                                { icon: "fa-phone", label: "SĐT", val: post.business?.phoneBusiness },
                                { icon: "fa-globe", label: "Website", val: post.business?.websiteBusiness },
                            ].map((r, i) => (
                                <div key={i} className="col">
                                    <div className="mpd-row-item" style={{ border: "none", padding: "0.35rem 0" }}>
                                        <div className="mpd-icon-box"><i className={`fa-solid ${r.icon}`} /></div>
                                        <div>
                                            <p className="mpd-label">{r.label}</p>
                                            <p className="mpd-value" style={{ fontSize: "0.8rem" }}>{r.val}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Kỹ năng ── */}
                    <div className="mpd-card">
                        <Section icon="fa-wand-magic-sparkles">Kỹ năng yêu cầu</Section>
                        <div className="d-flex flex-wrap gap-2">
                            {post.skills?.length > 0
                                ? post.skills.map((sk, i) => <span key={i} className="mpd-chip">{sk}</span>)
                                : <span className="text-muted small">Không có dữ liệu</span>
                            }
                        </div>
                    </div>

                    {/* ── Thông tin bài đăng ── */}
                    <div className="mpd-card">
                        <Section icon="fa-circle-info">Thông tin bài đăng</Section>
                        <div className="row row-cols-1 row-cols-sm-2 g-0">
                            {infoRows.map((r, i) => (
                                <div key={i} className="col">
                                    <div className="mpd-row-item">
                                        <div className="mpd-icon-box"><i className={`fa-solid ${r.icon}`} /></div>
                                        <div>
                                            <p className="mpd-label">{r.label}</p>
                                            <p className="mpd-value">{r.val}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Mô tả ── */}
                    <div className="mpd-card">
                        <Section icon="fa-align-left">Mô tả công việc</Section>
                        <div className="mpd-desc" dangerouslySetInnerHTML={{ __html: post.description }} />
                    </div>

                    {/* ── Trạng thái ── */}
                    <div className="mpd-card">
                        <Section icon="fa-shield-check">Trạng thái kiểm duyệt</Section>
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                            <span style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                background: statusMap.bg, color: statusMap.color,
                                borderRadius: 999, padding: "0.3rem 0.9rem",
                                fontSize: "0.78rem", fontWeight: 600,
                            }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusMap.dot, flexShrink: 0 }} />
                                {statusMap.label}
                            </span>

                            <button className="mpd-btn" onClick={handleChangeStatus} disabled={statusLoading}>
                                <SwapOutlined />
                                {statusLoading ? "Đang cập nhật..." : "Cập nhật trạng thái"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ManagerPostDetail;
