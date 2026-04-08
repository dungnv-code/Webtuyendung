import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getAllBusiness, changeStatusBusiness } from "../../../api/job";
import { SwapOutlined, SearchOutlined, RedoOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import path from "../../../ultils/path";

const ManagerCompany = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [listJob, setListJob] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [selectValue, setSelectValue] = useState("");
    const [loaddata, setLoaddata] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllBusiness({ page: currentPage, limit });
                setListJob(response.data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Error fetching businesses:", error);
            }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);

    const handleSearch = async () => {
        try {
            const response = await getAllBusiness({
                page: currentPage, limit,
                nameBusiness: inputValue || undefined,
                statusBusiness: selectValue || undefined,
            });
            setListJob(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error searching:", error);
        }
    };

    const hanleReset = async () => {
        setInputValue(""); setSelectValue("");
        try {
            const response = await getAllBusiness({ page: currentPage, limit });
            setListJob(response.data);
            setTotalPages(response.totalPages);
        } catch (error) { }
    };

    const hanleChangeStatus = async (id) => {
        try {
            await changeStatusBusiness(id);
            setCurrentPage(1);
            toast.success("Cập nhật trạng thái doanh nghiệp thành công!");
            setLoaddata(!loaddata);
        } catch (error) { }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .mc-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 55%, #f0fdf4 100%);
                    padding: 1rem 1rem;
                    font-family: 'Inter', sans-serif;
                    display: flex; flex-direction: column; align-items: center;
                }

                .mc-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem; font-weight: 700; color: #1e1b4b;
                    text-align: center; margin-bottom: 0.35rem; letter-spacing: -0.02em;
                }

                .mc-sub {
                    text-align: center; font-size: 0.8rem; color: #9ca3af;
                    letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2rem;
                }

                /* ── Card ── */
                .mc-card {
                    width: 100%; max-width: 1050px;
                    background: #fff; border-radius: 20px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.08);
                    padding: 2rem 1.75rem 1.5rem;
                    position: relative; overflow: hidden;
                }

                .mc-card::before {
                    content: ''; position: absolute;
                    top: 0; left: 0; right: 0; height: 3px;
                    background: linear-gradient(90deg, #6366f1, #10b981);
                    border-radius: 20px 20px 0 0;
                }

                /* ── Search row ── */
                .mc-search-row {
                    display: flex; gap: 0.75rem;
                    align-items: center; margin-bottom: 0rem; flex-wrap: wrap;
                }

                .mc-input-wrap { flex: 1; min-width: 180px; position: relative; }

                .mc-input-wrap .anticon {
                    position: absolute; left: 0.85rem; top: 50%;
                    transform: translateY(-50%); color: #a5b4fc; font-size: 0.8rem; pointer-events: none;
                }

                .mc-input {
                    width: 100%; background: #f9fafb;
                    border: 1.5px solid #e5e7eb; border-radius: 10px;
                    padding: 0.62rem 0.95rem 0.62rem 2.3rem;
                    color: #111827; font-family: 'Inter', sans-serif;
                    font-size: 0.88rem; outline: none;
                    transition: border-color 0.22s, box-shadow 0.22s, background 0.22s;
                }

                .mc-input:focus {
                    background: #fff; border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.11);
                }

                .mc-input::placeholder { color: #c4c9d4; }

                /* ── Select ── */
                .mc-select-wrap { position: relative; min-width: 180px; }

                .mc-select-wrap::after {
                    content: '▾'; position: absolute;
                    right: 0.85rem; top: 50%; transform: translateY(-50%);
                    color: #9ca3af; font-size: 0.75rem; pointer-events: none;
                }

                .mc-select {
                    width: 100%; background: #f9fafb;
                    border: 1.5px solid #e5e7eb; border-radius: 10px;
                    padding: 0.62rem 2rem 0.62rem 0.95rem;
                    color: #111827; font-family: 'Inter', sans-serif;
                    font-size: 0.88rem; outline: none; appearance: none;
                    transition: border-color 0.22s, box-shadow 0.22s;
                }

                .mc-select:focus {
                    background: #fff; border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.11);
                }

                .mc-btn {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    padding: 0.62rem 1.2rem; border-radius: 10px; border: none;
                    font-family: 'Inter', sans-serif; font-size: 0.82rem;
                    font-weight: 500; cursor: pointer;
                    transition: transform 0.15s, box-shadow 0.15s; white-space: nowrap;
                }

                .mc-btn:hover { transform: translateY(-1px); }
                .mc-btn:active { transform: translateY(0); }

                .mc-btn-primary {
                    background: linear-gradient(135deg, #6366f1, #10b981);
                    color: #fff; box-shadow: 0 4px 14px rgba(99,102,241,0.22);
                }

                .mc-btn-primary:hover { box-shadow: 0 6px 20px rgba(99,102,241,0.32); }

                .mc-btn-ghost {
                    background: #f3f4f6; color: #6b7280; border: 1.5px solid #e5e7eb;
                }

                .mc-btn-ghost:hover { background: #e5e7eb; }

                /* ── Divider ── */
                .mc-divider { border: none; border-top: 1px dashed #e5e7eb; margin: 0 0 1.25rem; }

                /* ── Section label ── */
                .mc-section {
                    font-family: 'Sora', sans-serif; font-size: 0.69rem; font-weight: 600;
                    letter-spacing: 0.12em; text-transform: uppercase; color: #6366f1;
                    margin: 0 0 1.1rem; display: flex; align-items: center; gap: 0.5rem;
                }

                .mc-section::after {
                    content: ''; flex: 1; height: 1px;
                    background: linear-gradient(90deg, #e0e7ff, transparent);
                }

                /* ── Table ── */
                .mc-table-wrap { width: 100%; overflow-x: auto; }

                .mc-table {
                    width: 100%; min-width: 720px;
                    border-collapse: separate; border-spacing: 0; font-size: 0.83rem;
                }

                .mc-table thead tr { background: #f5f3ff; }

                .mc-table th {
                    font-family: 'Sora', sans-serif; font-size: 0.67rem; font-weight: 600;
                    letter-spacing: 0.1em; text-transform: uppercase; color: #6366f1;
                    padding: 0.72rem 1rem; text-align: left;
                    border-bottom: 1.5px solid #e0e7ff; white-space: nowrap;
                }

                .mc-table th:first-child { border-radius: 10px 0 0 0; text-align: center; }
                .mc-table th:last-child  { border-radius: 0 10px 0 0; text-align: center; }

                .mc-table tbody tr { transition: background 0.15s; }
                .mc-table tbody tr:hover { background: #fafafa; }

                .mc-table td {
                    padding: 0.72rem 1rem; color: #374151;
                    vertical-align: middle; border-bottom: 1px solid #f3f4f6;
                }

                .mc-table td:first-child { text-align: center; color: #9ca3af; font-weight: 500; }

                /* ── Company name cell ── */
                .mc-biz-cell {
                    display: flex; align-items: center; gap: 0.65rem;
                }

                .mc-biz-avatar {
                    width: 32px; height: 32px; border-radius: 8px;
                    object-fit: cover; border: 1px solid #e5e7eb;
                    background: #f3f4f6; flex-shrink: 0;
                }

                .mc-biz-name { font-weight: 600; color: #1e1b4b; }

                /* ── Status badge ── */
                .mc-status {
                    display: inline-flex; align-items: center; gap: 0.32rem;
                    border-radius: 999px; padding: 0.2rem 0.65rem;
                    font-size: 0.71rem; font-weight: 500;
                }

                .mc-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

                .mc-status.approved { background: rgba(16,185,129,0.1);  color: #059669; }
                .mc-status.approved .mc-status-dot { background: #10b981; }
                .mc-status.pending  { background: rgba(245,158,11,0.1);  color: #d97706; }
                .mc-status.pending .mc-status-dot  { background: #f59e0b; }

                /* ── Tax code chip ── */
                .mc-tax {
                    font-size: 0.75rem; color: #6b7280;
                    background: #f3f4f6; border-radius: 6px;
                    padding: 0.15rem 0.5rem; font-family: 'Sora', monospace;
                }

                /* ── Actions ── */
                .mc-actions { display: flex; align-items: center; justify-content: center; gap: 0.35rem; }

                .mc-action-btn {
                    background: none; border: none; cursor: pointer;
                    width: 30px; height: 30px; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.9rem; transition: background 0.15s; text-decoration: none;
                }

                .mc-action-btn.swap  { color: #6366f1; }
                .mc-action-btn.swap:hover  { background: rgba(99,102,241,0.1); }
                .mc-action-btn.view  { color: #10b981; }
                .mc-action-btn.view:hover  { background: rgba(16,185,129,0.1); }

                /* ── Empty ── */
                .mc-empty { text-align: center; padding: 3rem 0; color: #9ca3af; }
                .mc-empty i { font-size: 2rem; display: block; margin-bottom: 0.6rem; color: #d1d5db; }

                /* ── Pagination ── */
                .mc-pagination { display: flex; justify-content: center; margin-top: 1.25rem; }
            `}</style>

            <div className="mc-page">
                <h2 className="mc-heading mb-2">Quản lý doanh nghiệp</h2>

                <div className="mc-card">
                    <div className="mc-search-row">
                        <div className="mc-input-wrap">
                            <SearchOutlined />
                            <input
                                type="text"
                                className="mc-input"
                                placeholder="Tìm theo tên doanh nghiệp..."
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSearch()}
                            />
                        </div>

                        <div className="mc-select-wrap">
                            <select
                                className="mc-select"
                                value={selectValue}
                                onChange={e => setSelectValue(e.target.value)}
                            >
                                <option value="">-- Trạng thái --</option>
                                <option value="true">Đã kiểm duyệt</option>
                                <option value="false">Chưa kiểm duyệt</option>
                            </select>
                        </div>

                        <button type="button" className="mc-btn mc-btn-primary" onClick={handleSearch}>
                            <SearchOutlined /> Tìm kiếm
                        </button>
                        <button type="button" className="mc-btn mc-btn-ghost" onClick={hanleReset}>
                            <RedoOutlined /> Đặt lại
                        </button>
                    </div>

                    <hr className="mc-divider" />
                    <p className="mc-section"><i className="fa-solid fa-building" />Danh sách doanh nghiệp</p>

                    <div className="mc-table-wrap">
                        <table className="mc-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên doanh nghiệp</th>
                                    <th>Mã số thuế</th>
                                    <th>Địa chỉ</th>
                                    <th>Điện thoại</th>
                                    <th>Trạng thái</th>
                                    <th style={{ textAlign: "center" }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listJob?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7}>
                                            <div className="mc-empty">
                                                <i className="fa-regular fa-building" />
                                                <p>Không tìm thấy doanh nghiệp nào.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    listJob?.map((job, index) => (
                                        <tr key={job._id}>
                                            <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                            <td>
                                                <div className="mc-biz-cell">
                                                    {job.imageAvatarBusiness && (
                                                        <img src={job.imageAvatarBusiness} className="mc-biz-avatar" alt="" />
                                                    )}
                                                    <span className="mc-biz-name">{job.nameBusiness}</span>
                                                </div>
                                            </td>
                                            <td><span className="mc-tax">{job.taxiCodeBusiness}</span></td>
                                            <td style={{ color: "#6b7280", fontSize: "0.8rem", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {job.addressBusiness}
                                            </td>
                                            <td>{job.phoneBusiness}</td>
                                            <td>
                                                <span className={`mc-status ${job.statusBusiness ? "approved" : "pending"}`}>
                                                    <span className="mc-status-dot" />
                                                    {job.statusBusiness ? "Đã duyệt" : "Chờ duyệt"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="mc-actions">
                                                    <button
                                                        className="mc-action-btn swap"
                                                        onClick={() => hanleChangeStatus(job._id)}
                                                        title="Đổi trạng thái"
                                                    >
                                                        <SwapOutlined />
                                                    </button>
                                                    <Link
                                                        to={`${path.COMPANYADMIN}/${job._id}`}
                                                        className="mc-action-btn view"
                                                        title="Xem chi tiết"
                                                    >
                                                        <InfoCircleOutlined />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mc-pagination">
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

export default ManagerCompany;
