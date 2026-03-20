import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getInvoidBusiness } from "../../../api/business";

const HistoryBuy = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [listJob, setListJob] = useState([]);
    const [loaddata] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getInvoidBusiness({ page: currentPage, limit });
                setListJob(response.data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Error fetching invoices:", error);
            }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    };

    const totalSpent = listJob.reduce((sum, j) => sum + (j.totalPrice || 0), 0);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .hb-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 55%, #fff7ed 100%);
                    padding: 3rem 1rem;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .hb-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #1e1b4b;
                    text-align: center;
                    margin-bottom: 0.35rem;
                    letter-spacing: -0.02em;
                }

                .hb-sub {
                    text-align: center;
                    font-size: 0.8rem;
                    color: #9ca3af;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 2rem;
                }

                /* ── Stats row ── */
                .hb-stats {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    width: 100%;
                    max-width: 900px;
                    flex-wrap: wrap;
                }

                .hb-stat {
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

                .hb-stat-icon {
                    width: 40px; height: 40px;
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                }

                .hb-stat-icon.purple { background: rgba(99,102,241,0.12); color: #6366f1; }
                .hb-stat-icon.orange { background: rgba(249,115,22,0.12); color: #f97316; }
                .hb-stat-icon.green  { background: rgba(16,185,129,0.12); color: #10b981; }

                .hb-stat-label {
                    font-size: 0.7rem;
                    color: #9ca3af;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    font-weight: 500;
                    margin-bottom: 0.15rem;
                }

                .hb-stat-value {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1e1b4b;
                }

                /* ── Card ── */
                .hb-card {
                    width: 100%;
                    max-width: 900px;
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.08);
                    padding: 1.75rem 1.75rem 1.5rem;
                    position: relative;
                    overflow: hidden;
                }

                .hb-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #6366f1, #f97316);
                    border-radius: 20px 20px 0 0;
                }

                /* ── Section label ── */
                .hb-section {
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

                .hb-section::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, #e0e7ff, transparent);
                }

                /* ── Table ── */
                .hb-table-wrap {
                    width: 100%;
                    overflow-x: auto;
                }

                .hb-table {
                    width: 100%;
                    min-width: 620px;
                    border-collapse: separate;
                    border-spacing: 0;
                    font-size: 0.85rem;
                }

                .hb-table thead tr { background: #f5f3ff; }

                .hb-table th {
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

                .hb-table th:first-child { border-radius: 10px 0 0 0; text-align: center; }
                .hb-table th:last-child  { border-radius: 0 10px 0 0; }

                .hb-table tbody tr { transition: background 0.15s; }
                .hb-table tbody tr:hover { background: #fafafa; }

                .hb-table td {
                    padding: 0.75rem 1rem;
                    color: #374151;
                    vertical-align: middle;
                    border-bottom: 1px solid #f3f4f6;
                }

                .hb-table td:first-child { text-align: center; color: #9ca3af; font-weight: 500; }

                /* ── Price badge ── */
                .hb-price {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    font-family: 'Sora', sans-serif;
                    font-weight: 700;
                    color: #f97316;
                    font-size: 0.88rem;
                }

                /* ── Date chip ── */
                .hb-date {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    background: #f3f4f6;
                    border-radius: 999px;
                    padding: 0.22rem 0.65rem;
                    font-size: 0.74rem;
                    color: #6b7280;
                }

                .hb-date i { color: #a5b4fc; font-size: 0.65rem; }

                /* ── Amount badge ── */
                .hb-amount {
                    display: inline-block;
                    background: rgba(99,102,241,0.1);
                    color: #6366f1;
                    border-radius: 999px;
                    padding: 0.18rem 0.6rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                /* ── Empty ── */
                .hb-empty {
                    text-align: center;
                    padding: 3rem 0;
                    color: #9ca3af;
                }

                .hb-empty i {
                    font-size: 2rem;
                    display: block;
                    margin-bottom: 0.6rem;
                    color: #d1d5db;
                }

                /* ── Pagination ── */
                .hb-pagination {
                    display: flex;
                    justify-content: center;
                    margin-top: 1.25rem;
                }

                /* ── Divider ── */
                .hb-divider {
                    border: none;
                    border-top: 1px dashed #e5e7eb;
                    margin: 0 0 1.25rem;
                }
            `}</style>

            <div className="hb-page">
                <h2 className="hb-heading">Lịch sử giao dịch</h2>
                <p className="hb-sub">Tổng hợp các hoá đơn đã thanh toán</p>

                {/* ── Stats ── */}
                <div className="hb-stats">
                    <div className="hb-stat">
                        <div className="hb-stat-icon purple">
                            <i className="fa-solid fa-receipt" />
                        </div>
                        <div>
                            <p className="hb-stat-label">Tổng hoá đơn</p>
                            <p className="hb-stat-value">{listJob.length}</p>
                        </div>
                    </div>
                    <div className="hb-stat">
                        <div className="hb-stat-icon orange">
                            <i className="fa-solid fa-dollar-sign" />
                        </div>
                        <div>
                            <p className="hb-stat-label">Tổng chi tiêu</p>
                            <p className="hb-stat-value">${totalSpent}</p>
                        </div>
                    </div>
                    <div className="hb-stat">
                        <div className="hb-stat-icon green">
                            <i className="fa-solid fa-file-lines" />
                        </div>
                        <div>
                            <p className="hb-stat-label">Trang hiện tại</p>
                            <p className="hb-stat-value">{currentPage} / {totalPages || 1}</p>
                        </div>
                    </div>
                </div>

                {/* ── Table card ── */}
                <div className="hb-card">
                    <p className="hb-section"><i className="fa-solid fa-clock-rotate-left" />Danh sách giao dịch</p>
                    <hr className="hb-divider" />

                    <div className="hb-table-wrap">
                        <table className="hb-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên hoá đơn</th>
                                    <th>Số lượng đăng</th>
                                    <th>Số lượng mua</th>
                                    <th>Tổng tiền</th>
                                    <th>Ngày mua</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listJob?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="hb-empty">
                                                <i className="fa-regular fa-file" />
                                                <p>Chưa có giao dịch nào.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    listJob?.map((job, index) => (
                                        <tr key={job._id}>
                                            <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                            <td style={{ fontWeight: 500, color: "#1e1b4b" }}>{job.title}</td>
                                            <td><span className="hb-amount">{job.value}</span></td>
                                            <td><span className="hb-amount">{job.amount}</span></td>
                                            <td><span className="hb-price"><i className="fa-solid fa-dollar-sign" style={{ fontSize: "0.75rem" }} />{job.totalPrice}</span></td>
                                            <td>
                                                <span className="hb-date">
                                                    <i className="fa-regular fa-calendar" />
                                                    {formatDate(job.createdAt)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="hb-pagination">
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

export default HistoryBuy;
