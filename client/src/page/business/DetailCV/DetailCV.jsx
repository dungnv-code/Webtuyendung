import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { detailPostJobCV } from "../../../api/business";
import { ChangeStatusCVPostjobs } from "../../../api/job";
import { toast } from "react-toastify";
import { ReadPDF } from "../../../component";
import { useParams } from "react-router-dom";
import Loading from "../../../component/loading/Loading";

const DetailCV = () => {
    const { idp } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [listJob, setListJob] = useState([]);
    const [loaddata, setLoaddata] = useState(false);
    const [urlCV, setUrlCV] = useState("");
    const [loading, setLoading] = useState(false);

    const [totalStats, setTotalStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedCV, setSelectedCV] = useState(null);
    const [rejectMessage, setRejectMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await detailPostJobCV(idp, {
                    page: currentPage,
                    limit,
                    role: "ungvien,nhatuyendung,STAFF",
                });
                setListJob(response.data || []);
                setTotalPages(response.totalPages || 0);

                if (response.stats) {
                    setTotalStats({
                        total: response.stats.total ?? 0,
                        approved: response.stats.approved ?? 0,
                        pending: response.stats.pending ?? 0,
                        rejected: response.stats.rejected ?? 0,
                    });
                } else {
                    const data = response.data || [];
                    setTotalStats({
                        total: data.length,
                        approved: data.filter(j => j.status === "active").length,
                        pending: data.filter(j => j.status === "pending").length,
                        rejected: data.filter(j => j.status === "unactive").length,
                    });
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
                toast.error("Không thể tải danh sách hồ sơ.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);

    const handleChangeStatus = async (idp, idcv, status) => {
        setLoading(true);
        try {
            const repo = await ChangeStatusCVPostjobs(idp, idcv, { status, message: rejectMessage });
            if (repo.success) {
                toast.success(repo.message || "Cập nhật trạng thái thành công");
                setLoaddata(prev => !prev);
            }
        } catch (err) {
            toast.error(err?.message || "Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectChange = (idp, idcv, value) => {
        if (value === "unactive") {
            setSelectedCV({ idp, idcv });
            setShowRejectModal(true);
        } else {
            handleChangeStatus(idp, idcv, value);
        }
    };

    const handleCloseRejectModal = () => {
        setShowRejectModal(false);
        setRejectMessage("");
        setSelectedCV(null);
    };

    const handleConfirmReject = () => {
        if (!rejectMessage.trim()) {
            toast.warning("Vui lòng nhập lý do từ chối.");
            return;
        }
        handleChangeStatus(selectedCV.idp, selectedCV.idcv, "unactive");
        handleCloseRejectModal();
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "active":
                return <span className="dc-badge dc-badge-green"><i className="bi bi-check-circle-fill me-1" />Đã duyệt</span>;
            case "pending":
                return <span className="dc-badge dc-badge-orange"><i className="bi bi-hourglass-split me-1" />Chờ duyệt</span>;
            case "unactive":
                return <span className="dc-badge dc-badge-red"><i className="bi bi-x-circle-fill me-1" />Từ chối</span>;
            default:
                return <span className="dc-badge dc-badge-gray">Không xác định</span>;
        }
    };

    const getRatioBadge = (ratio) => {
        const num = parseFloat(ratio);
        if (num >= 80) return <span className="dc-badge dc-badge-green">{ratio}%</span>;
        if (num >= 50) return <span className="dc-badge dc-badge-orange">{ratio}%</span>;
        return <span className="dc-badge dc-badge-red">{ratio}%</span>;
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .dc-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 55%, #fff7ed 100%);
                    padding: 1rem 1rem;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .dc-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #1e1b4b;
                    text-align: center;
                    margin-bottom: 0.35rem;
                    letter-spacing: -0.02em;
                }

                .dc-sub {
                    text-align: center;
                    font-size: 0.8rem;
                    color: #9ca3af;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 1rem;
                }

                .dc-stats {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 0.5rem;
                    width: 100%;
                    max-width: 960px;
                    flex-wrap: wrap;
                }

                .dc-stat {
                    flex: 1;
                    min-width: 140px;
                    background: #fff;
                    border-radius: 14px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 4px 16px rgba(99,102,241,0.07);
                    padding: 1rem 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.85rem;
                }

                .dc-stat-icon {
                    width: 40px; height: 40px;
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                }

                .dc-stat-icon.purple { background: rgba(99,102,241,0.12); color: #6366f1; }
                .dc-stat-icon.orange { background: rgba(249,115,22,0.12);  color: #f97316; }
                .dc-stat-icon.green  { background: rgba(16,185,129,0.12);  color: #10b981; }
                .dc-stat-icon.red    { background: rgba(239,68,68,0.12);   color: #ef4444; }

                .dc-stat-label {
                    font-size: 0.7rem;
                    color: #9ca3af;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    font-weight: 500;
                    margin-bottom: 0.15rem;
                }

                .dc-stat-value {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1e1b4b;
                }

                .dc-card {
                    width: 100%;
                    max-width: 960px;
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.08);
                    padding: 1.75rem 1.75rem 1.5rem;
                    position: relative;
                    overflow: hidden;
                }

                .dc-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #6366f1, #f97316);
                    border-radius: 20px 20px 0 0;
                }

                .dc-section {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.69rem;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #6366f1;
                    margin: 0 0 1.1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .dc-section::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, #e0e7ff, transparent);
                }

                .dc-divider {
                    border: none;
                    border-top: 1px dashed #e5e7eb;
                    margin: 0 0 1.25rem;
                }

                .dc-table-wrap { width: 100%; overflow-x: auto; }

                .dc-table {
                    width: 100%;
                    min-width: 700px;
                    border-collapse: separate;
                    border-spacing: 0;
                    font-size: 0.85rem;
                }

                .dc-table thead tr { background: #f5f3ff; }

                .dc-table th {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.69rem;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #6366f1;
                    padding: 0.75rem 1rem;
                    text-align: left;
                    border-bottom: 1.5px solid #e0e7ff;
                    white-space: nowrap;
                }

                .dc-table th:first-child { border-radius: 10px 0 0 0; text-align: center; }
                .dc-table th:last-child  { border-radius: 0 10px 0 0; text-align: center; }

                .dc-table tbody tr { transition: background 0.15s; }
                .dc-table tbody tr:hover { background: #fafafa; }

                .dc-table td {
                    padding: 0.75rem 1rem;
                    color: #374151;
                    vertical-align: middle;
                    border-bottom: 1px solid #f3f4f6;
                }

                .dc-table td:first-child { text-align: center; color: #9ca3af; font-weight: 500; }

                .dc-avatar {
                    width: 34px; height: 34px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #a5b4fc);
                    display: flex; align-items: center; justify-content: center;
                    color: #fff;
                    font-family: 'Sora', sans-serif;
                    font-weight: 700;
                    font-size: 0.82rem;
                    flex-shrink: 0;
                }

                .dc-contact {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    font-size: 0.75rem;
                    color: #6b7280;
                }

                .dc-contact i { color: #a5b4fc; font-size: 0.7rem; }

                .dc-badge {
                    display: inline-flex;
                    align-items: center;
                    border-radius: 999px;
                    padding: 0.2rem 0.65rem;
                    font-size: 0.74rem;
                    font-weight: 600;
                    white-space: nowrap;
                }

                .dc-badge-green  { background: rgba(16,185,129,0.12); color: #065f46; }
                .dc-badge-orange { background: rgba(249,115,22,0.12);  color: #c2410c; }
                .dc-badge-red    { background: rgba(239,68,68,0.12);   color: #991b1b; }
                .dc-badge-gray   { background: #f3f4f6; color: #6b7280; }
                .dc-badge-purple { background: rgba(99,102,241,0.1);   color: #4338ca; }

                .dc-select {
                    border: none;
                    border-radius: 999px;
                    padding: 0.25rem 0.75rem;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    outline: none;
                    min-width: 130px;
                }

                .dc-btn-cv {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    background: rgba(99,102,241,0.1);
                    color: #6366f1;
                    border: none;
                    border-radius: 999px;
                    padding: 0.3rem 0.85rem;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s;
                }

                .dc-btn-cv:hover { background: rgba(99,102,241,0.2); }

                .dc-empty {
                    text-align: center;
                    padding: 3rem 0;
                    color: #9ca3af;
                }

                .dc-empty i {
                    font-size: 2rem;
                    display: block;
                    margin-bottom: 0.6rem;
                    color: #d1d5db;
                }

                .dc-pagination {
                    display: flex;
                    justify-content: center;
                    margin-top: 1.25rem;
                }

                /* FIX #1: Modal từ chối dùng đúng dc- classes */
                .dc-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15,10,40,0.65);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1055;
                    padding: 1rem;
                }

                .dc-modal-box {
                    background: #fff;
                    border-radius: 20px;
                    overflow: hidden;
                    width: 100%;
                    max-width: 900px;
                    box-shadow: 0 24px 64px rgba(99,102,241,0.18);
                    position: relative;
                }

                .dc-modal-box::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #6366f1, #f97316);
                }

                .dc-modal-header {
                    padding: 1rem 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #f3f4f6;
                }

                .dc-modal-title {
                    font-family: 'Sora', sans-serif;
                    font-weight: 700;
                    color: #1e1b4b;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .dc-modal-title i { color: #6366f1; }

                .dc-modal-close {
                    background: #f3f4f6;
                    border: none;
                    border-radius: 50%;
                    width: 32px; height: 32px;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    color: #6b7280;
                    font-size: 0.85rem;
                    transition: background 0.15s;
                }

                .dc-modal-close:hover { background: #e5e7eb; }

                .dc-modal-footer {
                    padding: 0.85rem 1.5rem;
                    border-top: 1px solid #f3f4f6;
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.6rem;
                }

                .dc-btn-close {
                    background: #f3f4f6;
                    border: none;
                    border-radius: 10px;
                    padding: 0.45rem 1.25rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #374151;
                    cursor: pointer;
                    transition: background 0.15s;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                }

                .dc-btn-close:hover { background: #e5e7eb; }

                .dc-btn-confirm {
                    background: rgba(239,68,68,0.12);
                    border: none;
                    border-radius: 10px;
                    padding: 0.45rem 1.25rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #991b1b;
                    cursor: pointer;
                    transition: background 0.15s;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                }

                .dc-btn-confirm:hover { background: rgba(239,68,68,0.22); }

                .dc-reject-body {
                    padding: 1.25rem 1.5rem;
                }

                .dc-reject-label {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 0.5rem;
                    display: block;
                }

                .dc-reject-textarea {
                    width: 100%;
                    min-height: 110px;
                    border: 1.5px solid #e0e7ff;
                    border-radius: 12px;
                    padding: 0.75rem 1rem;
                    font-size: 0.85rem;
                    font-family: 'Inter', sans-serif;
                    color: #374151;
                    resize: vertical;
                    outline: none;
                    transition: border-color 0.15s;
                    box-sizing: border-box;
                }

                .dc-reject-textarea:focus { border-color: #6366f1; }
            `}</style>

            <div className="dc-page">
                <h2 className="dc-heading mb-2">Quản lý CV ứng viên</h2>
                {loading && <Loading />}

                {showRejectModal && (
                    <div className="dc-modal-overlay" onClick={handleCloseRejectModal}>
                        <div className="dc-modal-box" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
                            <div className="dc-modal-header">
                                <div className="dc-modal-title">
                                    <i className="bi bi-x-circle-fill" />
                                    Lý do từ chối
                                </div>
                                <button className="dc-modal-close" onClick={handleCloseRejectModal}>
                                    <i className="bi bi-x-lg" />
                                </button>
                            </div>

                            <div className="dc-reject-body">
                                <label className="dc-reject-label">Nhập lý do từ chối ứng viên *</label>
                                <textarea
                                    className="dc-reject-textarea"
                                    placeholder="Ví dụ: Hồ sơ chưa đáp ứng yêu cầu kinh nghiệm tối thiểu..."
                                    value={rejectMessage}
                                    onChange={(e) => setRejectMessage(e.target.value)}
                                />
                            </div>

                            <div className="dc-modal-footer">
                                <button className="dc-btn-close" onClick={handleCloseRejectModal}>
                                    <i className="bi bi-arrow-left" /> Hủy
                                </button>
                                <button className="dc-btn-confirm" onClick={handleConfirmReject}>
                                    <i className="bi bi-x-circle" /> Xác nhận từ chối
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="dc-stats">
                    <div className="dc-stat">
                        <div className="dc-stat-icon purple"><i className="bi bi-people-fill" /></div>
                        <div>
                            <p className="dc-stat-label">Tổng ứng viên</p>
                            <p className="dc-stat-value">{totalStats.total}</p>
                        </div>
                    </div>
                    <div className="dc-stat">
                        <div className="dc-stat-icon green"><i className="bi bi-check-circle-fill" /></div>
                        <div>
                            <p className="dc-stat-label">Đã duyệt</p>
                            <p className="dc-stat-value">{totalStats.approved}</p>
                        </div>
                    </div>
                    <div className="dc-stat">
                        <div className="dc-stat-icon orange"><i className="bi bi-hourglass-split" /></div>
                        <div>
                            <p className="dc-stat-label">Chờ duyệt</p>
                            <p className="dc-stat-value">{totalStats.pending}</p>
                        </div>
                    </div>
                    <div className="dc-stat">
                        <div className="dc-stat-icon red"><i className="bi bi-x-circle-fill" /></div>
                        <div>
                            <p className="dc-stat-label">Từ chối</p>
                            <p className="dc-stat-value">{totalStats.rejected}</p>
                        </div>
                    </div>
                </div>

                <div className="dc-card">
                    <p className="dc-section">
                        <i className="bi bi-file-earmark-person-fill" />
                        Danh sách hồ sơ
                    </p>
                    <hr className="dc-divider" />

                    <div className="dc-table-wrap">
                        <table className="dc-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Ứng viên</th>
                                    <th>Liên hệ</th>
                                    <th>Phù hợp</th>
                                    <th>Đánh giá</th>

                                    <th>Trạng thái</th>
                                    <th>Hồ sơ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listJob.length === 0 ? (
                                    <tr>
                                        <td colSpan={8}>
                                            <div className="dc-empty">
                                                <i className="bi bi-inbox" />
                                                <p>Chưa có hồ sơ ứng viên nào.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    listJob.map((job, index) => (
                                        <tr key={job._id}>
                                            <td>{(currentPage - 1) * limit + index + 1}</td>

                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                                    <div className="dc-avatar">
                                                        {job.idUser.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: "#1e1b4b", fontFamily: "'Sora',sans-serif", fontSize: "0.85rem" }}>
                                                        {job.idUser.username}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                                    <span className="dc-contact"><i className="bi bi-envelope-fill" />{job.idUser.email}</span>
                                                    <span className="dc-contact"><i className="bi bi-telephone-fill" />{job.idUser.phone}</span>
                                                </div>
                                            </td>

                                            <td>{getRatioBadge(job.ratio)}</td>

                                            <td><span className="dc-badge dc-badge-purple">{job.evaluate || "—"}</span></td>
                                            <td>
                                                <select
                                                    className="dc-select"
                                                    style={{
                                                        backgroundColor:
                                                            job.status === "active" ? "rgba(16,185,129,0.12)" :
                                                                job.status === "unactive" ? "rgba(239,68,68,0.12)" : "rgba(249,115,22,0.12)",
                                                        color:
                                                            job.status === "active" ? "#065f46" :
                                                                job.status === "unactive" ? "#991b1b" : "#c2410c",
                                                    }}
                                                    value={job.status}
                                                    onChange={(e) => handleSelectChange(idp, job._id, e.target.value)}
                                                >
                                                    <option value="pending"><i class="fa-solid fa-hourglass-start"></i> Đang chờ</option>
                                                    <option value="active"><i class="fa-solid fa-check"></i> Duyệt</option>
                                                    <option value="unactive"><i class="fa-solid fa-circle-xmark"></i> Từ chối</option>
                                                </select>
                                            </td>

                                            <td style={{ textAlign: "center" }}>
                                                <button className="dc-btn-cv" onClick={() => setUrlCV(job.fileCV)}>
                                                    <i className="bi bi-file-earmark-pdf-fill" />Xem CV
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="dc-pagination">
                        <PaginationCustom
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            limit={limit}
                            totalPages={totalPages}
                        />
                    </div>
                </div>
            </div>


            {urlCV && (
                <div className="dc-modal-overlay" onClick={() => setUrlCV("")}>
                    <div className="dc-modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="dc-modal-header">
                            <div className="dc-modal-title">
                                <i className="bi bi-file-earmark-pdf-fill" />
                                Xem CV ứng viên
                            </div>
                            <button className="dc-modal-close" onClick={() => setUrlCV("")}>
                                <i className="bi bi-x-lg" />
                            </button>
                        </div>
                        <div style={{ height: "75vh" }}>
                            <ReadPDF fileUrl={urlCV} />
                        </div>
                        <div className="dc-modal-footer">
                            <button className="dc-btn-close" onClick={() => setUrlCV("")}>
                                <i className="bi bi-x-circle" /> Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DetailCV;
