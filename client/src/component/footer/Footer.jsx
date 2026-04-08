import logo from '../../assets/icon_logo.png';

const Footer = () => {
    return (
        <footer style={{ background: "#1b5e20" }}>

            <div className="container py-5">
                <div className="row g-5">

                    <div className="col-lg-4 col-md-6">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <div className="rounded-2 d-flex align-items-center justify-content-center"
                            >
                                <img src={logo} style={{ width: "100px", height: "70px", background: "#69f0ae", borderRadius: "5px" }}></img>
                            </div>
                            <span className="fw-bold fs-5 text-white">NextJob</span>
                        </div>
                        <p style={{ color: "#a5d6a7", fontSize: "0.9rem", lineHeight: 1.8 }}>
                            Nền tảng tuyển dụng hàng đầu Việt Nam — kết nối hàng nghìn ứng viên tài năng với các doanh nghiệp uy tín trên toàn quốc.
                        </p>
                        <div className="d-flex gap-2 mt-3">
                            {[
                                { icon: "fa-facebook-f", href: "#" },
                                { icon: "fa-linkedin-in", href: "#" },
                                { icon: "fa-youtube", href: "#" },
                                { icon: "fa-tiktok", href: "#" },
                            ].map((s) => (
                                <a key={s.icon} href={s.href}
                                    className="d-flex align-items-center justify-content-center rounded-circle text-decoration-none"
                                    style={{
                                        width: "36px", height: "36px",
                                        background: "rgba(255,255,255,0.1)",
                                        color: "#a5d6a7",
                                        fontSize: "0.85rem",
                                        transition: "background 0.2s, color 0.2s",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = "#69f0ae";
                                        e.currentTarget.style.color = "#1b5e20";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                                        e.currentTarget.style.color = "#a5d6a7";
                                    }}
                                >
                                    <i className={`fa-brands ${s.icon}`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-6 col-6">
                        <h6 className="fw-bold text-white mb-3 text-uppercase"
                            style={{ fontSize: "0.78rem", letterSpacing: "0.1em" }}>
                            Liên kết
                        </h6>
                        <ul className="list-unstyled mb-0">
                            {[
                                { label: "Trang chủ", href: "#" },
                                { label: "Công việc", href: "#" },
                                { label: "Công ty", href: "#" },
                                { label: "Giới thiệu", href: "#" },
                                { label: "Blog", href: "#" },
                            ].map((item) => (
                                <li key={item.label} className="mb-2">
                                    <a href={item.href}
                                        className="text-decoration-none"
                                        style={{ color: "#a5d6a7", fontSize: "0.88rem", transition: "color 0.15s" }}
                                        onMouseEnter={e => e.currentTarget.style.color = "#69f0ae"}
                                        onMouseLeave={e => e.currentTarget.style.color = "#a5d6a7"}
                                    >
                                        <i className="fa-solid fa-chevron-right me-1"
                                            style={{ fontSize: "0.6rem", opacity: 0.6 }}></i>
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-6 col-6">
                        <h6 className="fw-bold text-white mb-3 text-uppercase"
                            style={{ fontSize: "0.78rem", letterSpacing: "0.1em" }}>
                            Hỗ trợ
                        </h6>
                        <ul className="list-unstyled mb-0">
                            {[
                                { label: "Câu hỏi thường gặp", href: "#" },
                                { label: "Chính sách bảo mật", href: "#" },
                                { label: "Điều khoản dịch vụ", href: "#" },
                                { label: "Hướng dẫn sử dụng", href: "#" },
                            ].map((item) => (
                                <li key={item.label} className="mb-2">
                                    <a href={item.href}
                                        className="text-decoration-none"
                                        style={{ color: "#a5d6a7", fontSize: "0.88rem", transition: "color 0.15s" }}
                                        onMouseEnter={e => e.currentTarget.style.color = "#69f0ae"}
                                        onMouseLeave={e => e.currentTarget.style.color = "#a5d6a7"}
                                    >
                                        <i className="fa-solid fa-chevron-right me-1"
                                            style={{ fontSize: "0.6rem", opacity: 0.6 }}></i>
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <h6 className="fw-bold text-white mb-3 text-uppercase"
                            style={{ fontSize: "0.78rem", letterSpacing: "0.1em" }}>
                            Liên hệ
                        </h6>

                        <div className="d-flex flex-column gap-3 mb-4">
                            {[
                                { icon: "fa-envelope", text: "support@topviec.vn" },
                                { icon: "fa-phone", text: "0123 456 789" },
                                { icon: "fa-location-dot", text: "123 Nguyễn Huệ, Q.1, TP.HCM" },
                            ].map((c) => (
                                <div key={c.icon} className="d-flex align-items-center gap-3">
                                    <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                                        style={{ width: "32px", height: "32px", background: "rgba(105,240,174,0.15)" }}>
                                        <i className={`fa-solid ${c.icon}`}
                                            style={{ color: "#69f0ae", fontSize: "0.8rem" }}></i>
                                    </div>
                                    <span style={{ color: "#a5d6a7", fontSize: "0.88rem" }}>{c.text}</span>
                                </div>
                            ))}
                        </div>

                        <div>
                            <p className="text-white fw-semibold mb-2" style={{ fontSize: "0.85rem" }}>
                                Nhận thông báo việc làm mới
                            </p>
                            <div className="input-group">
                                <input
                                    type="email"
                                    className="form-control border-0 rounded-start-pill"
                                    placeholder="Email của bạn..."
                                    style={{
                                        background: "rgba(255,255,255,0.12)",
                                        color: "#fff",
                                        fontSize: "0.85rem",
                                    }}
                                />
                                <button className="btn rounded-end-pill px-3 fw-semibold"
                                    style={{ background: "#69f0ae", color: "#1b5e20", fontSize: "0.82rem" }}>
                                    Đăng ký
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="container py-3">
                    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
                        <p className="mb-0" style={{ color: "#a5d6a7", fontSize: "0.82rem" }}>
                            © 2026 <span className="text-white fw-semibold">TopViệc</span>. All rights reserved.
                        </p>
                        <div className="d-flex gap-3">
                            {["Bảo mật", "Điều khoản", "Cookie"].map((t) => (
                                <a key={t} href="#"
                                    className="text-decoration-none"
                                    style={{ color: "#a5d6a7", fontSize: "0.8rem", transition: "color 0.15s" }}
                                    onMouseEnter={e => e.currentTarget.style.color = "#69f0ae"}
                                    onMouseLeave={e => e.currentTarget.style.color = "#a5d6a7"}
                                >
                                    {t}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
