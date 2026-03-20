import { Link } from "react-router-dom";
import banner from "../../../assets/banner1.jpg";
import banner2 from "../../../assets/banner2.png";
import banner3 from "../../../assets/banner3.jpg";
import path from "../../../ultils/path";
import { getAllPostjobs } from "../../../api/job";
import { useState, useEffect } from "react";

const Home = () => {
    const [jobnew, setJobnew] = useState([]);
    const [jobpri, setJobpri] = useState([]);

    const fetchJobNew = async () => {
        try {
            const res = await getAllPostjobs({
                limit: 5,
                flatten: true,
                populate: "salaryRange:salaryRange,min,max",
                sort: "-createdAt",
                status: "active",
                statusPause: false,
            });
            setJobnew(res.data || []);
        } catch (error) {
            console.log("Lỗi load job:", error);
        }
    };

    const fetchJobpri = async () => {
        try {
            const res = await getAllPostjobs({
                limit: 5,
                flatten: true,
                populate: "salaryRange:salaryRange,min,max",
                sort: "-postPackage -numberUpload -view",
                "deadline[gte]": new Date().toISOString(),
                status: "active",
                statusPause: false,
            });
            setJobpri(res.data || []);
        } catch (error) {
            console.log("Lỗi load job:", error);
        }
    };

    useEffect(() => {
        fetchJobNew();
        fetchJobpri();
    }, []);

    const getDaysRemaining = (deadline) => {
        const end = new Date(deadline).getTime();
        const now = Date.now();
        const distance = end - now;
        if (distance <= 0) return "Đã hết hạn";
        const days = Math.ceil(distance / (1000 * 60 * 60 * 24));
        return `Còn ${days} ngày`;
    };

    const categories = [
        {
            icon: "fa-laptop-code",
            title: "Ngành IT",
            desc: "Phát triển phần mềm, an ninh mạng, DevOps...",
            count: "1.200+ việc làm",
        },
        {
            icon: "fa-bullhorn",
            title: "Marketing",
            desc: "Quảng cáo, truyền thông, digital marketing",
            count: "850+ việc làm",
        },
        {
            icon: "fa-coins",
            title: "Tài chính",
            desc: "Kế toán, ngân hàng, phân tích tài chính",
            count: "640+ việc làm",
        },
        {
            icon: "fa-industry",
            title: "Sản xuất",
            desc: "Quản lý sản xuất, vận hành nhà máy, thực thi, triển khai, vận hành",
            count: "430+ việc làm",
        },
    ];

    const JobCard = ({ job }) => (
        <div className="card border-0 shadow-sm mb-3 rounded-3" style={{ transition: "box-shadow 0.2s" }}
            onMouseEnter={e => e.currentTarget.classList.add("shadow")}
            onMouseLeave={e => e.currentTarget.classList.remove("shadow")}
        >
            <div className="card-body px-4 py-3">
                <div className="row align-items-center g-3">
                    {/* Logo */}
                    <div className="col-auto">
                        <div className="rounded-3 border overflow-hidden"
                            style={{ width: "72px", height: "72px", flexShrink: 0 }}>
                            <img
                                src={job.imageCover}
                                alt={job.title}
                                className="w-100 h-100"
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="col">
                        <Link to={`${path.JOB}/${job._id}`} className="text-decoration-none">
                            <h6 className="fw-bold text-dark mb-1 lh-sm"
                                style={{ fontSize: "0.95rem" }}>
                                {job.title}
                            </h6>
                        </Link>
                        <div className="d-flex flex-wrap gap-3 mt-1">
                            <span className="text-muted small">
                                <i className="fa-solid fa-building me-1 text-success"></i>
                                {job.joblevel}
                            </span>
                            <span className="text-muted small">
                                <i className="fa-solid fa-location-dot me-1 text-success"></i>
                                {job.location}
                            </span>
                            <span className="text-success fw-semibold small">
                                <i className="fa-solid fa-money-bill-wave me-1"></i>
                                {job.salaryRange_salaryRange}
                            </span>
                        </div>
                    </div>

                    {/* Right badges */}
                    <div className="col-auto text-end d-flex flex-column align-items-end gap-2">
                        <span className="badge rounded-pill px-3 py-2"
                            style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: "0.75rem" }}>
                            {job.workType}
                        </span>
                        <span className="text-danger small fw-semibold">
                            <i className="fa-regular fa-clock me-1"></i>
                            {getDaysRemaining(job.deadline)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="home">

            {/* ── HERO CAROUSEL ── */}
            <div className="position-relative">
                <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        {[0, 1, 2].map(i => (
                            <button key={i} type="button" data-bs-target="#homeCarousel"
                                data-bs-slide-to={i} className={i === 0 ? "active" : ""}
                                style={{ width: "10px", height: "10px", borderRadius: "50%" }} />
                        ))}
                    </div>
                    <div className="carousel-inner rounded-0">
                        {[banner3, banner2, banner].map((src, i) => (
                            <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                                <img src={src} className="d-block w-100"
                                    style={{ height: "480px", objectFit: "cover", filter: "brightness(0.55)" }}
                                    alt={`banner ${i + 1}`} />
                            </div>
                        ))}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" />
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" />
                    </button>
                </div>

                <div className="position-absolute top-50 start-50 translate-middle text-center text-white w-100 px-3">
                    <span className="badge rounded-pill mb-3 px-3 py-2"
                        style={{ background: "rgba(76,175,80,0.85)", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                        <i class="fa-solid fa-rocket"></i> HỢN 10.000 CƠ HỘI ĐANG CHỜ BẠN
                    </span>
                    <h1 className="fw-bold display-4 mb-3" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
                        Tìm việc làm <span style={{ color: "#69f0ae" }}>mơ ước</span>
                    </h1>
                    <p className="fs-5 mb-4 opacity-90">
                        Kết nối hàng nghìn nhà tuyển dụng với ứng viên tài năng
                    </p>
                    <Link to={path.JOB}
                        className="btn btn-success btn-lg rounded-pill px-5 py-3 shadow fw-semibold"
                        style={{ fontSize: "1rem" }}>
                        <i className="fa-solid fa-magnifying-glass me-2"></i>
                        Tìm việc ngay
                    </Link>
                </div>
            </div>

            <div style={{ background: "#1b5e20" }}>
                <div className="container py-3">
                    <div className="row text-white text-center g-0">
                        {[
                            { num: "10.000+", label: "Việc làm" },
                            { num: "5.000+", label: "Công ty" },
                            { num: "500.000+", label: "Ứng viên" },
                            { num: "95%", label: "Tỷ lệ thành công" },
                        ].map((s, i) => (
                            <div key={i} className="col-6 col-md-3 py-2">
                                <div className="fw-bold fs-5">{s.num}</div>
                                <div className="small opacity-75">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="py-6" style={{ background: "#f8fffe", paddingTop: "4rem", paddingBottom: "4rem" }}>
                <div className="container text-center">
                    <p className="text-success fw-semibold small text-uppercase letter-spacing mb-1">
                        Lĩnh vực nổi bật
                    </p>
                    <h2 className="fw-bold mb-2" style={{ color: "#1b5e20" }}>Danh mục ngành nghề</h2>
                    <p className="text-muted mb-5">Khám phá hàng nghìn cơ hội việc làm trong mọi lĩnh vực</p>

                    <div className="row g-4">
                        {categories.map((cat, i) => (
                            <div key={i} className="col-6 col-md-3">
                                <div className="card border-0 h-100 rounded-4 text-center"
                                    style={{ cursor: "pointer", transition: "all 0.25s", background: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = "translateY(-6px)";
                                        e.currentTarget.style.boxShadow = "0 8px 30px rgba(76,175,80,0.2)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.07)";
                                    }}>
                                    <div className="card-body py-4 px-3">
                                        <div className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                                            style={{ width: "64px", height: "64px", background: "#e8f5e9" }}>
                                            <i className={`fa-solid ${cat.icon} fs-4`} style={{ color: "#2e7d32" }}></i>
                                        </div>
                                        <h6 className="fw-bold mb-1" style={{ color: "#1b5e20" }}>{cat.title}</h6>
                                        <p className="text-muted small mb-2">{cat.desc}</p>
                                        <span className="badge rounded-pill"
                                            style={{ background: "#e8f5e9", color: "#388e3c", fontSize: "0.7rem" }}>
                                            {cat.count}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="position-relative" style={{ height: "360px", overflow: "hidden" }}>
                <img
                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/company_covers/yb1I4bHCyIFi2WrPAdyN.jpg"
                    className="w-100 h-100"
                    style={{ objectFit: "cover", filter: "brightness(0.4)" }}
                    alt="Top companies"
                />
                <div className="position-absolute top-50 start-50 translate-middle text-center text-white w-100 px-3">
                    <p className="text-uppercase fw-semibold small mb-2 opacity-75"
                        style={{ letterSpacing: "0.15em" }}>
                        Đối tác tuyển dụng
                    </p>
                    <h2 className="fw-bold display-6 mb-2">Top công ty tuyển dụng</h2>
                    <p className="mb-4 opacity-75 fs-5">
                        Cơ hội làm việc tại các doanh nghiệp hàng đầu Việt Nam & Quốc tế
                    </p>
                    <Link to={path.COMPANY}
                        className="btn btn-outline-light rounded-pill px-5 py-2 fw-semibold me-3">
                        Xem công ty
                    </Link>
                    <Link to={path.JOB}
                        className="btn btn-success rounded-pill px-5 py-2 fw-semibold">
                        Xem tất cả việc làm
                    </Link>
                </div>
            </div>

            <div style={{ background: "#fff", paddingTop: "4rem", paddingBottom: "4rem" }}>
                <div className="container">
                    <div className="d-flex align-items-end justify-content-between mb-4">
                        <div>
                            <p className="text-success fw-semibold small text-uppercase mb-1">Cập nhật hôm nay</p>
                            <h2 className="fw-bold mb-0" style={{ color: "#1b5e20" }}>Việc làm mới nhất</h2>
                        </div>
                        <Link to={path.JOB} className="btn btn-outline-success rounded-pill px-4 small fw-semibold">
                            Xem tất cả <i className="fa-solid fa-arrow-right ms-1"></i>
                        </Link>
                    </div>

                    {jobnew.length > 0 ? (
                        jobnew.map(job => <JobCard key={job._id} job={job} />)
                    ) : (
                        <div className="text-center text-muted py-5">
                            <i className="fa-solid fa-briefcase fs-1 opacity-25 mb-3 d-block"></i>
                            Đang tải việc làm...
                        </div>
                    )}
                </div>
            </div>

            <div style={{ background: "#f8fffe", paddingTop: "4rem", paddingBottom: "4rem" }}>
                <div className="container">
                    <div className="d-flex align-items-end justify-content-between mb-4">
                        <div>
                            <p className="text-success fw-semibold small text-uppercase mb-1">Được đề xuất</p>
                            <h2 className="fw-bold mb-0" style={{ color: "#1b5e20" }}>Việc làm nổi bật</h2>
                        </div>
                        <Link to={path.JOB} className="btn btn-outline-success rounded-pill px-4 small fw-semibold">
                            Xem tất cả <i className="fa-solid fa-arrow-right ms-1"></i>
                        </Link>
                    </div>

                    {jobpri.length > 0 ? (
                        jobpri.map(job => <JobCard key={job._id} job={job} />)
                    ) : (
                        <div className="text-center text-muted py-5">
                            <i className="fa-solid fa-star fs-1 opacity-25 mb-3 d-block"></i>
                            Đang tải việc làm...
                        </div>
                    )}
                </div>
            </div>

            <div style={{ background: "#1b5e20", paddingTop: "4rem", paddingBottom: "4rem", marginBottom: "20px" }}>
                <div className="container text-center">
                    <p className="fw-semibold small text-uppercase mb-1" style={{ color: "#a5d6a7", letterSpacing: "0.1em" }}>
                        Đơn giản & Nhanh chóng
                    </p>
                    <h2 className="fw-bold mb-2 text-white">
                        Ứng tuyển chỉ với <span style={{ color: "#69f0ae" }}>3 bước</span>
                    </h2>
                    <p className="mb-5" style={{ color: "#a5d6a7" }}>
                        Quy trình đơn giản, không rườm rà — tìm việc nhanh hơn bao giờ hết
                    </p>

                    <div className="row g-4 justify-content-center">
                        {[
                            {
                                step: "01",
                                icon: "fa-magnifying-glass",
                                title: "Tìm kiếm công việc",
                                desc: "Dễ dàng tìm kiếm hàng nghìn việc làm phù hợp với kỹ năng và mong muốn của bạn.",
                            },
                            {
                                step: "02",
                                icon: "fa-paper-plane",
                                title: "Ứng tuyển công việc",
                                desc: "Gửi CV của bạn chỉ với vài thao tác đơn giản. Hồ sơ được gửi trực tiếp đến nhà tuyển dụng.",
                            },
                            {
                                step: "03",
                                icon: "fa-handshake",
                                title: "Nhận công việc",
                                desc: "Kết nối với nhà tuyển dụng, phỏng vấn và bắt đầu hành trình sự nghiệp mơ ước.",
                            },
                        ].map((item, i) => (
                            <div key={i} className="col-md-4">
                                <div className="p-4 rounded-4 h-100 text-start"
                                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                    <div className="d-flex align-items-center mb-3 gap-3">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                            style={{ width: "52px", height: "52px", background: "#69f0ae" }}>
                                            <i className={`fa-solid ${item.icon}`} style={{ color: "#1b5e20", fontSize: "1.2rem" }}></i>
                                        </div>
                                        <span className="fw-bold" style={{ color: "rgba(255,255,255,0.25)", fontSize: "2rem", lineHeight: 1 }}>
                                            {item.step}
                                        </span>
                                    </div>
                                    <h5 className="fw-bold text-white mb-2">{item.title}</h5>
                                    <p className="mb-0" style={{ color: "#a5d6a7", fontSize: "0.9rem", lineHeight: 1.7 }}>
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5">
                        <Link to={path.JOB}
                            className="btn btn-light btn-lg rounded-pill px-5 py-3 fw-semibold"
                            style={{ color: "#1b5e20" }}>
                            <i className="fa-solid fa-rocket me-2"></i>
                            Bắt đầu tìm việc ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
