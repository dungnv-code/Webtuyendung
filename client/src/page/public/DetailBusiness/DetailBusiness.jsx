import { useEffect, useState } from "react";
import { getDetailBusiness } from "../../../api/job";
import { getPostJobUserBusiness } from "../../../api/business";
import { useParams, Link } from "react-router-dom";
import { createWishListBusiness, checkWishlistBusiness } from "../../../api/user";
import { toast } from "react-toastify";
import PaginationCustom from "../../../component/pagination/pagination";
import path from "../../../ultils/path";
import { useSelector } from "react-redux";

const DetailBusiness = () => {
    const { idb } = useParams();
    const [data, setData] = useState({});
    const [listjob, setListjob] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(7);
    const [totalPages, setTotalPages] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const isLogIn = useSelector(state => state.user.isLogIn);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const repo = await getDetailBusiness(idb);
                setData(repo.data);
            } catch (err) { console.log(err); }
        };
        fetchData();
    }, [idb]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const repo = await getPostJobUserBusiness(idb, { page: currentPage, limit });
                setListjob(repo.data || []);
                setTotalPages(repo.totalPages || 0);
            } catch (err) { console.log(err); }
        };
        fetchJobs();
    }, [idb, currentPage, limit]);

    const getDaysRemaining = (deadline) => {
        const distance = new Date(deadline).getTime() - Date.now();
        if (distance <= 0) return "Đã hết hạn";
        return `Còn ${Math.ceil(distance / 86400000)} ngày`;
    };

    const generateMapIframe = (address) =>
        `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

    const checkLike = async () => {
        try {
            const res = await checkWishlistBusiness(idb);
            setIsLiked(res.isLiked);
        } catch (err) { console.log(err); }
    };

    const hanleCreateWishlistJob = async () => {
        try {
            const repo = await createWishListBusiness(idb);
            if (repo.success) { toast.success(repo.message); checkLike(); }
        } catch (err) { }
    };

    if (isLogIn) checkLike();

    return (
        <div style={{ background: "#f8fffe", minHeight: "100vh" }}>

            {/* ── COVER + PROFILE CARD ── */}
            <div className="position-relative" style={{ marginBottom: "20px" }}>
                {/* Cover image */}
                <div style={{ height: "300px", overflow: "hidden" }}>
                    <img
                        src={data?.imageCoverBusiness}
                        className="w-100 h-100"
                        style={{ objectFit: "cover", filter: "brightness(0.75)" }}
                        alt="cover"
                    />
                    {/* Gradient overlay */}
                    <div className="position-absolute top-0 start-0 w-100 h-100"
                        style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(27,94,32,0.6))" }} />
                </div>

                {/* Profile card overlapping cover */}
                <div className="container" style={{ marginTop: "-64px", position: "relative", zIndex: 10 }}>
                    <div className="card border-0 shadow rounded-4 px-4 py-4">
                        <div className="row align-items-center g-4">

                            {/* Avatar */}
                            <div className="col-auto">
                                <div className="rounded-3 overflow-hidden"
                                    style={{ width: "100px", height: "100px", border: "3px solid #fff", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
                                    <img src={data?.imageAvatarBusiness} alt="avatar"
                                        className="w-100 h-100" style={{ objectFit: "cover" }} />
                                </div>
                            </div>

                            {/* Company info */}
                            <div className="col">
                                <h4 className="fw-bold mb-1" style={{ color: "#1b5e20" }}>{data?.nameBusiness}</h4>
                                <div className="d-flex flex-wrap gap-3 mt-1">
                                    <span className="small text-muted">
                                        <i className="fa-solid fa-layer-group me-1" style={{ color: "#4caf50" }}></i>
                                        {data?.FieldBusiness}
                                    </span>
                                    <span className="small text-muted">
                                        <i className="fa-solid fa-users me-1" style={{ color: "#4caf50" }}></i>
                                        {data?.numberOfEmployees}
                                    </span>
                                    <span className="small text-muted">
                                        <i className="fa-solid fa-location-dot me-1" style={{ color: "#4caf50" }}></i>
                                        {data?.addressBusiness}
                                    </span>
                                </div>
                                {data?.websiteBusiness && (
                                    <a href={data.websiteBusiness} target="_blank" rel="noopener noreferrer"
                                        className="small mt-1 d-inline-block text-decoration-none"
                                        style={{ color: "#2e7d32" }}>
                                        <i className="fa-solid fa-globe me-1"></i>
                                        {data.websiteBusiness}
                                    </a>
                                )}
                            </div>

                            {/* CTA */}
                            <div className="col-auto">
                                <button onClick={hanleCreateWishlistJob}
                                    className={`btn rounded-pill px-4 fw-semibold ${isLiked ? "btn-success" : "btn-outline-success"}`}>
                                    {isLiked
                                        ? <><i className="fa-solid fa-heart me-2"></i>Đã theo dõi</>
                                        : <><i className="fa-regular fa-heart me-2"></i>Theo dõi</>}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN BODY ── */}
            <div className="container pb-5">
                <div className="row g-4">

                    {/* ── LEFT COLUMN ── */}
                    <div className="col-lg-8">

                        {/* Company description */}
                        <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-header border-0 rounded-top-3 py-3 px-4"
                                style={{ background: "#1b5e20" }}>
                                <h6 className="fw-bold text-white mb-0">
                                    <i className="fa-solid fa-building me-2"></i>
                                    Giới thiệu công ty
                                </h6>
                            </div>
                            <div className="card-body px-4 py-4">
                                {data?.descriptionBusiness ? (
                                    <div className="job-description text-secondary small lh-lg"
                                        dangerouslySetInnerHTML={{ __html: data.descriptionBusiness }} />
                                ) : (
                                    <p className="text-muted fst-italic small mb-0">
                                        <i className="fa-solid fa-circle-info me-1"></i>
                                        Công ty chưa cập nhật phần giới thiệu.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Job listings */}
                        <div className="card border-0 shadow-sm rounded-3">
                            <div className="card-header border-0 rounded-top-3 py-3 px-4 d-flex align-items-center justify-content-between"
                                style={{ background: "#1b5e20" }}>
                                <h6 className="fw-bold text-white mb-0">
                                    <i className="fa-solid fa-briefcase me-2"></i>
                                    Việc làm đang tuyển
                                </h6>
                                <span className="badge rounded-pill px-3"
                                    style={{ background: "#69f0ae", color: "#1b5e20", fontSize: "0.75rem" }}>
                                    {listjob.length} vị trí
                                </span>
                            </div>
                            <div className="card-body px-4 py-4">
                                {listjob.length === 0 ? (
                                    <div className="text-center py-4">
                                        <i className="fa-solid fa-briefcase fs-2 mb-2 d-block" style={{ color: "#c8e6c9" }}></i>
                                        <p className="text-muted small mb-0">Hiện chưa có vị trí tuyển dụng.</p>
                                    </div>
                                ) : (
                                    listjob.map((job) => {
                                        const isExpired = getDaysRemaining(job?.deadline) === "Đã hết hạn";
                                        return (
                                            <div key={job._id}
                                                className="rounded-3 border p-3 mb-3"
                                                style={{
                                                    borderColor: "#e8f5e9",
                                                    transition: "box-shadow 0.2s, transform 0.2s",
                                                    opacity: isExpired ? 0.6 : 1,
                                                }}
                                                onMouseEnter={e => {
                                                    if (!isExpired) {
                                                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(76,175,80,0.12)";
                                                        e.currentTarget.style.transform = "translateY(-2px)";
                                                    }
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.boxShadow = "";
                                                    e.currentTarget.style.transform = "";
                                                }}>
                                                <div className="row align-items-center g-3">

                                                    {/* Logo */}
                                                    <div className="col-auto">
                                                        <div className="rounded-2 border overflow-hidden"
                                                            style={{ width: "56px", height: "56px" }}>
                                                            <img src={job?.imageCover} alt={job?.title}
                                                                className="w-100 h-100" style={{ objectFit: "cover" }} />
                                                        </div>
                                                    </div>

                                                    {/* Info */}
                                                    <div className="col">
                                                        {isExpired ? (
                                                            <p className="fw-semibold mb-1 text-muted small">{job?.title}</p>
                                                        ) : (
                                                            <Link to={`${path.JOB}/${job._id}`} className="text-decoration-none">
                                                                <p className="fw-semibold mb-1 small" style={{ color: "#1b5e20" }}>
                                                                    {job?.title}
                                                                </p>
                                                            </Link>
                                                        )}
                                                        <div className="d-flex flex-wrap gap-3">
                                                            <span className="text-muted small">
                                                                <i className="fa-solid fa-building me-1" style={{ color: "#4caf50" }}></i>
                                                                {job?.joblevel}
                                                            </span>
                                                            <span className="text-muted small">
                                                                <i className="fa-solid fa-location-dot me-1" style={{ color: "#4caf50" }}></i>
                                                                {job?.location}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Right */}
                                                    <div className="col-auto text-end d-flex flex-column align-items-end gap-1">
                                                        <span className="badge rounded-pill px-3 py-2"
                                                            style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: "0.72rem" }}>
                                                            {job?.workType}
                                                        </span>
                                                        <span className={`small fw-semibold ${isExpired ? "text-muted" : "text-danger"}`}>
                                                            <i className="fa-regular fa-clock me-1"></i>
                                                            {getDaysRemaining(job?.deadline)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}

                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-center mt-3">
                                        <PaginationCustom
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            limit={limit}
                                            totalPages={totalPages}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div className="col-lg-4">

                        {/* Contact info */}
                        <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-header border-0 rounded-top-3 py-3 px-4"
                                style={{ background: "#1b5e20" }}>
                                <h6 className="fw-bold text-white mb-0">
                                    <i className="fa-solid fa-address-card me-2"></i>
                                    Thông tin liên hệ
                                </h6>
                            </div>
                            <div className="card-body px-4 py-4">
                                {[
                                    { icon: "fa-location-dot", label: "Địa chỉ", value: data?.addressBusiness },
                                    { icon: "fa-layer-group", label: "Lĩnh vực", value: data?.FieldBusiness },
                                    { icon: "fa-users", label: "Quy mô", value: data?.numberOfEmployees },
                                ].map((row, i) => (
                                    <div key={i} className={`d-flex align-items-start gap-3 py-2 ${i < 2 ? "border-bottom" : ""}`}
                                        style={{ borderColor: "#f1f8e9" }}>
                                        <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 mt-1"
                                            style={{ width: "30px", height: "30px", background: "#e8f5e9" }}>
                                            <i className={`fa-solid ${row.icon} fa-sm`} style={{ color: "#2e7d32" }}></i>
                                        </div>
                                        <div>
                                            <p className="mb-0 text-muted" style={{ fontSize: "0.72rem" }}>{row.label}</p>
                                            <p className="mb-0 fw-semibold small">{row.value}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Map */}
                                {data?.addressBusiness && (
                                    <div className="mt-3">
                                        <p className="fw-semibold small mb-2" style={{ color: "#2e7d32" }}>
                                            <i className="fa-solid fa-map-location-dot me-1"></i>Bản đồ:
                                        </p>
                                        <iframe
                                            src={generateMapIframe(data.addressBusiness)}
                                            className="w-100 rounded-3"
                                            height="200"
                                            style={{ border: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                                            loading="lazy"
                                            title="map"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Share */}
                        <div className="card border-0 shadow-sm rounded-3">
                            <div className="card-header border-0 rounded-top-3 py-3 px-4"
                                style={{ background: "#1b5e20" }}>
                                <h6 className="fw-bold text-white mb-0">
                                    <i className="fa-solid fa-share-nodes me-2"></i>
                                    Chia sẻ công ty
                                </h6>
                            </div>
                            <div className="card-body px-4 py-4">
                                <p className="small fw-semibold mb-2" style={{ color: "#2e7d32" }}>
                                    Sao chép đường dẫn:
                                </p>
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control form-control-sm"
                                        value={data?.websiteBusiness || ""}
                                        readOnly
                                        style={{ borderColor: "#c8e6c9", fontSize: "0.8rem", background: "#f9fbe7" }} />
                                    <button className="btn btn-success btn-sm px-3"
                                        onClick={() => {
                                            navigator.clipboard.writeText(data?.websiteBusiness);
                                            toast.success("Đã sao chép link website!");
                                        }}>
                                        <i className="fa-solid fa-copy"></i>
                                    </button>
                                </div>

                                <p className="small fw-semibold mb-2" style={{ color: "#2e7d32" }}>
                                    Chia sẻ qua mạng xã hội:
                                </p>
                                <div className="d-flex gap-2">
                                    {[
                                        { icon: "fa-facebook-f", color: "#1877f2" },
                                        { icon: "fa-twitter", color: "#1da1f2" },
                                        { icon: "fa-linkedin-in", color: "#0a66c2" },
                                        { icon: "fa-tiktok", color: "#010101" },
                                    ].map((s) => (
                                        <button key={s.icon}
                                            className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle"
                                            style={{ width: "36px", height: "36px", background: s.color, color: "#fff", border: "none" }}>
                                            <i className={`fa-brands ${s.icon}`} style={{ fontSize: "0.85rem" }}></i>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailBusiness;
