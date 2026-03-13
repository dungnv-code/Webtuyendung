import { listCVupload } from "../../../api/user";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import path from "../../../ultils/path"
const CVList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await listCVupload();
                if (res.success) {
                    setData(res.data);
                }
            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container py-4">
            <h3 className="fw-bold mb-3 text-center">Danh sách CV đã ứng tuyển</h3>

            <div className="row g-3">
                {data.map(job => (
                    <div key={job._id} className="col-12 col-md-6 col-lg-4">
                        <div className="card shadow-sm h-100">

                            <div className="card-body">
                                <Link to={`${path.JOB}/${job._id}`}>
                                    <h5 className="fw-semibold text-truncate">
                                        {job.title}
                                    </h5>
                                </Link>

                                <Link to={`${path.COMPANY}/${job.business._id}`}>
                                    <p className="text-secondary mb-1">
                                        <i className="fa-solid fa-building me-2"></i>
                                        {job.business?.nameBusiness}
                                    </p>
                                </Link>

                                <div className="d-flex justify-content-between">
                                    <p className="small mb-1">
                                        <i className="fa-solid fa-location-dot me-2"></i>
                                        {job.location}
                                    </p>

                                    <p className="small mb-1">
                                        <i className="fa-solid fa-clock me-2"></i>
                                        Hạn nộp: {new Date(job.deadline).toLocaleDateString("vi-VN")}
                                    </p>
                                </div>


                                {job.listCV.map(cv => (
                                    <div className="border-top pt-2 mt-2" key={cv._id}>
                                        {
                                            cv.status == "pendding" && <p className="small mb-1">   <strong>Trạng thái:</strong> Chờ phản hồi</p>
                                        }
                                        {
                                            cv.status == "unactive" && <p className="small mb-1">   <strong>Trạng thái:</strong> Đã từ chối</p>
                                        }
                                        {
                                            cv.status == "active" && <p className="small mb-1">   <strong>Trạng thái:</strong> Chấp nhận(liên hệ)</p>
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CVList;