import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getPostJobBusiness, changeStatusPausePostJobBusiness } from "../../../api/business"

import { DeleteTwoTone, EditTwoTone, EditOutlined, FundViewOutlined, SwapOutlined, PlusOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import { Link } from "react-router-dom"
import path from "../../../ultils/path"
const ManagerPostJob = () => {
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
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [listJob, setListJob] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState({});
    const [loaddata, setLoaddata] = useState(false)
    const [currentIndex, setCurrentIndex] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getPostJobBusiness({ page: currentPage, limit });
                setListJob(response.data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);


    const hanleChangeStatus = async (id) => {
        try {
            const reponse = await changeStatusPausePostJobBusiness(id)
            if (reponse?.success) {
                setLoaddata(!loaddata)
                toast.success("Thay đổi trạng thái thành công")
            }
        } catch (err) {

        }
    }

    const hanleSearch = async () => {
        try {
            const response = await getPostJobBusiness({ page: currentPage, limit, title: inputValue });
            setListJob(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
        }
    }

    const hanleReset = async () => {
        const fetchData = async () => {
            try {
                const response = await getPostJobBusiness({ page: currentPage, limit });
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
                Quản lí bài đăng
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
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
                                <th scope="col">Tên bài đăng</th>
                                <th scope="col">Lĩnh vực</th>
                                <th scope="col">Người thêm</th>
                                <th scope="col">Ngày cập nhật</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Tạm ẩn</th>
                                <th scope="col">Đổi tạm ẩn</th>
                                <th scope="col">Danh sách cv</th>
                                <th scope="col">Cập nhật</th>
                            </tr>
                        </thead>

                        <tbody>
                            {listJob?.map((job, index) => (
                                <tr key={job._id}>
                                    <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                    <td >{job.title}</td>
                                    <td>{job.jobs}</td>
                                    <td>{job.userPost}</td>
                                    <td>{job.updatedAt}</td>
                                    <td>{job.status == "pendding" ? "Chờ kiểm duyệt" : "Đã kiểm duyệt"}</td>
                                    <td>{job.statusPause ? "Đang tạm ẩn" : "Tạm ẩn"}</td>
                                    <td onClick={() => { hanleChangeStatus(job._id) }}><SwapOutlined /></td>
                                    <td><Link to={`${path.CVPOSTJOB}/${job._id}`} ><FundViewOutlined /></Link></td>
                                    <td className="text-danger fs-5" role="button">
                                        <Link to={`${path.MANAGERPOSTJOB}/${job._id}`} > <EditOutlined /></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
    );
};

export default ManagerPostJob