import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getAllSalaryrange, createSalaryrange, updateSalaryrange, deleteSalaryrange } from "../../../api/job";
import { DeleteTwoTone, EditTwoTone, PlusOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";

const ManagerSalaryRange = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [listJob, setListJob] = useState([]);
    const [inputValue, setInputValue] = useState({ salaryRange: "", min: "", max: "" });
    const [inputSearch, setInputSearch] = useState("");
    const [error, setError] = useState({});
    const [loaddata, setLoaddata] = useState(false);
    const [currentIndex, setCurrentIndex] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllSalaryrange({ page: currentPage, limit });
                setListJob(response.data); setTotalPages(response.totalPages);
            } catch (error) { console.error(error); }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);

    const validate = () => {
        const newError = {};
        if (!inputValue.salaryRange.trim()) newError.salaryRange = "Vui lòng nhập tên khoảng lương!";
        if (inputValue.min === "" || inputValue.min == null) newError.min = "Vui lòng nhập giá trị min!";
        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const hanleCreateJob = async () => {
        if (!validate()) return;
        try {
            await createSalaryrange(inputValue);
            setInputValue({ salaryRange: "", min: "", max: "" }); setCurrentPage(1);
            toast.success("Thêm khoảng lương thành công!"); setLoaddata(!loaddata);
        } catch (error) { }
    };

    const hanleUpdateJob = async () => {
        if (!validate()) return;
        try {
            await updateSalaryrange(currentIndex, inputValue);
            setInputValue({ salaryRange: "", min: "", max: "" }); setCurrentIndex(""); setCurrentPage(1);
            toast.success("Sửa khoảng lương thành công!"); setLoaddata(!loaddata);
        } catch (error) { }
    };

    const hanleDeleteJob = async (id) => {
        try {
            await deleteSalaryrange(id);
            setInputValue({ salaryRange: "", min: "", max: "" }); setCurrentPage(1);
            toast.success("Xoá khoảng lương thành công!"); setLoaddata(!loaddata);
        } catch (error) { }
    };

    const hanleSearch = async () => {
        try {
            const response = await getAllSalaryrange({ page: currentPage, limit, salaryRange: inputSearch });
            setListJob(response.data); setTotalPages(response.totalPages);
        } catch (error) { }
    };

    const hanleReset = async () => {
        setInputValue({ salaryRange: "", min: "", max: "" }); setInputSearch(""); setCurrentIndex(""); setError({});
        try {
            const response = await getAllSalaryrange({ page: currentPage, limit });
            setListJob(response.data); setTotalPages(response.totalPages);
        } catch (error) { }
    };

    const set = (key, val) => {
        setInputValue(prev => ({ ...prev, [key]: val }));
        setError(prev => ({ ...prev, [key]: "" }));
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
                .msr-page { min-height:100vh; background:linear-gradient(160deg,#f0f4ff 0%,#fafafa 55%,#fff7ed 100%); padding:1rem 1rem; font-family:'Inter',sans-serif; display:flex; flex-direction:column; align-items:center; }
                .msr-heading { font-family:'Sora',sans-serif; font-size:1.6rem; font-weight:700; color:#1e1b4b; text-align:center; margin-bottom:0.35rem; letter-spacing:-0.02em; }
                .msr-sub { text-align:center; font-size:0.8rem; color:#9ca3af; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:2rem; }
                .msr-card { width:100%; max-width:860px; background:#fff; border-radius:20px; border:1px solid #eef0f6; box-shadow:0 8px 32px rgba(99,102,241,0.08); padding:2rem 1.75rem 1.5rem; position:relative; overflow:hidden; }
                .msr-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#6366f1,#f97316); border-radius:20px 20px 0 0; }
                .msr-section { font-family:'Sora',sans-serif; font-size:0.69rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#6366f1; margin:0 0 1.1rem; display:flex; align-items:center; gap:0.5rem; }
                .msr-section::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#e0e7ff,transparent); }
                .msr-search-row { display:flex; gap:0.75rem; align-items:center; margin-bottom:0rem; flex-wrap:wrap; }
                .msr-input-wrap { flex:1; min-width:180px; position:relative; }
                .msr-input-wrap .anticon { position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); color:#a5b4fc; font-size:0.8rem; pointer-events:none; }
                .msr-input-search { width:100%; background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:10px; padding:0.62rem 0.95rem 0.62rem 2.3rem; color:#111827; font-family:'Inter',sans-serif; font-size:0.88rem; outline:none; transition:border-color 0.22s,box-shadow 0.22s,background 0.22s; }
                .msr-input-search:focus { background:#fff; border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.11); }
                .msr-input-search::placeholder { color:#c4c9d4; }
                .msr-form-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem; margin-bottom:1rem; }
                @media (max-width:600px) { .msr-form-grid { grid-template-columns:1fr; } }
                .msr-field { display:flex; flex-direction:column; }
                .msr-label { display:flex; align-items:center; gap:0.35rem; font-size:0.72rem; letter-spacing:0.09em; text-transform:uppercase; color:#6b7280; font-weight:500; margin-bottom:0.4rem; }
                .msr-label i { color:#a5b4fc; font-size:0.68rem; }
                .msr-input { width:100%; background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:10px; padding:0.65rem 0.95rem; color:#111827; font-family:'Inter',sans-serif; font-size:0.88rem; outline:none; transition:border-color 0.22s,box-shadow 0.22s,background 0.22s; }
                .msr-input:focus { background:#fff; border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.11); }
                .msr-input.err { border-color:#f43f5e; box-shadow:0 0 0 3px rgba(244,63,94,0.09); }
                .msr-input::placeholder { color:#c4c9d4; }
                .msr-err { font-size:0.71rem; color:#f43f5e; margin-top:0.28rem; }
                .msr-editing-badge { display:inline-flex; align-items:center; gap:0.4rem; background:rgba(99,102,241,0.1); color:#6366f1; border-radius:999px; padding:0.22rem 0.75rem; font-size:0.72rem; font-weight:600; margin-bottom:0.75rem; }
                .msr-btn-row { display:flex; gap:0.6rem; flex-wrap:wrap; margin-bottom:0rem; }
                .msr-btn { display:inline-flex; align-items:center; gap:0.4rem; padding:0.58rem 1.1rem; border-radius:10px; border:none; font-family:'Inter',sans-serif; font-size:0.82rem; font-weight:500; cursor:pointer; transition:transform 0.15s,box-shadow 0.15s; white-space:nowrap; }
                .msr-btn:hover { transform:translateY(-1px); }
                .msr-btn:active { transform:translateY(0); }
                .msr-btn-add  { background:linear-gradient(135deg,#6366f1,#f97316); color:#fff; box-shadow:0 4px 14px rgba(99,102,241,0.22); }
                .msr-btn-edit { background:linear-gradient(135deg,#f59e0b,#f97316); color:#fff; box-shadow:0 4px 14px rgba(245,158,11,0.22); }
                .msr-btn-reset{ background:#f3f4f6; color:#6b7280; border:1.5px solid #e5e7eb; }
                .msr-btn-reset:hover { background:#e5e7eb; }
                .msr-divider { border:none; border-top:1px dashed #e5e7eb; margin:0 0 1.25rem; }
                .msr-table-wrap { width:100%; overflow-x:auto; }
                .msr-table { width:100%; min-width:520px; border-collapse:separate; border-spacing:0; font-size:0.83rem; }
                .msr-table thead tr { background:#f5f3ff; }
                .msr-table th { font-family:'Sora',sans-serif; font-size:0.67rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#6366f1; padding:0.72rem 1rem; text-align:left; border-bottom:1.5px solid #e0e7ff; white-space:nowrap; }
                .msr-table th:first-child { border-radius:10px 0 0 0; text-align:center; }
                .msr-table th:last-child  { border-radius:0 10px 0 0; text-align:center; }
                .msr-table tbody tr { transition:background 0.15s; }
                .msr-table tbody tr:hover { background:#fafafa; }
                .msr-table tbody tr.selected { background:#eef2ff; }
                .msr-table td { padding:0.72rem 1rem; color:#374151; vertical-align:middle; border-bottom:1px solid #f3f4f6; }
                .msr-table td:first-child { text-align:center; color:#9ca3af; font-weight:500; }
                .msr-num-chip { font-size:0.78rem; font-weight:600; background:#f0fdf4; color:#059669; border-radius:6px; padding:0.15rem 0.55rem; font-family:monospace; }
                .msr-actions { display:flex; align-items:center; justify-content:center; gap:0.35rem; }
                .msr-action-btn { background:none; border:none; cursor:pointer; width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.9rem; transition:background 0.15s; }
                .msr-action-btn.edit:hover { background:rgba(99,102,241,0.1); }
                .msr-action-btn.del:hover  { background:rgba(244,63,94,0.08); }
                .msr-empty { text-align:center; padding:3rem 0; color:#9ca3af; }
                .msr-empty i { font-size:2rem; display:block; margin-bottom:0.6rem; color:#d1d5db; }
                .msr-pagination { display:flex; justify-content:center; margin-top:1.25rem; }
            `}</style>

            <div className="msr-page">
                <h2 className="msr-heading mb-2">Quản lý khoảng lương</h2>
                <div className="msr-card">
                    <p className="msr-section"><i className="fa-solid fa-magnifying-glass" />Tìm kiếm</p>
                    <div className="msr-search-row">
                        <div className="msr-input-wrap">
                            <SearchOutlined />
                            <input type="text" className="msr-input-search" placeholder="Tìm theo tên khoảng lương..."
                                value={inputSearch} onChange={e => setInputSearch(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && hanleSearch()} />
                        </div>
                        <button type="button" className="msr-btn msr-btn-add" style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }} onClick={hanleSearch}>
                            <SearchOutlined /> Tìm kiếm
                        </button>
                    </div>

                    <hr className="msr-divider" />
                    <p className="msr-section"><i className="fa-solid fa-money-bill-wave" />Thông tin khoảng lương</p>

                    {currentIndex && (
                        <p className="msr-editing-badge">
                            <i className="fa-solid fa-pen" style={{ fontSize: "0.65rem" }} />
                            Đang chỉnh sửa mục đã chọn
                        </p>
                    )}

                    <div className="msr-form-grid">
                        <div className="msr-field">
                            <label className="msr-label"><i className="fa-solid fa-tag" />Tên khoảng lương</label>
                            <input type="text" className={`msr-input ${error.salaryRange ? "err" : ""}`}
                                placeholder="VD: 10-20 triệu..." value={inputValue.salaryRange}
                                onChange={e => set("salaryRange", e.target.value)} />
                            {error.salaryRange && <p className="msr-err">✕ {error.salaryRange}</p>}
                        </div>
                        <div className="msr-field">
                            <label className="msr-label"><i className="fa-solid fa-arrow-down-1-9" />Giá trị Min</label>
                            <input type="number" className={`msr-input ${error.min ? "err" : ""}`}
                                placeholder="VD: 10000000" value={inputValue.min}
                                onChange={e => set("min", e.target.value)} />
                            {error.min && <p className="msr-err">✕ {error.min}</p>}
                        </div>
                        <div className="msr-field">
                            <label className="msr-label"><i className="fa-solid fa-arrow-up-1-9" />Giá trị Max</label>
                            <input type="number" className="msr-input"
                                placeholder="VD: 20000000" value={inputValue.max}
                                onChange={e => set("max", e.target.value)} />
                        </div>
                    </div>

                    <div className="msr-btn-row">
                        <button type="button" className="msr-btn msr-btn-add" onClick={hanleCreateJob}><PlusOutlined /> Thêm</button>
                        <button type="button" className="msr-btn msr-btn-edit" onClick={hanleUpdateJob}><i className="fa-solid fa-pen" /> Sửa</button>
                        <button type="button" className="msr-btn msr-btn-reset" onClick={hanleReset}><RedoOutlined /> Đặt lại</button>
                    </div>

                    <hr className="msr-divider" />
                    <p className="msr-section"><i className="fa-solid fa-list-ul" />Danh sách khoảng lương</p>

                    <div className="msr-table-wrap">
                        <table className="msr-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên khoảng lương</th>
                                    <th>Min</th>
                                    <th>Max</th>
                                    <th style={{ textAlign: "center" }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listJob?.length === 0 ? (
                                    <tr><td colSpan={5}><div className="msr-empty"><i className="fa-regular fa-folder-open" /><p>Chưa có dữ liệu.</p></div></td></tr>
                                ) : (
                                    listJob?.map((job, index) => (
                                        <tr key={job._id} className={currentIndex === job._id ? "selected" : ""}>
                                            <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                            <td style={{ fontWeight: 600, color: "#1e1b4b" }}>{job.salaryRange}</td>
                                            <td><span className="msr-num-chip">{Number(job.min).toLocaleString()}</span></td>
                                            <td><span className="msr-num-chip">{Number(job.max).toLocaleString()}</span></td>
                                            <td>
                                                <div className="msr-actions">
                                                    <button className="msr-action-btn edit" title="Chọn để sửa"
                                                        onClick={() => { setCurrentIndex(job._id); setInputValue({ salaryRange: job.salaryRange, min: job.min, max: job.max }); setError({}); }}>
                                                        <EditTwoTone twoToneColor="#6366f1" />
                                                    </button>
                                                    <button className="msr-action-btn del" title="Xoá"
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

                    <div className="msr-pagination">
                        <PaginationCustom currentPage={currentPage} setCurrentPage={setCurrentPage} limit={limit} totalPages={totalPages} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManagerSalaryRange;
