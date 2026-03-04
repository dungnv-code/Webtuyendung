import { useState, useEffect } from "react";
import { wishlistjob } from "../../../api/user";
import { Link } from "react-router-dom";
import path from "../../../ultils/path";
import "./wishlistjob.css";

const Wishlistjob = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await wishlistjob();
                setData(res.data || []);
            } catch (error) {
                console.log("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const getDaysRemaining = (deadline) => {
        const end = new Date(deadline).getTime();
        const now = Date.now();
        const distance = end - now;

        if (distance <= 0) return "Đã hết hạn";
        const days = Math.ceil(distance / (1000 * 60 * 60 * 24));
        return `Còn ${days} ngày`;
    };

    return (
        <div className="container py-3">
            <h3 className="fw-bold mb-3 text-center text-success" >Công việc yêu thích</h3>
            <div className="row g-3">
                {data.length > 0 ? (
                    data.map((job) => (
                        <div className="col-md-6 col-lg-4" key={job._id}>
                            <div className="wishlist-card p-3">
                                <div className="d-flex gap-3 align-items-start">

                                    {/* Ảnh */}
                                    <img
                                        src={job.imageCover}
                                        className="wishlist-img"
                                        alt=""
                                    />

                                    {/* Nội dung */}
                                    <div className="flex-grow-1">
                                        <Link to={`${path.JOB}/${job._id}`}>
                                            <p className="wishlist-title fw-semibold mb-1">
                                                {job.title}
                                            </p>
                                        </Link>

                                        <div className="wishlist-info small text-secondary">
                                            <div>
                                                <i className="fa-solid fa-building me-1"></i>
                                                {job.joblevel}
                                            </div>

                                            <div>
                                                <i className="fa-solid fa-location-dot me-1"></i>
                                                {job.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Loại việc + Deadline */}
                                <div className="mt-3 d-flex justify-content-between align-items-center">
                                    <span className="badge bg-info text-dark wishlist-tag">
                                        {job.workType}
                                    </span>

                                    <p className="text-danger fw-semibold wishlist-deadline mb-0">
                                        <i className="fa-solid fa-clock me-1"></i>
                                        {getDaysRemaining(job.deadline)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Chưa có công việc yêu thích nào.</p>
                )}
            </div>
        </div>
    );
};

export default Wishlistjob;