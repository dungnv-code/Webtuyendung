import { Link } from "react-router-dom";
import banner from "../../../assets/banner.png";
import path from "../../../ultils/path";

const Home = () => {

    return (
        <div className="home">

            {/* BANNER */}

            <div className="position-relative">
                <img
                    src={banner}
                    className="w-100"
                    style={{ height: "420px", objectFit: "cover" }}
                    alt="banner"
                />

                <div className="position-absolute top-50 start-50 translate-middle text-center text-white">

                    <h1 className="fw-bold">Tìm việc làm mơ ước</h1>

                    <p className="mb-4">
                        Hơn 10.000 cơ hội việc làm đang chờ bạn
                    </p>

                    <Link
                        to={path.JOB}
                        className="btn btn-success btn-lg"
                    >
                        Tìm việc ngay
                    </Link>

                </div>
            </div>


            {/* DANH MỤC NGÀNH NGHỀ */}

            <div className="container py-5 text-center">

                <p className="text-success fw-bold">Lĩnh vực nổi bật</p>

                <h2 className="fw-bold mb-5 text-success">
                    Danh mục ngành nghề
                </h2>

                <div className="row g-4 mt-5">
                    <div className="col-md-3">
                        <div className="card border-0 shadow h-100">
                            <div className="card-body">
                                <i className="fa-solid fa-laptop-code text-success fs-1"></i>
                                <h5 className="mt-3 fw-bold">Ngành IT</h5>
                                <p className="text-muted">
                                    Phát triển phần mềm, an ninh mạng, DevOps...
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border-0 shadow h-100">
                            <div className="card-body">
                                <i className="fa-solid fa-bullhorn text-success fs-1"></i>
                                <h5 className="mt-3 fw-bold">Marketing</h5>
                                <p className="text-muted">
                                    Quảng cáo, truyền thông, digital marketing
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border-0 shadow h-100">
                            <div className="card-body">
                                <i className="fa-solid fa-coins text-success fs-1"></i>
                                <h5 className="mt-3 fw-bold">Tài chính</h5>
                                <p className="text-muted">
                                    Kế toán, ngân hàng, phân tích tài chính
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border-0 shadow h-100">
                            <div className="card-body">
                                <i className="fa-solid fa-industry text-success fs-1"></i>
                                <h5 className="mt-3 fw-bold">Sản xuất</h5>
                                <p className="text-muted">
                                    Quản lý sản xuất, vận hành nhà máy
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>


            {/* BANNER CÔNG TY */}

            <div className="position-relative mt-5">

                <img
                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/company_covers/yb1I4bHCyIFi2WrPAdyN.jpg"
                    className="w-100"
                    style={{ height: "400px", objectFit: "cover" }}
                    alt=""
                />

                <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                ></div>

                <div className="position-absolute top-50 start-50 translate-middle text-center text-white">

                    <h2 className="fw-bold ">Top công ty tuyển dụng</h2>

                    <p>Cơ hội làm việc tại các doanh nghiệp hàng đầu</p>

                    <Link
                        to={path.JOB}
                        className="btn btn-success mt-3"
                    >
                        Xem công việc
                    </Link>

                </div>

            </div>


            {/* VIỆC MỚI NHẤT */}

            <div className="container py-5 text-center">

                <p className="text-success fw-bold">Công việc mới</p>

                <h2 className="fw-bold mb-5 text-success">
                    Việc làm mới nhất
                </h2>

                <div className="row g-4">

                    <div className="col-md-4">

                        <div className="card shadow border-0 h-100">

                            <div className="card-body">

                                <h5 className="fw-bold">
                                    Chuyên viên Marketing
                                </h5>

                                <p className="text-muted">
                                    Công ty ABC - Hà Nội
                                </p>

                                <span className="badge bg-success">
                                    10 - 15 triệu
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="card shadow border-0 h-100">

                            <div className="card-body">

                                <h5 className="fw-bold">
                                    Kỹ sư phần mềm
                                </h5>

                                <p className="text-muted">
                                    Công ty XYZ - Hồ Chí Minh
                                </p>

                                <span className="badge bg-success">
                                    20 - 30 triệu
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="card shadow border-0 h-100">

                            <div className="card-body">

                                <h5 className="fw-bold">
                                    Kế toán viên
                                </h5>

                                <p className="text-muted">
                                    Công ty DEF - Đà Nẵng
                                </p>

                                <span className="badge bg-success">
                                    12 - 18 triệu
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* QUY TRÌNH */}

            <div className="bg-light py-5">

                <div className="container text-center">

                    <p className="text-success fw-bold">
                        Quy trình ứng tuyển
                    </p>

                    <h2 className="fw-bold mb-5 text-success">
                        Ứng tuyển dễ dàng chỉ với 3 bước
                    </h2>

                    <div className="row g-4">

                        <div className="col-md-4">

                            <div className="card border-0 shadow h-100">

                                <div className="card-body">

                                    <div className="fs-1 text-success">
                                        1
                                    </div>

                                    <h5 className="fw-bold">
                                        Tìm kiếm công việc
                                    </h5>

                                </div>

                            </div>

                        </div>

                        <div className="col-md-4">

                            <div className="card border-0 shadow h-100">

                                <div className="card-body">

                                    <div className="fs-1 text-success">
                                        2
                                    </div>

                                    <h5 className="fw-bold">
                                        Ứng tuyển công việc
                                    </h5>

                                </div>

                            </div>

                        </div>

                        <div className="col-md-4">

                            <div className="card border-0 shadow h-100">

                                <div className="card-body">

                                    <div className="fs-1 text-success">
                                        3
                                    </div>

                                    <h5 className="fw-bold">
                                        Nhận công việc
                                    </h5>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Home;