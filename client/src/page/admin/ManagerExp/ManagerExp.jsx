import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getAllExp, updateExp, deleteExp, createExp } from "../../../api/job"
import { DeleteTwoTone, EditTwoTone, EditOutlined, PlusOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";

const ManagerExp = () => {
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
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [listJob, setListJob] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState({});
    const [loaddata, setLoaddata] = useState(false)
    const [currentIndex, setCurrentIndex] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllExp({ page: currentPage, limit });
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

        if (!inputValue.trim()) {
            newError.inputValue = "Vui lòng nhập tên kinh nhiệm";
        }

        setError(newError);

        if (Object.keys(newError).length === 0) {
            try {
                await createExp({ experience: inputValue });
                setInputValue("");
                setCurrentPage(1);
                toast.success("Thêm kinh nhiệm thành công!")
                setLoaddata(!loaddata)
            } catch (error) {
                // toast.error("Lỗi khi tạo công việc");
            }
        }
    };

    const hanleUpdateJob = async () => {
        const newError = {};
        if (!inputValue.trim()) {
            newError.inputValue = "Vui lòng nhập tên kinh nhiệm";
        }
        if (!currentIndex.trim()) {
            newError.inputValue = "Vui lòng chọn kinh nhiệm muốn sửa!";
        }
        setError(newError);
        if (Object.keys(newError).length === 0) {
            try {
                await updateExp(currentIndex, { experience: inputValue });
                setInputValue("");
                setCurrentPage(1);
                toast.success("Sửa kinh nhiệm thành công!")
                setLoaddata(!loaddata)
            } catch (error) {
                // toast.error("Lỗi khi sửa công việc");
            }
        }
    }

    const hanleDeleteJob = async (id) => {
        try {
            await deleteExp(id);
            setInputValue("");
            setCurrentPage(1);
            toast.success("Xoá kinh nhiệm thành công!")
            setLoaddata(!loaddata)
        } catch (error) {
            // toast.error("Lỗi khi sửa công việc");
        }
    }

    const hanleSearch = async () => {
        const newError = {};
        if (!inputValue.trim()) {
            newError.inputValue = "Vui lòng nhập tên kinh nhiệm bạn muốn tìm!";
        }
        setError(newError);
        if (Object.keys(newError).length === 0) {
            try {
                const response = await getAllExp({ page: currentPage, limit, experience: inputValue });
                setListJob(response.data);
                setTotalPages(response.totalPages);
            } catch (error) {
                // console.error("Error fetching jobs:", error);
            }
        }
    }

    const hanleReset = async () => {
        const fetchData = async () => {
            try {
                const response = await getAllExp({ page: currentPage, limit });
                setListJob(response.data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchData();
        setInputValue("")
    }

    return (
        <div style={styles.container}
        >
            <h1 style={{ marginTop: "10px", marginBottom: "20px", fontSize: "28px" }}>
                Quản lí kinh nhiệm
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
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            style={{
                                padding: "12px 16px",
                                width: "80%",
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
                            value={inputValue}
                            onChange={(e) => { setInputValue(e.target.value) }}
                            onFocus={(e) => (e.target.style.border = "1px solid #38bdf8")}
                            onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.25)")}
                        />    {error && <p className="text-danger mt-2">{error.inputValue}</p>}
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
                            onClick={hanleSearch}
                        >
                            <SearchOutlined />
                            Tìm kiếm
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
                                <th scope="col">Tên kinh nhiệm</th>
                                <th scope="col">Slug</th>
                                <th scope="col">Sửa</th>
                                <th scope="col">Xóa</th>
                            </tr>
                        </thead>

                        <tbody>
                            {listJob?.map((job, index) => (
                                <tr key={job._id}>
                                    <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                    <td>{job.experience}</td>
                                    <td>{job.slug}</td>
                                    <td className="text-primary fs-5" onClick={() => { setCurrentIndex(job._id), setInputValue(job.experience) }} role="button">
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
            </div>

        </div>
    );
};

export default ManagerExp;