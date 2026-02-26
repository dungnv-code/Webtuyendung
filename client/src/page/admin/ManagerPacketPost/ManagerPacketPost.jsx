


import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getAllPacketPost, createPacketPost, updatePacketPost, deletePacketPost, changeStatusPacketPost } from "../../../api/job"
import { DeleteTwoTone, EditTwoTone, EditOutlined, PlusOutlined, SwapOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";

const ManagerPacketPost = () => {
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
        namePostPackage: "",
        valuePostPackage: "",
        typePostPackage: "",
        price: ""
    });
    const [inputSearch, setinputSearch] = useState("");
    const [error, setError] = useState({});
    const [loaddata, setLoaddata] = useState(false)
    const [currentIndex, setCurrentIndex] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllPacketPost({ page: currentPage, limit });
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

        if (!inputValue.namePostPackage.trim()) {
            newError.namePostPackage = "Vui lòng nhập tên gói bài đăng!";
        }

        if (!inputValue.typePostPackage.trim()) {
            newError.typePostPackage = "Vui lòng chọn loại gói bài đăng!";
        }

        if (!inputValue.valuePostPackage.trim()) {
            newError.valuePostPackage = "Vui lòng nhập số lượng lượt đăng!";
        }

        if (!inputValue.price.trim()) {
            newError.price = "Vui lòng nhập giá gói đăng!";
        }

        setError(newError);
        if (Object.keys(newError).length === 0) {
            try {
                await createPacketPost(inputValue);
                setInputValue({ namePostPackage: "", valuePostPackage: "", typePostPackage: "", price: "" });
                setCurrentPage(1);
                toast.success("Thêm gói bài đăng thành công!")
                setLoaddata(!loaddata)
            } catch (error) {
                // toast.error("Lỗi khi tạo công việc");
            }
        }
    };

    const hanleUpdateJob = async () => {
        const newError = {};
        if (!inputValue.namePostPackage.trim()) {
            newError.namePostPackage = "Vui lòng nhập tên gói bài đăng!";
        }

        if (!inputValue.typePostPackage.trim()) {
            newError.typePostPackage = "Vui lòng chọn loại gói bài đăng!";
        }

        if (inputValue.valuePostPackage == null || inputValue.valuePostPackage === "") {
            newError.valuePostPackage = "Vui lòng nhập số lượng lượt đăng!";
        }

        if (inputValue.price == null || inputValue.price === "") {
            newError.price = "Vui lòng nhập giá gói đăng!";
        }

        setError(newError);
        if (Object.keys(newError).length === 0) {
            try {
                await updatePacketPost(currentIndex, inputValue);
                setInputValue({ namePostPackage: "", valuePostPackage: "", typePostPackage: "", price: "" });
                setCurrentPage(1);
                toast.success("Sửa gói bài đăng thành công!")
                setLoaddata(!loaddata)
            } catch (error) {
                // toast.error("Lỗi khi sửa công việc");
            }
        }
    }

    const hanleDeleteJob = async (id) => {
        try {
            await deletePacketPost(id);
            setInputValue({ namePostPackage: "", valuePostPackage: "", typePostPackage: "", price: "" });
            setCurrentPage(1);
            toast.success("Xoá gói bài đăng thành công!")
            setLoaddata(!loaddata)
        } catch (error) {
            // toast.error("Lỗi khi sửa công việc");
        }
    }

    const hanleSearch = async () => {
        try {
            const response = await getAllPacketPost({ page: currentPage, limit, namePostPackage: inputSearch });
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
                const response = await getAllPacketPost({ page: currentPage, limit });
                setListJob(response.data);
                setTotalPages(response.totalPages);
                setLoaddata(!loaddata)
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchData();
        setInputValue({ namePostPackage: "", valuePostPackage: "", typePostPackage: "", price: "" });
    }

    const hanleChangeStatus = async (id) => {
        try {
            const response = await changeStatusPacketPost(id);
            setLoaddata(!loaddata)
            toast.success("Thay đổi trạng thái gói bài đăng thành công!")
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    }

    return (
        <div style={styles.container}
        >
            <h1 style={{ marginTop: "10px", marginBottom: "20px", fontSize: "28px" }}>
                Quản lí gói bài đăng
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
                            Tên gói bài đăng
                        </label>

                        <input
                            type="text"
                            placeholder="Nhập tên gói bài đăng..."
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
                            value={inputValue.namePostPackage}
                            onChange={(e) =>
                                setInputValue({
                                    ...inputValue,
                                    namePostPackage: e.target.value,
                                })
                            }
                            onFocus={(e) => (e.target.style.border = "1px solid #38bdf8")}
                            onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.25)")}
                        />

                        {error?.namePostPackage && (
                            <p style={{ color: "red", fontSize: "12px", marginTop: "6px" }}>
                                {error.namePostPackage}
                            </p>
                        )}


                        <div className="row mt-3">

                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ color: "#0ea5e9", }}>Số lượng lượt bài đăng</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Số lượng..."
                                    style={{
                                        padding: "12px",
                                        borderRadius: "10px",
                                        border: "1px solid rgba(255,255,255,0.3)",
                                        background: "rgba(255,255,255,0.3)",
                                        color: "black",
                                        fontWeight: "500",
                                        boxShadow: "0 4px 14px rgba(59,130,246,0.4)",
                                        transition: "0.25s ease",
                                    }}
                                    value={inputValue.valuePostPackage}
                                    onChange={(e) =>
                                        setInputValue({
                                            ...inputValue,
                                            valuePostPackage: e.target.value,
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
                                {error?.valuePostPackage && (
                                    <p style={{ color: "red", fontSize: "12px", marginTop: "6px" }}>
                                        {error.valuePostPackage}
                                    </p>
                                )}
                            </div>

                            {/* Ô Nhóm Select */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold" style={{ color: "#0ea5e9", }}>Giá gói bài đăng($)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Giá..."
                                    style={{
                                        padding: "12px",
                                        borderRadius: "10px",
                                        border: "1px solid rgba(255,255,255,0.3)",
                                        background: "rgba(255,255,255,0.3)",
                                        color: "black",
                                        fontWeight: "500",
                                        boxShadow: "0 4px 14px rgba(59,130,246,0.4)",
                                        transition: "0.25s ease",
                                    }}
                                    value={inputValue.price}
                                    onChange={(e) =>
                                        setInputValue({
                                            ...inputValue,
                                            price: e.target.value,
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
                                {error?.price && (
                                    <p style={{ color: "red", fontSize: "12px", marginTop: "6px" }}>
                                        {error.price}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row">

                        <div className="col-md-6">
                            <label className="form-label fw-semibold" style={{ color: "#0ea5e9", }}>Khoảng lương</label>
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
                                    boxShadow: "0 4px 14px rgba(59,130,246,0.4)",
                                }}
                                value={inputValue.typePostPackage}
                                onChange={(e) =>
                                    setInputValue({
                                        ...inputValue,
                                        typePostPackage: e.target.value,
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
                                <option value="">-- Chọn loại bài đăng --</option>
                                <option value="BASIC">Bình thường</option>
                                <option value="PREMIUM">Nổi bật</option>
                            </select>

                            {error?.typePostPackage && (
                                <p style={{ color: "red", fontSize: "12px", marginTop: "6px" }}>
                                    {error.typePostPackage}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* BUTTON HÀNG DƯỚI */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "12px",
                            flexWrap: "wrap",
                            marginTop: "10px"
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
                                <th scope="col">Tên gói bài đăng</th>
                                <th scope="col">Giá trị</th>
                                <th scope="col">Loại</th>
                                <th scope="col">Giá</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Đổi TT</th>
                                <th scope="col">Sửa</th>
                                <th scope="col">Xóa</th>
                            </tr>
                        </thead>

                        <tbody>
                            {listJob?.map((job, index) => (
                                <tr key={job._id}>
                                    <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                    <td>{job.namePostPackage}</td>
                                    <td>{job.valuePostPackage}</td>
                                    <td>{job.typePostPackage == "PREMIUM" ? "Nổi bật" : "Bình thường"}</td>
                                    <td>{job.price}</td>
                                    <td>{job.status == "ACTIVE" ? "Đang kinh doanh" : "Dừng kinh doanh"}</td>
                                    <td onClick={() => { hanleChangeStatus(job._id) }}><SwapOutlined /></td>
                                    <td className="text-primary fs-5" onClick={() => { setCurrentIndex(job._id), setInputValue({ namePostPackage: job.namePostPackage, valuePostPackage: job.valuePostPackage, typePostPackage: job.typePostPackage, price: job.price }) }} role="button">
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

export default ManagerPacketPost;