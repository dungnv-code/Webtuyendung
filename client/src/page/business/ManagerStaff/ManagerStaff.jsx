import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getStaffs, deleteStaff } from "../../../api/business";
import { DeleteTwoTone, SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";

const ManagerStaff = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [listJob, setListJob] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [loaddata, setLoaddata] = useState(false);
    const [focused, setFocused] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getStaffs({ page: currentPage, limit });
                setListJob(response.data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Error fetching staffs:", error);
            }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);

    const hanleDeleteJob = async (id) => {
        try {
            await deleteStaff(id);
            setInputValue("");
            setCurrentPage(1);
            toast.success("Xoá nhân viên thành công!");
            setLoaddata(!loaddata);
        } catch (error) { }
    };

    const hanleSearch = async () => {
        try {
            const response = await getStaffs({ page: currentPage, limit, username: inputValue });
            setListJob(response.data);
            setTotalPages(response.totalPages);
        } catch (error) { }
    };

    const hanleReset = async () => {
        setInputValue("");
        try {
            const response = await getStaffs({ page: currentPage, limit });
            setListJob(response.data);
            setTotalPages(response.totalPages);
        } catch (error) { }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .ms-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 55%, #f0fdf4 100%);
                    padding: 1rem 1rem;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .ms-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #1e1b4b;
                    text-align: center;
                    margin-bottom: 0.35rem;
                    letter-spacing: -0.02em;
                }

                .ms-sub {
                    text-align: center;
                    font-size: 0.8rem;
                    color: #9ca3af;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 1rem;
                }

                /* ── Card wrap ── */
                .ms-card {
                    width: 100%;
                    max-width: 900px;
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.08);
                    padding: 2rem 2rem 1.5rem;
                    position: relative;
                    overflow: hidden;
                }

                .ms-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #6366f1, #06b6d4);
                    border-radius: 20px 20px 0 0;
                }

                /* ── Search bar ── */
                .ms-search-row {
                    display: flex;
                    gap: 0.75rem;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                }

                .ms-input-wrap {
                    flex: 1;
                    min-width: 180px;
                    position: relative;
                }

                .ms-input-wrap i,
                .ms-input-wrap .anticon {
                    position: absolute;
                    left: 0.85rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #a5b4fc;
                    font-size: 0.8rem;
                    pointer-events: none;
                }

                .ms-input {
                    width: 100%;
                    background: #f9fafb;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 10px;
                    padding: 0.62rem 0.95rem 0.62rem 2.3rem;
                    color: #111827;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.88rem;
                    outline: none;
                    transition: border-color 0.22s, box-shadow 0.22s, background 0.22s;
                }

                .ms-input:focus {
                    background: #fff;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.11);
                }

                .ms-input::placeholder { color: #c4c9d4; }

                /* ── Buttons ── */
                .ms-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.62rem 1.2rem;
                    border-radius: 10px;
                    border: none;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.82rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: transform 0.15s, box-shadow 0.15s;
                    white-space: nowrap;
                }

                .ms-btn:hover { transform: translateY(-1px); }
                .ms-btn:active { transform: translateY(0); }

                .ms-btn-primary {
                    background: linear-gradient(135deg, #6366f1, #06b6d4);
                    color: #fff;
                    box-shadow: 0 4px 14px rgba(99,102,241,0.25);
                }

                .ms-btn-primary:hover { box-shadow: 0 6px 20px rgba(99,102,241,0.35); }

                .ms-btn-ghost {
                    background: #f3f4f6;
                    color: #6b7280;
                    border: 1.5px solid #e5e7eb;
                }

                .ms-btn-ghost:hover { background: #e5e7eb; }

                /* ── Divider ── */
                .ms-divider {
                    border: none;
                    border-top: 1px dashed #e5e7eb;
                    margin: 0 0 1.25rem;
                }

                /* ── Table ── */
                .ms-table-wrap {
                    width: 100%;
                    overflow-x: auto;
                }

                .ms-table {
                    width: 100%;
                    min-width: 650px;
                    border-collapse: separate;
                    border-spacing: 0;
                    font-size: 0.85rem;
                }

                .ms-table thead tr {
                    background: #f5f3ff;
                }

                .ms-table th {
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

                .ms-table th:first-child { border-radius: 10px 0 0 0; }
                .ms-table th:last-child  { border-radius: 0 10px 0 0; text-align: center; }

                .ms-table tbody tr {
                    transition: background 0.15s;
                    border-bottom: 1px solid #f3f4f6;
                }

                .ms-table tbody tr:hover { background: #fafafa; }

                .ms-table td {
                    padding: 0.75rem 1rem;
                    color: #374151;
                    vertical-align: middle;
                    border-bottom: 1px solid #f3f4f6;
                }

                .ms-table td:last-child { text-align: center; }

                /* ── Status badge ── */
                .ms-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    border-radius: 999px;
                    padding: 0.2rem 0.65rem;
                    font-size: 0.71rem;
                    font-weight: 500;
                }

                .ms-badge-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                .ms-badge.active  { background: rgba(16,185,129,0.1); color: #059669; }
                .ms-badge.active .ms-badge-dot { background: #10b981; }
                .ms-badge.blocked { background: rgba(244,63,94,0.1);  color: #f43f5e; }
                .ms-badge.blocked .ms-badge-dot { background: #f43f5e; }

                /* ── Role badge ── */
                .ms-role {
                    display: inline-block;
                    background: rgba(99,102,241,0.1);
                    color: #6366f1;
                    border-radius: 999px;
                    padding: 0.18rem 0.6rem;
                    font-size: 0.71rem;
                    font-weight: 500;
                }

                /* ── Delete btn ── */
                .ms-del {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.3rem 0.55rem;
                    border-radius: 8px;
                    transition: background 0.15s;
                    font-size: 1rem;
                }

                .ms-del:hover { background: rgba(244,63,94,0.08); }

                /* ── Empty ── */
                .ms-empty {
                    text-align: center;
                    padding: 3rem 0;
                    color: #9ca3af;
                }

                .ms-empty i {
                    font-size: 2rem;
                    display: block;
                    margin-bottom: 0.6rem;
                    color: #d1d5db;
                }

                /* ── Pagination row ── */
                .ms-pagination {
                    display: flex;
                    justify-content: center;
                    margin-top: 1.25rem;
                }
            `}</style>

            <div className="ms-page">
                <h2 className="ms-heading">Quản lý nhân viên</h2>
                <p className="ms-sub">Danh sách tài khoản trong doanh nghiệp</p>

                <div className="ms-card">
                    {/* Search */}
                    <div className="ms-search-row">
                        <div className="ms-input-wrap">
                            <SearchOutlined />
                            <input
                                type="text"
                                className="ms-input"
                                placeholder="Tìm theo tên nhân viên..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && hanleSearch()}
                            />
                        </div>
                        <button type="button" className="ms-btn ms-btn-primary" onClick={hanleSearch}>
                            <SearchOutlined /> Tìm kiếm
                        </button>
                        <button type="button" className="ms-btn ms-btn-ghost" onClick={hanleReset}>
                            <RedoOutlined /> Đặt lại
                        </button>
                    </div>

                    <hr className="ms-divider" />

                    {/* Table */}
                    <div className="ms-table-wrap">
                        <table className="ms-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên nhân viên</th>
                                    <th>Email</th>
                                    <th>Điện thoại</th>
                                    <th>Vai trò</th>
                                    <th>Trạng thái</th>
                                    <th>Xoá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listJob?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7}>
                                            <div className="ms-empty">
                                                <i className="fa-regular fa-user" />
                                                <p>Không tìm thấy nhân viên nào.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    listJob?.map((job, index) => (
                                        <tr key={job._id}>
                                            <td style={{ color: "#9ca3af", fontWeight: 500 }}>
                                                {(currentPage - 1) * limit + (index + 1)}
                                            </td>
                                            <td style={{ fontWeight: 500, color: "#1e1b4b" }}>{job.username}</td>
                                            <td style={{ color: "#6b7280" }}>{job.email}</td>
                                            <td>{job.phone}</td>
                                            <td>
                                                <span className="ms-role">
                                                    {job.role === "STAFF" ? "Nhân viên" : job.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`ms-badge ${job.status === "Active" ? "active" : "blocked"}`}>
                                                    <span className="ms-badge-dot" />
                                                    {job.status === "Active" ? "Hoạt động" : "Đã chặn"}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="ms-del" onClick={() => hanleDeleteJob(job._id)} title="Xoá nhân viên">
                                                    <DeleteTwoTone twoToneColor="#f43f5e" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="ms-pagination">
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

export default ManagerStaff;
