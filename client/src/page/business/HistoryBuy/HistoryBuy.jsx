import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getInvoidBusiness } from "../../../api/business"
import { DeleteTwoTone, EditTwoTone, EditOutlined, SwapOutlined, PlusOutlined, SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";

const HistoryBuy = () => {
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
    const [currentIndex, setCurrentIndex] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getInvoidBusiness({ page: currentPage, limit });

                setListJob(response.data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchData();
    }, [currentPage, limit, loaddata]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div style={styles.container}
        >
            <h1 style={{ marginTop: "10px", marginBottom: "20px", fontSize: "28px" }}>
                Lịch sử giao dịch
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
                                <th scope="col">Tên hoá đơn</th>
                                <th scope="col">Số lượng đăng</th>
                                <th scope="col">Số lượng mua</th>
                                <th scope="col">Tổng tiền</th>
                                <th scope="col">Ngày mua</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listJob?.map((job, index) => (
                                <tr key={job._id}>
                                    <td>{(currentPage - 1) * limit + (index + 1)}</td>
                                    <td >{job.title}</td>
                                    <td>{job.value}</td>
                                    <td>{job.amount}</td>
                                    <td>{job.totalPrice} $</td>
                                    <td>{formatDate(job.createdAt)}</td>
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

export default HistoryBuy;