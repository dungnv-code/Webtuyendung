import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getAllPacketPost, createPacketPost, updatePacketPost, deletePacketPost, changeStatusPacketPost } from "../../../api/job";
import { DeleteTwoTone, EditTwoTone, PlusOutlined, SwapOutlined, SearchOutlined, RedoOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const ManagerPacketPost = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [listJob, setListJob] = useState([]);
    const [inputValue, setInputValue] = useState({ namePostPackage: "", valuePostPackage: "", typePostPackage: "", price: "" });
    const [inputSearch, setInputSearch] = useState("");
    const [error, setError] = useState({});
    const [loaddata, setLoaddata] = useState(false);
    const [currentIndex, setCurrentIndex] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllPacketPost({ page: currentPage, limit });
                setListJob(response.data); setTotalPages(response.totalPages);
            } catch (error) { console.error(error); }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);

    const validate = () => {
        const newError = {};
        if (!inputValue.namePostPackage.trim()) newError.namePostPackage = "Vui lòng nhập tên gói!";
        if (!inputValue.typePostPackage.trim()) newError.typePostPackage = "Vui lòng chọn loại gói!";
        if (inputValue.valuePostPackage === "") newError.valuePostPackage = "Vui lòng nhập số lượt!";
        if (inputValue.price === "") newError.price = "Vui lòng nhập giá!";
        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const set = (key, val) => {
        setInputValue(prev => ({ ...prev, [key]: val }));
        setError(prev => ({ ...prev, [key]: "" }));
    };

    const handleCreateJob = async () => {
        if (!validate()) return;
        try {
            await createPacketPost(inputValue);
            setInputValue({ namePostPackage: "", valuePostPackage: "", typePostPackage: "", price: "" }); setCurrentPage(1);
            toast.success("Thêm gói bài đăng thành công!"); setLoaddata(!loaddata);
        } catch { }
    };

    const handleUpdateJob = async () => {
        if (!validate()) return;
        try {
            await updatePacketPost(currentIndex, inputValue);
            setInputValue({ namePostPackage: "", valuePostPackage: "", typePostPackage: "", price: "" }); setCurrentIndex(""); setCurrentPage(1);
            toast.success("Sửa gói bài đăng thành công!"); setLoaddata(!loaddata);
        } catch { }
    };

    const handleDeleteJob = async (id) => {
        try {
            await deletePacketPost(id); setCurrentPage(1);
            toast.success("Xoá gói bài đăng thành công!"); setLoaddata(!loaddata);
        } catch { }
    };

    const handleSearch = async () => {
        try {
            const response = await getAllPacketPost({ page: currentPage, limit, namePostPackage: inputSearch });
            setListJob(response.data); setTotalPages(response.totalPages);
        } catch { }
    };

    const handleReset = async () => {
        setInputValue({ namePostPackage: "", valuePostPackage: "", typePostPackage: "", price: "" });
        setCurrentIndex(""); setError({}); setInputSearch("");
        try {
            const response = await getAllPacketPost({ page: currentPage, limit });
            setListJob(response.data); setTotalPages(response.totalPages);
        } catch { }
    };

    const handleChangeStatus = async (id) => {
        try {
            await changeStatusPacketPost(id);
            setLoaddata(!loaddata); toast.success("Thay đổi trạng thái thành công!");
        } catch (error) { console.error(error); }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
                .mpp-page { min-height:100vh; background:linear-gradient(160deg,#f0f4ff 0%,#fafafa 55%,#fff7ed 100%); padding:1rem 1rem; font-family:'Inter',sans-serif; display:flex; flex-direction:column; align-items:center; }
                .mpp-heading { font-family:'Sora',sans-serif; font-size:1.6rem; font-weight:700; color:#1e1b4b; text-align:center; margin-bottom:0.35rem; letter-spacing:-0.02em; }
                .mpp-sub { text-align:center; font-size:0.8rem; color:#9ca3af; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:2rem; }
                .mpp-card { width:100%; max-width:980px; background:#fff; border-radius:20px; border:1px solid #eef0f6; box-shadow:0 8px 32px rgba(99,102,241,0.08); padding:2rem 1.75rem 1.5rem; position:relative; overflow:hidden; margin-bottom:1.5rem; }
                .mpp-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#6366f1,#f97316); border-radius:20px 20px 0 0; }
                .mpp-section { font-family:'Sora',sans-serif; font-size:0.69rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#6366f1; margin:0 0 1.1rem; display:flex; align-items:center; gap:0.5rem; }
                .mpp-section::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,#e0e7ff,transparent); }
                /* Search */
                .mpp-search-row { display:flex; gap:0.75rem; align-items:center; margin-bottom:1rem; flex-wrap:wrap; }
                .mpp-input-wrap { flex:1; min-width:180px; position:relative; }
                .mpp-input-wrap .anticon { position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); color:#a5b4fc; font-size:0.8rem; pointer-events:none; }
                .mpp-input-search { width:100%; background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:10px; padding:0.62rem 0.95rem 0.62rem 2.3rem; color:#111827; font-family:'Inter',sans-serif; font-size:0.88rem; outline:none; transition:border-color 0.22s,box-shadow 0.22s,background 0.22s; }
                .mpp-input-search:focus { background:#fff; border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.11); }
                .mpp-input-search::placeholder { color:#c4c9d4; }
                /* Form grid */
                .mpp-form-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem; margin-bottom:1rem; }
                .mpp-form-full { grid-column:1/-1; }
                @media (max-width:640px) { .mpp-form-grid { grid-template-columns:1fr; } .mpp-form-full { grid-column:1; } }
                .mpp-field { display:flex; flex-direction:column; }
                .mpp-label { display:flex; align-items:center; gap:0.35rem; font-size:0.72rem; letter-spacing:0.09em; text-transform:uppercase; color:#6b7280; font-weight:500; margin-bottom:0.4rem; }
                .mpp-label i { color:#a5b4fc; font-size:0.68rem; }
                .mpp-input, .mpp-select { width:100%; background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:10px; padding:0.65rem 0.95rem; color:#111827; font-family:'Inter',sans-serif; font-size:0.88rem; outline:none; appearance:none; transition:border-color 0.22s,box-shadow 0.22s,background 0.22s; }
                .mpp-input:focus, .mpp-select:focus { background:#fff; border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.11); }
                .mpp-input.err, .mpp-select.err { border-color:#f43f5e; box-shadow:0 0 0 3px rgba(244,63,94,0.09); }
                .mpp-input::placeholder { color:#c4c9d4; }
                .mpp-select-wrap { position:relative; }
                .mpp-select-wrap::after { content:'▾'; position:absolute; right:0.85rem; top:50%; transform:translateY(-50%); color:#9ca3af; font-size:0.75rem; pointer-events:none; }
                /* price prefix */
                .mpp-price-wrap { position:relative; }
                .mpp-price-prefix { position:absolute; left:0.9rem; top:50%; transform:translateY(-50%); color:#6366f1; font-weight:700; font-size:0.85rem; pointer-events:none; }
                .mpp-price-input { padding-left:1.8rem !important; }
                .mpp-err { font-size:0.71rem; color:#f43f5e; margin-top:0.28rem; }
                .mpp-editing-badge { display:inline-flex; align-items:center; gap:0.4rem; background:rgba(99,102,241,0.1); color:#6366f1; border-radius:999px; padding:0.22rem 0.75rem; font-size:0.72rem; font-weight:600; margin-bottom:0.75rem; }
                /* Buttons */
                .mpp-btn-row { display:flex; gap:0.6rem; flex-wrap:wrap; }
                .mpp-btn { display:inline-flex; align-items:center; gap:0.4rem; padding:0.58rem 1.1rem; border-radius:10px; border:none; font-family:'Inter',sans-serif; font-size:0.82rem; font-weight:500; cursor:pointer; transition:transform 0.15s,box-shadow 0.15s; white-space:nowrap; }
                .mpp-btn:hover { transform:translateY(-1px); }
                .mpp-btn:active { transform:translateY(0); }
                .mpp-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
                .mpp-btn-add  { background:linear-gradient(135deg,#6366f1,#f97316); color:#fff; box-shadow:0 4px 14px rgba(99,102,241,0.22); }
                .mpp-btn-edit { background:linear-gradient(135deg,#f59e0b,#f97316); color:#fff; box-shadow:0 4px 14px rgba(245,158,11,0.22); }
                .mpp-btn-reset{ background:#f3f4f6; color:#6b7280; border:1.5px solid #e5e7eb; }
                .mpp-btn-reset:hover { background:#e5e7eb; }
                /* Divider */
                .mpp-divider { border:none; border-top:1px dashed #e5e7eb; margin:1.25rem 0; }
                /* Table */
                .mpp-table-wrap { width:100%; overflow-x:auto; }
                .mpp-table { width:100%; min-width:700px; border-collapse:separate; border-spacing:0; font-size:0.83rem; }
                .mpp-table thead tr { background:#f5f3ff; }
                .mpp-table th { font-family:'Sora',sans-serif; font-size:0.67rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#6366f1; padding:0.72rem 1rem; text-align:left; border-bottom:1.5px solid #e0e7ff; white-space:nowrap; }
                .mpp-table th:first-child { border-radius:10px 0 0 0; text-align:center; }
                .mpp-table th:last-child  { border-radius:0 10px 0 0; text-align:center; }
                .mpp-table tbody tr { transition:background 0.15s; }
                .mpp-table tbody tr:hover { background:#fafafa; }
                .mpp-table tbody tr.selected { background:#eef2ff; }
                .mpp-table td { padding:0.72rem 1rem; color:#374151; vertical-align:middle; border-bottom:1px solid #f3f4f6; }
                .mpp-table td:first-child { text-align:center; color:#9ca3af; font-weight:500; }
                /* Badges */
                .mpp-badge { display:inline-flex; align-items:center; gap:0.3rem; border-radius:999px; padding:0.2rem 0.65rem; font-size:0.71rem; font-weight:600; }
                .mpp-badge.premium { background:rgba(245,158,11,0.12); color:#d97706; }
                .mpp-badge.basic   { background:#f3f4f6; color:#6b7280; }
                .mpp-badge.active  { background:rgba(16,185,129,0.1); color:#059669; }
                .mpp-badge.inactive{ background:rgba(244,63,94,0.1); color:#f43f5e; }
                .mpp-badge-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }
                /* Price */
                .mpp-price { font-family:'Sora',sans-serif; font-weight:700; color:#f97316; font-size:0.88rem; }
                /* Actions */
                .mpp-actions { display:flex; align-items:center; justify-content:center; gap:0.35rem; }
                .mpp-action-btn { background:none; border:none; cursor:pointer; width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.9rem; transition:background 0.15s; }
                .mpp-action-btn.swap:hover { background:rgba(99,102,241,0.1); color:#6366f1; }
                .mpp-action-btn.edit:hover { background:rgba(245,158,11,0.1); }
                .mpp-action-btn.del:hover  { background:rgba(244,63,94,0.08); }
                .mpp-empty { text-align:center; padding:3rem 0; color:#9ca3af; }
                .mpp-empty i { font-size:2rem; display:block; margin-bottom:0.6rem; color:#d1d5db; }
                .mpp-pagination { display:flex; justify-content:center; margin-top:1.25rem; }
            `}</style>

            <div className="mpp-page">
                <h2 className="mpp-heading mb-2">Quản lý gói bài đăng</h2>

                <div className="mpp-card">

                    <p className="mpp-section"><i className="fa-solid fa-magnifying-glass" />Tìm kiếm</p>
                    <div className="mpp-search-row">
                        <div className="mpp-input-wrap">
                            <SearchOutlined />
                            <input type="text" className="mpp-input-search" placeholder="Tìm theo tên gói..."
                                value={inputSearch} onChange={e => setInputSearch(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSearch()} />
                        </div>
                        <button type="button" className="mpp-btn mpp-btn-add" style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }} onClick={handleSearch}>
                            <SearchOutlined /> Tìm kiếm
                        </button>
                    </div>
                    <p className="mpp-section"><i className="fa-solid fa-box-open" />Thông tin gói bài đăng</p>

                    {currentIndex && (
                        <p className="mpp-editing-badge">
                            <i className="fa-solid fa-pen" style={{ fontSize: "0.65rem" }} />
                            Đang chỉnh sửa gói đã chọn
                        </p>
                    )}

                    <div className="mpp-form-grid">
                        <div className="mpp-field mpp-form-full">
                            <label className="mpp-label"><i className="fa-solid fa-tag" />Tên gói bài đăng</label>
                            <input type="text" className={`mpp-input ${error.namePostPackage ? "err" : ""}`}
                                placeholder="VD: Gói Basic 10 lượt..." value={inputValue.namePostPackage}
                                onChange={e => set("namePostPackage", e.target.value)} />
                            {error.namePostPackage && <p className="mpp-err">✕ {error.namePostPackage}</p>}
                        </div>

                        <div className="mpp-field">
                            <label className="mpp-label"><i className="fa-solid fa-file-lines" />Số lượt đăng</label>
                            <input type="number" className={`mpp-input ${error.valuePostPackage ? "err" : ""}`}
                                placeholder="VD: 10" value={inputValue.valuePostPackage}
                                onChange={e => set("valuePostPackage", e.target.value)} />
                            {error.valuePostPackage && <p className="mpp-err">✕ {error.valuePostPackage}</p>}
                        </div>

                        {/* Price */}
                        <div className="mpp-field">
                            <label className="mpp-label"><i className="fa-solid fa-dollar-sign" />Giá gói ($)</label>
                            <div className="mpp-price-wrap">
                                <span className="mpp-price-prefix">$</span>
                                <input type="number" className={`mpp-input mpp-price-input ${error.price ? "err" : ""}`}
                                    placeholder="VD: 99" value={inputValue.price}
                                    onChange={e => set("price", e.target.value)} />
                            </div>
                            {error.price && <p className="mpp-err">✕ {error.price}</p>}
                        </div>

                        <div className="mpp-field">
                            <label className="mpp-label"><i className="fa-solid fa-layer-group" />Loại gói</label>
                            <div className="mpp-select-wrap">
                                <select className={`mpp-select ${error.typePostPackage ? "err" : ""}`}
                                    value={inputValue.typePostPackage} onChange={e => set("typePostPackage", e.target.value)}>
                                    <option value="">-- Chọn loại --</option>
                                    <option value="BASIC">Bình thường</option>
                                    <option value="PREMIUM"><i class="fa-solid fa-star"></i> Nổi bật</option>
                                </select>
                            </div>
                            {error.typePostPackage && <p className="mpp-err">✕ {error.typePostPackage}</p>}
                        </div>
                    </div>

                    <div className="mpp-btn-row">
                        <button type="button" className="mpp-btn mpp-btn-add" onClick={handleCreateJob}><PlusOutlined /> Thêm</button>
                        <button type="button" className="mpp-btn mpp-btn-edit" onClick={handleUpdateJob} disabled={!currentIndex}><i className="fa-solid fa-pen" /> Sửa</button>
                        <button type="button" className="mpp-btn mpp-btn-reset" onClick={handleReset}><RedoOutlined /> Đặt lại</button>
                    </div>
                </div>
                <div className="mpp-card">
                    <p className="mpp-section"><i className="fa-solid fa-list-ul" />Danh sách gói bài đăng</p>
                    <div className="mpp-table-wrap">
                        <table className="mpp-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên gói</th>
                                    <th>Số lượt</th>
                                    <th>Loại</th>
                                    <th>Giá</th>
                                    <th>Trạng thái</th>
                                    <th style={{ textAlign: "center" }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listJob?.length === 0 ? (
                                    <tr><td colSpan={7}><div className="mpp-empty"><i className="fa-regular fa-folder-open" /><p>Chưa có dữ liệu.</p></div></td></tr>
                                ) : (
                                    listJob?.map((job, index) => (
                                        <tr key={job._id} className={currentIndex === job._id ? "selected" : ""}>
                                            <td>{(currentPage - 1) * limit + index + 1}</td>
                                            <td style={{ fontWeight: 600, color: "#1e1b4b" }}>{job.namePostPackage}</td>
                                            <td style={{ textAlign: "center" }}>{job.valuePostPackage}</td>
                                            <td>
                                                <span className={`mpp-badge ${job.typePostPackage === "PREMIUM" ? "premium" : "basic"}`}>
                                                    {job.typePostPackage === "PREMIUM" ? "⭐ Nổi bật" : "Bình thường"}
                                                </span>
                                            </td>
                                            <td><span className="mpp-price">${job.price}</span></td>
                                            <td>
                                                <span className={`mpp-badge ${job.status === "ACTIVE" ? "active" : "inactive"}`}>
                                                    <span className="mpp-badge-dot" style={{ background: job.status === "ACTIVE" ? "#10b981" : "#f43f5e" }} />
                                                    {job.status === "ACTIVE" ? "Đang KD" : "Dừng KD"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="mpp-actions">
                                                    <button className="mpp-action-btn swap" title="Đổi trạng thái" onClick={() => handleChangeStatus(job._id)}>
                                                        <SwapOutlined />
                                                    </button>
                                                    <button className="mpp-action-btn edit" title="Chỉnh sửa"
                                                        onClick={() => { setCurrentIndex(job._id); setInputValue({ namePostPackage: job.namePostPackage, valuePostPackage: job.valuePostPackage, typePostPackage: job.typePostPackage, price: job.price }); setError({}); }}>
                                                        <EditTwoTone twoToneColor="#f59e0b" />
                                                    </button>
                                                    <button className="mpp-action-btn del" title="Xoá" onClick={() => handleDeleteJob(job._id)}>
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
                    <div className="mpp-pagination">
                        <PaginationCustom currentPage={currentPage} setCurrentPage={setCurrentPage} limit={limit} totalPages={totalPages} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManagerPacketPost;
