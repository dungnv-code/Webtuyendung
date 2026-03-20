import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getAllBusiness } from "../../../api/job";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Link } from "react-router-dom";
import path from "../../../ultils/path";

const Company = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [listBusiness, setListBusiness] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState({});
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllBusiness({
                    page: currentPage,
                    limit,
                    sort: "-createdAt",
                    nameBusiness: inputValue || undefined,
                });
                setListBusiness(response.data);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Error fetching business:", error);
            }
        };
        fetchData();
    }, [currentPage, limit, reload]);

    const hanleSearch = () => {
        const newError = {};
        if (!inputValue.trim()) newError.inputValue = "Vui lòng nhập tên công ty bạn muốn tìm!";
        setError(newError);
        if (Object.keys(newError).length === 0) { setCurrentPage(1); setReload(r => !r); }
    };

    const hanleReset = () => {
        setInputValue(""); setError({});
        setCurrentPage(1); setReload(r => !r);
    };

    return (
        <div style={{ background: "#f8fffe", minHeight: "100vh" }}>
            <div style={{ background: "#1b5e20", paddingTop: "2.5rem", paddingBottom: "3.5rem", borderRadius: "10px" }}>
                <div className="container text-center">
                    <p className="fw-semibold small text-uppercase mb-1"
                        style={{ color: "#a5d6a7", letterSpacing: "0.12em" }}>
                        Đối tác tuyển dụng
                    </p>
                    <h3 className="fw-bold text-white mb-2">
                        <i className="fa-solid fa-building me-2" style={{ color: "#69f0ae" }}></i>
                        Khám phá công ty
                    </h3>
                    <p className="mb-0" style={{ color: "#a5d6a7", fontSize: "0.92rem" }}>
                        Tìm hiểu về các doanh nghiệp hàng đầu đang tuyển dụng
                    </p>
                </div>
            </div>

            <div className="container" style={{ marginTop: "-1.5rem" }}>

                <div className="card border-0 shadow rounded-3 mb-5">
                    <div className="card-body px-4 py-4">
                        <div className="row g-3 align-items-start">
                            <div className="col-md-9">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0"
                                        style={{ borderColor: "#c8e6c9" }}>
                                        <i className="fa-solid fa-magnifying-glass" style={{ color: "#4caf50" }}></i>
                                    </span>
                                    <input
                                        type="text"
                                        className={`form-control border-start-0 ps-0 ${error.inputValue ? "is-invalid" : ""}`}
                                        placeholder="Nhập tên công ty bạn muốn tìm..."
                                        style={{ borderColor: "#c8e6c9", fontSize: "0.92rem" }}
                                        value={inputValue}
                                        onChange={e => { setInputValue(e.target.value); setError({}); }}
                                        onKeyDown={e => e.key === "Enter" && hanleSearch()}
                                    />
                                    {error.inputValue && (
                                        <div className="invalid-feedback">{error.inputValue}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-3 d-flex gap-2">
                                <button className="btn btn-success fw-semibold w-100 rounded-2"
                                    onClick={hanleSearch}>
                                    <i className="fa-solid fa-magnifying-glass me-1"></i> Tìm kiếm
                                </button>
                                <button className="btn btn-outline-secondary rounded-2 px-3"
                                    onClick={hanleReset} title="Đặt lại">
                                    <i className="fa-solid fa-rotate-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {listBusiness.length > 0 && (
                    <p className="fw-semibold mb-4" style={{ color: "#2e7d32", fontSize: "0.9rem" }}>
                        <i className="fa-solid fa-list me-1"></i>
                        Hiển thị <span className="fs-6">{listBusiness.length}</span> công ty
                    </p>
                )}


                {listBusiness.length === 0 ? (
                    <div className="text-center py-5 mb-5">
                        <i className="fa-solid fa-building fs-1 mb-3 d-block" style={{ color: "#c8e6c9" }}></i>
                        <h6 className="text-muted">Không tìm thấy công ty phù hợp</h6>
                        <p className="text-muted small">Thử từ khoá khác hoặc đặt lại tìm kiếm</p>
                        <button className="btn btn-outline-success rounded-pill px-4" onClick={hanleReset}>
                            Xem tất cả công ty
                        </button>
                    </div>
                ) : (
                    <div className="row g-4 mb-5">
                        {listBusiness.map((item) => (
                            <div className="col-lg-4 col-md-6" key={item._id}>
                                <div className="card h-100 border-0 shadow-sm rounded-3"
                                    style={{ transition: "transform 0.2s, box-shadow 0.2s", overflow: "visible" }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = "translateY(-5px)";
                                        e.currentTarget.style.boxShadow = "0 10px 32px rgba(76,175,80,0.18)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "";
                                    }}>

                                    <div className="position-relative"
                                        style={{ height: "130px", overflow: "hidden", borderRadius: "0.75rem 0.75rem 0 0" }}>
                                        <img
                                            src={item.imageCoverBusiness}
                                            className="w-100 h-100"
                                            style={{ objectFit: "cover" }}
                                            alt={item.nameBusiness}
                                        />
                                        <div className="position-absolute top-0 start-0 w-100 h-100"
                                            style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.3))" }} />
                                    </div>

                                    <div className="d-flex justify-content-center"
                                        style={{ marginTop: "-36px", position: "relative", zIndex: 1 }}>
                                        <img
                                            src={item.imageAvatarBusiness}
                                            alt={item.nameBusiness}
                                            className="rounded-circle"
                                            style={{
                                                width: "72px", height: "72px",
                                                objectFit: "cover",
                                                border: "3px solid #fff",
                                                boxShadow: "0 2px 12px rgba(0,0,0,0.15)"
                                            }}
                                        />
                                    </div>

                                    <div className="card-body text-center pt-2 pb-4 px-4">
                                        <Link to={`${path.COMPANY}/${item._id}`} className="text-decoration-none">
                                            <h6 className="fw-bold mb-1 lh-sm"
                                                style={{ color: "#1b5e20", fontSize: "1rem" }}>
                                                {item.nameBusiness}
                                            </h6>
                                        </Link>

                                        <p className="small mb-3" style={{ color: "#888" }}>
                                            <i className="fa-solid fa-location-dot me-1" style={{ color: "#4caf50" }}></i>
                                            {item.addressBusiness}
                                        </p>

                                        <div className="text-muted small mb-4 lh-lg"
                                            style={{ fontSize: "0.82rem" }}>
                                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                                {(item.descriptionBusiness || "").slice(0, 100) + "..."}
                                            </ReactMarkdown>
                                        </div>

                                        <Link
                                            to={`${path.COMPANY}/${item._id}`}
                                            className="btn btn-outline-success btn-sm rounded-pill px-4 fw-semibold"
                                            style={{ fontSize: "0.8rem" }}>
                                            Xem chi tiết
                                            <i className="fa-solid fa-arrow-right ms-1"></i>
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="d-flex justify-content-center pb-5">
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
    );
};

export default Company;
