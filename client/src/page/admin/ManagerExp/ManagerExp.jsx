import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getAllExp, updateExp, deleteExp, createExp } from "../../../api/job";
import { DeleteTwoTone, EditTwoTone, PlusOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";

const ManagerExp = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [listJob, setListJob] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState({});
    const [loaddata, setLoaddata] = useState(false);
    const [currentIndex, setCurrentIndex] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllExp({ page: currentPage, limit });
                setListJob(response.data); setTotalPages(response.totalPages);
            } catch (error) { console.error(error); }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);

    const validate = (requireId = false) => {
        const newError = {};
        if (!inputValue.trim()) newError.inputValue = "Vui lòng nhập tên kinh nghiệm";
        if (requireId && !currentIndex.trim()) newError.inputValue = "Vui lòng chọn kinh nghiệm muốn sửa!";
        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const hanleCreateJob = async () => {
        if (!validate()) return;
        try {
            await createExp({ experience: inputValue });
            setInputValue(""); setCurrentPage(1);
            toast.success("Thêm kinh nghiệm thành công!"); setLoaddata(!loaddata);
        } catch (error) { }
    };

    const hanleUpdateJob = async () => {
        if (!validate(true)) return;
        try {
            await updateExp(currentIndex, { experience: inputValue });
            setInputValue(""); setCurrentIndex(""); setCurrentPage(1);
            toast.success("Sửa kinh nghiệm thành công!"); setLoaddata(!loaddata);
        } catch (error) { }
    };

    const hanleDeleteJob = async (id) => {
        try {
            await deleteExp(id);
            setInputValue(""); setCurrentPage(1);
            toast.success("Xoá kinh nghiệm thành công!"); setLoaddata(!loaddata);
        } catch (error) { }
    };

    const hanleSearch = async () => {
        if (!validate()) return;
        try {
            const response = await getAllExp({ page: currentPage, limit, experience: inputValue });
            setListJob(response.data); setTotalPages(response.totalPages);
        } catch (error) { }
    };

    const hanleReset = async () => {
        setInputValue(""); setCurrentIndex(""); setError({});
        try {
            const response = await getAllExp({ page: currentPage, limit });
            setListJob(response.data); setTotalPages(response.totalPages);
        } catch (error) { }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
                .me-page { min-height:100vh; background:linear-gradient(160deg,#f0f4ff 0%,#fafafa 55%,#fff7ed 100%); padding:1rem 1rem; font-family:'Inter',sans-serif; display:flex; flex-direction:column; align-items:center; }
                .me-heading { font-family:'Sora',sans-serif; font-size:1.6rem; font-weight:700; color:#1e1b4b; text-align:center; margin-bottom:0.35rem; letter-spacing:-0.02em; }
                .me-sub { text-align:center; font-size:0.8rem; color:#9ca3af; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:2rem; }
                .me-card { width:100%; max-width:820px; background:#fff; border-radius:20px; border:1px solid #eef0f6; box-shadow:0 8px 32px rgba(99,102,241,0.08); padding:2rem 1.75rem 1.5rem; position:relative; overflow:hidden; }
                .me-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#6366f1,#f97316); border-radius:20px 20px 0 0; }
                .me-section { font-family:'Sora',sans-serif; font-size:0.69rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#6366f1; margin:0 0 1.1rem; display:flex; align-items:center; gap:0.5rem; }
                .me-section::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#e0e7ff,transparent); }
                .me-input-row { display:flex; gap:0.75rem; align-items:flex-start; margin-bottom:0.75rem; flex-wrap:wrap; }
                .me-input-wrap { flex:1; min-width:200px; position:relative; }
                .me-input-wrap .anticon { position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); color:#a5b4fc; font-size:0.8rem; pointer-events:none; }
                .me-input { width:100%; background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:10px; padding:0.62rem 0.95rem 0.62rem 2.3rem; color:#111827; font-family:'Inter',sans-serif; font-size:0.88rem; outline:none; transition:border-color 0.22s,box-shadow 0.22s,background 0.22s; }
                .me-input:focus { background:#fff; border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.11); }
                .me-input.err { border-color:#f43f5e; box-shadow:0 0 0 3px rgba(244,63,94,0.09); }
                .me-input::placeholder { color:#c4c9d4; }
                .me-err { font-size:0.71rem; color:#f43f5e; margin-bottom:0.75rem; }
                .me-editing-badge { display:inline-flex; align-items:center; gap:0.4rem; background:rgba(99,102,241,0.1); color:#6366f1; border-radius:999px; padding:0.22rem 0.75rem; font-size:0.72rem; font-weight:600; margin-bottom:0.75rem; }
                .me-btn-row { display:flex; gap:0.6rem; flex-wrap:wrap; margin-bottom:0rem; }
                .me-btn { display:inline-flex; align-items:center; gap:0.4rem; padding:0.58rem 1.1rem; border-radius:10px; border:none; font-family:'Inter',sans-serif; font-size:0.82rem; font-weight:500; cursor:pointer; transition:transform 0.15s,box-shadow 0.15s; white-space:nowrap; }
                .me-btn:hover { transform:translateY(-1px); }
                .me-btn:active { transform:translateY(0); }
                .me-btn-add    { background:linear-gradient(135deg,#6366f1,#f97316); color:#fff; box-shadow:0 4px 14px rgba(99,102,241,0.22); }
                .me-btn-edit   { background:linear-gradient(135deg,#f59e0b,#f97316); color:#fff; box-shadow:0 4px 14px rgba(245,158,11,0.22); }
                .me-btn-search { background:linear-gradient(135deg,#06b6d4,#6366f1); color:#fff; box-shadow:0 4px 14px rgba(6,182,212,0.22); }
                .me-btn-reset  { background:#f3f4f6; color:#6b7280; border:1.5px solid #e5e7eb; }
                .me-btn-reset:hover { background:#e5e7eb; }
                .me-divider { border:none; border-top:1px dashed #e5e7eb; margin:0 0 1.25rem; }
                .me-table-wrap { width:100%; overflow-x:auto; }
                .me-table { width:100%; min-width:480px; border-collapse:separate; border-spacing:0; font-size:0.83rem; }
                .me-table thead tr { background:#f5f3ff; }
                .me-table th { font-family:'Sora',sans-serif; font-size:0.67rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#6366f1; padding:0.72rem 1rem; text-align:left; border-bottom:1.5px solid #e0e7ff; white-space:nowrap; }
                .me-table th:first-child { border-radius:10px 0 0 0; text-align:center; }
                .me-table th:last-child  { border-radius:0 10px 0 0; text-align:center; }
                .me-table tbody tr { transition:background 0.15s; }
                .me-table tbody tr:hover { background:#fafafa; }
                .me-table tbody tr.selected { background:#eef2ff; }
                .me-table td { padding:0.72rem 1rem; color:#374151; vertical-align:middle; border-bottom:1px solid #f3f4f6; }
                .me-table td:first-child { text-align:center; color:#9ca3af; font-weight:500; }
                .me-slug { font-size:0.75rem; color:#9ca3af; background:#f3f4f6; border-radius:6px; padding:0.15rem 0.5rem; font-family:monospace; }
                .me-actions { display:flex; align-items:center; justify-content:center; gap:0.35rem; }
                .me-action-btn { background:none; border:none; cursor:pointer; width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.9rem; transition:background 0.15s; }
                .me-action-btn.edit:hover { background:rgba(99,102,241,0.1); }
                .me-action-btn.del:hover  { background:rgba(244,63,94,0.08); }
                .me-empty { text-align:center; padding:3rem 0; color:#9ca3af; }
                .me-empty i { font-size:2rem; display:block; margin-bottom:0.6rem; color:#d1d5db; }
                .me-pagination { display:flex; justify-content:center; margin-top:1.25rem; }
            `}</style>

            <div className="me-page">
                <h2 className="me-heading mb-2">Quản lý kinh nghiệm</h2>

                <div className="me-card">
                    <p className="me-section"><i className="fa-solid fa-user-clock" />Nhập tên kinh nghiệm</p>

                    <div className="me-input-row">
                        <div className="me-input-wrap">
                            <SearchOutlined />
                            <input type="text" className={`me-input ${error.inputValue ? "err" : ""}`}
                                placeholder="VD: Dưới 1 năm, 1-3 năm, 5+ năm..."
                                value={inputValue}
                                onChange={e => { setInputValue(e.target.value); setError({}); }}
                                onKeyDown={e => e.key === "Enter" && hanleSearch()}
                            />
                        </div>
                    </div>

                    {currentIndex && (
                        <p className="me-editing-badge">
                            <i className="fa-solid fa-pen" style={{ fontSize: "0.65rem" }} />
                            Đang chỉnh sửa mục đã chọn
                        </p>
                    )}

                    {error.inputValue && <p className="me-err">✕ {error.inputValue}</p>}

                    <div className="me-btn-row">
                        <button type="button" className="me-btn me-btn-add" onClick={hanleCreateJob}><PlusOutlined /> Thêm</button>
                        <button type="button" className="me-btn me-btn-edit" onClick={hanleUpdateJob}><i className="fa-solid fa-pen" /> Sửa</button>
                        <button type="button" className="me-btn me-btn-search" onClick={hanleSearch}><SearchOutlined /> Tìm kiếm</button>
                        <button type="button" className="me-btn me-btn-reset" onClick={hanleReset}><RedoOutlined /> Đặt lại</button>
                    </div>

                    <hr className="me-divider" />
                    <p className="me-section"><i className="fa-solid fa-list-ul" />Danh sách kinh nghiệm</p>

                    <div className="me-table-wrap">
                        <table className="me-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên kinh nghiệm</th>
                                    <th>Slug</th>
                                    <th style={{ textAlign: "center" }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listJob?.length === 0 ? (
                                    <tr><td colSpan={4}><div className="me-empty"><i className="fa-regular fa-folder-open" /><p>Chưa có dữ liệu.</p></div></td></tr>
                                ) : (
                                    listJob?.map((job, index) => (
                                        <tr key={job._id} className={currentIndex === job._id ? "selected" : ""}>
                                            <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                            <td style={{ fontWeight: 600, color: "#1e1b4b" }}>{job.experience}</td>
                                            <td><span className="me-slug">{job.slug}</span></td>
                                            <td>
                                                <div className="me-actions">
                                                    <button className="me-action-btn edit" title="Chọn để sửa"
                                                        onClick={() => { setCurrentIndex(job._id); setInputValue(job.experience); setError({}); }}>
                                                        <EditTwoTone twoToneColor="#6366f1" />
                                                    </button>
                                                    <button className="me-action-btn del" title="Xoá"
                                                        onClick={() => hanleDeleteJob(job._id)}>
                                                        <DeleteTwoTone twoToneColor="#f43f5e" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="me-pagination">
                        <PaginationCustom currentPage={currentPage} setCurrentPage={setCurrentPage} limit={limit} totalPages={totalPages} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManagerExp;
