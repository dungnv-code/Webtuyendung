
import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getAllSalaryrange, createSalaryrange, updateSalaryrange, deleteSalaryrange } from "../../../api/job"
import { DeleteTwoTone, EditTwoTone, EditOutlined, PlusOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";

const ManagerSalaryRange = () => {
    const styles = {
        container: {
            width: "100%",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        error: {
            color: "#ffb3b3",
            fontSize: "13px",
            marginTop: "8px",
            textAlign: "left",
        },
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(3);
    const [totalPages, setTotalPages] = useState(0);
    const [listJob, setListJob] = useState([]);

    const [inputValue, setInputValue] = useState({
        salaryRange: "",
        min: "",
        max: ""
    });
    const [inputSearch, setinputSearch] = useState("");
    const [error, setError] = useState({});
    const [loaddata, setLoaddata] = useState(false)
    const [currentIndex, setCurrentIndex] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllSalaryrange({ page: currentPage, limit });
                setListJob(response.data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);


    const hanleCreateJob = async () => {
        const newError = {};

        if (!inputValue.salaryRange.trim()) {
            newError.salaryRange = "Vui lòng nhập tên khoảng lương!";
        }
        if (!inputValue.min.trim()) {
            newError.min = "Vui lòng nhập giá trị min!";
        }

        setError(newError);
        if (Object.keys(newError).length === 0) {
            try {
                await createSalaryrange(inputValue);
                setInputValue({ salaryRange: "", min: "", max: "" });
                setCurrentPage(1);
                toast.success("Thêm khoảng lương thành công!")
                setLoaddata(!loaddata)
            } catch (error) {
                // toast.error("Lỗi khi tạo công việc");
            }
        }
    };

    const hanleUpdateJob = async () => {
        const newError = {};
        if (!inputValue.salaryRange.trim()) {
            newError.salaryRange = "Vui lòng nhập tên khoảng lương!";
        }
        if (inputValue.min == null || inputValue.min === "") {
            newError.min = "Vui lòng nhập giá trị min!";
        }
        setError(newError);
        if (Object.keys(newError).length === 0) {
            try {
                await updateSalaryrange(currentIndex, inputValue);
                setInputValue({ salaryRange: "", min: "", max: "" });
                setCurrentPage(1);
                toast.success("Sửa khoảng lương thành công!")
                setLoaddata(!loaddata)
            } catch (error) {
                // toast.error("Lỗi khi sửa công việc");
            }
        }
    }

    const hanleDeleteJob = async (id) => {
        try {
            await deleteSalaryrange(id);
            setInputValue({ salaryRange: "", min: "", max: "" });
            setCurrentPage(1);
            toast.success("Xoá khoảng lương thành công!")
            setLoaddata(!loaddata)
        } catch (error) {
            // toast.error("Lỗi khi sửa công việc");
        }
    }

    const hanleSearch = async () => {
        try {
            const response = await getAllSalaryrange({ page: currentPage, limit, salaryRange: inputSearch });
            setinputSearch("")
            setListJob(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            // console.error("Error fetching jobs:", error);
        }
    }

    const hanleReset = async () => {
        const fetchData = async () => {
            try {
                const response = await getAllSalaryrange({ page: currentPage, limit });
                setListJob(response.data);
                setTotalPages(response.totalPages);
                setLoaddata(!loaddata)
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchData();
        setInputValue({ salaryRange: "", min: "", max: "" });
    }

    return (
        <div style={styles.container}
        >
            <h1 style={{ marginTop: "10px", marginBottom: "20px", fontSize: "28px" }}>
                Quản lí khoảng lương
            </h1>

            <div
                style={{
                    width: "80%",
                    maxWidth: "800px",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "16px",
                    padding: "30px",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                }}
            >
                <form style={{ width: "100%" }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "20px",
                            width: "100%",
                        }}
                    >
                        {/* WRAP INPUT + ERROR */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                style={{
                                    padding: "12px 16px",
                                    width: "100%",
                                    borderRadius: "10px",
                                    border: "1px solid rgba(255,255,255,0.25)",
                                    background: "rgba(255,255,255,0.15)",
                                    backdropFilter: "blur(6px)",
                                    color: "black",
                                    fontSize: "1rem",
                                    outline: "none",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    transition: "0.25s ease",
                                }}
                                value={inputSearch}
                                onChange={(e) => setinputSearch(e.target.value)}
                                onFocus={(e) => (e.target.style.border = "1px solid #38bdf8")}
                                onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.25)")}
                            />

                        </div>

                        {/* BUTTON */}
                        <button
                            type="button"
                            style={{
                                padding: "12px 26px",
                                borderRadius: "10px",
                                border: "none",
                                fontSize: "1rem",
                                background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
                                color: "#fff",
                                cursor: "pointer",
                                fontWeight: "600",
                                boxShadow: "0 4px 14px rgba(59,130,246,0.4)",
                                transition: "0.25s ease",
                                whiteSpace: "nowrap",
                            }}
                            onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
                            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
                            onClick={hanleSearch}
                        >
                            <SearchOutlined /> Tìm kiếm
                        </button>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        {/* LABEL + INPUT NAME SKILL */}
                        <label
                            style={{
                                display: "block",
                                fontWeight: "600",
                                marginBottom: "6px",
                                color: "#0ea5e9",
                            }}
                        >
                            Tên khoảng lương
                        </label>

                        <input
                            type="text"
                            placeholder="Nhập tên khoảng lương..."
                            style={{
                                padding: "12px 16px",
                                width: "100%",
                                borderRadius: "10px",
                                border: "1px solid rgba(255,255,255,0.25)",
                                background: "rgba(255,255,255,0.15)",
                                backdropFilter: "blur(6px)",
                                color: "black",
                                fontSize: "1rem",
                                outline: "none",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                transition: "0.25s ease",
                            }}
                            value={inputValue.salaryRange}
                            onChange={(e) =>
                                setInputValue({
                                    ...inputValue,
                                    salaryRange: e.target.value,
                                })
                            }
                            onFocus={(e) => (e.target.style.border = "1px solid #38bdf8")}
                            onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.25)")}
                        />

                        {error?.salaryRange && (
                            <p style={{ color: "red", fontSize: "12px", marginTop: "6px" }}>
                                {error.salaryRange}
                            </p>
                        )}

                        {/* LABEL SELECT JOB */}
                        <label
                            style={{
                                display: "block",
                                fontWeight: "600",
                                marginTop: "15px",
                                marginBottom: "6px",
                                color: "#0ea5e9",
                            }}
                        >
                            Khoảng giá trị
                        </label>

                        <div className="row">
                            {/* Ô Mã */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Giá trị min</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Min..."
                                    style={{
                                        padding: "12px",
                                        borderRadius: "10px",
                                        border: "1px solid rgba(255,255,255,0.3)",
                                        background: "rgba(255,255,255,0.3)",
                                        color: "black",
                                        fontWeight: "500",
                                        transition: "0.25s ease",
                                    }}
                                    value={inputValue.min}
                                    onChange={(e) =>
                                        setInputValue({
                                            ...inputValue,
                                            min: e.target.value,
                                        })
                                    }
                                    onFocus={(e) => {
                                        e.target.style.outline = "2px solid #38bdf8";
                                        e.target.style.boxShadow = "0 0 8px #38bdf8";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.outline = "none";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                                {error?.min && (
                                    <p style={{ color: "red", fontSize: "12px", marginTop: "6px" }}>
                                        {error.min}
                                    </p>
                                )}
                            </div>

                            {/* Ô Nhóm Select */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Giá trị max</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Max..."
                                    style={{
                                        padding: "12px",
                                        borderRadius: "10px",
                                        border: "1px solid rgba(255,255,255,0.3)",
                                        background: "rgba(255,255,255,0.3)",
                                        color: "black",
                                        fontWeight: "500",
                                        transition: "0.25s ease",
                                    }}
                                    value={inputValue.max}
                                    onChange={(e) =>
                                        setInputValue({
                                            ...inputValue,
                                            max: e.target.value,
                                        })
                                    }
                                    onFocus={(e) => {
                                        e.target.style.outline = "2px solid #38bdf8";
                                        e.target.style.boxShadow = "0 0 8px #38bdf8";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.outline = "none";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                            </div>
                        </div>

                    </div>
                    {/* BUTTON HÀNG DƯỚI */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "12px",
                            flexWrap: "wrap",
                        }}
                    >
                        <button
                            type="button"
                            style={{
                                padding: "12px 26px",
                                borderRadius: "10px",
                                border: "none",
                                fontSize: "1rem",
                                background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
                                color: "#fff",
                                cursor: "pointer",
                                fontWeight: "600",
                                boxShadow: "0 4px 14px rgba(59,130,246,0.4)",
                                transition: "0.25s ease",
                            }}
                            onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
                            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
                            onClick={hanleCreateJob}
                        >
                            <PlusOutlined />
                            Thêm
                        </button>
                        <button
                            type="button"
                            style={{
                                padding: "12px 26px",
                                borderRadius: "10px",
                                border: "none",
                                fontSize: "1rem",
                                background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
                                color: "#fff",
                                cursor: "pointer",
                                fontWeight: "600",
                                boxShadow: "0 4px 14px rgba(59,130,246,0.4)",
                                transition: "0.25s ease",
                            }}
                            onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
                            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
                            onClick={hanleUpdateJob}
                        >
                            <EditOutlined />
                            Sửa
                        </button>

                        <button
                            type="button"
                            style={{
                                padding: "12px 26px",
                                borderRadius: "10px",
                                border: "none",
                                fontSize: "1rem",
                                background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
                                color: "#fff",
                                cursor: "pointer",
                                fontWeight: "600",
                                boxShadow: "0 4px 14px rgba(59,130,246,0.4)",
                                transition: "0.25s ease",
                            }}
                            onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
                            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
                            onClick={hanleReset}
                        >
                            <RedoOutlined />
                            Huỷ
                        </button>
                    </div>
                </form>

                {/* table */}
                <div className="container mt-4">
                    <table className="table table-dark table-hover table-bordered align-middle text-center rounded-3 overflow-hidden">
                        <thead className="table-primary text-dark">
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Tên khoảng lương</th>
                                <th scope="col">Min</th>
                                <th scope="col">Max</th>
                                <th scope="col">Sửa</th>
                                <th scope="col">Xóa</th>
                            </tr>
                        </thead>

                        <tbody>
                            {listJob?.map((job, index) => (
                                <tr key={job._id}>
                                    <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                    <td>{job.salaryRange}</td>
                                    <td>{job.min}</td>
                                    <td>{job.max}</td>
                                    <td className="text-primary fs-5" onClick={() => { setCurrentIndex(job._id), setInputValue({ salaryRange: job.salaryRange, min: job.min, max: job.max }) }} role="button">
                                        <EditTwoTone />
                                    </td>
                                    <td className="text-danger fs-5" onClick={() => { hanleDeleteJob(job._id) }} role="button">
                                        <DeleteTwoTone />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="d-flex justify-content-center">
                        <PaginationCustom
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            limit={limit}
                            totalPages={totalPages}
                        />
                    </div>
                </div>
            </div >

        </div >
    );
};

export default ManagerSalaryRange;