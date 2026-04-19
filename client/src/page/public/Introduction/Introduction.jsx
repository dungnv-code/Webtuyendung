import { useState, useRef, useCallback, useEffect } from "react";
import html2canvas from "@html2canvas/html2canvas";
import { jsPDF } from "jspdf";

const A4_W = 794;
const A4_H = 1123;

const defaultCV = {
    name: "Nguyễn Văn Đồ Án",
    position: "Vị trí ứng tuyển",
    dob: "01/01/2000",
    gender: "Nam",
    phone: "0123 456 789",
    email: "dungg322004@gmail.com",
    website: "facebook.com/TopCV.vn",
    address: "Quận A, thành phố Hà Nội",
    photo: null,
    objective: "",
    education: [{ id: 1, start: "", end: "", school: "", major: "", desc: "" }],
    experience: [{ id: 1, start: "", end: "", company: "", role: "", desc: "" }],
    skills: [{ id: 1, name: "", level: 3 }],
    certificates: [{ id: 1, date: "", name: "", issuer: "", desc: "" }],
    projects: [{ id: 1, start: "", end: "", name: "", role: "", desc: "", tech: "" }],
    awards: [{ id: 1, date: "", name: "", org: "", desc: "" }],
    hobbies: "",
    extraInfo: "",
    accentColor: "#1a7a4a",
    fontSize: 13,
    lineHeight: 1.6,
    fontFamily: "'Segoe UI', sans-serif",
    showObjective: true, showEducation: true, showExperience: true,
    showSkills: true, showCertificates: true, showProjects: true,
    showAwards: true, showHobbies: true, showExtra: true,
    sectionSpacing: 22, itemSpacing: 12, pagePadding: 36,
};

const ACCENT_COLORS = ["#1a7a4a", "#2c4a6e", "#444444", "#7a1a1a", "#b5860d", "#5a2d82", "#0e7490"];
const FONTS = [
    { label: "Segoe UI", value: "'Segoe UI', sans-serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Tahoma", value: "Tahoma, sans-serif" },
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Verdana", value: "Verdana, sans-serif" },
];
const TABS = [
    { key: "design", icon: "fa-palette", label: "Thiết kế" },
    { key: "layout", icon: "fa-table-columns", label: "Bố cục" },
    { key: "personal", icon: "fa-user", label: "Cá nhân" },
    { key: "education", icon: "fa-graduation-cap", label: "Học vấn" },
    { key: "experience", icon: "fa-briefcase", label: "Kinh nghiệm" },
    { key: "skills", icon: "fa-bolt", label: "Kỹ năng" },
    { key: "certificates", "icon": "fa-certificate", label: "Chứng chỉ" },
    { key: "projects", icon: "fa-rocket", label: "Dự án" },
    { key: "awards", icon: "fa-trophy", label: "Giải thưởng" },
    { key: "hobbies", icon: "fa-heart", label: "Sở thích" },
    { key: "extra", icon: "fa-circle-info", label: "Thêm" },
];
const SECTION_TOGGLES = {
    showObjective: "Mục tiêu nghề nghiệp", showEducation: "Học vấn",
    showExperience: "Kinh nghiệm", showSkills: "Kỹ năng",
    showCertificates: "Chứng chỉ", showProjects: "Dự án",
    showAwards: "Giải thưởng", showHobbies: "Sở thích", showExtra: "Thông tin thêm",
};

function SInput({ value, onChange, placeholder, style = {} }) {
    return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
            width: "100%", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 10px",
            fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", ...style
        }} />;
}

function STA({ value, onChange, placeholder }) {
    return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
        style={{
            width: "100%", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 10px",
            fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "none"
        }} />;
}

function AddBtn({ color, onClick, label }) {
    return (
        <button onClick={onClick}
            className="btn btn-sm mt-2"
            style={{ fontSize: 11, color, border: `1px dashed ${color}`, background: "transparent", borderRadius: 6 }}>
            <i className="fa-solid fa-plus me-1"></i>{label}
        </button>
    );
}

function DelBtn({ onClick }) {
    return (
        <button onClick={onClick}
            className="btn btn-sm"
            style={{ fontSize: 10, color: "#e55", border: "1px solid #fcc", background: "transparent", borderRadius: 4, padding: "2px 6px" }}>
            <i className="fa-solid fa-xmark"></i>
        </button>
    );
}

function Toggle({ checked, onChange, label, color }) {
    return (
        <div className="d-flex align-items-center justify-content-between mb-2">
            <span style={{ fontSize: 12, color: "#555" }}>{label}</span>
            <div onClick={() => onChange(!checked)}
                style={{
                    width: 36, height: 20, borderRadius: 10,
                    background: checked ? (color || "#1a7a4a") : "#ccc",
                    cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0
                }}>
                <div style={{
                    position: "absolute", top: 2, left: checked ? 18 : 2, width: 16, height: 16,
                    borderRadius: "50%", background: "#fff", transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                }} />
            </div>
        </div>
    );
}

function EF({ value, onChange, placeholder, style = {}, multiline = false }) {
    const ref = useRef();
    useEffect(() => {
        const el = ref.current;
        if (!el || document.activeElement === el) return;
        if (el.innerText !== value) el.innerText = value ?? "";
    }, [value]);
    const handleInput = () => { if (ref.current) onChange(ref.current.innerText); };
    return (
        <div ref={ref} contentEditable suppressContentEditableWarning
            onInput={handleInput} onBlur={handleInput}
            data-placeholder={placeholder} className="ef-field"
            style={{
                display: "block", borderBottom: "1.5px dashed #d0d0d0", outline: "none",
                background: "transparent", fontSize: "inherit", fontFamily: "inherit", color: "inherit",
                width: "100%", padding: "2px 0", lineHeight: "inherit",
                whiteSpace: multiline ? "pre-wrap" : "nowrap", overflowWrap: "break-word",
                minHeight: multiline ? "3.2em" : undefined, cursor: "text", ...style,
            }}
        />
    );
}

function SecHead({ title, color }) {
    return (
        <div className="d-flex align-items-center gap-2 mb-2">
            <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color, margin: 0, whiteSpace: "nowrap" }}>{title}</h2>
            <div style={{ flex: 1, height: 1.5, background: color, opacity: 0.22 }} />
        </div>
    );
}

function PhotoUpload({ photo, onUpload, onRemove, color }) {
    const ref = useRef();
    const read = f => { if (!f) return; const r = new FileReader(); r.onload = e => onUpload(e.target.result); r.readAsDataURL(f); };
    const drop = useCallback(e => { e.preventDefault(); read(e.dataTransfer.files[0]); }, []);
    return (
        <div>
            <label className="form-label fw-semibold" style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <i className="fa-solid fa-image me-1"></i> Ảnh đại diện
            </label>
            {photo ? (
                <div className="d-flex align-items-center gap-3">
                    <img src={photo} alt="avatar" className="rounded-circle"
                        style={{ width: 64, height: 64, objectFit: "cover", border: `2.5px solid ${color}` }} />
                    <div className="d-flex flex-column gap-1">
                        <button onClick={() => ref.current.click()} className="btn btn-sm btn-outline-secondary" style={{ fontSize: 11 }}>
                            <i className="fa-solid fa-camera me-1"></i>Đổi ảnh
                        </button>
                        <button onClick={onRemove} className="btn btn-sm" style={{ fontSize: 11, color: "#e55", border: "1px solid #fcc", background: "transparent" }}>
                            <i className="fa-solid fa-trash me-1"></i>Xóa
                        </button>
                    </div>
                </div>
            ) : (
                <div onDrop={drop} onDragOver={e => e.preventDefault()} onClick={() => ref.current.click()}
                    className="rounded-3 text-center p-3"
                    style={{ border: `2px dashed ${color}50`, background: `${color}05`, cursor: "pointer" }}>
                    <i className="fa-solid fa-camera-retro d-block mb-1" style={{ fontSize: 24, color: color }}></i>
                    <div style={{ fontSize: 12, color: "#888" }}>Kéo thả hoặc nhấn để tải ảnh</div>
                    <div style={{ fontSize: 11, color: "#bbb" }}>JPG · PNG · WEBP</div>
                </div>
            )}
            <input ref={ref} type="file" accept="image/*" onChange={e => read(e.target.files[0])} style={{ display: "none" }} />
        </div>
    );
}

function Toolbar({ cv, setCV }) {
    const [tab, setTab] = useState("design");
    const c = cv.accentColor;
    const set = (k, v) => setCV(p => ({ ...p, [k]: v }));
    const upArr = (arr, i, f, v) => arr.map((x, j) => j === i ? { ...x, [f]: v } : x);

    return (
        <div className="d-flex flex-column h-100">


            <div className="px-3 py-3 sticky-top bg-white" style={{ borderBottom: "1px solid #f0f0f0", zIndex: 2 }}>
                <div className="fw-bold mb-2" style={{ fontSize: 13, color: "#1a1a1a" }}>
                    <i className="fa-solid fa-pen-to-square me-2" style={{ color: c }}></i>
                    Chỉnh sửa CV
                </div>

                <div className="d-flex flex-wrap gap-1">
                    {TABS.map(s => (
                        <button key={s.key} onClick={() => setTab(s.key)}
                            className="btn btn-sm"
                            style={{
                                fontSize: 11, padding: "3px 8px", borderRadius: 6,
                                border: tab === s.key ? `1.5px solid ${c}` : "1px solid #e5e7eb",
                                background: tab === s.key ? `${c}18` : "#fff",
                                color: tab === s.key ? c : "#666",
                                fontWeight: tab === s.key ? 700 : 400,
                            }}>
                            <i className={`fa-solid ${s.icon} me-1`}></i>
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-3 flex-grow-1" style={{ overflowY: "auto" }}>

                {tab === "design" && (
                    <div className="d-flex flex-column gap-3">
                        <PhotoUpload photo={cv.photo} color={c} onUpload={v => set("photo", v)} onRemove={() => set("photo", null)} />

                        <div>
                            <label className="form-label fw-semibold" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#444" }}>
                                <i className="fa-solid fa-droplet me-1"></i> Màu chủ đề
                            </label>
                            <div className="d-flex gap-2 flex-wrap align-items-center">
                                {ACCENT_COLORS.map(col => (
                                    <button key={col} onClick={() => set("accentColor", col)}
                                        style={{
                                            width: 26, height: 26, borderRadius: "50%", background: col, border: "none",
                                            cursor: "pointer",
                                            outline: cv.accentColor === col ? `3px solid ${col}` : "2px solid #eee",
                                            outlineOffset: 2,
                                            transform: cv.accentColor === col ? "scale(1.2)" : "scale(1)",
                                            transition: "all 0.2s"
                                        }} />
                                ))}
                                <input type="color" value={cv.accentColor} onChange={e => set("accentColor", e.target.value)}
                                    style={{ width: 26, height: 26, padding: 0, border: "2px solid #eee", borderRadius: "50%", cursor: "pointer" }} />
                            </div>
                        </div>

                        <div>
                            <label className="form-label fw-semibold" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#444" }}>
                                <i className="fa-solid fa-font me-1"></i> Font chữ
                            </label>
                            <select className="form-select form-select-sm" value={cv.fontFamily}
                                onChange={e => set("fontFamily", e.target.value)}>
                                {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="form-label fw-semibold mb-1" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#444" }}>
                                <i className="fa-solid fa-text-height me-1"></i> Cỡ chữ: {cv.fontSize}px
                            </label>
                            <input type="range" className="form-range" min={11} max={16} step={0.5}
                                value={cv.fontSize} onChange={e => set("fontSize", parseFloat(e.target.value))}
                                style={{ accentColor: c }} />
                            <div className="d-flex justify-content-between" style={{ fontSize: 10, color: "#aaa" }}>
                                <span>Nhỏ</span><span>Vừa</span><span>Lớn</span>
                            </div>
                        </div>

                        <div>
                            <label className="form-label fw-semibold mb-1" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "#444" }}>
                                <i className="fa-solid fa-lines-leaning me-1"></i> Khoảng cách dòng: {cv.lineHeight}
                            </label>
                            <input type="range" className="form-range" min={1.2} max={2.2} step={0.1}
                                value={cv.lineHeight} onChange={e => set("lineHeight", parseFloat(e.target.value))}
                                style={{ accentColor: c }} />
                        </div>
                    </div>
                )}

                {tab === "layout" && (
                    <div className="d-flex flex-column gap-3">
                        <div>
                            <label className="form-label fw-bold" style={{ fontSize: 12 }}>
                                <i className="fa-solid fa-list-check me-1" style={{ color: c }}></i> Hiển thị mục
                            </label>
                            <p className="text-muted mb-2" style={{ fontSize: 11 }}>Bật/tắt để điều chỉnh độ dài CV</p>
                            {Object.entries(SECTION_TOGGLES).map(([k, label]) => (
                                <Toggle key={k} checked={cv[k]} onChange={v => set(k, v)} label={label} color={c} />
                            ))}
                        </div>
                        <hr className="my-1" />
                        <div>
                            <label className="form-label fw-bold" style={{ fontSize: 12 }}>
                                <i className="fa-solid fa-ruler me-1" style={{ color: c }}></i> Khoảng cách & Lề
                            </label>
                            {[
                                ["Khoảng cách giữa mục", "sectionSpacing", 8, 42, 2],
                                ["Khoảng cách item", "itemSpacing", 4, 24, 2],
                                ["Lề trang", "pagePadding", 16, 64, 4],
                            ].map(([label, key, min, max, step]) => (
                                <div key={key} className="mb-3">
                                    <label className="form-label mb-1" style={{ fontSize: 11, color: "#666" }}>
                                        {label}: {cv[key]}px
                                    </label>
                                    <input type="range" className="form-range" min={min} max={max} step={step}
                                        value={cv[key]} onChange={e => set(key, parseInt(e.target.value))}
                                        style={{ accentColor: c }} />
                                </div>
                            ))}
                        </div>
                        <div className="rounded-3 p-3" style={{ background: `${c}10`, border: `1px solid ${c}30`, fontSize: 11, color: "#555", lineHeight: 1.5 }}>
                            <i className="fa-solid fa-lightbulb me-1" style={{ color: c }}></i>
                            <strong>Gói 1 trang:</strong> Giảm cỡ chữ + khoảng cách, tắt mục ít quan trọng.
                        </div>
                    </div>
                )}

                {tab === "personal" && (
                    <div className="d-flex flex-column gap-2">
                        {[
                            ["fa-user", "Họ và tên", "name"],
                            ["fa-briefcase", "Vị trí ứng tuyển", "position"],
                            ["fa-calendar", "Ngày sinh", "dob"],
                            ["fa-venus-mars", "Giới tính", "gender"],
                            ["fa-phone", "Số điện thoại", "phone"],
                            ["fa-envelope", "Email", "email"],
                            ["fa-globe", "Website", "website"],
                            ["fa-location-dot", "Địa chỉ", "address"],
                        ].map(([icon, label, key]) => (
                            <div key={key}>
                                <div className="mb-1" style={{ fontSize: 11, color: "#888" }}>
                                    <i className={`fa-solid ${icon} me-1`} style={{ color: c, width: 12 }}></i>{label}
                                </div>
                                <SInput value={cv[key]} onChange={v => set(key, v)} placeholder={label} />
                            </div>
                        ))}
                        <div>
                            <div className="mb-1" style={{ fontSize: 11, color: "#888" }}>
                                <i className="fa-solid fa-align-left me-1" style={{ color: c }}></i>Mục tiêu nghề nghiệp
                            </div>
                            <STA value={cv.objective} onChange={v => set("objective", v)} placeholder="Mục tiêu..." />
                        </div>
                    </div>
                )}

                {tab === "education" && (
                    <div>
                        {cv.education.map((edu, i) => (
                            <div key={edu.id} className="rounded-3 p-3 mb-2" style={{ background: "#f9f9f9" }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-semibold" style={{ fontSize: 11, color: "#555" }}>
                                        <i className="fa-solid fa-graduation-cap me-1" style={{ color: c }}></i>Học vấn {i + 1}
                                    </span>
                                    <DelBtn onClick={() => setCV(p => ({ ...p, education: p.education.filter((_, j) => j !== i) }))} />
                                </div>
                                <div className="d-flex gap-2 mb-2">
                                    <SInput placeholder="Bắt đầu" value={edu.start} onChange={v => setCV(p => ({ ...p, education: upArr(p.education, i, "start", v) }))} style={{ width: "50%" }} />
                                    <SInput placeholder="Kết thúc" value={edu.end} onChange={v => setCV(p => ({ ...p, education: upArr(p.education, i, "end", v) }))} style={{ width: "50%" }} />
                                </div>
                                <SInput placeholder="Tên trường" value={edu.school} onChange={v => setCV(p => ({ ...p, education: upArr(p.education, i, "school", v) }))} style={{ marginBottom: 6 }} />
                                <SInput placeholder="Ngành học" value={edu.major} onChange={v => setCV(p => ({ ...p, education: upArr(p.education, i, "major", v) }))} style={{ marginBottom: 6 }} />
                                <STA placeholder="Mô tả" value={edu.desc} onChange={v => setCV(p => ({ ...p, education: upArr(p.education, i, "desc", v) }))} />
                            </div>
                        ))}
                        <AddBtn color={c} onClick={() => setCV(p => ({ ...p, education: [...p.education, { id: Date.now(), start: "", end: "", school: "", major: "", desc: "" }] }))} label="Thêm học vấn" />
                    </div>
                )}

                {tab === "experience" && (
                    <div>
                        {cv.experience.map((exp, i) => (
                            <div key={exp.id} className="rounded-3 p-3 mb-2" style={{ background: "#f9f9f9" }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-semibold" style={{ fontSize: 11, color: "#555" }}>
                                        <i className="fa-solid fa-briefcase me-1" style={{ color: c }}></i>Kinh nghiệm {i + 1}
                                    </span>
                                    <DelBtn onClick={() => setCV(p => ({ ...p, experience: p.experience.filter((_, j) => j !== i) }))} />
                                </div>
                                <div className="d-flex gap-2 mb-2">
                                    <SInput placeholder="Bắt đầu" value={exp.start} onChange={v => setCV(p => ({ ...p, experience: upArr(p.experience, i, "start", v) }))} style={{ width: "50%" }} />
                                    <SInput placeholder="Kết thúc" value={exp.end} onChange={v => setCV(p => ({ ...p, experience: upArr(p.experience, i, "end", v) }))} style={{ width: "50%" }} />
                                </div>
                                <SInput placeholder="Tên công ty" value={exp.company} onChange={v => setCV(p => ({ ...p, experience: upArr(p.experience, i, "company", v) }))} style={{ marginBottom: 6 }} />
                                <SInput placeholder="Vị trí" value={exp.role} onChange={v => setCV(p => ({ ...p, experience: upArr(p.experience, i, "role", v) }))} style={{ marginBottom: 6 }} />
                                <STA placeholder="Mô tả công việc" value={exp.desc} onChange={v => setCV(p => ({ ...p, experience: upArr(p.experience, i, "desc", v) }))} />
                            </div>
                        ))}
                        <AddBtn color={c} onClick={() => setCV(p => ({ ...p, experience: [...p.experience, { id: Date.now(), start: "", end: "", company: "", role: "", desc: "" }] }))} label="Thêm kinh nghiệm" />
                    </div>
                )}

                {tab === "skills" && (
                    <div>
                        {cv.skills.map((sk, i) => (
                            <div key={sk.id} className="d-flex align-items-center gap-2 mb-2">
                                <SInput placeholder="Tên kỹ năng" value={sk.name} onChange={v => setCV(p => ({ ...p, skills: upArr(p.skills, i, "name", v) }))} style={{ flex: 1 }} />
                                <div className="d-flex gap-1">
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <div key={n} onClick={() => setCV(p => ({ ...p, skills: upArr(p.skills, i, "level", n) }))}
                                            style={{ width: 14, height: 14, borderRadius: "50%", background: n <= sk.level ? c : "#e5e7eb", cursor: "pointer", transition: "background 0.2s" }} />
                                    ))}
                                </div>
                                <DelBtn onClick={() => setCV(p => ({ ...p, skills: p.skills.filter((_, j) => j !== i) }))} />
                            </div>
                        ))}
                        <AddBtn color={c} onClick={() => setCV(p => ({ ...p, skills: [...p.skills, { id: Date.now(), name: "", level: 3 }] }))} label="Thêm kỹ năng" />
                    </div>
                )}

                {tab === "certificates" && (
                    <div>
                        {cv.certificates.map((cert, i) => (
                            <div key={cert.id} className="rounded-3 p-3 mb-2" style={{ background: "#f9f9f9" }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-semibold" style={{ fontSize: 11, color: "#555" }}>
                                        <i className="fa-solid fa-certificate me-1" style={{ color: c }}></i>Chứng chỉ {i + 1}
                                    </span>
                                    <DelBtn onClick={() => setCV(p => ({ ...p, certificates: p.certificates.filter((_, j) => j !== i) }))} />
                                </div>
                                <SInput placeholder="Thời gian" value={cert.date} onChange={v => setCV(p => ({ ...p, certificates: upArr(p.certificates, i, "date", v) }))} style={{ marginBottom: 6 }} />
                                <SInput placeholder="Tên chứng chỉ" value={cert.name} onChange={v => setCV(p => ({ ...p, certificates: upArr(p.certificates, i, "name", v) }))} style={{ marginBottom: 6 }} />
                                <SInput placeholder="Tổ chức cấp" value={cert.issuer} onChange={v => setCV(p => ({ ...p, certificates: upArr(p.certificates, i, "issuer", v) }))} style={{ marginBottom: 6 }} />
                                <STA placeholder="Mô tả" value={cert.desc} onChange={v => setCV(p => ({ ...p, certificates: upArr(p.certificates, i, "desc", v) }))} />
                            </div>
                        ))}
                        <AddBtn color={c} onClick={() => setCV(p => ({ ...p, certificates: [...p.certificates, { id: Date.now(), date: "", name: "", issuer: "", desc: "" }] }))} label="Thêm chứng chỉ" />
                    </div>
                )}

                {tab === "projects" && (
                    <div>
                        {cv.projects.map((proj, i) => (
                            <div key={proj.id} className="rounded-3 p-3 mb-2" style={{ background: "#f9f9f9" }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-semibold" style={{ fontSize: 11, color: "#555" }}>
                                        <i className="fa-solid fa-rocket me-1" style={{ color: c }}></i>Dự án {i + 1}
                                    </span>
                                    <DelBtn onClick={() => setCV(p => ({ ...p, projects: p.projects.filter((_, j) => j !== i) }))} />
                                </div>
                                <div className="d-flex gap-2 mb-2">
                                    <SInput placeholder="Bắt đầu" value={proj.start} onChange={v => setCV(p => ({ ...p, projects: upArr(p.projects, i, "start", v) }))} style={{ width: "50%" }} />
                                    <SInput placeholder="Kết thúc" value={proj.end} onChange={v => setCV(p => ({ ...p, projects: upArr(p.projects, i, "end", v) }))} style={{ width: "50%" }} />
                                </div>
                                <SInput placeholder="Tên dự án" value={proj.name} onChange={v => setCV(p => ({ ...p, projects: upArr(p.projects, i, "name", v) }))} style={{ marginBottom: 6 }} />
                                <SInput placeholder="Vai trò" value={proj.role} onChange={v => setCV(p => ({ ...p, projects: upArr(p.projects, i, "role", v) }))} style={{ marginBottom: 6 }} />
                                <SInput placeholder="Công nghệ" value={proj.tech} onChange={v => setCV(p => ({ ...p, projects: upArr(p.projects, i, "tech", v) }))} style={{ marginBottom: 6 }} />
                                <STA placeholder="Mô tả dự án..." value={proj.desc} onChange={v => setCV(p => ({ ...p, projects: upArr(p.projects, i, "desc", v) }))} />
                            </div>
                        ))}
                        <AddBtn color={c} onClick={() => setCV(p => ({ ...p, projects: [...p.projects, { id: Date.now(), start: "", end: "", name: "", role: "", desc: "", tech: "" }] }))} label="Thêm dự án" />
                    </div>
                )}

                {tab === "awards" && (
                    <div>
                        {cv.awards.map((aw, i) => (
                            <div key={aw.id} className="rounded-3 p-3 mb-2" style={{ background: "#f9f9f9" }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-semibold" style={{ fontSize: 11, color: "#555" }}>
                                        <i className="fa-solid fa-trophy me-1" style={{ color: c }}></i>Giải thưởng {i + 1}
                                    </span>
                                    <DelBtn onClick={() => setCV(p => ({ ...p, awards: p.awards.filter((_, j) => j !== i) }))} />
                                </div>
                                <SInput placeholder="Thời gian" value={aw.date} onChange={v => setCV(p => ({ ...p, awards: upArr(p.awards, i, "date", v) }))} style={{ marginBottom: 6 }} />
                                <SInput placeholder="Tên giải thưởng" value={aw.name} onChange={v => setCV(p => ({ ...p, awards: upArr(p.awards, i, "name", v) }))} style={{ marginBottom: 6 }} />
                                <SInput placeholder="Tổ chức trao" value={aw.org} onChange={v => setCV(p => ({ ...p, awards: upArr(p.awards, i, "org", v) }))} style={{ marginBottom: 6 }} />
                                <STA placeholder="Mô tả" value={aw.desc} onChange={v => setCV(p => ({ ...p, awards: upArr(p.awards, i, "desc", v) }))} />
                            </div>
                        ))}
                        <AddBtn color={c} onClick={() => setCV(p => ({ ...p, awards: [...p.awards, { id: Date.now(), date: "", name: "", org: "", desc: "" }] }))} label="Thêm giải thưởng" />
                    </div>
                )}

                {tab === "hobbies" && (
                    <div>
                        <div className="mb-1" style={{ fontSize: 11, color: "#888" }}>
                            <i className="fa-solid fa-heart me-1" style={{ color: c }}></i>Sở thích của bạn
                        </div>
                        <STA value={cv.hobbies} onChange={v => set("hobbies", v)} placeholder="VD: Đọc sách, du lịch, âm nhạc..." />
                    </div>
                )}

                {tab === "extra" && (
                    <div>
                        <div className="mb-1" style={{ fontSize: 11, color: "#888" }}>
                            <i className="fa-solid fa-circle-info me-1" style={{ color: c }}></i>Thông tin bổ sung
                        </div>
                        <STA value={cv.extraInfo} onChange={v => set("extraInfo", v)} placeholder="VD: Sẵn sàng toàn thời gian, có xe máy..." />
                    </div>
                )}
            </div>
        </div>
    );
}


function CVPreview({ cv, setCV, cvRef, cvHRef }) {
    const col = cv.accentColor;
    const up = (k, v) => setCV(p => ({ ...p, [k]: v }));
    const upA = (ak, i, f, v) => setCV(p => ({ ...p, [ak]: p[ak].map((x, j) => j === i ? { ...x, [f]: v } : x) }));
    const ss = cv.sectionSpacing;
    const is = cv.itemSpacing;
    const photoRef = useRef();

    const addBtn = (arr, key, blank) => (
        <button onClick={() => setCV(p => ({ ...p, [key]: [...p[key], { id: Date.now(), ...blank }] }))}
            className="btn btn-sm mt-2"
            style={{ fontSize: 11, color: col, border: `1px dashed ${col}`, background: "transparent", borderRadius: 6 }}>
            <i className="fa-solid fa-plus me-1"></i>Thêm
        </button>
    );

    const setRefs = (el) => {
        if (cvRef) cvRef.current = el;
        if (cvHRef) cvHRef.current = el;
    };

    return (
        <div ref={setRefs} style={{
            background: "#fff", width: A4_W, minHeight: A4_H,
            fontFamily: cv.fontFamily, fontSize: cv.fontSize, lineHeight: cv.lineHeight,
            color: "#333", padding: `${cv.pagePadding}px ${cv.pagePadding + 8}px`, boxSizing: "border-box"
        }}>
            {/* Header */}
            <div style={{ display: "flex", gap: 22, marginBottom: ss, paddingBottom: ss * 0.75, borderBottom: `2px solid ${col}20` }}>
                <div style={{ width: 96, height: 96, borderRadius: "50%", flexShrink: 0, background: cv.photo ? "transparent" : `${col}15`, display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${col}30`, overflow: "hidden", cursor: "pointer", position: "relative" }}
                    onClick={() => photoRef.current.click()} title="Nhấp để thay ảnh">
                    {cv.photo ? <img src={cv.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <i className="fa-solid fa-user" style={{ fontSize: 32, color: col, opacity: 0.4 }}></i>}
                    <div style={{ position: "absolute", inset: "auto 0 0 0", background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: 9, textAlign: "center", padding: "3px 0", opacity: 0, transition: "opacity 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                        <i className="fa-solid fa-camera"></i> Đổi
                    </div>
                </div>
                <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }}
                    onChange={e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => up("photo", ev.target.result); r.readAsDataURL(f); }} />
                <div style={{ flex: 1 }}>
                    <EF value={cv.name} onChange={v => up("name", v)} style={{ fontSize: cv.fontSize * 1.9, fontWeight: 700, color: "#1a1a1a", display: "block", marginBottom: 2 }} />
                    <EF value={cv.position} onChange={v => up("position", v)} style={{ fontSize: cv.fontSize * 1.05, color: col, fontWeight: 600, display: "block", marginBottom: 10 }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 14px", fontSize: cv.fontSize * 0.88 }}>
                        {[[<i class="fa-solid fa-calendar"></i>, "Ngày sinh", "dob"], [<i class="fa-solid fa-venus-mars"></i>, "Giới tính", "gender"], [<i class="fa-solid fa-phone"></i>, "Điện thoại", "phone"], [<i class="fa-solid fa-envelope"></i>, "Email", "email"], [<i class="fa-solid fa-globe"></i>, "Website", "website"], [<i class="fa-solid fa-location-dot"></i>, "Địa chỉ", "address"]].map(([icon, label, key]) => (
                            <div key={key} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                <span style={{ color: "#aaa", whiteSpace: "nowrap", fontSize: cv.fontSize * 0.82 }}>{icon} {label}:</span>
                                <EF value={cv[key]} onChange={v => up(key, v)} style={{ fontSize: cv.fontSize * 0.88, flex: 1 }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {cv.showObjective && <div style={{ marginBottom: ss }}><SecHead title="Mục tiêu nghề nghiệp" color={col} /><EF value={cv.objective} onChange={v => up("objective", v)} placeholder="Mục tiêu nghề nghiệp ngắn hạn và dài hạn..." multiline style={{ fontSize: cv.fontSize * 0.95, color: "#555" }} /></div>}

            {cv.showEducation && <div style={{ marginBottom: ss }}><SecHead title="Học vấn" color={col} />{cv.education.map((edu, i) => (<div key={edu.id} style={{ display: "flex", gap: 16, marginBottom: is }}><div style={{ width: 110, flexShrink: 0, color: "#999", fontSize: cv.fontSize * 0.83, paddingTop: 2 }}><EF value={edu.start} placeholder="Bắt đầu" onChange={v => upA("education", i, "start", v)} style={{ fontSize: cv.fontSize * 0.83, width: 44 }} />{" – "}<EF value={edu.end} placeholder="Kết thúc" onChange={v => upA("education", i, "end", v)} style={{ fontSize: cv.fontSize * 0.83, width: 44 }} /></div><div style={{ flex: 1 }}><EF value={edu.school} placeholder="Tên trường" onChange={v => upA("education", i, "school", v)} style={{ fontWeight: 600 }} /><EF value={edu.major} placeholder="Ngành học" onChange={v => upA("education", i, "major", v)} style={{ color: col, fontSize: cv.fontSize * 0.92 }} /><EF value={edu.desc} placeholder="Mô tả" onChange={v => upA("education", i, "desc", v)} multiline style={{ fontSize: cv.fontSize * 0.87, color: "#666", marginTop: 2 }} /></div></div>))}</div>}

            {cv.showExperience && <div style={{ marginBottom: ss }}><SecHead title="Kinh nghiệm làm việc" color={col} />{cv.experience.map((exp, i) => (<div key={exp.id} style={{ display: "flex", gap: 16, marginBottom: is }}><div style={{ width: 110, flexShrink: 0, color: "#999", fontSize: cv.fontSize * 0.83, paddingTop: 2 }}><EF value={exp.start} placeholder="Bắt đầu" onChange={v => upA("experience", i, "start", v)} style={{ fontSize: cv.fontSize * 0.83, width: 44 }} />{" – "}<EF value={exp.end} placeholder="Kết thúc" onChange={v => upA("experience", i, "end", v)} style={{ fontSize: cv.fontSize * 0.83, width: 44 }} /></div><div style={{ flex: 1 }}><EF value={exp.company} placeholder="Tên công ty" onChange={v => upA("experience", i, "company", v)} style={{ fontWeight: 600 }} /><EF value={exp.role} placeholder="Vị trí" onChange={v => upA("experience", i, "role", v)} style={{ color: col, fontSize: cv.fontSize * 0.92 }} /><EF value={exp.desc} placeholder="Mô tả..." onChange={v => upA("experience", i, "desc", v)} multiline style={{ fontSize: cv.fontSize * 0.87, color: "#555", marginTop: 4 }} /></div></div>))}{addBtn(cv.experience, "experience", { start: "", end: "", company: "", role: "", desc: "" })}</div>}

            {cv.showSkills && <div style={{ marginBottom: ss }}><SecHead title="Kỹ năng" color={col} /><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${is * 0.6}px 16px` }}>{cv.skills.map((sk, i) => (<div key={sk.id} style={{ display: "flex", alignItems: "center", gap: 8 }}><EF value={sk.name} placeholder="Tên kỹ năng" onChange={v => upA("skills", i, "name", v)} style={{ flex: 1, fontSize: cv.fontSize * 0.92 }} /><div style={{ display: "flex", gap: 3 }}>{[1, 2, 3, 4, 5].map(n => (<div key={n} onClick={() => upA("skills", i, "level", n)} style={{ width: 11, height: 11, borderRadius: "50%", background: n <= sk.level ? col : "#e5e7eb", cursor: "pointer", transition: "background 0.2s" }} />))}</div></div>))}</div>{addBtn(cv.skills, "skills", { name: "", level: 3 })}</div>}

            {cv.showCertificates && <div style={{ marginBottom: ss }}><SecHead title="Chứng chỉ" color={col} />{cv.certificates.map((cert, i) => (<div key={cert.id} style={{ display: "flex", gap: 16, marginBottom: is }}><div style={{ width: 110, flexShrink: 0, color: "#999", fontSize: cv.fontSize * 0.83 }}><EF value={cert.date} placeholder="Thời gian" onChange={v => upA("certificates", i, "date", v)} style={{ fontSize: cv.fontSize * 0.83 }} /></div><div style={{ flex: 1 }}><EF value={cert.name} placeholder="Tên chứng chỉ" onChange={v => upA("certificates", i, "name", v)} style={{ fontWeight: 600 }} /></div></div>))}{addBtn(cv.certificates, "certificates", { date: "", name: "", issuer: "", desc: "" })}</div>}

            {cv.showProjects && <div style={{ marginBottom: ss }}><SecHead title="Dự án" color={col} />{cv.projects.map((proj, i) => (<div key={proj.id} style={{ display: "flex", gap: 16, marginBottom: is }}><div style={{ width: 110, flexShrink: 0, color: "#999", fontSize: cv.fontSize * 0.83, paddingTop: 2 }}><EF value={proj.start} placeholder="Bắt đầu" onChange={v => upA("projects", i, "start", v)} style={{ fontSize: cv.fontSize * 0.83, width: 44 }} />{" – "}<EF value={proj.end} placeholder="Kết thúc" onChange={v => upA("projects", i, "end", v)} style={{ fontSize: cv.fontSize * 0.83, width: 44 }} /></div><div style={{ flex: 1 }}><div style={{ display: "flex", gap: 6, alignItems: "baseline" }}><EF value={proj.name} placeholder="Tên dự án" onChange={v => upA("projects", i, "name", v)} style={{ fontWeight: 600, flex: 1 }} /><EF value={proj.role} placeholder="Vai trò" onChange={v => upA("projects", i, "role", v)} style={{ color: col, fontSize: cv.fontSize * 0.9, flex: 1 }} /></div><EF value={proj.tech} placeholder="Công nghệ: React, Node.js..." onChange={v => upA("projects", i, "tech", v)} style={{ fontSize: cv.fontSize * 0.84, color: "#888", fontStyle: "italic", marginTop: 2 }} /><EF value={proj.desc} placeholder="Mô tả dự án..." onChange={v => upA("projects", i, "desc", v)} multiline style={{ fontSize: cv.fontSize * 0.87, color: "#555", marginTop: 3 }} /></div></div>))}{addBtn(cv.projects, "projects", { start: "", end: "", name: "", role: "", desc: "", tech: "" })}</div>}

            {cv.showAwards && <div style={{ marginBottom: ss }}><SecHead title="Danh hiệu & Giải thưởng" color={col} />{cv.awards.map((aw, i) => (<div key={aw.id} style={{ display: "flex", gap: 16, marginBottom: is }}><div style={{ width: 110, flexShrink: 0, color: "#999", fontSize: cv.fontSize * 0.83 }}><EF value={aw.date} placeholder="Thời gian" onChange={v => upA("awards", i, "date", v)} style={{ fontSize: cv.fontSize * 0.83 }} /></div><div style={{ flex: 1 }}><EF value={aw.name} placeholder="Tên giải thưởng" onChange={v => upA("awards", i, "name", v)} style={{ fontWeight: 600 }} /></div></div>))}{addBtn(cv.awards, "awards", { date: "", name: "", org: "", desc: "" })}</div>}

            {cv.showHobbies && <div style={{ marginBottom: ss }}><SecHead title="Sở thích" color={col} /><EF value={cv.hobbies} onChange={v => up("hobbies", v)} placeholder="VD: Đọc sách, du lịch, âm nhạc..." multiline style={{ fontSize: cv.fontSize * 0.92, color: "#555" }} /></div>}

            {cv.showExtra && <div style={{ marginBottom: ss }}><SecHead title="Thông tin thêm" color={col} /><EF value={cv.extraInfo} onChange={v => up("extraInfo", v)} placeholder="Thông tin bổ sung..." multiline style={{ fontSize: cv.fontSize * 0.92, color: "#555" }} /></div>}
        </div>
    );
}

function PageBreaks({ height }) {
    const count = Math.floor(height / A4_H);
    if (count < 1) return null;
    return <>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ position: "absolute", top: A4_H * (i + 1), left: 0, right: 0, borderTop: "2px dashed #ef4444", zIndex: 10, pointerEvents: "none" }}>
                <span style={{ position: "absolute", right: 10, top: -16, fontSize: 10, color: "#ef4444", background: "#fff", padding: "1px 6px", borderRadius: 4, border: "1px solid #fca5a5", whiteSpace: "nowrap" }}>
                    Trang {i + 1} ↕ {i + 2}
                </span>
            </div>
        ))}
    </>;
}

export default function Introduction() {
    const [cv, setCV] = useState(defaultCV);
    const [cvH, setCvH] = useState(A4_H);
    const [exporting, setExp] = useState(false);
    const cvRef = useRef();
    const cvPreviewRef = useRef();

    useEffect(() => {
        if (!cvRef.current) return;
        const ro = new ResizeObserver(([e]) => setCvH(e.contentRect.height));
        ro.observe(cvRef.current);
        return () => ro.disconnect();
    }, []);

    const buildCleanHTML = () => {
        const node = cvPreviewRef.current;
        if (!node) return null;
        const clone = node.cloneNode(true);
        clone.querySelectorAll("button").forEach(b => b.remove());
        clone.querySelectorAll("[contenteditable]").forEach(el => {
            el.removeAttribute("contenteditable");
            el.style.borderBottom = "none";
            el.style.outline = "none";
        });
        clone.querySelectorAll("[data-placeholder]").forEach(el => el.removeAttribute("data-placeholder"));
        return clone.outerHTML;
    };

    const handlePrint = () => {
        const cleanHTML = buildCleanHTML();
        if (!cleanHTML) return;
        const styleTexts = Array.from(document.querySelectorAll("style")).map(s => s.textContent).join("\n");
        const win = window.open("", "_blank", `width=${A4_W + 40},height=800,scrollbars=yes`);
        if (!win) { alert("Vui lòng cho phép popup để in CV."); return; }
        win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><style>* { box-sizing: border-box; margin: 0; padding: 0; } html, body { background: #fff; width: ${A4_W}px; } ${styleTexts} [contenteditable] { border-bottom: none !important; outline: none; } button { display: none !important; } @page { size: A4 portrait; margin: 0; } @media print { html, body { margin: 0; padding: 0; } }</style></head><body>${cleanHTML}</body></html>`);
        win.document.close();
        win.onload = () => { win.focus(); win.print(); win.onafterprint = () => win.close(); setTimeout(() => { try { win.close(); } catch (_) { } }, 3000); };
    };

    const exportPDF = async () => {
        if (!cvPreviewRef.current || exporting) return;
        setExp(true);
        const node = cvPreviewRef.current;
        node.classList.add("cv-exporting");
        await new Promise(r => setTimeout(r, 150));
        try {
            const wrapper = document.createElement("div");
            wrapper.style.cssText = `position:fixed;top:0;left:0;width:${A4_W}px;background:#fff;z-index:-9999;opacity:0;pointer-events:none;`;
            const clone = node.cloneNode(true);
            clone.classList.add("cv-exporting");
            clone.querySelectorAll("[contenteditable]").forEach(el => { el.removeAttribute("contenteditable"); el.style.borderBottom = "none"; });
            clone.querySelectorAll("[data-placeholder]").forEach(el => el.removeAttribute("data-placeholder"));
            clone.querySelectorAll("button").forEach(b => b.remove());
            clone.style.position = "relative"; clone.style.top = "0"; clone.style.left = "0";
            wrapper.appendChild(clone);
            document.body.appendChild(wrapper);
            await new Promise(r => setTimeout(r, 100));
            const canvas = await html2canvas(clone, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#ffffff", logging: false, width: A4_W, height: clone.scrollHeight, windowWidth: A4_W, windowHeight: clone.scrollHeight });
            document.body.removeChild(wrapper);
            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            const pdfW = pdf.internal.pageSize.getWidth();
            const pdfH = pdf.internal.pageSize.getHeight();
            const pxPerMm = canvas.width / pdfW;
            const pxPerPage = Math.floor(pdfH * pxPerMm);
            const totalPages = Math.ceil(canvas.height / pxPerPage);
            for (let p = 0; p < totalPages; p++) {
                if (p > 0) pdf.addPage();
                const srcY = p * pxPerPage;
                const srcH = Math.min(pxPerPage, canvas.height - srcY);
                const pageCanvas = document.createElement("canvas");
                pageCanvas.width = canvas.width; pageCanvas.height = srcH;
                const ctx = pageCanvas.getContext("2d");
                ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, srcH);
                ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
                pdf.addImage(pageCanvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, pdfW, srcH / pxPerMm);
            }
            pdf.save(`CV_${cv.name || "export"}.pdf`);
        } catch (err) {
            console.error(err);
            alert("Xuất PDF lỗi: " + err.message);
        } finally {
            node.classList.remove("cv-exporting");
            const w = document.querySelector("div[style*='z-index:-9999']");
            if (w) document.body.removeChild(w);
            setExp(false);
        }
    };

    const pages = Math.max(1, Math.ceil(cvH / A4_H));
    const c = cv.accentColor;

    return (
        <div className="d-flex" style={{ height: "100vh", background: "#dde1e7", overflow: "hidden" }}>

            <div className="bg-white d-flex flex-column"
                style={{ width: 272, flexShrink: 0, height: "100vh", overflowY: "auto", borderRight: "1px solid #e5e7eb" }}>
                <Toolbar cv={cv} setCV={setCV} />
            </div>

            <div className="flex-grow-1 d-flex flex-column align-items-center"
                style={{ overflowY: "auto", padding: "24px 28px" }}>

                <div className="d-flex justify-content-between align-items-center mb-3" style={{ width: A4_W }}>

                    <div className="d-flex align-items-center gap-2">
                        <span className="badge rounded-pill px-3 py-2"
                            style={{ background: "#fff", border: "1px solid #e5e7eb", color: "#888", fontSize: 11, fontWeight: 400 }}>
                            <i className="fa-solid fa-pencil me-1"></i>Nhấp để chỉnh sửa trực tiếp
                        </span>
                        <span className="badge rounded-pill px-3 py-2"
                            style={{
                                background: "#fff", fontSize: 11, fontWeight: 600,
                                border: `1px solid ${pages > 1 ? "#fca5a5" : "#bbf7d0"}`,
                                color: pages > 1 ? "#ef4444" : "#16a34a"
                            }}>
                            <i className={`fa-solid ${pages > 1 ? "fa-triangle-exclamation" : "fa-file"} me-1`}></i>
                            {pages} trang A4
                        </span>
                        <span>
                            <a
                                href="/cv-builder.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary btn-sm fw-semibold"
                            >
                                Mẫu CV khác
                            </a>
                        </span>
                    </div>

                    <div className="d-flex gap-2">
                        <button onClick={() => setCV(defaultCV)}
                            className="btn btn-sm btn-light border fw-semibold"
                            style={{ fontSize: 12 }}>
                            <i className="fa-solid fa-rotate-left me-1"></i>Reset
                        </button>
                        <button onClick={handlePrint}
                            className="btn btn-sm btn-outline-secondary fw-semibold"
                            style={{ fontSize: 12 }}>
                            <i className="fa-solid fa-print me-1"></i>In CV
                        </button>
                        <button onClick={exportPDF} disabled={exporting}
                            className="btn btn-sm fw-semibold px-3"
                            style={{
                                fontSize: 12, minWidth: 120,
                                background: exporting ? "#9ca3af" : c,
                                color: "#fff", border: "none",
                                boxShadow: exporting ? "none" : `0 3px 14px ${c}55`,
                                transition: "all 0.2s",
                                cursor: exporting ? "not-allowed" : "pointer",
                            }}>
                            {exporting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" style={{ width: 12, height: 12, borderWidth: 2 }}></span>
                                    Đang xuất…
                                </>
                            ) : (
                                <><i className="fa-solid fa-file-arrow-down me-1"></i>Tải PDF</>
                            )}
                        </button>
                    </div>
                </div>

                <style>{`
                    .ef-field:empty::before { content: attr(data-placeholder); color: #bbb; pointer-events: none; }
                    .cv-exporting .ef-field { border-bottom: none !important; }
                    .cv-exporting .ef-field::before { display: none !important; }
                    .cv-exporting button { display: none !important; }
                `}</style>

                <div style={{ position: "relative", width: A4_W, boxShadow: "0 6px 36px rgba(0,0,0,0.18)" }}>
                    <PageBreaks height={cvH} />
                    <div id="cv-only">
                        <CVPreview cv={cv} setCV={setCV} cvRef={cvPreviewRef} cvHRef={cvRef} />
                    </div>
                </div>
                <div style={{ height: 48 }} />
            </div>
        </div>
    );
}
