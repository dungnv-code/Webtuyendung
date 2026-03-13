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

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [loadInput, setLoadInput] = useState(false)

    // FILTER LIST OPTIONS
    const [jobs, setJobs] = useState([]);
    const [typesjobs, setTypesjobs] = useState([]);
    const [exp, setExp] = useState([]);
    const [salaryrange, setSalaryrange] = useState([]);
    const [cities, setCities] = useState([]);
    const [levels, setLevels] = useState([]);

    const [inputValue, setInputValue] = useState("")
    // FILTER SELECTED VALUES
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
                    page: currentPage,
                    limit,
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
        filterLevel,
        loadInput,
    ]);


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
        <div className="container mt-4" >

            <div className="row g-4">


                <div className="col-lg-3">

                    <div className="card shadow-sm">
                        <div className="card-body">

                            <h5 className="fw-bold text-success mb-3">
                                <i className="fa-solid fa-filter me-2"></i>
                                Lọc công việc
                            </h5>

                            <div className="mb-3">
                                <label className="form-label fw-semibold text-success">Ngành nghề</label>
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

                            <div className="mb-3">
                                <label className="form-label fw-semibold text-success">Hình thức làm việc</label>
                                {typesjobs.map(item => (
                                    <div className="form-check" key={item._id}>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={filterTypes.includes(item.workType)}
                                            onChange={() => handleTypeChange(item.workType)}
                                        />
                                        <label className="form-check-label">
                                            {item.workType}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold text-success">Vị trí</label>
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

                            <div className="mb-3">
                                <label className="form-label fw-semibold text-success">Kinh nghiệm</label>
                                {exp.map(item => (
                                    <div className="form-check" key={item._id}>
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

                            <div className="mb-3">
                                <label className="form-label fw-semibold text-success">Mức lương</label>
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

                            <div className="mb-2">
                                <label className="form-label fw-semibol text-success">Cấp bậc</label>
                                <div className="row">
                                    {levels.map(item => (
                                        <div className="col-6" key={item._id}>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={filterLevel.includes(item.nameLevel)}
                                                    onChange={() => handleLevelChange(item.nameLevel)}
                                                />
                                                <label className="form-check-label">
                                                    {item.nameLevel}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>


                <div className="col-lg-9">

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <h6 className="fw-bold text-success mb-0">
                            {data.length} công việc được tìm thấy
                        </h6>

                        <div className="input-group input-group-sm w-50">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm kiếm công việc..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />

                            <button
                                className="btn btn-success"
                                onClick={() => setLoadInput(!loadInput)}
                            >
                                Tìm
                            </button>
                        </div>

                    </div>

                    {data.map(job => (
                        <div className="card mb-3 shadow-sm border-0" key={job._id}>
                            <div className="card-body">

                                <div className="row align-items-center g-3">

                                    <div className="col-md-2 col-4">
                                        <img
                                            src={job.imageCover}
                                            alt=""
                                            className="img-fluid rounded border"
                                        />
                                    </div>

                                    <div className="col-md-7 col-8">

                                        <Link
                                            to={`${path.JOB}/${job._id}`}
                                            className="text-decoration-none"
                                        >
                                            <h6 className="fw-bold text-black">
                                                {job.title}
                                            </h6>
                                        </Link>

                                        <div className="row text-secondary small">

                                            <div className="col-md-4">
                                                <i className="fa-solid fa-building me-1"></i>
                                                {job.joblevel}
                                            </div>

                                            <div className="col-md-4">
                                                <i className="fa-solid fa-location-dot me-1"></i>
                                                {job.location}
                                            </div>

                                            <div className="col-md-4 fw-semibold ">
                                                <i className="fa-solid fa-dollar-sign me-1"></i>
                                                {job.salaryRange_salaryRange}
                                            </div>

                                        </div>
                                    </div>

                                    <div className="col-md-3 text-md-end">

                                        <span className="badge bg-success-subtle text-black mb-2 w-100">
                                            {job.workType}
                                        </span>

                                        <p className="text-danger fw-semibold mb-0 small">
                                            <i className="fa-solid fa-clock me-1"></i>
                                            {getDaysRemaining(job.deadline)}
                                        </p>

                                    </div>

                                </div>

                            </div>
                        </div>
                    ))}

                    <div className="d-flex justify-content-center mt-4">
                        <PaginationCustom
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            limit={limit}
                            totalPages={totalPages}
                        />
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Job;