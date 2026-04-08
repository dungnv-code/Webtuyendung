import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getAllSkill, createSkill, updateSkill, deleteSkill, getAllJob } from "../../../api/job";
import { DeleteTwoTone, EditTwoTone, PlusOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";

const ManagerSkill = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [listJob, setListJob] = useState([]);
    const [listJobSelect, setListJobSelect] = useState([]);
    const [inputValue, setInputValue] = useState({ nameskill: "", job: "" });
    const [inputSearch, setInputSearch] = useState("");
    const [error, setError] = useState({});
    const [loaddata, setLoaddata] = useState(false);
    const [currentIndex, setCurrentIndex] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllSkill({ page: currentPage, limit, populate: "job:title,slug", flatten: true });
                setListJob(response.data);
                setTotalPages(response.totalPages);
            } catch (error) { console.error(error); }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getAllJob();
                setListJobSelect(response.data);
            } catch (error) { console.error(error); }
        };
        fetchJobs();
    }, []);

    const validate = () => {
        const newError = {};
        if (!inputValue.nameskill.trim()) newError.nameskill = "Vui lòng nhập tên kỹ năng!";
        if (!inputValue.job.trim()) newError.job = "Vui lòng chọn nhóm công việc!";
        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const hanleCreateJob = async () => {
        if (!validate()) return;
        try {
            await createSkill(inputValue);
            setInputValue({ job: "", nameskill: "" }); setCurrentPage(1);
            toast.success("Thêm kỹ năng thành công!"); setLoaddata(!loaddata);
        } catch (error) { }
    };

    const hanleUpdateJob = async () => {
        if (!validate()) return;
        try {
            await updateSkill(currentIndex, inputValue);
            setInputValue({ job: "", nameskill: "" }); setCurrentIndex(""); setCurrentPage(1);
            toast.success("Sửa kỹ năng thành công!"); setLoaddata(!loaddata);
        } catch (error) { }
    };

    const hanleDeleteJob = async (id) => {
        try {
            await deleteSkill(id);
            setInputValue({ job: "", nameskill: "" }); setCurrentPage(1);
            toast.success("Xoá kỹ năng thành công!"); setLoaddata(!loaddata);
        } catch (error) { }
    };

    const hanleSearch = async () => {
        try {
            const response = await getAllSkill({ page: currentPage, limit, populate: "job:title,slug", flatten: true, nameskill: inputSearch });
            setListJob(response.data); setTotalPages(response.totalPages);
        } catch (error) { }
    };

    const hanleReset = async () => {
        setInputValue({ job: "", nameskill: "" }); setInputSearch(""); setCurrentIndex(""); setError({});
        try {
            const response = await getAllSkill({ page: currentPage, limit, populate: "job:title,slug", flatten: true });
            setListJob(response.data); setTotalPages(response.totalPages);
        } catch (error) { }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .msk-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 55%, #fff7ed 100%);
                    padding: 1rem 1rem;
                    font-family: 'Inter', sans-serif;
                    display: flex; flex-direction: column; align-items: center;
                }

                .msk-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem; font-weight: 700; color: #1e1b4b;
                    text-align: center; margin-bottom: 0.35rem; letter-spacing: -0.02em;
                }

                .msk-sub {
                    text-align: center; font-size: 0.8rem; color: #9ca3af;
                    letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2rem;
                }

                .msk-card {
                    width: 100%; max-width: 860px;
                    background: #fff; border-radius: 20px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.08);
                    padding: 2rem 1.75rem 1.5rem;
                    position: relative; overflow: hidden;
                }

                .msk-card::before {
                    content: ''; position: absolute;
                    top: 0; left: 0; right: 0; height: 3px;
                    background: linear-gradient(90deg, #6366f1, #f97316);
                    border-radius: 20px 20px 0 0;
                }

                /* ── Section label ── */
                .msk-section {
                    font-family: 'Sora', sans-serif; font-size: 0.69rem; font-weight: 600;
                    letter-spacing: 0.12em; text-transform: uppercase; color: #6366f1;
                    margin: 0 0 1.1rem; display: flex; align-items: center; gap: 0.5rem;
                }

                .msk-section::after {
                    content: ''; flex: 1; height: 1px;
                    background: linear-gradient(90deg, #e0e7ff, transparent);
                }

                /* ── Search row ── */
                .msk-search-row {
                    display: flex; gap: 0.75rem; align-items: center;
                    margin-bottom: 0rem; flex-wrap: wrap;
                }

                .msk-input-wrap { flex: 1; min-width: 180px; position: relative; }

                .msk-input-wrap .anticon {
                    position: absolute; left: 0.85rem; top: 50%;
                    transform: translateY(-50%); color: #a5b4fc; font-size: 0.8rem; pointer-events: none;
                }

                .msk-input-search {
                    width: 100%; background: #f9fafb;
                    border: 1.5px solid #e5e7eb; border-radius: 10px;
                    padding: 0.62rem 0.95rem 0.62rem 2.3rem;
                    color: #111827; font-family: 'Inter', sans-serif;
                    font-size: 0.88rem; outline: none;
                    transition: border-color 0.22s, box-shadow 0.22s, background 0.22s;
                }

                .msk-input-search:focus {
                    background: #fff; border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.11);
                }

                .msk-input-search::placeholder { color: #c4c9d4; }

                /* ── Form grid ── */
                .msk-form-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
                    margin-bottom: 1rem;
                }

                @media (max-width: 560px) { .msk-form-grid { grid-template-columns: 1fr; } }

                .msk-field { display: flex; flex-direction: column; }

                .msk-label {
                    display: flex; align-items: center; gap: 0.35rem;
                    font-size: 0.72rem; letter-spacing: 0.09em;
                    text-transform: uppercase; color: #6b7280;
                    font-weight: 500; margin-bottom: 0.4rem;
                }

                .msk-label i { color: #a5b4fc; font-size: 0.68rem; }

                .msk-input, .msk-select {
                    width: 100%; background: #f9fafb;
                    border: 1.5px solid #e5e7eb; border-radius: 10px;
                    padding: 0.65rem 0.95rem; color: #111827;
                    font-family: 'Inter', sans-serif; font-size: 0.88rem;
                    outline: none; appearance: none;
                    transition: border-color 0.22s, box-shadow 0.22s, background 0.22s;
                }

                .msk-input:focus, .msk-select:focus {
                    background: #fff; border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.11);
                }

                .msk-input.err, .msk-select.err {
                    border-color: #f43f5e; box-shadow: 0 0 0 3px rgba(244,63,94,0.09);
                }

                .msk-input::placeholder { color: #c4c9d4; }

                .msk-select-wrap { position: relative; }

                .msk-select-wrap::after {
                    content: '▾'; position: absolute;
                    right: 0.85rem; top: 50%; transform: translateY(-50%);
                    color: #9ca3af; font-size: 0.75rem; pointer-events: none;
                }

                .msk-err { font-size: 0.71rem; color: #f43f5e; margin-top: 0.28rem; }

                /* editing badge */
                .msk-editing-badge {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    background: rgba(99,102,241,0.1); color: #6366f1;
                    border-radius: 999px; padding: 0.22rem 0.75rem;
                    font-size: 0.72rem; font-weight: 600; margin-bottom: 0.75rem;
                }

                /* ── Button row ── */
                .msk-btn-row {
                    display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0rem;
                }

                .msk-btn {
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    padding: 0.58rem 1.1rem; border-radius: 10px; border: none;
                    font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 500;
                    cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; white-space: nowrap;
                }

                .msk-btn:hover { transform: translateY(-1px); }
                .msk-btn:active { transform: translateY(0); }

                .msk-btn-add  { background: linear-gradient(135deg,#6366f1,#f97316); color:#fff; box-shadow:0 4px 14px rgba(99,102,241,0.22); }
                .msk-btn-edit { background: linear-gradient(135deg,#f59e0b,#f97316); color:#fff; box-shadow:0 4px 14px rgba(245,158,11,0.22); }
                .msk-btn-reset{ background: #f3f4f6; color: #6b7280; border: 1.5px solid #e5e7eb; }
                .msk-btn-reset:hover { background: #e5e7eb; }

                /* ── Divider ── */
                .msk-divider { border: none; border-top: 1px dashed #e5e7eb; margin: 0 0 1.25rem; }

                /* ── Table ── */
                .msk-table-wrap { width: 100%; overflow-x: auto; }

                .msk-table {
                    width: 100%; min-width: 480px;
                    border-collapse: separate; border-spacing: 0; font-size: 0.83rem;
                }

                .msk-table thead tr { background: #f5f3ff; }

                .msk-table th {
                    font-family: 'Sora', sans-serif; font-size: 0.67rem; font-weight: 600;
                    letter-spacing: 0.1em; text-transform: uppercase; color: #6366f1;
                    padding: 0.72rem 1rem; text-align: left;
                    border-bottom: 1.5px solid #e0e7ff; white-space: nowrap;
                }

                .msk-table th:first-child { border-radius: 10px 0 0 0; text-align: center; }
                .msk-table th:last-child  { border-radius: 0 10px 0 0; text-align: center; }

                .msk-table tbody tr { transition: background 0.15s; }
                .msk-table tbody tr:hover { background: #fafafa; }
                .msk-table tbody tr.selected { background: #eef2ff; }

                .msk-table td {
                    padding: 0.72rem 1rem; color: #374151;
                    vertical-align: middle; border-bottom: 1px solid #f3f4f6;
                }

                .msk-table td:first-child { text-align: center; color: #9ca3af; font-weight: 500; }

                .msk-job-chip {
                    display: inline-block; background: rgba(99,102,241,0.1);
                    color: #6366f1; border-radius: 999px;
                    padding: 0.18rem 0.65rem; font-size: 0.72rem; font-weight: 500;
                }

                .msk-actions { display: flex; align-items: center; justify-content: center; gap: 0.35rem; }

                .msk-action-btn {
                    background: none; border: none; cursor: pointer;
                    width: 30px; height: 30px; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.9rem; transition: background 0.15s;
                }

                .msk-action-btn.edit:hover { background: rgba(99,102,241,0.1); }
                .msk-action-btn.del:hover  { background: rgba(244,63,94,0.08); }

                .msk-empty { text-align: center; padding: 3rem 0; color: #9ca3af; }
                .msk-empty i { font-size: 2rem; display: block; margin-bottom: 0.6rem; color: #d1d5db; }

                .msk-pagination { display: flex; justify-content: center; margin-top: 1.25rem; }
            `}</style>

            <div className="msk-page">
                <h2 className="msk-heading mb-2">Quản lý kỹ năng</h2>

                <div className="msk-card">
                    <p className="msk-section"><i className="fa-solid fa-magnifying-glass" />Tìm kiếm</p>
                    <div className="msk-search-row">
                        <div className="msk-input-wrap">
                            <SearchOutlined />
                            <input
                                type="text" className="msk-input-search"
                                placeholder="Tìm theo tên kỹ năng..."
                                value={inputSearch}
                                onChange={e => setInputSearch(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && hanleSearch()}
                            />
                        </div>
                        <button type="button" className="msk-btn msk-btn-add" style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }} onClick={hanleSearch}>
                            <SearchOutlined /> Tìm kiếm
                        </button>
                    </div>

                    <hr className="msk-divider" />

                    {/* Form */}
                    <p className="msk-section"><i className="fa-solid fa-lightbulb" />Thông tin kỹ năng</p>

                    {currentIndex && (
                        <p className="msk-editing-badge">
                            <i className="fa-solid fa-pen" style={{ fontSize: "0.65rem" }} />
                            Đang chỉnh sửa kỹ năng đã chọn
                        </p>
                    )}

                    <div className="msk-form-grid">
                        {/* Name */}
                        <div className="msk-field">
                            <label className="msk-label"><i className="fa-solid fa-tag" />Tên kỹ năng</label>
                            <input
                                type="text"
                                className={`msk-input ${error.nameskill ? "err" : ""}`}
                                placeholder="VD: React, Python, Figma..."
                                value={inputValue.nameskill}
                                onChange={e => { setInputValue({ ...inputValue, nameskill: e.target.value }); setError(prev => ({ ...prev, nameskill: "" })); }}
                            />
                            {error.nameskill && <p className="msk-err">✕ {error.nameskill}</p>}
                        </div>

                        {/* Job group */}
                        <div className="msk-field">
                            <label className="msk-label"><i className="fa-solid fa-briefcase" />Ngành nghề</label>
                            <div className="msk-select-wrap">
                                <select
                                    className={`msk-select ${error.job ? "err" : ""}`}
                                    value={inputValue.job}
                                    onChange={e => { setInputValue({ ...inputValue, job: e.target.value }); setError(prev => ({ ...prev, job: "" })); }}
                                >
                                    <option value="">-- Chọn ngành nghề --</option>
                                    {listJobSelect?.map(item => (
                                        <option key={item._id} value={item._id}>{item.title}</option>
                                    ))}
                                </select>
                            </div>
                            {error.job && <p className="msk-err">✕ {error.job}</p>}
                        </div>
                    </div>

                    <div className="msk-btn-row">
                        <button type="button" className="msk-btn msk-btn-add" onClick={hanleCreateJob}>
                            <PlusOutlined /> Thêm
                        </button>
                        <button type="button" className="msk-btn msk-btn-edit" onClick={hanleUpdateJob}>
                            <i className="fa-solid fa-pen" /> Sửa
                        </button>
                        <button type="button" className="msk-btn msk-btn-reset" onClick={hanleReset}>
                            <RedoOutlined /> Đặt lại
                        </button>
                    </div>

                    <hr className="msk-divider" />
                    <p className="msk-section"><i className="fa-solid fa-list-ul" />Danh sách kỹ năng</p>

                    <div className="msk-table-wrap">
                        <table className="msk-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên kỹ năng</th>
                                    <th>Nhóm công việc</th>
                                    <th style={{ textAlign: "center" }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listJob?.length === 0 ? (
                                    <tr><td colSpan={4}><div className="msk-empty"><i className="fa-regular fa-folder-open" /><p>Chưa có dữ liệu.</p></div></td></tr>
                                ) : (
                                    listJob?.map((job, index) => (
                                        <tr key={job._id} className={currentIndex === job._id ? "selected" : ""}>
                                            <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                            <td style={{ fontWeight: 600, color: "#1e1b4b" }}>{job.nameskill}</td>
                                            <td><span className="msk-job-chip">{job.job_title}</span></td>
                                            <td>
                                                <div className="msk-actions">
                                                    <button
                                                        className="msk-action-btn edit"
                                                        title="Chọn để sửa"
                                                        onClick={() => { setCurrentIndex(job._id); setInputValue({ job: job.job__id, nameskill: job.nameskill }); setError({}); }}
                                                    >
                                                        <EditTwoTone twoToneColor="#6366f1" />
                                                    </button>
                                                    <button
                                                        className="msk-action-btn del"
                                                        title="Xoá"
                                                        onClick={() => hanleDeleteJob(job._id)}
                                                    >
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

                    <div className="msk-pagination">
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

export default ManagerSkill;
