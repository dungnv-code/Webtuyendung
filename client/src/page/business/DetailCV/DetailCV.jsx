import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { detailPostJobCV } from "../../../api/business";
import { toast } from "react-toastify";
import { ReadPDF } from "../../../component";
import { useParams } from "react-router-dom";

const DetailCV = () => {
    const { idp } = useParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(3);
    const [totalPages, setTotalPages] = useState(0);
    const [listJob, setListJob] = useState([]);
    const [loaddata, setLoaddata] = useState(false);
    const [urlCV, setUrlCV] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await detailPostJobCV(idp, {
                    page: currentPage,
                    limit,
                    role: "ungvien,nhatuyendung,STAFF",
                });

                setListJob(response.data || []);
                setTotalPages(response.totalPages || 0);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchData();
    }, [currentPage, limit, loaddata]);

    return (
        <div className="container py-5">

            <h2 className="text-center fw-bold mb-4">Quản lý CV ứng viên</h2>

            <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body">

                    <div className="table-responsive">
                        <table className="table table-striped table-hover align-middle text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">STT</th>
                                    <th scope="col">Tên ứng viên</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Điện thoại</th>
                                    <th scope="col">Phù hợp</th>
                                    <th scope="col">Đánh giá</th>
                                    <th scope="col">Xem CV</th>
                                </tr>
                            </thead>

                            <tbody>
                                {listJob.map((job, index) => (
                                    <tr key={job._id}>
                                        <td>{(currentPage - 1) * limit + index + 1}</td>
                                        <td>{job.idUser.username}</td>
                                        <td>{job.idUser.email}</td>
                                        <td>{job.idUser.phone}</td>
                                        <td>{job.ratio}%</td>
                                        <td>{job.evaluate}</td>

                                        <td>
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => setUrlCV(job.fileCV)}
                                            >
                                                📄 Xem CV
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

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

            {/* Modal xem PDF */}
            {urlCV && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                    onClick={() => setUrlCV("")}
                >
                    <div
                        className="modal-dialog modal-xl modal-dialog-centered"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xem CV ứng viên</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setUrlCV("")}
                                ></button>
                            </div>

                            <div className="modal-body" style={{ height: "80vh" }}>
                                <ReadPDF fileUrl={urlCV} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailCV;