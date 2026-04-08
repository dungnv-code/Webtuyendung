import { useParams } from "react-router-dom";
import { getDetailBusiness, changeStatusBusiness } from "../../../api/job";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ManagerCompanyDetail = () => {
    const { idb } = useParams();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getDetailBusiness(idb);
                setBusiness(res.data);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [idb]);

    const hanleChangeStatus = async () => {
        try {
            await changeStatusBusiness(idb);
            toast.success("Cập nhật trạng thái thành công");
            const res = await getDetailBusiness(idb);
            setBusiness(res.data);
        } catch (err) { }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .mcd-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 55%, #f0fdf4 100%);
                    padding: 1rem 2rem;
                    font-family: 'Inter', sans-serif;
                }

                .mcd-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem; font-weight: 700; color: #1e1b4b;
                    margin-bottom: 0.35rem; letter-spacing: -0.02em;
                }

                .mcd-sub {
                    font-size: 0.8rem; color: #9ca3af;
                    letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1rem;
                }

                /* ── Loading / Error ── */
                .mcd-state {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 55%, #f0fdf4 100%);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Inter', sans-serif; color: #9ca3af;
                    flex-direction: column; gap: 0.75rem;
                }

                .mcd-spinner {
                    width: 36px; height: 36px;
                    border: 3px solid #e0e7ff; border-top-color: #6366f1;
                    border-radius: 50%; animation: mcdspin 0.8s linear infinite;
                }

                @keyframes mcdspin { to { transform: rotate(360deg); } }

                /* ── Layout ── */
                .mcd-layout {
                    display: grid;
                    grid-template-columns: 1fr 1.6fr;
                    gap: 1.5rem;
                    max-width: 1000px;
                }

                @media (max-width: 768px) { .mcd-layout { grid-template-columns: 1fr; } }

                /* ── Left panel: images ── */
                .mcd-images {
                    display: flex; flex-direction: column; gap: 1rem;
                }

                .mcd-cover-wrap {
                    border-radius: 16px; overflow: hidden;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 4px 16px rgba(99,102,241,0.07);
                    height: 160px;
                }

                .mcd-cover {
                    width: 100%; height: 100%; object-fit: cover; display: block;
                    transition: transform 0.4s;
                }

                .mcd-cover-wrap:hover .mcd-cover { transform: scale(1.04); }

                .mcd-avatar-row {
                    display: flex; align-items: center; gap: 1rem;
                    background: #fff; border-radius: 14px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 4px 16px rgba(99,102,241,0.06);
                    padding: 1rem 1.2rem;
                }

                .mcd-avatar {
                    width: 64px; height: 64px; border-radius: 14px;
                    object-fit: cover; border: 2px solid #e0e7ff;
                    box-shadow: 0 2px 10px rgba(99,102,241,0.12);
                    flex-shrink: 0;
                }

                .mcd-biz-name {
                    font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 700; color: #1e1b4b;
                }

                .mcd-biz-field { font-size: 0.78rem; color: #6366f1; font-weight: 500; margin-top: 0.15rem; }

                /* ── Cert card ── */
                .mcd-cert-card {
                    background: #fff; border-radius: 14px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 4px 16px rgba(99,102,241,0.06);
                    padding: 1rem;
                }

                .mcd-cert-label {
                    font-family: 'Sora', sans-serif; font-size: 0.69rem; font-weight: 600;
                    letter-spacing: 0.1em; text-transform: uppercase; color: #6366f1;
                    margin-bottom: 0.75rem;
                }

                .mcd-cert-img {
                    width: 100%; border-radius: 10px; border: 1px solid #e5e7eb; display: block;
                }

                /* ── Right panel: info card ── */
                .mcd-info-card {
                    background: #fff; border-radius: 20px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.08);
                    padding: 2rem 1.75rem;
                    position: relative; overflow: hidden;
                }

                .mcd-info-card::before {
                    content: ''; position: absolute;
                    top: 0; left: 0; right: 0; height: 3px;
                    background: linear-gradient(90deg, #6366f1, #10b981);
                    border-radius: 20px 20px 0 0;
                }

                /* ── Section label ── */
                .mcd-section {
                    font-family: 'Sora', sans-serif; font-size: 0.69rem; font-weight: 600;
                    letter-spacing: 0.12em; text-transform: uppercase; color: #6366f1;
                    margin: 0 0 1.1rem; display: flex; align-items: center; gap: 0.5rem;
                }

                .mcd-section::after {
                    content: ''; flex: 1; height: 1px;
                    background: linear-gradient(90deg, #e0e7ff, transparent);
                }

                /* ── Info rows ── */
                .mcd-rows { display: flex; flex-direction: column; gap: 0; }

                .mcd-row {
                    display: flex; align-items: flex-start; gap: 0.75rem;
                    padding: 0.7rem 0; border-bottom: 1px solid #f3f4f6;
                }

                .mcd-row:last-child { border-bottom: none; }

                .mcd-row-icon {
                    width: 30px; height: 30px; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    background: #f5f3ff; color: #6366f1; font-size: 0.75rem; flex-shrink: 0;
                    margin-top: 1px;
                }

                .mcd-row-label {
                    font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em;
                    color: #9ca3af; font-weight: 500; margin-bottom: 0.15rem;
                }

                .mcd-row-value {
                    font-size: 0.88rem; color: #1e1b4b; font-weight: 400; word-break: break-word;
                }

                .mcd-row-value a {
                    color: #6366f1; text-decoration: none; font-weight: 500;
                }

                .mcd-row-value a:hover { text-decoration: underline; }

                /* ── Tax chip ── */
                .mcd-tax {
                    font-family: 'Sora', monospace; font-size: 0.82rem;
                    background: #f3f4f6; border-radius: 6px;
                    padding: 0.18rem 0.55rem; color: #374151;
                }

                /* ── Divider ── */
                .mcd-divider { border: none; border-top: 1px dashed #e5e7eb; margin: 1.25rem 0; }

                /* ── Status + button row ── */
                .mcd-status-row {
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 0.75rem;
                }

                .mcd-status-badge {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    border-radius: 999px; padding: 0.3rem 0.9rem;
                    font-size: 0.78rem; font-weight: 600;
                }

                .mcd-status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

                .mcd-status-badge.approved { background: rgba(16,185,129,0.1); color: #059669; }
                .mcd-status-badge.approved .mcd-status-dot { background: #10b981; }
                .mcd-status-badge.pending  { background: rgba(245,158,11,0.1);  color: #d97706; }
                .mcd-status-badge.pending .mcd-status-dot  { background: #f59e0b; }

                /* ── Button ── */
                .mcd-btn {
                    display: inline-flex; align-items: center; gap: 0.45rem;
                    padding: 0.65rem 1.3rem; border-radius: 10px; border: none;
                    background: linear-gradient(135deg, #6366f1, #10b981);
                    color: #fff; font-family: 'Sora', sans-serif;
                    font-size: 0.82rem; font-weight: 600; letter-spacing: 0.05em;
                    cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
                }

                .mcd-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.28); }
                .mcd-btn:active { transform: translateY(0); }
            `}</style>

            {/* Loading */}
            {loading && (
                <div className="mcd-state">
                    <div className="mcd-spinner" />
                    <p style={{ fontSize: "0.85rem" }}>Đang tải dữ liệu...</p>
                </div>
            )}

            {/* Error */}
            {!loading && !business && (
                <div className="mcd-state">
                    <i className="fa-regular fa-building" style={{ fontSize: "2rem", color: "#d1d5db" }} />
                    <p>Không tìm thấy doanh nghiệp!</p>
                </div>
            )}

            {/* Content */}
            {!loading && business && (
                <div className="mcd-page">
                    <h2 className="mcd-heading">Chi tiết doanh nghiệp</h2>
                    <p className="mcd-sub">Thông tin hồ sơ & trạng thái kiểm duyệt</p>

                    <div className="mcd-layout">
                        <div className="mcd-images">
                            <div className="mcd-cover-wrap">
                                <img src={business.imageCoverBusiness} className="mcd-cover" alt="cover" />
                            </div>
                            <div className="mcd-avatar-row">
                                <img src={business.imageAvatarBusiness} className="mcd-avatar" alt="avatar" />
                                <div>
                                    <p className="mcd-biz-name">{business.nameBusiness}</p>
                                    <p className="mcd-biz-field">{business.FieldBusiness}</p>
                                </div>
                            </div>
                            {business.certification && (
                                <div className="mcd-cert-card">
                                    <p className="mcd-cert-label">
                                        <i className="fa-solid fa-certificate" style={{ marginRight: "0.35rem" }} />
                                        Chứng nhận doanh nghiệp
                                    </p>
                                    <img src={business.certification} className="mcd-cert-img" alt="certification" />
                                </div>
                            )}
                        </div>

                        <div className="mcd-info-card">
                            <p className="mcd-section"><i className="fa-solid fa-circle-info" />Thông tin cơ bản</p>

                            <div className="mcd-rows">
                                <div className="mcd-row">
                                    <div className="mcd-row-icon"><i className="fa-solid fa-tag" /></div>
                                    <div>
                                        <p className="mcd-row-label">Mã số thuế</p>
                                        <span className="mcd-tax">{business.taxiCodeBusiness}</span>
                                    </div>
                                </div>

                                <div className="mcd-row">
                                    <div className="mcd-row-icon"><i className="fa-solid fa-location-dot" /></div>
                                    <div>
                                        <p className="mcd-row-label">Địa chỉ</p>
                                        <p className="mcd-row-value">{business.addressBusiness}</p>
                                    </div>
                                </div>

                                <div className="mcd-row">
                                    <div className="mcd-row-icon"><i className="fa-solid fa-phone" /></div>
                                    <div>
                                        <p className="mcd-row-label">Số điện thoại</p>
                                        <p className="mcd-row-value">{business.phoneBusiness}</p>
                                    </div>
                                </div>

                                <div className="mcd-row">
                                    <div className="mcd-row-icon"><i className="fa-solid fa-globe" /></div>
                                    <div>
                                        <p className="mcd-row-label">Website</p>
                                        <p className="mcd-row-value">
                                            <a href={business.websiteBusiness} target="_blank" rel="noreferrer">
                                                {business.websiteBusiness}
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                <div className="mcd-row">
                                    <div className="mcd-row-icon"><i className="fa-solid fa-users" /></div>
                                    <div>
                                        <p className="mcd-row-label">Quy mô nhân sự</p>
                                        <p className="mcd-row-value">{business.numberOfEmployees}</p>
                                    </div>
                                </div>

                                <div className="mcd-row">
                                    <div className="mcd-row-icon"><i className="fa-regular fa-calendar" /></div>
                                    <div>
                                        <p className="mcd-row-label">Ngày tạo</p>
                                        <p className="mcd-row-value">{new Date(business.createdAt).toLocaleString("vi-VN")}</p>
                                    </div>
                                </div>

                                <div className="mcd-row">
                                    <div className="mcd-row-icon"><i className="fa-regular fa-calendar-check" /></div>
                                    <div>
                                        <p className="mcd-row-label">Ngày cập nhật</p>
                                        <p className="mcd-row-value">{new Date(business.updatedAt).toLocaleString("vi-VN")}</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="mcd-divider" />

                            <p className="mcd-section"><i className="fa-solid fa-shield-check" />Trạng thái kiểm duyệt</p>

                            <div className="mcd-status-row">
                                <span className={`mcd-status-badge ${business.statusBusiness ? "approved" : "pending"}`}>
                                    <span className="mcd-status-dot" />
                                    {business.statusBusiness ? "Đã kiểm duyệt" : "Chờ kiểm duyệt"}
                                </span>
                                <button className="mcd-btn" onClick={hanleChangeStatus}>
                                    <i className="fa-solid fa-arrows-rotate" />
                                    Cập nhật trạng thái
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManagerCompanyDetail;
