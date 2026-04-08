import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getAllUser, deleteUser, changeStatusUser } from "../../../api/job";
import { DeleteTwoTone, SwapOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";

const roleLabel = {
    ungvien: { text: "Ứng viên", color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
    nhatuyendung: { text: "Nhà tuyển dụng", color: "#f97316", bg: "rgba(249,115,22,0.1)" },
    STAFF: { text: "Nhân viên TD", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
};

const ManagerUser = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [listJob, setListJob] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState({});
    const [loaddata, setLoaddata] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllUser({ page: currentPage, limit, role: "ungvien,nhatuyendung,STAFF" });
                setListJob(response.data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);

    const hanleDeleteJob = async (id) => {
        try {
            await deleteUser(id);
            setInputValue(""); setCurrentPage(1);
            toast.success("Xoá người dùng thành công!");
            setLoaddata(!loaddata);
        } catch (error) { }
    };

    const hanleSearch = async () => {
        const newError = {};
        if (!inputValue.trim()) newError.inputValue = "Vui lòng nhập tên người dùng bạn muốn tìm!";
        setError(newError);
        if (Object.keys(newError).length === 0) {
            try {
                const response = await getAllUser({ page: currentPage, limit, username: inputValue, role: "ungvien,nhatuyendung,STAFF" });
                setListJob(response.data);
                setTotalPages(response.totalPages);
            } catch (error) { }
        }
    };

    const hanleReset = async () => {
        setInputValue(""); setError({});
        try {
            const response = await getAllUser({ page: currentPage, limit, role: "ungvien,nhatuyendung,STAFF" });
            setListJob(response.data);
            setTotalPages(response.totalPages);
        } catch (error) { }
    };

    const hanleChangeStatus = async (id) => {
        try {
            await changeStatusUser(id);
            setCurrentPage(1);
            toast.success("Cập nhật trạng thái thành công!");
            setLoaddata(!loaddata);
        } catch (error) { }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .mu-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 55%, #fff7ed 100%);
                    padding: 1rem 1rem;
                    font-family: 'Inter', sans-serif;
                    display: flex; flex-direction: column; align-items: center;
                }

                .mu-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem; font-weight: 700; color: #1e1b4b;
                    text-align: center; margin-bottom: 0.35rem; letter-spacing: -0.02em;
                }

                .mu-sub {
                    text-align: center; font-size: 0.8rem; color: #9ca3af;
                    letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2rem;
                }

                /* ── Card ── */
                .mu-card {
                    width: 100%; max-width: 1050px;
                    background: #fff; border-radius: 20px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.08);
                    padding: 2rem 1.75rem 1.5rem;
                    position: relative; overflow: hidden;
                }

                .mu-card::before {
                    content: ''; position: absolute;
                    top: 0; left: 0; right: 0; height: 3px;
                    background: linear-gradient(90deg, #6366f1, #f97316);
                    border-radius: 20px 20px 0 0;
                }

                /* ── Search ── */
                .mu-search-row {
                    display: flex; gap: 0.75rem;
                    align-items: flex-start; margin-bottom: 0rem; flex-wrap: wrap;
                }

                .mu-input-wrap { flex: 1; min-width: 200px; position: relative; }

                .mu-input-wrap .anticon {
                    position: absolute; left: 0.85rem; top: 50%;
                    transform: translateY(-50%); color: #a5b4fc; font-size: 0.8rem; pointer-events: none;
                }

                .mu-input {
                    width: 100%; background: #f9fafb;
                    border: 1.5px solid #e5e7eb; border-radius: 10px;
                    padding: 0.62rem 0.95rem 0.62rem 2.3rem;
                    color: #111827; font-family: 'Inter', sans-serif;
                    font-size: 0.88rem; outline: none;
                    transition: border-color 0.22s, box-shadow 0.22s, background 0.22s;
                }

                .mu-input:focus {
                    background: #fff; border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.11);
                }

                .mu-input.err { border-color: #f43f5e; }
                .mu-input::placeholder { color: #c4c9d4; }
                .mu-err { font-size: 0.71rem; color: #f43f5e; margin-top: 0.28rem; }

                /* ── Buttons ── */
                .mu-btn {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    padding: 0.62rem 1.2rem; border-radius: 10px; border: none;
                    font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 500;
                    cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; white-space: nowrap;
                }

                .mu-btn:hover { transform: translateY(-1px); }
                .mu-btn:active { transform: translateY(0); }

                .mu-btn-primary {
                    background: linear-gradient(135deg, #6366f1, #f97316);
                    color: #fff; box-shadow: 0 4px 14px rgba(99,102,241,0.22);
                }

                .mu-btn-primary:hover { box-shadow: 0 6px 20px rgba(99,102,241,0.32); }

                .mu-btn-ghost {
                    background: #f3f4f6; color: #6b7280; border: 1.5px solid #e5e7eb;
                }

                .mu-btn-ghost:hover { background: #e5e7eb; }

                /* ── Divider ── */
                .mu-divider { border: none; border-top: 1px dashed #e5e7eb; margin: 0 0 1.25rem; }

                /* ── Section label ── */
                .mu-section {
                    font-family: 'Sora', sans-serif; font-size: 0.69rem; font-weight: 600;
                    letter-spacing: 0.12em; text-transform: uppercase; color: #6366f1;
                    margin: 0 0 1.1rem; display: flex; align-items: center; gap: 0.5rem;
                }

                .mu-section::after {
                    content: ''; flex: 1; height: 1px;
                    background: linear-gradient(90deg, #e0e7ff, transparent);
                }

                /* ── Table ── */
                .mu-table-wrap { width: 100%; overflow-x: auto; }

                .mu-table {
                    width: 100%; min-width: 750px;
                    border-collapse: separate; border-spacing: 0; font-size: 0.83rem;
                }

                .mu-table thead tr { background: #f5f3ff; }

                .mu-table th {
                    font-family: 'Sora', sans-serif; font-size: 0.67rem; font-weight: 600;
                    letter-spacing: 0.1em; text-transform: uppercase; color: #6366f1;
                    padding: 0.72rem 1rem; text-align: left;
                    border-bottom: 1.5px solid #e0e7ff; white-space: nowrap;
                }

                .mu-table th:first-child { border-radius: 10px 0 0 0; text-align: center; }
                .mu-table th:last-child  { border-radius: 0 10px 0 0; text-align: center; }

                .mu-table tbody tr { transition: background 0.15s; }
                .mu-table tbody tr:hover { background: #fafafa; }

                .mu-table td {
                    padding: 0.72rem 1rem; color: #374151;
                    vertical-align: middle; border-bottom: 1px solid #f3f4f6;
                }

                .mu-table td:first-child { text-align: center; color: #9ca3af; font-weight: 500; }

                /* ── Role badge ── */
                .mu-role {
                    display: inline-block; border-radius: 999px;
                    padding: 0.18rem 0.65rem; font-size: 0.71rem; font-weight: 600;
                }

                /* ── Status badge ── */
                .mu-status {
                    display: inline-flex; align-items: center; gap: 0.32rem;
                    border-radius: 999px; padding: 0.2rem 0.65rem;
                    font-size: 0.71rem; font-weight: 500;
                }

                .mu-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

                .mu-status.active  { background: rgba(16,185,129,0.1); color: #059669; }
                .mu-status.active .mu-status-dot  { background: #10b981; }
                .mu-status.blocked { background: rgba(244,63,94,0.1);  color: #f43f5e; }
                .mu-status.blocked .mu-status-dot { background: #f43f5e; }

                /* ── Action buttons ── */
                .mu-actions { display: flex; align-items: center; justify-content: center; gap: 0.35rem; }

                .mu-action-btn {
                    background: none; border: none; cursor: pointer;
                    width: 30px; height: 30px; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.9rem; transition: background 0.15s;
                }

                .mu-action-btn.swap  { color: #6366f1; }
                .mu-action-btn.swap:hover  { background: rgba(99,102,241,0.1); }
                .mu-action-btn.del   { color: #f43f5e; }
                .mu-action-btn.del:hover   { background: rgba(244,63,94,0.08); }

                /* ── Empty ── */
                .mu-empty { text-align: center; padding: 3rem 0; color: #9ca3af; }
                .mu-empty i { font-size: 2rem; display: block; margin-bottom: 0.6rem; color: #d1d5db; }

                /* ── Pagination ── */
                .mu-pagination { display: flex; justify-content: center; margin-top: 1.25rem; }
            `}</style>

            <div className="mu-page">
                <h2 className="mu-heading mb-2">Quản lý người dùng</h2>

                <div className="mu-card">
                    {/* Search */}
                    <div className="mu-search-row">
                        <div>
                            <div className="mu-input-wrap">
                                <SearchOutlined />
                                <input
                                    type="text"
                                    className={`mu-input ${error.inputValue ? "err" : ""}`}
                                    placeholder="Tìm theo tên người dùng..."
                                    value={inputValue}
                                    onChange={e => { setInputValue(e.target.value); setError({}); }}
                                    onKeyDown={e => e.key === "Enter" && hanleSearch()}
                                />
                            </div>
                            {error.inputValue && <p className="mu-err">✕ {error.inputValue}</p>}
                        </div>
                        <button type="button" className="mu-btn mu-btn-primary" onClick={hanleSearch}>
                            <SearchOutlined /> Tìm kiếm
                        </button>
                        <button type="button" className="mu-btn mu-btn-ghost" onClick={hanleReset}>
                            <RedoOutlined /> Đặt lại
                        </button>
                    </div>

                    <hr className="mu-divider" />
                    <p className="mu-section"><i className="fa-solid fa-users" />Danh sách người dùng</p>

                    <div className="mu-table-wrap">
                        <table className="mu-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên người dùng</th>
                                    <th>Email</th>
                                    <th>Điện thoại</th>
                                    <th>Vai trò</th>
                                    <th>Trạng thái</th>
                                    <th style={{ textAlign: "center" }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listJob?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7}>
                                            <div className="mu-empty">
                                                <i className="fa-regular fa-user" />
                                                <p>Không tìm thấy người dùng nào.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    listJob?.map((job, index) => {
                                        const role = roleLabel[job.role] || { text: job.role, color: "#6b7280", bg: "#f3f4f6" };
                                        return (
                                            <tr key={job._id}>
                                                <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                                <td style={{ fontWeight: 600, color: "#1e1b4b" }}>{job.username}</td>
                                                <td style={{ color: "#6b7280" }}>{job.email}</td>
                                                <td>{job.phone}</td>
                                                <td>
                                                    <span className="mu-role" style={{ background: role.bg, color: role.color }}>
                                                        {role.text}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`mu-status ${job.status === "Active" ? "active" : "blocked"}`}>
                                                        <span className="mu-status-dot" />
                                                        {job.status === "Active" ? "Hoạt động" : "Đã chặn"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="mu-actions">
                                                        <button
                                                            className="mu-action-btn swap"
                                                            onClick={() => hanleChangeStatus(job._id)}
                                                            title="Đổi trạng thái"
                                                        >
                                                            <SwapOutlined />
                                                        </button>
                                                        <button
                                                            className="mu-action-btn del"
                                                            onClick={() => hanleDeleteJob(job._id)}
                                                            title="Xoá người dùng"
                                                        >
                                                            <DeleteTwoTone twoToneColor="#f43f5e" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mu-pagination">
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

export default ManagerUser;
