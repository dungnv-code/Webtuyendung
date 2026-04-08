import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getAllLevel, createLevel, updateLevel, deleteLevel } from "../../../api/job";
import { DeleteTwoTone, EditTwoTone, PlusOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";

const ManagerLevel = () => {
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
                const response = await getAllLevel({ page: currentPage, limit });
                setListJob(response.data);
                setTotalPages(response.totalPages);
            } catch (error) { console.error(error); }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);

    const validate = (requireId = false) => {
        const newError = {};
        if (!inputValue.trim()) newError.inputValue = "Vui lòng nhập tên cấp bậc";
        if (requireId && !currentIndex.trim()) newError.inputValue = "Vui lòng chọn cấp bậc muốn sửa!";
        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const hanleCreateJob = async () => {
        if (!validate()) return;
        try {
            await createLevel({ nameLevel: inputValue });
            setInputValue(""); setCurrentPage(1);
            toast.success("Thêm cấp bậc thành công!"); setLoaddata(!loaddata);
        } catch (error) { }
    };

    const hanleUpdateJob = async () => {
        if (!validate(true)) return;
        try {
            await updateLevel(currentIndex, { nameLevel: inputValue });
            setInputValue(""); setCurrentIndex(""); setCurrentPage(1);
            toast.success("Sửa cấp bậc thành công!"); setLoaddata(!loaddata);
        } catch (error) { }
    };

    const hanleDeleteJob = async (id) => {
        try {
            await deleteLevel(id);
            setInputValue(""); setCurrentPage(1);
            toast.success("Xoá cấp bậc thành công!"); setLoaddata(!loaddata);
        } catch (error) { }
    };

    const hanleSearch = async () => {
        if (!validate()) return;
        try {
            const response = await getAllLevel({ page: currentPage, limit, nameLevel: inputValue });
            setListJob(response.data); setTotalPages(response.totalPages);
        } catch (error) { }
    };

    const hanleReset = async () => {
        setInputValue(""); setCurrentIndex(""); setError({});
        try {
            const response = await getAllLevel({ page: currentPage, limit });
            setListJob(response.data); setTotalPages(response.totalPages);
        } catch (error) { }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
                .ml-page { min-height:100vh; background:linear-gradient(160deg,#f0f4ff 0%,#fafafa 55%,#fff7ed 100%); padding:1rem 1rem; font-family:'Inter',sans-serif; display:flex; flex-direction:column; align-items:center; }
                .ml-heading { font-family:'Sora',sans-serif; font-size:1.6rem; font-weight:700; color:#1e1b4b; text-align:center; margin-bottom:0.35rem; letter-spacing:-0.02em; }
                .ml-sub { text-align:center; font-size:0.8rem; color:#9ca3af; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:2rem; }
                .ml-card { width:100%; max-width:820px; background:#fff; border-radius:20px; border:1px solid #eef0f6; box-shadow:0 8px 32px rgba(99,102,241,0.08); padding:2rem 1.75rem 1.5rem; position:relative; overflow:hidden; }
                .ml-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#6366f1,#f97316); border-radius:20px 20px 0 0; }
                .ml-section { font-family:'Sora',sans-serif; font-size:0.69rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#6366f1; margin:0 0 1.1rem; display:flex; align-items:center; gap:0.5rem; }
                .ml-section::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#e0e7ff,transparent); }
                .ml-input-row { display:flex; gap:0.75rem; align-items:flex-start; margin-bottom:0.75rem; flex-wrap:wrap; }
                .ml-input-wrap { flex:1; min-width:200px; position:relative; }
                .ml-input-wrap .anticon { position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); color:#a5b4fc; font-size:0.8rem; pointer-events:none; }
                .ml-input { width:100%; background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:10px; padding:0.62rem 0.95rem 0.62rem 2.3rem; color:#111827; font-family:'Inter',sans-serif; font-size:0.88rem; outline:none; transition:border-color 0.22s,box-shadow 0.22s,background 0.22s; }
                .ml-input:focus { background:#fff; border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.11); }
                .ml-input.err { border-color:#f43f5e; box-shadow:0 0 0 3px rgba(244,63,94,0.09); }
                .ml-input::placeholder { color:#c4c9d4; }
                .ml-err { font-size:0.71rem; color:#f43f5e; margin-bottom:0.75rem; }
                .ml-editing-badge { display:inline-flex; align-items:center; gap:0.4rem; background:rgba(99,102,241,0.1); color:#6366f1; border-radius:999px; padding:0.22rem 0.75rem; font-size:0.72rem; font-weight:600; margin-bottom:0.75rem; }
                .ml-btn-row { display:flex; gap:0.6rem; flex-wrap:wrap; margin-bottom:0rem; }
                .ml-btn { display:inline-flex; align-items:center; gap:0.4rem; padding:0.58rem 1.1rem; border-radius:10px; border:none; font-family:'Inter',sans-serif; font-size:0.82rem; font-weight:500; cursor:pointer; transition:transform 0.15s,box-shadow 0.15s; white-space:nowrap; }
                .ml-btn:hover { transform:translateY(-1px); }
                .ml-btn:active { transform:translateY(0); }
                .ml-btn-add    { background:linear-gradient(135deg,#6366f1,#f97316); color:#fff; box-shadow:0 4px 14px rgba(99,102,241,0.22); }
                .ml-btn-edit   { background:linear-gradient(135deg,#f59e0b,#f97316); color:#fff; box-shadow:0 4px 14px rgba(245,158,11,0.22); }
                .ml-btn-search { background:linear-gradient(135deg,#06b6d4,#6366f1); color:#fff; box-shadow:0 4px 14px rgba(6,182,212,0.22); }
                .ml-btn-reset  { background:#f3f4f6; color:#6b7280; border:1.5px solid #e5e7eb; }
                .ml-btn-reset:hover { background:#e5e7eb; }
                .ml-divider { border:none; border-top:1px dashed #e5e7eb; margin:0 0 1.25rem; }
                .ml-table-wrap { width:100%; overflow-x:auto; }
                .ml-table { width:100%; min-width:480px; border-collapse:separate; border-spacing:0; font-size:0.83rem; }
                .ml-table thead tr { background:#f5f3ff; }
                .ml-table th { font-family:'Sora',sans-serif; font-size:0.67rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#6366f1; padding:0.72rem 1rem; text-align:left; border-bottom:1.5px solid #e0e7ff; white-space:nowrap; }
                .ml-table th:first-child { border-radius:10px 0 0 0; text-align:center; }
                .ml-table th:last-child  { border-radius:0 10px 0 0; text-align:center; }
                .ml-table tbody tr { transition:background 0.15s; }
                .ml-table tbody tr:hover { background:#fafafa; }
                .ml-table tbody tr.selected { background:#eef2ff; }
                .ml-table td { padding:0.72rem 1rem; color:#374151; vertical-align:middle; border-bottom:1px solid #f3f4f6; }
                .ml-table td:first-child { text-align:center; color:#9ca3af; font-weight:500; }
                .ml-slug { font-size:0.75rem; color:#9ca3af; background:#f3f4f6; border-radius:6px; padding:0.15rem 0.5rem; font-family:monospace; }
                .ml-actions { display:flex; align-items:center; justify-content:center; gap:0.35rem; }
                .ml-action-btn { background:none; border:none; cursor:pointer; width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.9rem; transition:background 0.15s; }
                .ml-action-btn.edit:hover { background:rgba(99,102,241,0.1); }
                .ml-action-btn.del:hover  { background:rgba(244,63,94,0.08); }
                .ml-empty { text-align:center; padding:3rem 0; color:#9ca3af; }
                .ml-empty i { font-size:2rem; display:block; margin-bottom:0.6rem; color:#d1d5db; }
                .ml-pagination { display:flex; justify-content:center; margin-top:1.25rem; }
            `}</style>

            <div className="ml-page">
                <h2 className="ml-heading mb-2">Quản lý cấp bậc</h2>

                <div className="ml-card">
                    <p className="ml-section"><i className="fa-solid fa-medal" />Nhập tên cấp bậc</p>

                    <div className="ml-input-row">
                        <div className="ml-input-wrap">
                            <SearchOutlined />
                            <input
                                type="text"
                                className={`ml-input ${error.inputValue ? "err" : ""}`}
                                placeholder="VD: Junior, Senior, Manager..."
                                value={inputValue}
                                onChange={e => { setInputValue(e.target.value); setError({}); }}
                                onKeyDown={e => e.key === "Enter" && hanleSearch()}
                            />
                        </div>
                    </div>

                    {currentIndex && (
                        <p className="ml-editing-badge">
                            <i className="fa-solid fa-pen" style={{ fontSize: "0.65rem" }} />
                            Đang chỉnh sửa mục đã chọn
                        </p>
                    )}

                    {error.inputValue && <p className="ml-err">✕ {error.inputValue}</p>}

                    <div className="ml-btn-row">
                        <button type="button" className="ml-btn ml-btn-add" onClick={hanleCreateJob}><PlusOutlined /> Thêm</button>
                        <button type="button" className="ml-btn ml-btn-edit" onClick={hanleUpdateJob}><i className="fa-solid fa-pen" /> Sửa</button>
                        <button type="button" className="ml-btn ml-btn-search" onClick={hanleSearch}><SearchOutlined /> Tìm kiếm</button>
                        <button type="button" className="ml-btn ml-btn-reset" onClick={hanleReset}><RedoOutlined /> Đặt lại</button>
                    </div>

                    <hr className="ml-divider" />
                    <p className="ml-section"><i className="fa-solid fa-list-ul" />Danh sách cấp bậc</p>

                    <div className="ml-table-wrap">
                        <table className="ml-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên cấp bậc</th>
                                    <th>Slug</th>
                                    <th style={{ textAlign: "center" }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listJob?.length === 0 ? (
                                    <tr><td colSpan={4}><div className="ml-empty"><i className="fa-regular fa-folder-open" /><p>Chưa có dữ liệu.</p></div></td></tr>
                                ) : (
                                    listJob?.map((job, index) => (
                                        <tr key={job._id} className={currentIndex === job._id ? "selected" : ""}>
                                            <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                            <td style={{ fontWeight: 600, color: "#1e1b4b" }}>{job.nameLevel}</td>
                                            <td><span className="ml-slug">{job.slug}</span></td>
                                            <td>
                                                <div className="ml-actions">
                                                    <button className="ml-action-btn edit" title="Chọn để sửa"
                                                        onClick={() => { setCurrentIndex(job._id); setInputValue(job.nameLevel); setError({}); }}>
                                                        <EditTwoTone twoToneColor="#6366f1" />
                                                    </button>
                                                    <button className="ml-action-btn del" title="Xoá"
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

                    <div className="ml-pagination">
                        <PaginationCustom currentPage={currentPage} setCurrentPage={setCurrentPage} limit={limit} totalPages={totalPages} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManagerLevel;
