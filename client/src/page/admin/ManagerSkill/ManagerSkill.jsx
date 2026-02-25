
import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getAllSkill, createSkill, updateSkill, deleteSkill, getAllJob } from "../../../api/job"
import { DeleteTwoTone, EditTwoTone, EditOutlined, PlusOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";

const ManagerSkill = () => {
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
    const [listJobSelect, setListJobSelect] = useState([]);
    const [inputValue, setInputValue] = useState({
        nameskill: "",
        job: ""
    });
    const [inputSearch, setinputSearch] = useState("");
    const [error, setError] = useState({});
    const [loaddata, setLoaddata] = useState(false)
    const [currentIndex, setCurrentIndex] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllSkill({ page: currentPage, limit, populate: "job:title,slug", flatten: true });
                setListJob(response.data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllJob();
                setListJobSelect(response.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchData();
    }, [])

    const hanleCreateJob = async () => {
        const newError = {};

        if (!inputValue.nameskill.trim()) {
            newError.nameskill = "Vui lòng nhập tên kĩ năng!";
        }
        if (!inputValue.job.trim()) {
            newError.job = "Vui lòng chọn nhóm công việc!";
        }
        setError(newError);
        if (Object.keys(newError).length === 0) {
            try {
                await createSkill(inputValue);
                setInputValue({ job: "", nameskill: "" });
                setCurrentPage(1);
                toast.success("Thêm kĩ năng thành công!")
                setLoaddata(!loaddata)
            } catch (error) {
                // toast.error("Lỗi khi tạo công việc");
            }
        }
    };

    const hanleUpdateJob = async () => {
        const newError = {};
        if (!inputValue.nameskill.trim()) {
            newError.nameskill = "Vui lòng nhập tên kĩ năng!";
        }
        if (!inputValue.job.trim()) {
            newError.job = "Vui lòng chọn nhóm công việc!";
        }
        setError(newError);
        if (Object.keys(newError).length === 0) {
            try {
                await updateSkill(currentIndex, inputValue);
                setInputValue({ job: "", nameskill: "" });
                setCurrentPage(1);
                toast.success("Sửa kĩ năng thành công!")
                setLoaddata(!loaddata)
            } catch (error) {
                // toast.error("Lỗi khi sửa công việc");
            }
        }
    }

    const hanleDeleteJob = async (id) => {
        try {
            await deleteSkill(id);
            setInputValue({ job: "", nameskill: "" });
            setCurrentPage(1);
            toast.success("Xoá kĩ năng thành công!")
            setLoaddata(!loaddata)
        } catch (error) {
            // toast.error("Lỗi khi sửa công việc");
        }
    }

    const hanleSearch = async () => {
        try {
            const response = await getAllSkill({ page: currentPage, limit, populate: "job:title,slug", flatten: true, nameskill: inputSearch });
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
                const response = await getAllSkill({ page: currentPage, limit });
                setListJob(response.data);
                setTotalPages(response.totalPages);
                setLoaddata(!loaddata)
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchData();
        setInputValue({ job: "", nameskill: "" });
    }

    return (
        <div style={styles.container}
        >
            <h1 style={{ marginTop: "10px", marginBottom: "20px", fontSize: "28px" }}>
                Quản lí kĩ năng
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
                            Tên kỹ năng
                        </label>

                        <input
                            type="text"
                            placeholder="Nhập tên kỹ năng..."
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
                            value={inputValue.nameskill}
                            onChange={(e) =>
                                setInputValue({
                                    ...inputValue,
                                    nameskill: e.target.value,
                                })
                            }
                            onFocus={(e) => (e.target.style.border = "1px solid #38bdf8")}
                            onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.25)")}
                        />

                        {error?.nameskill && (
                            <p style={{ color: "red", fontSize: "12px", marginTop: "6px" }}>
                                {error.nameskill}
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
                            Nhóm công việc
                        </label>

                        <select
                            className="form-select"
                            style={{
                                padding: "12px",
                                borderRadius: "10px",
                                border: "1px solid rgba(255,255,255,0.3)",
                                background: "rgba(255,255,255,0.3)",
                                color: "black",
                                fontWeight: "500",
                                transition: "0.25s ease",
                            }}
                            value={inputValue.job}
                            onChange={(e) =>
                                setInputValue({
                                    ...inputValue,
                                    job: e.target.value,
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
                        >
                            <option value="">Chọn một nhóm</option>
                            {listJobSelect?.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.title}
                                </option>
                            ))}
                        </select>
                        {error?.job && (
                            <p style={{ color: "red", fontSize: "12px", marginTop: "6px" }}>
                                {error.job}
                            </p>
                        )}
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
                                <th scope="col">Tên kĩ năng</th>
                                <th scope="col">Nhóm công việc</th>
                                <th scope="col">Sửa</th>
                                <th scope="col">Xóa</th>
                            </tr>
                        </thead>

                        <tbody>
                            {listJob?.map((job, index) => (
                                <tr key={job._id}>
                                    <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                    <td>{job.nameskill}</td>
                                    <td>{job.job_title}</td>
                                    <td className="text-primary fs-5" onClick={() => { setCurrentIndex(job._id), setInputValue({ job: job.job__id, nameskill: job.nameskill }) }} role="button">
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

export default ManagerSkill;