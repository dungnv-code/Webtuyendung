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
import { Link } from "react-router-dom"
import path from "../../../ultils/path"
const Job = () => {

    // DATA
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(3);
    const [totalPages, setTotalPages] = useState(0);

    // FILTER LIST OPTIONS
    const [jobs, setJobs] = useState([]);
    const [typesjobs, setTypesjobs] = useState([]);
    const [exp, setExp] = useState([]);
    const [salaryrange, setSalaryrange] = useState([]);
    const [cities, setCities] = useState([]);
    const [levels, setLevels] = useState([]);

    // FILTER SELECTED VALUES
    const [filterJob, setFilterJob] = useState("");
    const [filterTypes, setFilterTypes] = useState([]);
    const [filterCitys, setFilterCitys] = useState("");       // ✔ FIX: MUST BE STRING
    const [filterExp, setFilterExp] = useState([]);
    const [filterSalary, setFilterSalary] = useState("");
    const [filterLevel, setFilterLevel] = useState([]);

    // 🔥 Load bài đăng theo filter
    useEffect(() => {
        const fetchPostjobs = async () => {
            try {
                const response = await getAllPostjobs({
                    page: currentPage,
                    limit,
                    flatten: true,
                    populate: "salaryRange:salaryRange,min,max",
                    sort: "-postPackage -view",
                    status: "active",
                    "deadline[gte]": new Date().toISOString(),
                    statusPause: false,

                    // FILTERS
                    jobs: filterJob || undefined,
                    workType: filterTypes.length > 0 ? filterTypes : undefined,
                    location: filterCitys || undefined,
                    experience: filterExp.length > 0 ? filterExp : undefined,
                    salaryRange: filterSalary || undefined,
                    joblevel: filterLevel.length > 0 ? filterLevel[0] : undefined
                });

                setData(response.data || []);
                setTotalPages(response.totalPages || 0);
            } catch (err) {
                console.log(err);
            }
        };

        fetchPostjobs();
    }, [
        currentPage,
        limit,
        filterJob,
        filterTypes,
        filterCitys,
        filterExp,
        filterSalary,
        filterLevel
    ]);

    // 🔥 Load tỉnh thành
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
                const json = await res.json();
                setCities(json.data);
            } catch (error) {
                console.error("Lỗi tải tỉnh thành:", error);
            }
        };
        fetchCities();
    }, []);

    // 🔥 Load toàn bộ filters
    useEffect(() => {
        const fetchAllFilters = async () => {
            try {
                const [jobRes, styleRes, expRes, salaryRes, LevelRes] = await Promise.all([
                    getAllJob(),
                    getAllStyleJob(),
                    getAllExp(),
                    getAllSalaryrange(),
                    getAllLevel()
                ]);

                setJobs(jobRes.data || []);
                setTypesjobs(styleRes.data || []);
                setExp(expRes.data || []);
                setSalaryrange(salaryRes.data || []);
                setLevels(LevelRes.data || []);
            } catch (err) {
                console.log("Lỗi load filter:", err);
            }
        };

        fetchAllFilters();
    }, []);

    // HANDLES
    const handleTypeChange = (type) => {
        setFilterTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
        setCurrentPage(1);
    };

    const handleExpChange = (expName) => {
        setFilterExp(prev =>
            prev.includes(expName)
                ? prev.filter(e => e !== expName)
                : [...prev, expName]
        );
        setCurrentPage(1);
    };

    const handleLevelChange = (lv) => {
        setFilterLevel(prev =>
            prev.includes(lv)
                ? prev.filter(l => l !== lv)
                : [...prev, lv]
        );
        setCurrentPage(1);
    };

    const getDaysRemaining = (deadline) => {
        const end = new Date(deadline).getTime();
        const now = Date.now();
        const distance = end - now;

        if (distance <= 0) return "Đã hết hạn";
        const days = Math.ceil(distance / (1000 * 60 * 60 * 24));
        return `Còn ${days} ngày`;
    };



    return (
        <div className="row gap-2" style={{ margin: "0 60px" }}>

            <div className="col-3">

                <h6 className="fw-bold mb-3">
                    <i className="fa-solid fa-filter me-1"></i> Lọc công việc
                </h6>

                {/* Ngành nghề */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Ngành nghề</label>
                    <select
                        className="form-select"
                        value={filterJob}
                        onChange={(e) => {
                            setFilterJob(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">Tất cả ngành nghề</option>
                        {jobs.map(item => (
                            <option key={item._id} value={item.title}>
                                {item.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Hình thức làm việc */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Hình thức làm việc</label>
                    {typesjobs.map(item => (
                        <div className="form-check mb-1" key={item._id}>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={filterTypes.includes(item.workType)}
                                onChange={() => handleTypeChange(item.workType)}
                            />
                            <label className="form-check-label">{item.workType}</label>
                        </div>
                    ))}
                </div>

                {/* Vị trí */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Vị trí</label>
                    <select
                        className="form-select"
                        value={filterCitys}
                        onChange={(e) => {
                            setFilterCitys(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">Tất cả vị trí</option>
                        {cities.map(item => (
                            <option key={item.code} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Kinh nghiệm */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Kinh nghiệm</label>
                    {exp.map(item => (
                        <div className="form-check mb-1" key={item._id}>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={filterExp.includes(item.experience)}
                                onChange={() => handleExpChange(item.experience)}
                            />
                            <label className="form-check-label">
                                {item.experience}
                            </label>
                        </div>
                    ))}
                </div>

                {/* Mức lương */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Mức lương</label>
                    <select
                        className="form-select"
                        value={filterSalary}
                        onChange={(e) => {
                            setFilterSalary(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">Tất cả mức lương</option>
                        {salaryrange.map(item => (
                            <option key={item._id} value={item._id}>
                                {item.salaryRange}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Cấp bậc */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Cấp bậc</label>
                    <div className="row">
                        {levels.map(item => (
                            <div className="col-6" key={item._id}>
                                <div className="form-check mb-1">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={filterLevel.includes(item.nameLevel)}
                                        onChange={() => handleLevelChange(item.nameLevel)}
                                    />
                                    <label className="form-check-label">{item.nameLevel}</label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="col-8">
                <div>{data.length} công việc được tìm thấy</div>
                {data.map(job => (
                    <div className="card mb-3" key={job._id}>
                        <div className="card-body">
                            <div className="row g-3 align-items-center">
                                <div className="col-md-2 col-4">
                                    <img
                                        src={job.imageCover}
                                        alt=""
                                        className="img-fluid rounded"
                                    />
                                </div>
                                <div className="col-md-7 col-8">
                                    <Link to={`${path.JOB}/${job._id}`}><p className="mb-2">{job.title}</p></Link>
                                    <div className="row text-secondary">
                                        <div className="col-4">
                                            <i className="fa-solid fa-building me-1"></i>
                                            {job.joblevel}
                                        </div>

                                        <div className="col-4">
                                            <i className="fa-solid fa-location-arrow me-1"></i>
                                            {job.location}
                                        </div>

                                        <div className="col-4 fw-semibold">
                                            <i className="fa-solid fa-dollar-sign me-1"></i>
                                            {job.salaryRange_salaryRange}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3 text-md-end">
                                    <span className="badge bg-info text-dark mb-2 w-100">
                                        {job.workType}
                                    </span>

                                    <p className="text-danger fw-semibold mb-0">
                                        <i className="fa-solid fa-clock me-1"></i>
                                        {getDaysRemaining(job.deadline)}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}

                <div className="d-flex justify-content-center mt-3">
                    <PaginationCustom
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        limit={limit}
                        totalPages={totalPages}
                    />
                </div>
            </div>

        </div>
    );
};

export default Job;