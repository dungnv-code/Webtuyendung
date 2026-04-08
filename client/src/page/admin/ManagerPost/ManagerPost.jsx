import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getAllPostjobs, changeStatusPostjobs } from "../../../api/job";
import { SwapOutlined, SearchOutlined, RedoOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import path from "../../../ultils/path";

const ManagerPost = () => {
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
                const response = await getAllPostjobs({ page: currentPage, limit });
                setListJob(response.data); setTotalPages(response.totalPages);
            } catch (error) { console.error(error); }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);

    const handleSearch = async () => {
        try {
            const response = await getAllPostjobs({ page: currentPage, limit, title: inputValue || undefined, status: selectValue || undefined });
            setListJob(response.data); setTotalPages(response.totalPages);
        } catch (error) { console.error(error); }
    };

    const hanleReset = async () => {
        setInputValue(""); setSelectValue("");
        try {
            const response = await getAllPostjobs({ page: currentPage, limit });
            setListJob(response.data); setTotalPages(response.totalPages);
        } catch (error) { }
    };

    const hanleChangeStatus = async (id) => {
        try {
            await changeStatusPostjobs(id); setCurrentPage(1);
            toast.success("Cập nhật trạng thái bài đăng thành công!"); setLoaddata(!loaddata);
        } catch (error) { }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
                .mp-page { min-height:100vh; background:linear-gradient(160deg,#f0f4ff 0%,#fafafa 55%,#f0fdf4 100%); padding:1rem 1rem; font-family:'Inter',sans-serif; display:flex; flex-direction:column; align-items:center; }
                .mp-heading { font-family:'Sora',sans-serif; font-size:1.6rem; font-weight:700; color:#1e1b4b; text-align:center; margin-bottom:0.35rem; letter-spacing:-0.02em; }
                .mp-sub { text-align:center; font-size:0.8rem; color:#9ca3af; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:2rem; }
                .mp-card { width:100%; max-width:1100px; background:#fff; border-radius:20px; border:1px solid #eef0f6; box-shadow:0 8px 32px rgba(99,102,241,0.08); padding:2rem 1.75rem 1.5rem; position:relative; overflow:hidden; }
                .mp-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#6366f1,#10b981); border-radius:20px 20px 0 0; }
                .mp-search-row { display:flex; gap:0.75rem; align-items:center; margin-bottom:0rem; flex-wrap:wrap; }
                .mp-input-wrap { flex:1; min-width:180px; position:relative; }
                .mp-input-wrap .anticon { position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); color:#a5b4fc; font-size:0.8rem; pointer-events:none; }
                .mp-input { width:100%; background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:10px; padding:0.62rem 0.95rem 0.62rem 2.3rem; color:#111827; font-family:'Inter',sans-serif; font-size:0.88rem; outline:none; transition:border-color 0.22s,box-shadow 0.22s,background 0.22s; }
                .mp-input:focus { background:#fff; border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.11); }
                .mp-input::placeholder { color:#c4c9d4; }
                .mp-select-wrap { position:relative; min-width:180px; }
                .mp-select-wrap::after { content:'▾'; position:absolute; right:0.85rem; top:50%; transform:translateY(-50%); color:#9ca3af; font-size:0.75rem; pointer-events:none; }
                .mp-select { width:100%; background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:10px; padding:0.62rem 2rem 0.62rem 0.95rem; color:#111827; font-family:'Inter',sans-serif; font-size:0.88rem; outline:none; appearance:none; transition:border-color 0.22s,box-shadow 0.22s; }
                .mp-select:focus { background:#fff; border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.11); }
                .mp-btn { display:inline-flex; align-items:center; gap:0.4rem; padding:0.62rem 1.2rem; border-radius:10px; border:none; font-family:'Inter',sans-serif; font-size:0.82rem; font-weight:500; cursor:pointer; transition:transform 0.15s,box-shadow 0.15s; white-space:nowrap; }
                .mp-btn:hover { transform:translateY(-1px); }
                .mp-btn:active { transform:translateY(0); }
                .mp-btn-primary { background:linear-gradient(135deg,#6366f1,#10b981); color:#fff; box-shadow:0 4px 14px rgba(99,102,241,0.22); }
                .mp-btn-primary:hover { box-shadow:0 6px 20px rgba(99,102,241,0.32); }
                .mp-btn-ghost { background:#f3f4f6; color:#6b7280; border:1.5px solid #e5e7eb; }
                .mp-btn-ghost:hover { background:#e5e7eb; }
                .mp-divider { border:none; border-top:1px dashed #e5e7eb; margin:0 0 1.25rem; }
                .mp-section { font-family:'Sora',sans-serif; font-size:0.69rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#6366f1; margin:0 0 1.1rem; display:flex; align-items:center; gap:0.5rem; }
                .mp-section::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#e0e7ff,transparent); }
                .mp-table-wrap { width:100%; overflow-x:auto; }
                .mp-table { width:100%; min-width:780px; border-collapse:separate; border-spacing:0; font-size:0.83rem; }
                .mp-table thead tr { background:#f5f3ff; }
                .mp-table th { font-family:'Sora',sans-serif; font-size:0.67rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#6366f1; padding:0.72rem 1rem; text-align:left; border-bottom:1.5px solid #e0e7ff; white-space:nowrap; }
                .mp-table th:first-child { border-radius:10px 0 0 0; text-align:center; }
                .mp-table th:last-child  { border-radius:0 10px 0 0; text-align:center; }
                .mp-table tbody tr { transition:background 0.15s; }
                .mp-table tbody tr:hover { background:#fafafa; }
                .mp-table td { padding:0.72rem 1rem; color:#374151; vertical-align:middle; border-bottom:1px solid #f3f4f6; }
                .mp-table td:first-child { text-align:center; color:#9ca3af; font-weight:500; }
                .mp-chip { display:inline-block; background:rgba(99,102,241,0.1); color:#6366f1; border-radius:999px; padding:0.18rem 0.65rem; font-size:0.72rem; font-weight:500; }
                .mp-status { display:inline-flex; align-items:center; gap:0.32rem; border-radius:999px; padding:0.2rem 0.65rem; font-size:0.71rem; font-weight:500; }
                .mp-status-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
                .mp-status.approved { background:rgba(16,185,129,0.1); color:#059669; }
                .mp-status.approved .mp-status-dot { background:#10b981; }
                .mp-status.pending  { background:rgba(245,158,11,0.1);  color:#d97706; }
                .mp-status.pending .mp-status-dot  { background:#f59e0b; }
                .mp-actions { display:flex; align-items:center; justify-content:center; gap:0.35rem; }
                .mp-action-btn { background:none; border:none; cursor:pointer; width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.9rem; transition:background 0.15s; text-decoration:none; }
                .mp-action-btn.swap  { color:#6366f1; }
                .mp-action-btn.swap:hover  { background:rgba(99,102,241,0.1); }
                .mp-action-btn.view  { color:#10b981; }
                .mp-action-btn.view:hover  { background:rgba(16,185,129,0.1); }
                .mp-empty { text-align:center; padding:3rem 0; color:#9ca3af; }
                .mp-empty i { font-size:2rem; display:block; margin-bottom:0.6rem; color:#d1d5db; }
                .mp-pagination { display:flex; justify-content:center; margin-top:1.25rem; }
            `}</style>

            <div className="mp-page">
                <h2 className="mp-heading mb-2">Quản lý bài đăng</h2>

                <div className="mp-card">
                    <div className="mp-search-row">
                        <div className="mp-input-wrap">
                            <SearchOutlined />
                            <input type="text" className="mp-input" placeholder="Tìm theo tên bài đăng..."
                                value={inputValue} onChange={e => setInputValue(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSearch()} />
                        </div>
                        <div className="mp-select-wrap">
                            <select className="mp-select" value={selectValue} onChange={e => setSelectValue(e.target.value)}>
                                <option value="">-- Trạng thái --</option>
                                <option value="active">Đã kiểm duyệt</option>
                                <option value="pendding">Chưa kiểm duyệt</option>
                            </select>
                        </div>
                        <button type="button" className="mp-btn mp-btn-primary" onClick={handleSearch}>
                            <SearchOutlined /> Tìm kiếm
                        </button>
                        <button type="button" className="mp-btn mp-btn-ghost" onClick={hanleReset}>
                            <RedoOutlined /> Đặt lại
                        </button>
                    </div>

                    <hr className="mp-divider" />
                    <p className="mp-section"><i className="fa-solid fa-file-lines" />Danh sách bài đăng</p>

                    <div className="mp-table-wrap">
                        <table className="mp-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên bài đăng</th>
                                    <th>Ngành nghề</th>
                                    <th>Kinh nghiệm</th>
                                    <th>Cấp bậc</th>
                                    <th>Trạng thái</th>
                                    <th style={{ textAlign: "center" }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listJob?.length === 0 ? (
                                    <tr><td colSpan={7}><div className="mp-empty"><i className="fa-regular fa-file-lines" /><p>Không có bài đăng nào.</p></div></td></tr>
                                ) : (
                                    listJob?.map((job, index) => (
                                        <tr key={job._id}>
                                            <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                            <td style={{ fontWeight: 600, color: "#1e1b4b", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={job.title}>{job.title}</td>
                                            <td><span className="mp-chip">{job.jobs}</span></td>
                                            <td style={{ color: "#6b7280", fontSize: "0.8rem" }}>{job.experience}</td>
                                            <td style={{ color: "#6b7280", fontSize: "0.8rem" }}>{job.joblevel}</td>
                                            <td>
                                                <span className={`mp-status ${job.status === "active" ? "approved" : "pending"}`}>
                                                    <span className="mp-status-dot" />
                                                    {job.status === "active" ? "Đã duyệt" : "Chờ duyệt"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="mp-actions">
                                                    <button className="mp-action-btn swap" title="Đổi trạng thái" onClick={() => hanleChangeStatus(job._id)}>
                                                        <SwapOutlined />
                                                    </button>
                                                    <Link to={`${path.POSTADMIN}/${job._id}`} className="mp-action-btn view" title="Xem chi tiết">
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

                    <div className="mp-pagination">
                        <PaginationCustom currentPage={currentPage} setCurrentPage={setCurrentPage} limit={limit} totalPages={totalPages} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManagerPost;
