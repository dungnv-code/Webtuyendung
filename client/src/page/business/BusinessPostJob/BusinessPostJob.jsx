import { useState, useEffect } from "react";
import {
    getAllExp, getAllJob, getAllLevel,
    getAllSalaryrange, getAllSkill, getAllStyleJob
} from "../../../api/job";
import { Editor } from '@tinymce/tinymce-react';
import Select from "react-select";
import Loading from "../../../component/loading/Loading";
import { createPostJobdBusiness, getDetailByBusiness } from "../../../api/business";
import Swal from "sweetalert2";

const BusinessPostJob = () => {
    const [exp, setExp] = useState([]);
    const [job, setJob] = useState([]);
    const [level, setLevel] = useState([]);
    const [Salaryrange, setSalaryrange] = useState([]);
    const [skill, setSkill] = useState([]);
    const [styleJob, setStyleJob] = useState([]);
    const [cities, setCities] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [dataBusiness, setDataBusiness] = useState({});

    const defaultDeadline = new Date();
    defaultDeadline.setDate(defaultDeadline.getDate() + 8 * 7);
    const formatDate = defaultDeadline.toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        title: "", description: "", jobs: "", experience: "",
        salaryRange: "", joblevel: "", workType: "", location: "",
        skills: [], quantity: "", postPackage: 0, deadline: formatDate
    });

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const repo = await getDetailByBusiness();
                setDataBusiness(repo.data);
            } catch (err) { console.error(err); }
        };
        fetchBusiness();
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
                const json = await res.json();
                setCities(json.data);
            } catch (error) { console.error(error); }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [expRes, jobRes, levelRes, salaryRes, skillRes, styleJobRes] = await Promise.all([
                    getAllExp(), getAllJob(), getAllLevel(),
                    getAllSalaryrange(), getAllSkill(), getAllStyleJob()
                ]);
                setExp(expRes?.data || []);
                setJob(jobRes?.data || []);
                setLevel(levelRes?.data || []);
                setSalaryrange(salaryRes?.data || []);
                setSkill(skillRes?.data || []);
                setStyleJob(styleJobRes?.data || []);
            } catch (error) { console.error(error); }
        };
        fetchAllData();
    }, []);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        if (name === "jobs") {
            const res = await getAllSkill({ populate: "job:title,slug", flatten: true, job_title: value });
            setSkill(res.data);
        }
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Vui lòng nhập tiêu đề tuyển dụng";
        if (!formData.jobs) newErrors.jobs = "Vui lòng chọn ngành nghề";
        if (!formData.experience) newErrors.experience = "Vui lòng chọn kinh nghiệm";
        if (!formData.salaryRange) newErrors.salaryRange = "Vui lòng chọn mức lương";
        if (!formData.joblevel) newErrors.joblevel = "Vui lòng chọn cấp bậc";
        if (!formData.workType) newErrors.workType = "Vui lòng chọn hình thức làm việc";
        if (!formData.location) newErrors.location = "Vui lòng chọn địa điểm";
        if (!formData.quantity) newErrors.quantity = "Vui lòng nhập số lượng tuyển";
        if (!formData.description || formData.description.trim() === "<p></p>") newErrors.description = "Vui lòng nhập mô tả công việc";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const hanleSumitForm = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            const response = await createPostJobdBusiness(formData);
            if (response?.success) {
                Swal.fire({ icon: "success", title: "Tạo tin tuyển dụng thành công!", timer: 2000, showConfirmButton: false });
                setFormData({ title: "", description: "", jobs: "", experience: "", salaryRange: "", joblevel: "", workType: "", location: "", skills: [], quantity: "", postPackage: 0, deadline: formatDate });
            } else {
                Swal.fire({ icon: "error", title: "Tạo tin thất bại!", text: response?.message || "Có lỗi xảy ra!" });
            }
        } catch (error) {
            Swal.fire({ icon: "error", title: "Lỗi kết nối!", text: error?.mes || "Không thể gửi dữ liệu!" });
        } finally {
            setLoading(false);
        }
    };

    const selectStyles = {
        control: (base, state) => ({
            ...base,
            background: state.isDisabled ? "#f3f4f6" : "#f9fafb",
            border: `1.5px solid ${state.isFocused ? "#6366f1" : "#e5e7eb"}`,
            borderRadius: "10px",
            boxShadow: state.isFocused ? "0 0 0 3px rgba(99,102,241,0.11)" : "none",
            minHeight: "42px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.88rem",
            color: "#111827",
            cursor: "pointer",
            transition: "border-color 0.22s, box-shadow 0.22s",
            "&:hover": { borderColor: "#6366f1" },
        }),
        multiValue: (base) => ({
            ...base,
            background: "rgba(99,102,241,0.1)",
            borderRadius: "999px",
            padding: "0 2px",
        }),
        multiValueLabel: (base) => ({
            ...base, color: "#6366f1", fontWeight: 500, fontSize: "0.76rem",
        }),
        multiValueRemove: (base) => ({
            ...base, color: "#6366f1", borderRadius: "999px",
            "&:hover": { background: "rgba(244,63,94,0.1)", color: "#f43f5e" },
        }),
        placeholder: (base) => ({ ...base, color: "#c4c9d4" }),
        option: (base, state) => ({
            ...base,
            background: state.isSelected ? "#6366f1" : state.isFocused ? "#eef2ff" : "#fff",
            color: state.isSelected ? "#fff" : "#111827",
            fontSize: "0.87rem",
            cursor: "pointer",
        }),
        menu: (base) => ({ ...base, borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 8px 24px rgba(99,102,241,0.12)" }),
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .bpj-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 55%, #f0fdf4 100%);
                    padding: 1rem 1rem;
                    font-family: 'Inter', sans-serif;
                }

                .bpj-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #1e1b4b;
                    text-align: center;
                    margin-bottom: 0.35rem;
                    letter-spacing: -0.02em;
                }

                .bpj-sub {
                    text-align: center;
                    font-size: 0.8rem;
                    color: #9ca3af;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 1rem;
                }

                /* ── Quota bar ── */
                .bpj-quota {
                    display: flex;
                    gap: 1rem;
                    max-width: 880px;
                    margin: 0 auto 1.5rem;
                    flex-wrap: wrap;
                }

                .bpj-quota-item {
                    flex: 1;
                    min-width: 140px;
                    background: #fff;
                    border-radius: 14px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 4px 16px rgba(99,102,241,0.07);
                    padding: 0.9rem 1.1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .bpj-quota-icon {
                    width: 38px; height: 38px;
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.85rem; flex-shrink: 0;
                }

                .bpj-quota-icon.blue   { background: rgba(99,102,241,0.12); color: #6366f1; }
                .bpj-quota-icon.orange { background: rgba(249,115,22,0.12);  color: #f97316; }

                .bpj-quota-label {
                    font-size: 0.68rem; color: #9ca3af;
                    text-transform: uppercase; letter-spacing: 0.08em;
                    font-weight: 500; margin-bottom: 0.1rem;
                }

                .bpj-quota-value {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.1rem; font-weight: 700; color: #1e1b4b;
                }

                /* ── Card ── */
                .bpj-card {
                    max-width: 880px;
                    margin: 0 auto;
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.08);
                    padding: 2.5rem 2rem;
                    position: relative;
                    overflow: hidden;
                }

                .bpj-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #6366f1, #10b981);
                    border-radius: 20px 20px 0 0;
                }

                /* ── Section header ── */
                .bpj-section {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.69rem; font-weight: 600;
                    letter-spacing: 0.12em; text-transform: uppercase;
                    color: #6366f1; margin: 0 0 1.1rem;
                    display: flex; align-items: center; gap: 0.5rem;
                }

                .bpj-section::after {
                    content: ''; flex: 1; height: 1px;
                    background: linear-gradient(90deg, #e0e7ff, transparent);
                }

                /* ── Grid ── */
                .bpj-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; margin-bottom: 1.1rem; }
                .bpj-grid.full { grid-template-columns: 1fr; }
                @media (max-width: 600px) { .bpj-grid { grid-template-columns: 1fr; } }

                /* ── Divider ── */
                .bpj-divider { border: none; border-top: 1px dashed #e5e7eb; margin: 1.5rem 0 1.25rem; }

                /* ── Label ── */
                .bpj-label {
                    display: flex; align-items: center; gap: 0.35rem;
                    font-size: 0.72rem; letter-spacing: 0.09em;
                    text-transform: uppercase; color: #6b7280;
                    font-weight: 500; margin-bottom: 0.4rem;
                }
                .bpj-label i { color: #a5b4fc; font-size: 0.68rem; }

                /* ── Input / Select ── */
                .bpj-input, .bpj-select {
                    width: 100%; background: #f9fafb;
                    border: 1.5px solid #e5e7eb; border-radius: 10px;
                    padding: 0.65rem 0.95rem; color: #111827;
                    font-family: 'Inter', sans-serif; font-size: 0.88rem;
                    outline: none; appearance: none;
                    transition: border-color 0.22s, box-shadow 0.22s, background 0.22s;
                }

                .bpj-input:focus, .bpj-select:focus {
                    background: #fff; border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.11);
                }

                .bpj-input.err, .bpj-select.err {
                    border-color: #f43f5e;
                    box-shadow: 0 0 0 3px rgba(244,63,94,0.09);
                }

                .bpj-input::placeholder { color: #c4c9d4; }
                .bpj-input:disabled, .bpj-select:disabled { background: #f3f4f6; color: #9ca3af; cursor: not-allowed; }

                /* ── Select arrow ── */
                .bpj-select-wrap { position: relative; }
                .bpj-select-wrap::after {
                    content: '▾'; position: absolute;
                    right: 0.9rem; top: 50%; transform: translateY(-50%);
                    color: #9ca3af; font-size: 0.75rem; pointer-events: none;
                }

                /* ── Error ── */
                .bpj-err { font-size: 0.71rem; color: #f43f5e; margin-top: 0.28rem; display: flex; align-items: center; gap: 0.3rem; }

                /* ── Post package selector ── */
                .bpj-pkg-row { display: flex; gap: 0.75rem; }

                .bpj-pkg-item {
                    flex: 1; background: #f9fafb;
                    border: 1.5px solid #e5e7eb; border-radius: 12px;
                    padding: 0.75rem 1rem; cursor: pointer;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                    display: flex; align-items: center; gap: 0.65rem;
                }

                .bpj-pkg-item:hover { border-color: #a5b4fc; background: #eef2ff; }

                .bpj-pkg-item.selected {
                    border-color: #6366f1; background: #eef2ff;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }

                .bpj-pkg-dot {
                    width: 16px; height: 16px; border-radius: 50%;
                    border: 2px solid #d1d5db; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    transition: border-color 0.2s, background 0.2s;
                }

                .bpj-pkg-item.selected .bpj-pkg-dot { border-color: #6366f1; background: #6366f1; }
                .bpj-pkg-dot::after { content: ''; width: 5px; height: 5px; border-radius: 50%; background: #fff; opacity: 0; transition: opacity 0.2s; }
                .bpj-pkg-item.selected .bpj-pkg-dot::after { opacity: 1; }

                .bpj-pkg-name { font-family: 'Sora', sans-serif; font-size: 0.82rem; font-weight: 600; color: #1e1b4b; }
                .bpj-pkg-meta { font-size: 0.72rem; color: #9ca3af; margin-top: 0.1rem; }

                /* ── Submit ── */
                .bpj-btn {
                    width: 100%; padding: 0.85rem;
                    border: none; border-radius: 10px;
                    background: linear-gradient(135deg, #6366f1 0%, #10b981 100%);
                    color: #fff; font-family: 'Sora', sans-serif;
                    font-size: 0.85rem; font-weight: 600;
                    letter-spacing: 0.07em; text-transform: uppercase;
                    cursor: pointer; margin-top: 1.25rem;
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                    transition: transform 0.15s, box-shadow 0.15s;
                }

                .bpj-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.28); }
                .bpj-btn:active { transform: translateY(0); }
                .bpj-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
            `}</style>

            <div className="bpj-page">
                {loading && <Loading />}

                <h2 className="bpj-heading">Tạo bài tuyển dụng</h2>
                <p className="bpj-sub">Đăng tin tuyển dụng nhanh chóng, chuyên nghiệp</p>

                {/* ── Quota stats ── */}
                <div className="bpj-quota">
                    <div className="bpj-quota-item">
                        <div className="bpj-quota-icon blue"><i className="fa-solid fa-file-lines" /></div>
                        <div>
                            <p className="bpj-quota-label">Đăng bình thường</p>
                            <p className="bpj-quota-value">{dataBusiness.normalPosts ?? "—"}</p>
                        </div>
                    </div>
                    <div className="bpj-quota-item">
                        <div className="bpj-quota-icon orange"><i className="fa-solid fa-star" /></div>
                        <div>
                            <p className="bpj-quota-label">Đăng nổi bật</p>
                            <p className="bpj-quota-value">{dataBusiness.featuredPosts ?? "—"}</p>
                        </div>
                    </div>
                </div>

                <div className="bpj-card">

                    <p className="bpj-section"><i className="fa-solid fa-briefcase" />Thông tin công việc</p>

                    {/* Title */}
                    <div className="bpj-grid full">
                        <div>
                            <label className="bpj-label"><i className="fa-solid fa-heading" />Tên bài tuyển dụng</label>
                            <input
                                type="text" name="title"
                                className={`bpj-input ${errors.title ? "err" : ""}`}
                                value={formData.title} onChange={handleChange}
                                placeholder="VD: Tuyển dụng Senior Frontend Developer..."
                            />
                            {errors.title && <p className="bpj-err">✕ {errors.title}</p>}
                        </div>
                    </div>

                    <div className="bpj-grid">
                        {/* Jobs */}
                        <div>
                            <label className="bpj-label"><i className="fa-solid fa-layer-group" />Lĩnh vực</label>
                            <div className="bpj-select-wrap">
                                <select name="jobs" className={`bpj-select ${errors.jobs ? "err" : ""}`} value={formData.jobs} onChange={handleChange}>
                                    <option value="">-- Chọn ngành nghề --</option>
                                    {job.map(item => <option key={item.title} value={item.title}>{item.title}</option>)}
                                </select>
                            </div>
                            {errors.jobs && <p className="bpj-err">✕ {errors.jobs}</p>}
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="bpj-label"><i className="fa-solid fa-clock-rotate-left" />Kinh nghiệm</label>
                            <div className="bpj-select-wrap">
                                <select name="experience" className={`bpj-select ${errors.experience ? "err" : ""}`} value={formData.experience} onChange={handleChange}>
                                    <option value="">-- Chọn kinh nghiệm --</option>
                                    {exp.map(item => <option key={item.experience} value={item.experience}>{item.experience}</option>)}
                                </select>
                            </div>
                            {errors.experience && <p className="bpj-err">✕ {errors.experience}</p>}
                        </div>

                        {/* Salary */}
                        <div>
                            <label className="bpj-label"><i className="fa-solid fa-dollar-sign" />Mức lương</label>
                            <div className="bpj-select-wrap">
                                <select name="salaryRange" className={`bpj-select ${errors.salaryRange ? "err" : ""}`} value={formData.salaryRange} onChange={handleChange}>
                                    <option value="">-- Chọn mức lương --</option>
                                    {Salaryrange.map(s => <option key={s._id} value={s._id}>{s.salaryRange}</option>)}
                                </select>
                            </div>
                            {errors.salaryRange && <p className="bpj-err">✕ {errors.salaryRange}</p>}
                        </div>

                        {/* Level */}
                        <div>
                            <label className="bpj-label"><i className="fa-solid fa-medal" />Cấp bậc</label>
                            <div className="bpj-select-wrap">
                                <select name="joblevel" className={`bpj-select ${errors.joblevel ? "err" : ""}`} value={formData.joblevel} onChange={handleChange}>
                                    <option value="">-- Chọn cấp bậc --</option>
                                    {level.map(l => <option key={l._id} value={l.nameLevel}>{l.nameLevel}</option>)}
                                </select>
                            </div>
                            {errors.joblevel && <p className="bpj-err">✕ {errors.joblevel}</p>}
                        </div>

                        {/* Work type */}
                        <div>
                            <label className="bpj-label"><i className="fa-solid fa-laptop-house" />Hình thức làm việc</label>
                            <div className="bpj-select-wrap">
                                <select name="workType" className={`bpj-select ${errors.workType ? "err" : ""}`} value={formData.workType} onChange={handleChange}>
                                    <option value="">-- Chọn hình thức --</option>
                                    {styleJob.map(st => <option key={st._id} value={st.workType}>{st.workType}</option>)}
                                </select>
                            </div>
                            {errors.workType && <p className="bpj-err">✕ {errors.workType}</p>}
                        </div>

                        {/* Location */}
                        <div>
                            <label className="bpj-label"><i className="fa-solid fa-location-dot" />Địa điểm</label>
                            <div className="bpj-select-wrap">
                                <select name="location" className={`bpj-select ${errors.location ? "err" : ""}`} value={formData.location} onChange={handleChange}>
                                    <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                    {cities.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            {errors.location && <p className="bpj-err">✕ {errors.location}</p>}
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="bpj-label"><i className="fa-solid fa-users" />Số lượng tuyển</label>
                            <input
                                type="number" name="quantity" min="1"
                                className={`bpj-input ${errors.quantity ? "err" : ""}`}
                                value={formData.quantity} onChange={handleChange}
                                placeholder="VD: 3"
                            />
                            {errors.quantity && <p className="bpj-err">✕ {errors.quantity}</p>}
                        </div>

                        {/* Deadline */}
                        <div>
                            <label className="bpj-label"><i className="fa-solid fa-calendar-xmark" />Hạn nộp hồ sơ</label>
                            <input type="date" name="deadline" className="bpj-input" value={formData.deadline} disabled />
                        </div>
                    </div>

                    {/* Skills */}
                    <div style={{ marginBottom: "1.1rem" }}>
                        <label className="bpj-label"><i className="fa-solid fa-wand-magic-sparkles" />Kỹ năng yêu cầu</label>
                        <Select
                            isMulti placeholder="-- Chọn kỹ năng --"
                            styles={selectStyles}
                            options={skill.map(sk => ({ value: sk.nameskill, label: sk.nameskill }))}
                            onChange={selected => setFormData(prev => ({ ...prev, skills: selected.map(s => s.value) }))}
                        />
                    </div>

                    <hr className="bpj-divider" />

                    <p className="bpj-section"><i className="fa-solid fa-box-open" />Gói đăng bài</p>

                    <div className="bpj-pkg-row" style={{ marginBottom: "1.5rem" }}>
                        <div
                            className={`bpj-pkg-item ${formData.postPackage === 0 ? "selected" : ""}`}
                            onClick={() => setFormData(prev => ({ ...prev, postPackage: 0 }))}
                        >
                            <div className="bpj-pkg-dot" />
                            <div>
                                <p className="bpj-pkg-name">Bình thường</p>
                                <p className="bpj-pkg-meta">Hiển thị trong danh sách thường</p>
                            </div>
                        </div>
                        <div
                            className={`bpj-pkg-item ${formData.postPackage === 1 ? "selected" : ""}`}
                            onClick={() => setFormData(prev => ({ ...prev, postPackage: 1 }))}
                        >
                            <div className="bpj-pkg-dot" />
                            <div>
                                <p className="bpj-pkg-name">⭐ Nổi bật</p>
                                <p className="bpj-pkg-meta">Hiển thị ưu tiên, thu hút hơn</p>
                            </div>
                        </div>
                    </div>

                    <hr className="bpj-divider" />


                    <p className="bpj-section"><i className="fa-solid fa-align-left" />Mô tả công việc</p>

                    <Editor
                        name="description" id="description"
                        value={formData.description}
                        onEditorChange={content => setFormData(prev => ({ ...prev, description: content }))}
                        apiKey={import.meta.env.VITE_API_MAKE_DOWN}
                        initialValue="Mô tả bài đăng công việc của bạn"
                        init={{
                            height: 420, menubar: true,
                            plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
                            toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                            content_style: "body { font-family: 'Inter', sans-serif; font-size: 14px; color: #111827; }",
                        }}
                    />
                    {errors.description && <p className="bpj-err" style={{ marginTop: "0.5rem" }}>✕ {errors.description}</p>}

                    <button className="bpj-btn" onClick={hanleSumitForm} disabled={loading}>
                        <i className="fa-solid fa-square-plus" />
                        {loading ? "Đang tạo..." : "Tạo bài đăng"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default BusinessPostJob;
