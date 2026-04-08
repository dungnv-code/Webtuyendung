import { useEffect, useState } from "react";
import {
    getAllPostjobs,
    getAllJob,
    getAllStyleJob,
    getAllExp,
    getAllSalaryrange,
    getAllLevel
} from "../../../api/job";
import PaginationCustom from "../../../component/pagination/pagination";
import { Link } from "react-router-dom";
import path from "../../../ultils/path";

const Job = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(13);
    const [totalPages, setTotalPages] = useState(0);
    const [loadInput, setLoadInput] = useState(false);

    const [jobs, setJobs] = useState([]);
    const [typesjobs, setTypesjobs] = useState([]);
    const [exp, setExp] = useState([]);
    const [salaryrange, setSalaryrange] = useState([]);
    const [cities, setCities] = useState([]);
    const [levels, setLevels] = useState([]);

    const [inputValue, setInputValue] = useState("");
    const [filterJob, setFilterJob] = useState("");
    const [filterTypes, setFilterTypes] = useState([]);
    const [filterCitys, setFilterCitys] = useState("");
    const [filterExp, setFilterExp] = useState([]);
    const [filterSalary, setFilterSalary] = useState("");
    const [filterLevel, setFilterLevel] = useState([]);

    useEffect(() => {
        const fetchPostjobs = async () => {
            try {
                const response = await getAllPostjobs({
                    page: currentPage, limit,
                    flatten: true,
                    populate: "salaryRange:salaryRange,min,max",
                    sort: "-postPackage -numberUpload -view",
                    status: "active",
                    "deadline[gte]": new Date().toISOString(),
                    statusPause: false,
                    title: inputValue || undefined,
                    jobs: filterJob || undefined,
                    workType: filterTypes.length > 0 ? filterTypes : undefined,
                    location: filterCitys || undefined,
                    experience: filterExp.length > 0 ? filterExp : undefined,
                    salaryRange: filterSalary || undefined,
                    joblevel: filterLevel.length > 0 ? filterLevel[0] : undefined,
                });
                setData(response.data || []);
                setTotalPages(response.totalPages || 0);
            } catch (err) { console.log(err); }
        };
        fetchPostjobs();
    }, [currentPage, limit, filterJob, filterTypes, filterCitys, filterExp, filterSalary, filterLevel, loadInput]);

    useEffect(() => {
        fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
            .then(r => r.json())
            .then(json => setCities(json.data || []))
            .catch(console.error);
    }, []);

    useEffect(() => {
        const fetchAllFilters = async () => {
            try {
                const [jobRes, styleRes, expRes, salaryRes, LevelRes] = await Promise.all([
                    getAllJob(), getAllStyleJob(), getAllExp(), getAllSalaryrange(), getAllLevel()
                ]);
                setJobs(jobRes.data || []);
                setTypesjobs(styleRes.data || []);
                setExp(expRes.data || []);
                setSalaryrange(salaryRes.data || []);
                setLevels(LevelRes.data || []);
            } catch (err) { console.log(err); }
        };
        fetchAllFilters();
    }, []);

    const handleTypeChange = (type) => {
        setFilterTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
        setCurrentPage(1);
    };
    const handleExpChange = (expName) => {
        setFilterExp(prev => prev.includes(expName) ? prev.filter(e => e !== expName) : [...prev, expName]);
        setCurrentPage(1);
    };
    const handleLevelChange = (lv) => {
        setFilterLevel(prev => prev.includes(lv) ? prev.filter(l => l !== lv) : [...prev, lv]);
        setCurrentPage(1);
    };

    const getDaysRemaining = (deadline) => {
        const distance = new Date(deadline).getTime() - Date.now();
        if (distance <= 0) return "Đã hết hạn";
        return `Còn ${Math.ceil(distance / 86400000)} ngày`;
    };

    const activeFilterCount = [
        filterJob, filterCitys, filterSalary,
        ...filterTypes, ...filterExp, ...filterLevel
    ].filter(Boolean).length;

    const clearAll = () => {
        setFilterJob(""); setFilterTypes([]); setFilterCitys("");
        setFilterExp([]); setFilterSalary(""); setFilterLevel([]);
        setCurrentPage(1);
    };

    return (
        <div style={{ background: "#f8fffe", minHeight: "100vh" }}>

            <div style={{ background: "#1b5e20", paddingTop: "2rem", paddingBottom: "2rem", borderRadius: "10px" }}>
                <div className="container">
                    <h4 className="fw-bold text-white mb-1">
                        <i className="fa-solid fa-briefcase me-2" style={{ color: "#69f0ae" }}></i>
                        Tìm kiếm việc làm
                    </h4>
                    <p className="mb-0" style={{ color: "#a5d6a7", fontSize: "0.9rem" }}>
                        Hàng nghìn cơ hội đang chờ bạn khám phá
                    </p>
                </div>
            </div>

            <div className="container py-4">
                <div className="row g-4">

                    <div className="col-lg-3">
                        <div className="card border-0 shadow-sm rounded-3 sticky-top" style={{ top: "80px" }}>

                            <div className="card-header border-0 rounded-top-3 d-flex align-items-center justify-content-between py-3 px-4"
                                style={{ background: "#1b5e20" }}>
                                <span className="fw-bold text-white">
                                    <i className="fa-solid fa-sliders me-2"></i>
                                    Bộ lọc
                                </span>
                                {activeFilterCount > 0 && (
                                    <button onClick={clearAll}
                                        className="btn btn-sm rounded-pill px-3 fw-semibold"
                                        style={{ background: "#69f0ae", color: "#1b5e20", fontSize: "0.75rem" }}>
                                        Xoá ({activeFilterCount})
                                    </button>
                                )}
                            </div>

                            <div className="card-body px-4 py-3">

                                <div className="mb-4">
                                    <label className="form-label fw-semibold mb-2"
                                        style={{ color: "#2e7d32", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        <i className="fa-solid fa-layer-group me-1"></i> Ngành nghề
                                    </label>
                                    <select className="form-select form-select-sm rounded-2"
                                        style={{ borderColor: "#c8e6c9", fontSize: "0.88rem" }}
                                        value={filterJob}
                                        onChange={e => { setFilterJob(e.target.value); setCurrentPage(1); }}>
                                        <option value="">Tất cả ngành nghề</option>
                                        {jobs.map(item => (
                                            <option key={item._id} value={item.title}>{item.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold mb-2"
                                        style={{ color: "#2e7d32", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        <i className="fa-solid fa-clock me-1"></i> Hình thức làm việc
                                    </label>
                                    <div className="d-flex flex-column gap-2">
                                        {typesjobs.map(item => (
                                            <div key={item._id}
                                                className="form-check rounded-2 px-3 py-2 mb-0"
                                                style={{
                                                    background: filterTypes.includes(item.workType) ? "#e8f5e9" : "transparent",
                                                    border: `1px solid ${filterTypes.includes(item.workType) ? "#a5d6a7" : "#eee"}`,
                                                    cursor: "pointer", transition: "all 0.15s"
                                                }}
                                                onClick={() => handleTypeChange(item.workType)}>
                                                <input type="checkbox" className="form-check-input"
                                                    style={{ accentColor: "#2e7d32" }}
                                                    checked={filterTypes.includes(item.workType)}
                                                    onChange={() => { }}
                                                />
                                                <label className="form-check-label ms-1"
                                                    style={{
                                                        fontSize: "0.87rem", cursor: "pointer",
                                                        color: filterTypes.includes(item.workType) ? "#1b5e20" : "#333",
                                                        fontWeight: filterTypes.includes(item.workType) ? "600" : "400"
                                                    }}>
                                                    {item.workType}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold mb-2"
                                        style={{ color: "#2e7d32", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        <i className="fa-solid fa-location-dot me-1"></i> Tỉnh / Thành phố
                                    </label>
                                    <select className="form-select form-select-sm rounded-2"
                                        style={{ borderColor: "#c8e6c9", fontSize: "0.88rem" }}
                                        value={filterCitys}
                                        onChange={e => { setFilterCitys(e.target.value); setCurrentPage(1); }}>
                                        <option value="">Tất cả vị trí</option>
                                        {cities.map(item => (
                                            <option key={item.id} value={item.name}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold mb-2"
                                        style={{ color: "#2e7d32", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        <i className="fa-solid fa-star me-1"></i> Kinh nghiệm
                                    </label>
                                    <div className="d-flex flex-column gap-2">
                                        {exp.map(item => (
                                            <div key={item._id}
                                                className="form-check rounded-2 px-3 py-2 mb-0"
                                                style={{
                                                    background: filterExp.includes(item.experience) ? "#e8f5e9" : "transparent",
                                                    border: `1px solid ${filterExp.includes(item.experience) ? "#a5d6a7" : "#eee"}`,
                                                    cursor: "pointer", transition: "all 0.15s"
                                                }}
                                                onClick={() => handleExpChange(item.experience)}>
                                                <input type="checkbox" className="form-check-input"
                                                    style={{ accentColor: "#2e7d32" }}
                                                    checked={filterExp.includes(item.experience)}
                                                    onChange={() => { }}
                                                />
                                                <label className="form-check-label ms-1"
                                                    style={{
                                                        fontSize: "0.87rem", cursor: "pointer",
                                                        color: filterExp.includes(item.experience) ? "#1b5e20" : "#333",
                                                        fontWeight: filterExp.includes(item.experience) ? "600" : "400"
                                                    }}>
                                                    {item.experience}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold mb-2"
                                        style={{ color: "#2e7d32", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        <i className="fa-solid fa-money-bill-wave me-1"></i> Mức lương
                                    </label>
                                    <select className="form-select form-select-sm rounded-2"
                                        style={{ borderColor: "#c8e6c9", fontSize: "0.88rem" }}
                                        value={filterSalary}
                                        onChange={e => { setFilterSalary(e.target.value); setCurrentPage(1); }}>
                                        <option value="">Tất cả mức lương</option>
                                        {salaryrange.map(item => (
                                            <option key={item._id} value={item._id}>{item.salaryRange}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-1">
                                    <label className="form-label fw-semibold mb-2"
                                        style={{ color: "#2e7d32", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        <i className="fa-solid fa-chart-bar me-1"></i> Cấp bậc
                                    </label>
                                    <div className="row g-2">
                                        {levels.map(item => (
                                            <div key={item._id} className="col-6">
                                                <div
                                                    className="text-center rounded-2 py-2 px-1"
                                                    style={{
                                                        background: filterLevel.includes(item.nameLevel) ? "#1b5e20" : "#f5f5f5",
                                                        color: filterLevel.includes(item.nameLevel) ? "#fff" : "#555",
                                                        fontSize: "0.78rem", fontWeight: "500",
                                                        cursor: "pointer", transition: "all 0.15s",
                                                        border: `1px solid ${filterLevel.includes(item.nameLevel) ? "#1b5e20" : "#e0e0e0"}`,
                                                    }}
                                                    onClick={() => handleLevelChange(item.nameLevel)}
                                                >
                                                    {item.nameLevel}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9">

                        <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-body px-4 py-3">
                                <div className="row align-items-center g-3">
                                    <div className="col-md-7">
                                        <div className="input-group">
                                            <span className="input-group-text border-end-0 bg-white"
                                                style={{ borderColor: "#c8e6c9" }}>
                                                <i className="fa-solid fa-magnifying-glass" style={{ color: "#4caf50" }}></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control border-start-0 ps-0"
                                                placeholder="Tìm kiếm tên công việc..."
                                                style={{ borderColor: "#c8e6c9", fontSize: "0.9rem" }}
                                                value={inputValue}
                                                onChange={e => setInputValue(e.target.value)}
                                                onKeyDown={e => e.key === "Enter" && setLoadInput(p => !p)}
                                            />
                                            <button
                                                className="btn btn-success px-4 fw-semibold rounded-end-2"
                                                onClick={() => setLoadInput(p => !p)}>
                                                Tìm
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-md-5 text-md-end">
                                        <span className="fw-semibold" style={{ color: "#2e7d32", fontSize: "0.9rem" }}>
                                            <i className="fa-solid fa-list me-1"></i>
                                            Tìm thấy <span className="fs-6">{data.length}</span> công việc
                                        </span>
                                    </div>
                                </div>

                                {activeFilterCount > 0 && (
                                    <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
                                        {filterJob && (
                                            <span className="badge rounded-pill px-3 py-2"
                                                style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: "0.78rem" }}>
                                                {filterJob}
                                                <button className="btn-close ms-2" style={{ fontSize: "0.6rem" }}
                                                    onClick={() => setFilterJob("")} />
                                            </span>
                                        )}
                                        {filterCitys && (
                                            <span className="badge rounded-pill px-3 py-2"
                                                style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: "0.78rem" }}>
                                                <i className="fa-solid fa-location-dot me-1"></i>{filterCitys}
                                                <button className="btn-close ms-2" style={{ fontSize: "0.6rem" }}
                                                    onClick={() => setFilterCitys("")} />
                                            </span>
                                        )}
                                        {filterTypes.map(t => (
                                            <span key={t} className="badge rounded-pill px-3 py-2"
                                                style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: "0.78rem" }}>
                                                {t}
                                                <button className="btn-close ms-2" style={{ fontSize: "0.6rem" }}
                                                    onClick={() => handleTypeChange(t)} />
                                            </span>
                                        ))}
                                        {filterExp.map(e => (
                                            <span key={e} className="badge rounded-pill px-3 py-2"
                                                style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: "0.78rem" }}>
                                                {e}
                                                <button className="btn-close ms-2" style={{ fontSize: "0.6rem" }}
                                                    onClick={() => handleExpChange(e)} />
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {data.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fa-solid fa-magnifying-glass fs-1 mb-3 d-block" style={{ color: "#c8e6c9" }}></i>
                                <h6 className="text-muted">Không tìm thấy công việc phù hợp</h6>
                                <p className="text-muted small">Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm</p>
                                <button className="btn btn-outline-success rounded-pill px-4" onClick={clearAll}>
                                    Xoá bộ lọc
                                </button>
                            </div>
                        ) : (
                            data.map(job => (
                                <div key={job._id}
                                    className="card border-0 shadow-sm rounded-3 mb-3"
                                    style={{ transition: "box-shadow 0.2s, transform 0.2s" }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.boxShadow = "0 6px 24px rgba(76,175,80,0.15)";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.boxShadow = "";
                                        e.currentTarget.style.transform = "";
                                    }}>
                                    <div className="card-body px-4 py-3">
                                        <div className="row align-items-center g-3">

                                            <div className="col-auto">
                                                <div className="rounded-3 border overflow-hidden"
                                                    style={{ width: "68px", height: "68px" }}>
                                                    <img src={job.imageCover} alt={job.title}
                                                        className="w-100 h-100" style={{ objectFit: "cover" }} />
                                                </div>
                                            </div>

                                            <div className="col">
                                                <Link to={`${path.JOB}/${job._id}`} className="text-decoration-none">
                                                    <h6 className="fw-bold mb-1 lh-sm"
                                                        style={{ color: "#1b5e20", fontSize: "0.95rem" }}>
                                                        {job.title}
                                                    </h6>
                                                </Link>
                                                <div className="d-flex flex-wrap gap-3 mt-1">
                                                    <span className="text-muted small">
                                                        <i className="fa-solid fa-building me-1" style={{ color: "#4caf50" }}></i>
                                                        {job.joblevel}
                                                    </span>
                                                    <span className="text-muted small">
                                                        <i className="fa-solid fa-location-dot me-1" style={{ color: "#4caf50" }}></i>
                                                        {job.location}
                                                    </span>
                                                    <span className="fw-semibold small" style={{ color: "#2e7d32" }}>
                                                        <i className="fa-solid fa-money-bill-wave me-1"></i>
                                                        {job.salaryRange_salaryRange}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="col-auto text-end d-flex flex-column align-items-end gap-2">
                                                <span className="badge rounded-pill px-3 py-2"
                                                    style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                                                    {job.workType}
                                                </span>
                                                <span className="text-danger fw-semibold small">
                                                    <i className="fa-regular fa-clock me-1"></i>
                                                    {getDaysRemaining(job.deadline)}
                                                </span>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))
                        )}


                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center mt-4">
                                <PaginationCustom
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    limit={limit}
                                    totalPages={totalPages}
                                />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Job;
