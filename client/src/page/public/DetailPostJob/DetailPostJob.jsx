import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailPostjobs, getAllPostjobs, uploadCVPostjobs } from "../../../api/job";
import { createWishListJob, checkWishlistJob } from "../../../api/user";
import Loading from "../../../component/loading/Loading";
import { Link } from "react-router-dom";
import path from "../../../ultils/path";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const DetailPostJob = () => {
    const { idp } = useParams();
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [listsuggest, setListsuggest] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [fileCV, setFileCV] = useState(null);
    const isLogIn = useSelector((state) => state.user.isLogIn);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getDetailPostjobs(idp);
                if (res.success) setDetail(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDetail();
    }, [idp]);

    useEffect(() => {
        if (!detail?.jobs) return;
        const fetchSuggest = async () => {
            try {
                const res = await getAllPostjobs({
                    flatten: true,
                    populate: "salaryRange:salaryRange,min,max",
                    limit: 7,
                    jobs: detail.jobs,
                });
                setListsuggest(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchSuggest();
    }, [detail?.jobs]);

    const showModal = () => {
        const modal = document.getElementById("uploadCV");
        if (!modal) return;
        modal.classList.add("show", "d-block");
        modal.style.backgroundColor = "rgba(0,0,0,0.5)";
    };

    const hideModal = () => {
        const modal = document.getElementById("uploadCV");
        if (!modal) return;
        modal.classList.remove("show", "d-block");
        modal.style.backgroundColor = "transparent";
    };

    const hanleCheckLike = () => {
        if (!isLogIn) {
            const currentPath = window.location.pathname + window.location.search;
            localStorage.setItem("redirectAfterLogin", currentPath);
            Swal.fire({
                icon: "warning",
                title: "Bạn chưa đăng nhập",
                text: "Vui lòng đăng nhập lại để tiếp tục",
                confirmButtonText: "OK",
                showCancelButton: true,
                cancelButtonText: "Huỷ",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then((result) => {
                if (result.isConfirmed) window.location.replace("/login");
            });
            return;
        } else {
            showModal();
        }
    };

    const hanleCheckLikeLT = () => {
        if (!isLogIn) {
            const currentPath = window.location.pathname + window.location.search;
            localStorage.setItem("redirectAfterLogin", currentPath);
            Swal.fire({
                icon: "warning",
                title: "Bạn chưa đăng nhập",
                text: "Vui lòng đăng nhập lại để tiếp tục",
                confirmButtonText: "OK",
                showCancelButton: true,
                cancelButtonText: "Huỷ",
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then((result) => {
                if (result.isConfirmed) window.location.replace("/login");
            });
            return;
        } else {
            hanleCreateWishlistJob();
        }
    };

    const handleChangeFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== "application/pdf") {
            toast.error("Chỉ chấp nhận file PDF!");
            return;
        }
        setFileCV(file);
    };

    const handleUploadCV = async () => {
        if (!fileCV) { toast.error("Vui lòng chọn file PDF trước!"); return; }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("fileCV", fileCV);
            const res = await uploadCVPostjobs(idp, formData);
            if (res.success) { toast.success("Nộp CV thành công!"); hideModal(); }
            else toast.error("Nộp CV thất bại!");
        } catch (error) { }
        finally { setLoading(false); }
    };

    const getDaysRemaining = (date) => {
        if (!date) return "Không có hạn";
        const diff = Math.ceil((new Date(date) - new Date()) / 86400000);
        return diff <= 0 ? "Đã hết hạn" : `${diff} ngày`;
    };

    const checkLike = async () => {
        try {
            const res = await checkWishlistJob(idp);
            setIsLiked(res.isLiked);
        } catch (err) { console.log(err); }
    };

    const hanleCreateWishlistJob = async () => {
        try {
            const repo = await createWishListJob(idp);
            if (repo.success) { toast.success(repo.message); checkLike(); }
        } catch (err) { }
    };

    if (isLogIn) checkLike();
    if (!detail)
        return <div className="text-center text-danger py-5">Không tìm thấy bài đăng!</div>;

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

    return (
        <div style={{ background: "#f8fffe", minHeight: "100vh" }}>
            {loading && <Loading />}

            {/* ── UPLOAD CV MODAL ── */}
            <div className="modal fade" id="uploadCV" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered mx-3 mx-sm-auto">
                    <div className="modal-content border-0 shadow rounded-3">
                        <div
                            className="modal-header border-0 pb-0"
                            style={{ background: "#1b5e20", borderRadius: "0.75rem 0.75rem 0 0" }}
                        >
                            <h5 className="modal-title text-white fw-bold" style={{ fontSize: "clamp(0.95rem, 3vw, 1.1rem)" }}>
                                <i className="fa-solid fa-file-arrow-up me-2"></i>
                                Nộp CV ứng tuyển
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={hideModal}></button>
                        </div>
                        <div className="modal-body px-3 px-md-4 py-4">
                            <label className="form-label fw-semibold mb-2" style={{ color: "#2e7d32" }}>
                                Chọn file CV (PDF):
                            </label>
                            <div
                                className="border-2 border-dashed rounded-3 p-3 p-md-4 text-center"
                                style={{ borderColor: "#c8e6c9", background: "#f1f8e9", cursor: "pointer" }}
                                onClick={() => document.getElementById("cvFileInput").click()}
                            >
                                <i className="fa-solid fa-cloud-arrow-up fs-2 mb-2 d-block" style={{ color: "#4caf50" }}></i>
                                {fileCV ? (
                                    <p className="mb-0 fw-semibold small" style={{ color: "#2e7d32" }}>
                                        <i className="fa-solid fa-file-pdf me-1 text-danger"></i>
                                        {fileCV.name}
                                    </p>
                                ) : (
                                    <p className="mb-0 text-muted small">Nhấn để chọn file PDF</p>
                                )}
                            </div>
                            <input
                                id="cvFileInput"
                                type="file"
                                accept="application/pdf"
                                className="d-none"
                                onChange={handleChangeFile}
                            />
                        </div>
                        <div className="modal-footer border-0 px-3 px-md-4 pb-4 pt-0 gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary rounded-pill px-4"
                                onClick={hideModal}
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                onClick={handleUploadCV}
                                className="btn btn-success rounded-pill px-4 fw-semibold"
                            >
                                <i className="fa-solid fa-paper-plane me-1"></i> Nộp CV
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── HERO BANNER ── */}
            <div
                className="py-4 py-md-5"
                style={{
                    background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)",
                }}
            >
                <div className="container">
                    <div className="row align-items-start align-items-md-center g-3">
                        {/* Logo — hide on xs */}
                        <div className="col-auto d-none d-md-block">
                            <div
                                className="rounded-3 overflow-hidden border border-white border-opacity-25"
                                style={{ width: "80px", height: "80px" }}
                            >
                                <img
                                    src={detail.business?.imageAvatarBusiness}
                                    alt="logo"
                                    className="w-100 h-100"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="col-12 col-md">
                            {/* Mobile: small logo + company inline */}
                            <div className="d-flex align-items-center gap-2 mb-1 d-md-none">
                                <img
                                    src={detail.business?.imageAvatarBusiness}
                                    alt="logo"
                                    className="rounded-2"
                                    style={{ width: "32px", height: "32px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.3)" }}
                                />
                                <p className="mb-0 small" style={{ color: "#a5d6a7" }}>
                                    {detail.business?.nameBusiness}
                                </p>
                            </div>
                            <p className="mb-1 small d-none d-md-block" style={{ color: "#a5d6a7" }}>
                                {detail.business?.nameBusiness}
                            </p>
                            <h2
                                className="fw-bold text-white mb-3"
                                style={{ fontSize: "clamp(1.1rem, 4vw, 1.75rem)" }}
                            >
                                {detail.title}
                            </h2>
                            <div className="d-flex flex-wrap gap-2">
                                {[
                                    { icon: "fa-money-bill-wave", text: detail.salaryRange?.salaryRange || "Thoả thuận" },
                                    { icon: "fa-location-dot", text: detail.location },
                                    { icon: "fa-briefcase", text: detail.experience },
                                ].map((item, i) => (
                                    <span
                                        key={i}
                                        className="d-flex align-items-center gap-2 rounded-pill px-3 py-1"
                                        style={{
                                            background: "rgba(255,255,255,0.15)",
                                            color: "#fff",
                                            fontSize: "clamp(0.75rem, 2vw, 0.88rem)",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        <i className={`fa-solid ${item.icon}`} style={{ color: "#69f0ae" }}></i>
                                        {item.text}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* CTA buttons */}
                        <div className="col-12 col-md-auto mt-3 mt-md-0">
                            <div className="d-flex flex-row flex-md-column gap-2 align-items-center align-items-md-stretch">
                                <button
                                    onClick={hanleCheckLike}
                                    className="btn btn-light fw-bold rounded-pill flex-fill flex-md-grow-0"
                                    style={{ color: "#1b5e20", fontSize: "clamp(0.82rem, 2vw, 0.95rem)", minWidth: "0", padding: "8px 16px" }}
                                >
                                    <i className="fa-solid fa-paper-plane me-1 me-md-2"></i>
                                    <span>Ứng tuyển ngay</span>
                                </button>
                                <button
                                    onClick={hanleCheckLikeLT}
                                    className="btn fw-semibold rounded-pill flex-fill flex-md-grow-0"
                                    style={{
                                        background: "rgba(255,255,255,0.15)",
                                        color: "#fff",
                                        border: "1px solid rgba(255,255,255,0.3)",
                                        fontSize: "clamp(0.82rem, 2vw, 0.95rem)",
                                        padding: "8px 16px",
                                    }}
                                >
                                    {isLiked ? (
                                        <><i className="fa-solid fa-heart text-danger me-1"></i>Đã lưu</>
                                    ) : (
                                        <><i className="fa-regular fa-heart me-1"></i>Lưu tin</>
                                    )}
                                </button>
                            </div>
                            <p className="text-center mb-0 mt-2 small" style={{ color: "#a5d6a7", fontSize: "0.8rem" }}>
                                <i className="fa-regular fa-clock me-1"></i>
                                Hạn nộp: {formatDate(detail.deadline)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="container py-3 py-md-4">
                <div className="row g-3 g-md-4">

                    {/* LEFT: main detail */}
                    <div className="col-12 col-lg-8">

                        {/* Job detail card */}
                        <div className="card border-0 shadow-sm rounded-3 mb-3 mb-md-4">
                            <div className="card-body px-3 px-md-4 py-3 py-md-4">
                                <h5
                                    className="fw-bold mb-3 mb-md-4 pb-2 border-bottom"
                                    style={{ color: "#1b5e20", fontSize: "clamp(1rem, 3vw, 1.2rem)" }}
                                >
                                    <i className="fa-solid fa-file-lines me-2" style={{ color: "#4caf50" }}></i>
                                    Chi tiết tin tuyển dụng
                                </h5>

                                {/* Skills */}
                                {detail.skills?.length > 0 && (
                                    <div className="mb-4">
                                        <p className="fw-semibold mb-2 small" style={{ color: "#2e7d32" }}>
                                            <i className="fa-solid fa-tags me-1"></i> Kỹ năng yêu cầu:
                                        </p>
                                        <div className="d-flex gap-2 flex-wrap">
                                            {detail.skills.map((s, i) => (
                                                <span
                                                    key={i}
                                                    className="badge rounded-pill px-3 py-2"
                                                    style={{
                                                        background: "#e8f5e9",
                                                        color: "#2e7d32",
                                                        fontSize: "0.8rem",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                <div
                                    className="job-description"
                                    dangerouslySetInnerHTML={{ __html: detail.description }}
                                />

                                {/* Deadline + CTA */}
                                <div
                                    className="rounded-3 p-3 mt-4 d-flex align-items-center justify-content-between flex-wrap gap-3"
                                    style={{ background: "#f1f8e9", border: "1px solid #c8e6c9" }}
                                >
                                    <p className="mb-0 fw-semibold small" style={{ color: "#2e7d32" }}>
                                        <i className="fa-regular fa-calendar me-2"></i>
                                        Hạn nộp:{" "}
                                        <span className="text-danger">{formatDate(detail.deadline)}</span>
                                    </p>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <button
                                            onClick={hanleCheckLike}
                                            className="btn btn-success rounded-pill px-3 px-md-4 fw-semibold btn-sm"
                                        >
                                            <i className="fa-solid fa-paper-plane me-1"></i> Ứng tuyển ngay
                                        </button>
                                        <button
                                            onClick={hanleCheckLikeLT}
                                            className="btn btn-outline-success rounded-pill px-3 px-md-4 fw-semibold btn-sm"
                                        >
                                            {isLiked ? (
                                                <><i className="fa-solid fa-heart text-danger me-1"></i>Đã lưu</>
                                            ) : (
                                                <><i className="fa-regular fa-heart me-1"></i>Lưu tin</>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Warning */}
                                <div
                                    className="alert border-0 rounded-3 mt-3 d-flex gap-2 align-items-start"
                                    style={{ background: "#fff3e0", color: "#e65100" }}
                                >
                                    <i className="fa-solid fa-circle-exclamation mt-1 flex-shrink-0"></i>
                                    <span className="small">
                                        <strong>Báo cáo tin tuyển dụng:</strong> Nếu bạn thấy tin này không đúng
                                        hoặc có dấu hiệu lừa đảo, hãy phản ánh với chúng tôi.
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Suggested jobs */}
                        <div className="card border-0 shadow-sm rounded-3 mb-3 mb-md-4">
                            <div className="card-body px-3 px-md-4 py-3 py-md-4">
                                <h5
                                    className="fw-bold mb-3 mb-md-4 pb-2 border-bottom"
                                    style={{ color: "#1b5e20", fontSize: "clamp(1rem, 3vw, 1.2rem)" }}
                                >
                                    <i className="fa-solid fa-lightbulb me-2" style={{ color: "#4caf50" }}></i>
                                    Gợi ý việc làm tương tự
                                </h5>

                                {listsuggest.length === 0 ? (
                                    <p className="text-muted fst-italic small">
                                        Không tìm thấy công việc tương tự.
                                    </p>
                                ) : (
                                    listsuggest.map((job) => {
                                        const isExpired = getDaysRemaining(job.deadline) === "Đã hết hạn";
                                        return (
                                            <div
                                                key={job._id}
                                                className="rounded-3 border p-2 p-md-3 mb-3"
                                                style={{
                                                    transition: "box-shadow 0.2s",
                                                    opacity: isExpired ? 0.6 : 1,
                                                }}
                                                onMouseEnter={(e) =>
                                                    !isExpired &&
                                                    (e.currentTarget.style.boxShadow =
                                                        "0 4px 16px rgba(76,175,80,0.12)")
                                                }
                                                onMouseLeave={(e) =>
                                                    (e.currentTarget.style.boxShadow = "")
                                                }
                                            >
                                                <div className="row align-items-start align-items-md-center g-2 g-md-3">
                                                    <div className="col-auto">
                                                        <div
                                                            className="rounded-2 border overflow-hidden"
                                                            style={{ width: "48px", height: "48px" }}
                                                        >
                                                            <img
                                                                src={job.imageCover}
                                                                alt={job.title}
                                                                className="w-100 h-100"
                                                                style={{ objectFit: "cover" }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        {isExpired ? (
                                                            <p className="fw-semibold mb-1 text-muted small">
                                                                {job.title}
                                                            </p>
                                                        ) : (
                                                            <Link
                                                                to={`${path.JOB}/${job._id}`}
                                                                className="text-decoration-none"
                                                            >
                                                                <p
                                                                    className="fw-semibold mb-1 small"
                                                                    style={{ color: "#1b5e20" }}
                                                                >
                                                                    {job.title}
                                                                </p>
                                                            </Link>
                                                        )}
                                                        <div className="d-flex flex-wrap gap-2">
                                                            <span className="text-muted small">
                                                                <i
                                                                    className="fa-solid fa-building me-1"
                                                                    style={{ color: "#4caf50" }}
                                                                ></i>
                                                                {job.joblevel}
                                                            </span>
                                                            <span className="text-muted small">
                                                                <i
                                                                    className="fa-solid fa-location-dot me-1"
                                                                    style={{ color: "#4caf50" }}
                                                                ></i>
                                                                {job.location}
                                                            </span>
                                                            <span
                                                                className="fw-semibold small"
                                                                style={{ color: "#2e7d32" }}
                                                            >
                                                                <i className="fa-solid fa-money-bill-wave me-1"></i>
                                                                {job.salaryRange_salaryRange}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-auto d-flex flex-row flex-sm-column align-items-center align-items-sm-end justify-content-between gap-1 mt-1 mt-sm-0">
                                                        <span
                                                            className="badge rounded-pill"
                                                            style={{
                                                                background: "#e8f5e9",
                                                                color: "#2e7d32",
                                                                fontSize: "0.7rem",
                                                            }}
                                                        >
                                                            {job.workType}
                                                        </span>
                                                        <span
                                                            className={`small fw-semibold ${isExpired ? "text-muted" : "text-danger"}`}
                                                            style={{ whiteSpace: "nowrap" }}
                                                        >
                                                            <i className="fa-regular fa-clock me-1"></i>
                                                            {getDaysRemaining(job.deadline)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: sidebar */}
                    <div className="col-12 col-lg-4">

                        {/* Business info */}
                        <div className="card border-0 shadow-sm rounded-3 mb-3 mb-md-4">
                            <div
                                className="card-header border-0 rounded-top-3 py-3 px-3 px-md-4"
                                style={{ background: "#1b5e20" }}
                            >
                                <h6 className="fw-bold text-white mb-0" style={{ fontSize: "clamp(0.88rem, 2.5vw, 1rem)" }}>
                                    <i className="fa-solid fa-building me-2"></i>
                                    Thông tin doanh nghiệp
                                </h6>
                            </div>
                            <div className="card-body px-3 px-md-4 py-3 py-md-4">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <img
                                        src={detail.business?.imageAvatarBusiness}
                                        alt="logo"
                                        className="rounded-2 flex-shrink-0"
                                        style={{ width: "56px", height: "56px", objectFit: "cover" }}
                                    />
                                    <div>
                                        <h6
                                            className="fw-bold mb-0"
                                            style={{ color: "#1b5e20", fontSize: "clamp(0.85rem, 2.5vw, 1rem)" }}
                                        >
                                            {detail.business?.nameBusiness}
                                        </h6>
                                        <p className="text-muted small mb-0">
                                            <i
                                                className="fa-solid fa-location-dot me-1"
                                                style={{ color: "#4caf50" }}
                                            ></i>
                                            {detail.business?.addressBusiness}
                                        </p>
                                    </div>
                                </div>
                                <hr style={{ borderColor: "#e8f5e9" }} />
                                {[
                                    { icon: "fa-users", label: "Quy mô", value: detail.business?.numberOfEmployees },
                                    { icon: "fa-layer-group", label: "Lĩnh vực", value: detail.business?.FieldBusiness },
                                ].map((row, i) => (
                                    <div key={i} className="d-flex align-items-center gap-2 mb-2">
                                        <i
                                            className={`fa-solid ${row.icon} fa-sm`}
                                            style={{ color: "#4caf50", width: "16px" }}
                                        ></i>
                                        <span className="small text-muted">{row.label}:</span>
                                        <span className="small fw-semibold">{row.value}</span>
                                    </div>
                                ))}
                                {detail.business?.websiteBusiness && (
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <i
                                            className="fa-solid fa-globe fa-sm"
                                            style={{ color: "#4caf50", width: "16px" }}
                                        ></i>
                                        <a
                                            href={detail.business.websiteBusiness}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="small text-success text-truncate"
                                            style={{ maxWidth: "200px" }}
                                        >
                                            {detail.business.websiteBusiness}
                                        </a>
                                    </div>
                                )}
                                <Link
                                    to={`${path.COMPANY}/${detail.business?._id}`}
                                    className="btn btn-outline-success w-100 rounded-pill fw-semibold btn-sm"
                                >
                                    Xem trang công ty
                                    <i className="fa-solid fa-arrow-right ms-1"></i>
                                </Link>
                            </div>
                        </div>

                        {/* General info */}
                        <div className="card border-0 shadow-sm rounded-3 mb-3 mb-md-4">
                            <div
                                className="card-header border-0 rounded-top-3 py-3 px-3 px-md-4"
                                style={{ background: "#1b5e20" }}
                            >
                                <h6 className="fw-bold text-white mb-0" style={{ fontSize: "clamp(0.88rem, 2.5vw, 1rem)" }}>
                                    <i className="fa-solid fa-circle-info me-2"></i>
                                    Thông tin chung
                                </h6>
                            </div>
                            <div className="card-body px-3 px-md-4 py-3">
                                {[
                                    { icon: "fa-layer-group", label: "Cấp bậc", value: detail?.joblevel },
                                    { icon: "fa-briefcase", label: "Nhóm công việc", value: detail?.jobs },
                                    { icon: "fa-users", label: "Số lượng tuyển", value: detail?.quantity },
                                    { icon: "fa-laptop-house", label: "Hình thức", value: detail?.workType },
                                ].map((row, i) => (
                                    <div
                                        key={i}
                                        className={`d-flex align-items-center gap-3 py-2 ${i < 3 ? "border-bottom" : ""}`}
                                        style={{ borderColor: "#f1f8e9" }}
                                    >
                                        <div
                                            className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                                            style={{ width: "32px", height: "32px", background: "#e8f5e9" }}
                                        >
                                            <i
                                                className={`fa-solid ${row.icon} fa-sm`}
                                                style={{ color: "#2e7d32" }}
                                            ></i>
                                        </div>
                                        <div>
                                            <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>
                                                {row.label}
                                            </p>
                                            <p className="mb-0 fw-semibold small">{row.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Safety tips */}
                        <div className="card border-0 shadow-sm rounded-3">
                            <div
                                className="card-header border-0 rounded-top-3 py-3 px-3 px-md-4"
                                style={{ background: "#e65100" }}
                            >
                                <h6 className="fw-bold text-white mb-0" style={{ fontSize: "clamp(0.88rem, 2.5vw, 1rem)" }}>
                                    <i className="fa-solid fa-shield-halved me-2"></i>
                                    Bí kíp tìm việc an toàn
                                </h6>
                            </div>
                            <div className="card-body px-3 px-md-4 py-3 py-md-4">
                                <p className="small text-muted mb-3">
                                    Dấu hiệu của tổ chức, cá nhân tuyển dụng không minh bạch:
                                </p>
                                <p className="small fw-semibold mb-2" style={{ color: "#e65100" }}>
                                    1. Dấu hiệu phổ biến:
                                </p>
                                <div className="d-flex flex-column gap-2 mb-3">
                                    {[
                                        "Mô tả công việc sơ sài",
                                        'Hứa hẹn "việc nhẹ lương cao"',
                                        "Yêu cầu tải app / nạp tiền",
                                        "Yêu cầu nộp phí phỏng vấn",
                                        "Yêu cầu nộp giấy tờ gốc",
                                        "Địa điểm phỏng vấn bất thường",
                                    ].map((t, i) => (
                                        <div key={i} className="d-flex align-items-center gap-2">
                                            <i
                                                className="fa-solid fa-triangle-exclamation fa-xs"
                                                style={{ color: "#e65100" }}
                                            ></i>
                                            <span className="small text-muted">{t}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="small fw-semibold mb-2" style={{ color: "#e65100" }}>
                                    2. Cần làm gì:
                                </p>
                                <div className="d-flex flex-column gap-2 mb-3">
                                    {[
                                        "Kiểm tra thông tin công ty trước khi ứng tuyển.",
                                        "Báo cáo tin tuyển dụng khi thấy đáng ngờ.",
                                    ].map((t, i) => (
                                        <div key={i} className="d-flex align-items-center gap-2">
                                            <i
                                                className="fa-solid fa-check fa-xs"
                                                style={{ color: "#4caf50" }}
                                            ></i>
                                            <span className="small text-muted">{t}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="rounded-2 p-3 small" style={{ background: "#fbe9e7" }}>
                                    <p className="mb-1 fw-semibold" style={{ color: "#e65100" }}>
                                        Bộ phận hỗ trợ ứng viên:
                                    </p>
                                    <p className="mb-1">
                                        <i className="fa-solid fa-envelope me-1"></i> hotro@topcv.vn
                                    </p>
                                    <p className="mb-0">
                                        <i className="fa-solid fa-phone me-1"></i> (024) 6680 5588
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom SEO card */}
                <div className="card border-0 shadow-sm rounded-3 mt-3 mt-md-4">
                    <div className="card-body px-3 px-md-4 py-3 py-md-4">
                        <p className="lh-lg text-muted small mb-3">
                            <strong className="text-dark">
                                Cơ hội ứng tuyển việc làm với đãi ngộ hấp dẫn tại các công ty hàng đầu
                            </strong>
                            <br />
                            Trước sự phát triển mạnh mẽ của nền kinh tế, nhiều ngành nghề đang rơi vào tình
                            trạng khan hiếm nhân lực, đặc biệt là nguồn nhân lực chất lượng cao. Vì vậy, các
                            trường Đại học đã chủ động liên kết với doanh nghiệp nhằm tạo điều kiện cho sinh
                            viên được học tập, rèn luyện và tiếp cận môi trường làm việc thực tế.
                        </p>
                        <p className="fw-semibold mb-2" style={{ color: "#1b5e20" }}>
                            Vì sao nên tìm việc làm tại TopCV?
                        </p>
                        {[
                            {
                                title: "1. Việc làm chất lượng",
                                points: [
                                    "Hàng nghìn tin tuyển dụng uy tín được cập nhật liên tục.",
                                    "Hệ thống thông minh gợi ý công việc phù hợp dựa trên CV của bạn.",
                                ],
                            },
                            {
                                title: "2. Công cụ viết CV đẹp – Miễn phí",
                                points: [
                                    "Nhiều mẫu CV chuyên nghiệp phù hợp mọi vị trí.",
                                    "Giao diện trực quan, dễ chỉnh sửa, tạo CV chỉ trong 5 phút.",
                                ],
                            },
                            {
                                title: "3. Hỗ trợ người tìm việc",
                                points: [
                                    "Nhà tuyển dụng chủ động liên hệ qua hệ thống kết nối ứng viên.",
                                    "Báo cáo chi tiết về việc xem CV và lời mời phỏng vấn.",
                                ],
                            },
                        ].map((sec, i) => (
                            <div key={i} className="mb-3">
                                <p className="fw-semibold mb-1 small" style={{ color: "#2e7d32" }}>
                                    {sec.title}
                                </p>
                                {sec.points.map((p, j) => (
                                    <p key={j} className="text-muted small mb-1 lh-lg">
                                        <i
                                            className="fa-solid fa-check me-2"
                                            style={{ color: "#4caf50" }}
                                        ></i>
                                        {p}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailPostJob;
