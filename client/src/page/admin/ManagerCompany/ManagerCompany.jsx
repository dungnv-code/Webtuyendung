import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getAllBusiness, changeStatusBusiness } from "../../../api/job"
import { DeleteTwoTone, EditTwoTone, EditOutlined, SwapOutlined, PlusOutlined, DeliveredProcedureOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import path from "../../../ultils/path";

const ManagerCompany = () => {
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
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState({});
    const [loaddata, setLoaddata] = useState(false)
    const [selectValue, setSelectValue] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllBusiness({ page: currentPage, limit });
                setListJob(response.data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);

    // const hanleCreateJob = async () => {
    //     const newError = {};

    //     if (!inputValue.trim()) {
    //         newError.inputValue = "Vui lòng nhập tên doanh nghiệp";
    //     }

    //     setError(newError);

    //     if (Object.keys(newError).length === 0) {
    //         try {
    //             await createLevel({ nameLevel: inputValue });
    //             setInputValue("");
    //             setCurrentPage(1);
    //             toast.success("Thêm doanh nghiệp thành công!")
    //             setLoaddata(!loaddata)
    //         } catch (error) {
    //             // toast.error("Lỗi khi tạo công việc");
    //         }
    //     }
    // };

    // const hanleUpdateJob = async () => {
    //     const newError = {};
    //     if (!inputValue.trim()) {
    //         newError.inputValue = "Vui lòng nhập tên doanh nghiệp";
    //     }
    //     if (!currentIndex.trim()) {
    //         newError.inputValue = "Vui lòng chọn doanh nghiệp muốn sửa!";
    //     }
    //     setError(newError);
    //     if (Object.keys(newError).length === 0) {
    //         try {
    //             await updateLevel(currentIndex, { nameLevel: inputValue });
    //             setInputValue("");
    //             setCurrentPage(1);
    //             toast.success("Sửa doanh nghiệp thành công!")
    //             setLoaddata(!loaddata)
    //         } catch (error) {
    //             // toast.error("Lỗi khi sửa công việc");
    //         }
    //     }
    // }

    // const hanleDeleteJob = async (id) => {
    //     try {
    //         await deleteUser(id);
    //         setInputValue("");
    //         setCurrentPage(1);
    //         toast.success("Xoá doanh nghiệp thành công!")
    //         setLoaddata(!loaddata)
    //     } catch (error) {
    //         // toast.error("Lỗi khi sửa công việc");
    //     }
    // }

    const handleSearch = async () => {
        const newError = {};

        if (Object.keys(newError).length > 0) return;

        try {
            const response = await getAllBusiness({
                page: currentPage,
                limit,
                nameBusiness: inputValue || undefined,
                statusBusiness: selectValue || undefined,
            });
            setListJob(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    };
    const hanleReset = async () => {
        const fetchData = async () => {
            try {
                const response = await getAllBusiness({ page: currentPage, limit });
                setListJob(response.data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchData();
        setInputValue("")
        setSelectValue("")
    }

    const hanleChangeStatus = async (id) => {
        try {
            await changeStatusBusiness(id);
            setCurrentPage(1);
            toast.success("Cập nhật trạng thái doanh nghiệp thành công!")
            setLoaddata(!loaddata)
        } catch (error) {
            // toast.error("Lỗi khi sửa công việc");
        }
    }

    return (
        <div style={styles.container}
        >
            <h1 style={{ marginTop: "10px", marginBottom: "20px", fontSize: "28px" }}>
                Quản lí doanh nghiệp
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
                            gap: "15px",
                            marginBottom: "20px",
                            width: "100%"
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            style={{
                                padding: "12px 16px",
                                width: "70%",
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
                            onChange={(e) => setInputValue(e.target.value)}
                        />

                        <select
                            className="form-select"
                            style={{
                                padding: "12px 16px",
                                width: "25%",
                                borderRadius: "10px",
                                border: "1px solid rgba(255,255,255,0.3)",
                                background: "rgba(255,255,255,0.15)",
                                backdropFilter: "blur(6px)",
                                color: "black",
                                fontSize: "1rem",
                                outline: "none",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                transition: "0.25s ease"
                            }}
                            onFocus={(e) => (e.target.style.border = "1px solid #38bdf8")}
                            onBlur={(e) => (e.target.style.border = "1px solid rgba(255,255,255,0.3)")}
                            value={selectValue}
                            onChange={(e) => { setSelectValue(e.target.value) }}
                        >
                            <option value="">-- Chọn giá trị --</option>
                            <option value="true">Đã kiểm duyệt</option>
                            <option value="false">Chưa kiểm duyệt</option>
                        </select>
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
                            onClick={handleSearch}
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
                <div
                    className="container mt-4"
                    style={{
                        width: "100%",
                        overflowX: "auto",
                        paddingBottom: "10px"
                    }}
                >
                    <table
                        className="table table-dark table-hover table-bordered align-middle text-center rounded-3 overflow-hidden"
                        style={{
                            minWidth: "1000px" // hoặc 1000px tùy bạn muốn rộng bao nhiêu
                        }}
                    >
                        <thead className="table-primary text-dark">
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Tên doanh nghiệp</th>
                                <th scope="col">taxiCodeBusiness</th>
                                <th scope="col">Địa chỉ</th>
                                <th scope="col">Điện thoại</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Đổi TT</th>
                                <th scope="col">Chi tiết</th>
                            </tr>
                        </thead>

                        <tbody>
                            {listJob?.map((job, index) => (
                                <tr key={job._id}>
                                    <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                    <td >{job.nameBusiness}</td>
                                    <td>{job.taxiCodeBusiness}</td>
                                    <td>{job.addressBusiness}</td>
                                    <td>{job.phoneBusiness}</td>
                                    <td>{job.statusBusiness == true ? "Đã kiểm duyệt" : "Chưa kiểm duyệt"}</td>
                                    <td onClick={() => { hanleChangeStatus(job._id) }}><SwapOutlined /></td>
                                    <td className="text-danger fs-5" role="button">
                                        <Link to={`${path.COMPANYADMIN}/${job._id}`}>   <DeliveredProcedureOutlined /></Link>
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

export default ManagerCompany;