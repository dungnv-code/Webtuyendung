import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getPostJobBusiness, changeStatusPausePostJobBusiness } from "../../../api/business";
import { SearchOutlined, RedoOutlined, EditOutlined, FundViewOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import path from "../../../ultils/path";

const ManagerPostJob = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [listJob, setListJob] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [loaddata, setLoaddata] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getPostJobBusiness({ page: currentPage, limit });
                setListJob(response.data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);

    const hanleChangeStatus = async (id) => {
        try {
            const response = await changeStatusPausePostJobBusiness(id);
            if (response?.success) {
                setLoaddata(!loaddata);
                toast.success("Thay đổi trạng thái thành công");
            }
        } catch (err) { }
    };

    const hanleSearch = async () => {
        try {
            const response = await getPostJobBusiness({ page: currentPage, limit, title: inputValue });
            setListJob(response.data);
            setTotalPages(response.totalPages);
        } catch (error) { }
    };

    const hanleReset = async () => {
        setInputValue("");
        try {
            const response = await getPostJobBusiness({ page: currentPage, limit });
            setListJob(response.data);
            setTotalPages(response.totalPages);
        } catch (error) { }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit", month: "2-digit", year: "numeric"
        });
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .mpj-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 55%, #f0fdf4 100%);
                    padding: 1rem 1rem;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .mpj-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem; font-weight: 700;
                    color: #1e1b4b; text-align: center;
                    margin-bottom: 0.35rem; letter-spacing: -0.02em;
                }

                .mpj-sub {
                    text-align: center; font-size: 0.8rem;
                    color: #9ca3af; letter-spacing: 0.1em;
                    text-transform: uppercase; margin-bottom: 1rem;
                }

                /* ── Card ── */
                .mpj-card {
                    width: 100%; max-width: 1100px;
                    background: #fff; border-radius: 20px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.08);
                    padding: 2rem 1.75rem 1.5rem;
                    position: relative; overflow: hidden;
                }

                .mpj-card::before {
                    content: ''; position: absolute;
                    top: 0; left: 0; right: 0; height: 3px;
                    background: linear-gradient(90deg, #6366f1, #10b981);
                    border-radius: 20px 20px 0 0;
                }

                /* ── Search bar ── */
                .mpj-search-row {
                    display: flex; gap: 0.75rem;
                    align-items: center; margin-bottom: 0rem; flex-wrap: wrap;
                }

                .mpj-input-wrap { flex: 1; min-width: 180px; position: relative; }

                .mpj-input-wrap .anticon {
                    position: absolute; left: 0.85rem; top: 50%;
                    transform: translateY(-50%);
                    color: #a5b4fc; font-size: 0.8rem; pointer-events: none;
                }

                .mpj-input {
                    width: 100%; background: #f9fafb;
                    border: 1.5px solid #e5e7eb; border-radius: 10px;
                    padding: 0.62rem 0.95rem 0.62rem 2.3rem;
                    color: #111827; font-family: 'Inter', sans-serif;
                    font-size: 0.88rem; outline: none;
                    transition: border-color 0.22s, box-shadow 0.22s, background 0.22s;
                }

                .mpj-input:focus {
                    background: #fff; border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.11);
                }

                .mpj-input::placeholder { color: #c4c9d4; }

                /* ── Buttons ── */
                .mpj-btn {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    padding: 0.62rem 1.2rem; border-radius: 10px; border: none;
                    font-family: 'Inter', sans-serif; font-size: 0.82rem;
                    font-weight: 500; cursor: pointer;
                    transition: transform 0.15s, box-shadow 0.15s; white-space: nowrap;
                }

                .mpj-btn:hover { transform: translateY(-1px); }
                .mpj-btn:active { transform: translateY(0); }

                .mpj-btn-primary {
                    background: linear-gradient(135deg, #6366f1, #10b981);
                    color: #fff; box-shadow: 0 4px 14px rgba(99,102,241,0.22);
                }

                .mpj-btn-primary:hover { box-shadow: 0 6px 20px rgba(99,102,241,0.32); }

                .mpj-btn-ghost {
                    background: #f3f4f6; color: #6b7280;
                    border: 1.5px solid #e5e7eb;
                }

                .mpj-btn-ghost:hover { background: #e5e7eb; }

                /* ── Divider ── */
                .mpj-divider { border: none; border-top: 1px dashed #e5e7eb; margin: 0 0 1.25rem; }

                /* ── Section label ── */
                .mpj-section {
                    font-family: 'Sora', sans-serif; font-size: 0.69rem;
                    font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
                    color: #6366f1; margin: 0 0 1.1rem;
                    display: flex; align-items: center; gap: 0.5rem;
                }

                .mpj-section::after {
                    content: ''; flex: 1; height: 1px;
                    background: linear-gradient(90deg, #e0e7ff, transparent);
                }

                /* ── Table ── */
                .mpj-table-wrap { width: 100%; overflow-x: auto; }

                .mpj-table {
                    width: 100%; min-width: 900px;
                    border-collapse: separate; border-spacing: 0; font-size: 0.83rem;
                }

                .mpj-table thead tr { background: #f5f3ff; }

                .mpj-table th {
                    font-family: 'Sora', sans-serif; font-size: 0.67rem;
                    font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
                    color: #6366f1; padding: 0.7rem 0.9rem; text-align: left;
                    border-bottom: 1.5px solid #e0e7ff; white-space: nowrap;
                }

                .mpj-table th:first-child { border-radius: 10px 0 0 0; text-align: center; }
                .mpj-table th:last-child  { border-radius: 0 10px 0 0; text-align: center; }

                .mpj-table tbody tr { transition: background 0.15s; }
                .mpj-table tbody tr:hover { background: #fafafa; }

                .mpj-table td {
                    padding: 0.72rem 0.9rem; color: #374151;
                    vertical-align: middle; border-bottom: 1px solid #f3f4f6;
                }

                .mpj-table td:first-child { text-align: center; color: #9ca3af; font-weight: 500; }

                /* ── Status badge ── */
                .mpj-badge {
                    display: inline-flex; align-items: center; gap: 0.32rem;
                    border-radius: 999px; padding: 0.2rem 0.65rem;
                    font-size: 0.7rem; font-weight: 500;
                }

                .mpj-badge-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

                .mpj-badge.pending  { background: rgba(245,158,11,0.1);  color: #d97706; }
                .mpj-badge.pending .mpj-badge-dot  { background: #f59e0b; }
                .mpj-badge.approved { background: rgba(16,185,129,0.1);  color: #059669; }
                .mpj-badge.approved .mpj-badge-dot { background: #10b981; }

                /* ── Pause toggle ── */
                .mpj-toggle {
                    background: none; border: none; cursor: pointer;
                    padding: 0.28rem 0.55rem; border-radius: 8px;
                    transition: background 0.15s; font-size: 1.1rem;
                    display: inline-flex; align-items: center;
                }

                .mpj-toggle.on  { color: #6366f1; }
                .mpj-toggle.off { color: #d1d5db; }
                .mpj-toggle:hover { background: rgba(99,102,241,0.08); }

                /* ── Pause label ── */
                .mpj-pause-lbl {
                    font-size: 0.7rem; font-weight: 500; border-radius: 999px;
                    padding: 0.18rem 0.6rem; display: inline-block;
                }

                .mpj-pause-lbl.hidden  { background: rgba(244,63,94,0.1);  color: #f43f5e; }
                .mpj-pause-lbl.visible { background: rgba(16,185,129,0.1); color: #059669; }

                /* ── Action icons ── */
                .mpj-action {
                    display: inline-flex; align-items: center; justify-content: center;
                    width: 30px; height: 30px; border-radius: 8px;
                    transition: background 0.15s; color: #6366f1; font-size: 0.95rem;
                }

                .mpj-action:hover { background: rgba(99,102,241,0.1); }
                .mpj-action.green { color: #10b981; }
                .mpj-action.green:hover { background: rgba(16,185,129,0.1); }

                .mpj-actions-cell { display: flex; align-items: center; justify-content: center; gap: 0.3rem; }

                /* ── Job title ── */
                .mpj-title-cell {
                    font-weight: 600; color: #1e1b4b;
                    max-width: 200px; white-space: nowrap;
                    overflow: hidden; text-overflow: ellipsis;
                }

                /* ── Empty ── */
                .mpj-empty { text-align: center; padding: 3rem 0; color: #9ca3af; }
                .mpj-empty i { font-size: 2rem; display: block; margin-bottom: 0.6rem; color: #d1d5db; }

                /* ── Pagination ── */
                .mpj-pagination { display: flex; justify-content: center; margin-top: 1.25rem; }
            `}</style>

            <div className="mpj-page">
                <h2 className="mpj-heading">Quản lý bài đăng</h2>
                <p className="mpj-sub">Danh sách tin tuyển dụng của doanh nghiệp</p>

                <div className="mpj-card">
                    {/* Search */}
                    <div className="mpj-search-row">
                        <div className="mpj-input-wrap">
                            <SearchOutlined />
                            <input
                                type="text" className="mpj-input"
                                placeholder="Tìm theo tên bài đăng..."
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && hanleSearch()}
                            />
                        </div>
                        <button type="button" className="mpj-btn mpj-btn-primary" onClick={hanleSearch}>
                            <SearchOutlined /> Tìm kiếm
                        </button>
                        <button type="button" className="mpj-btn mpj-btn-ghost" onClick={hanleReset}>
                            <RedoOutlined /> Đặt lại
                        </button>
                    </div>

                    <hr className="mpj-divider" />
                    <p className="mpj-section"><i className="fa-solid fa-list-ul" />Danh sách bài đăng</p>

                    <div className="mpj-table-wrap">
                        <table className="mpj-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên bài đăng</th>
                                    <th>Lĩnh vực</th>
                                    <th>Người thêm</th>
                                    <th>Ngày cập nhật</th>
                                    <th>Trạng thái</th>
                                    <th>Hiển thị</th>
                                    <th style={{ textAlign: "center" }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listJob?.length === 0 ? (
                                    <tr>
                                        <td colSpan={8}>
                                            <div className="mpj-empty">
                                                <i className="fa-regular fa-file-lines" />
                                                <p>Chưa có bài đăng nào.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    listJob?.map((job, index) => (
                                        <tr key={job._id}>
                                            <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                            <td className="mpj-title-cell" title={job.title}>{job.title}</td>
                                            <td style={{ color: "#6b7280" }}>{job.jobs}</td>
                                            <td style={{ color: "#6b7280" }}>{job.userPost}</td>
                                            <td>
                                                <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                                                    <i className="fa-regular fa-calendar" style={{ marginRight: "0.3rem", color: "#a5b4fc" }} />
                                                    {formatDate(job.updatedAt)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`mpj-badge ${job.status === "pendding" ? "pending" : "approved"}`}>
                                                    <span className="mpj-badge-dot" />
                                                    {job.status === "pendding" ? "Chờ duyệt" : "Đã duyệt"}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`mpj-pause-lbl ${job.statusPause ? "hidden" : "visible"}`}>
                                                    {job.statusPause ? "Đang ẩn" : "Hiển thị"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="mpj-actions-cell">
                                                    {/* Toggle pause */}
                                                    <button
                                                        className={`mpj-toggle ${job.statusPause ? "on" : "off"}`}
                                                        onClick={() => hanleChangeStatus(job._id)}
                                                        title={job.statusPause ? "Bỏ tạm ẩn" : "Tạm ẩn"}
                                                    >
                                                        <i className={`fa-solid ${job.statusPause ? "fa-toggle-on" : "fa-toggle-off"}`} />
                                                    </button>

                                                    {/* View CVs */}
                                                    <Link to={`${path.CVPOSTJOB}/${job._id}`} className="mpj-action green" title="Danh sách CV">
                                                        <FundViewOutlined />
                                                    </Link>

                                                    {/* Edit */}
                                                    <Link to={`${path.MANAGERPOSTJOB}/${job._id}`} className="mpj-action" title="Chỉnh sửa">
                                                        <EditOutlined />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mpj-pagination">
                        <PaginationCustom
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            limit={limit}
                            totalPages={totalPages}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManagerPostJob;
