import { wishlistbusiness } from "../../../api/user";
import { Link } from "react-router-dom";
import path from "../../../ultils/path";
import { useState, useEffect } from "react";
import "./wishlistbusiness.css";

const WishlistBusiness = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await wishlistbusiness();
                setData(res.data || []);
            } catch (error) {
                console.log("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    return (
        <div className="container py-3">
            <h3 className="fw-bold mb-4 text-center text-success">Doanh nghiệp theo dõi</h3>

            <div className="row g-3">
                {data.length > 0 ? (
                    data.map((biz) => (
                        <div className="col-md-6 col-lg-4" key={biz._id}>
                            <div className="business-card p-3">

                                {/* Cover */}
                                <img
                                    src={biz.imageCoverBusiness}
                                    className="business-cover"
                                    alt="cover"
                                />

                                <div className="d-flex align-items-center mt-3 gap-3">
                                    {/* Avatar */}
                                    <img
                                        src={biz.imageAvatarBusiness}
                                        className="business-avatar"
                                        alt="avatar"
                                    />

                                    <div>
                                        <Link to={`${path.COMPANY}/${biz._id}`}>
                                            <p className="business-title fw-semibold mb-1">
                                                {biz.nameBusiness}
                                            </p>
                                        </Link>

                                        <p className="small text-secondary mb-0">
                                            {biz.FieldBusiness}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 small text-secondary">
                                    <div>
                                        <i className="fa-solid fa-users me-1"></i>
                                        {biz.numberOfEmployees}
                                    </div>
                                    <div className="business-title">
                                        <i className="fa-solid fa-location-dot me-1"></i>
                                        {biz.addressBusiness}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Chưa có doanh nghiệp nào được lưu.</p>
                )}
            </div>
        </div>
    );
};

export default WishlistBusiness;