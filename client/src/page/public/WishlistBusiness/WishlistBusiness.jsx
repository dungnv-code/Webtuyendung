import { wishlistbusiness } from "../../../api/user";
import { Link } from "react-router-dom";
import path from "../../../ultils/path";
import { useState, useEffect } from "react";

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
        <div className="min-vh-100 bg-light py-5 px-3">
            <h2 className="text-center fw-bold text-dark mb-1" style={{ fontSize: "1.6rem" }}>
                Doanh nghiệp theo dõi
            </h2>
            <p className="text-center text-muted text-uppercase mb-1" style={{ fontSize: "0.78rem", letterSpacing: "0.1em" }}>
                Danh sách công ty bạn đang quan tâm
            </p>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: "2.2rem", height: "2.2rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted" style={{ fontSize: "0.85rem" }}>Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4" style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    {data.length === 0 ? (
                        <div className="col-12 text-center text-muted py-5">
                            <i className="fa-regular fa-bookmark fs-1 d-block mb-3 text-secondary opacity-50" />
                            <p>Chưa có doanh nghiệp nào được lưu.</p>
                        </div>
                    ) : (
                        data.map((biz) => (
                            <div className="col" key={biz._id}>
                                <div className="row gap-3 h-100 border-0 shadow-sm rounded-4 overflow-hidden">

                                    <div className="overflow-hidden" style={{ height: "100px" }}>
                                        <img
                                            src={biz.imageCoverBusiness}
                                            className="w-100 h-100 object-fit-cover"
                                            alt="cover"
                                        />
                                    </div>

                                    <div className="card-body pt-0 px-3 pb-3">
                                        <div className="d-flex align-items-end gap-3 mb-3" style={{ marginTop: "-28px" }}>
                                            <img
                                                src={biz.imageAvatarBusiness}
                                                alt="avatar"
                                                className="rounded-3 border border-3 border-white shadow-sm flex-shrink-0 bg-light object-fit-cover"
                                                style={{ width: "56px", height: "56px" }}
                                            />
                                            <div className="pb-1">
                                                <Link
                                                    to={`${path.COMPANY}/${biz._id}`}
                                                    className="fw-semibold text-decoration-none text-dark d-block lh-sm"
                                                    style={{ fontSize: "0.92rem" }}
                                                >
                                                    {biz.nameBusiness}
                                                </Link>
                                                <small className="text-primary fw-medium" style={{ fontSize: "0.75rem" }}>
                                                    {biz.FieldBusiness}
                                                </small>
                                            </div>
                                        </div>

                                        <hr className="border-dashed my-2 opacity-25" />

                                        <div className="d-flex flex-column gap-2">
                                            <span className="badge rounded-pill bg-light text-secondary fw-normal d-inline-flex align-items-center gap-2 px-3 py-2">
                                                <i className="fa-solid fa-users text-primary-emphasis" style={{ fontSize: "0.7rem" }} />
                                                <span style={{ fontSize: "0.76rem" }}>{biz.numberOfEmployees} nhân viên</span>
                                            </span>
                                            <span className="badge rounded-pill bg-light text-secondary fw-normal d-inline-flex align-items-center gap-2 px-3 py-2 text-truncate" style={{ maxWidth: "100%" }}>
                                                <i className="fa-solid fa-location-dot text-primary-emphasis" style={{ fontSize: "0.7rem" }} />
                                                <span className="text-truncate" style={{ fontSize: "0.76rem" }}>{biz.addressBusiness}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default WishlistBusiness;