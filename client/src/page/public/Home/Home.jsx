import { data, Link } from "react-router-dom";
import banner from "../../../assets/banner1.jpg";
import banner2 from "../../../assets/banner2.png";
import banner3 from "../../../assets/banner3.jpg";
import path from "../../../ultils/path";
import {
    getAllPostjobs,
} from "../../../api/job";
import { useState, useEffect } from "react";
const Home = () => {

    const [jobnew, setJobnew] = useState([])
    const [jobpri, setJobpri] = useState([])

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
            console.log(res.data)
            setJobnew(res.data || []);
        } catch (error) {
            console.log("Lỗi load job:", error);
        }
    };
    useEffect(() => {
        fetchJobNew();
    }, []);

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

    return (
        <div className="home">
            <div className="position-relative shadow-lg rounded overflow-hidden">
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img
                                src={banner3}
                                className="d-block w-100 img-fluid"
                                style={{ height: "420px", objectFit: "cover" }}
                                alt="banner"
                            />
                        </div>
                        <div className="carousel-item">
                            <img
                                src={banner2}
                                className="d-block w-100 img-fluid"
                                style={{ height: "420px", objectFit: "cover" }}
                                alt="banner"
                            />
                        </div>

                        <div className="carousel-item">
                            <img
                                src={banner}
                                className="d-block w-100 img-fluid"
                                style={{ height: "420px", objectFit: "cover" }}
                                alt="banner"
                            />
                        </div>

                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon"></span>
                    </button>

                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon"></span>
                    </button>

                </div>

                {/* Overlay content */}
                <div className="position-absolute top-50 start-50 translate-middle text-center text-success">

                    <h1 className="fw-bold display-5">
                        Tìm việc làm mơ ước
                    </h1>

                    <p className="mb-4 fs-5">
                        Hơn 10.000 cơ hội việc làm đang chờ bạn
                    </p>

                    <Link
                        to={path.JOB}
                        className="btn btn-success btn-lg shadow"
                    >
                        Tìm việc ngay
                    </Link>

                </div>

            </div>

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
                        to={path.COMPANY}
                        className="btn btn-success mt-3"
                    >
                        Xem công việc
                    </Link>

                </div>

            </div>

            <div className="container py-5 text-center">

                <p className="text-success fw-bold">Công việc mới</p>

                <h2 className="fw-bold mb-5 text-success">
                    Việc làm mới nhất
                </h2>

                <div className="row g-4">

                    {jobnew.map(job => (
                        <div className="card mb-3 shadow-sm border-0" key={job._id}>
                            <div className="card-body">

                                <div className="row align-items-center g-3">

                                    <div className="col-md-2 col-4">
                                        <img
                                            src={job.imageCover}
                                            alt=""
                                            className="img-fluid rounded border"
                                        />
                                    </div>

                                    <div className="col-md-7 col-8">

                                        <Link
                                            to={`${path.JOB}/${job._id}`}
                                            className="text-decoration-none"
                                        >
                                            <h6 className="fw-bold text-black">
                                                {job.title}
                                            </h6>
                                        </Link>

                                        <div className="row text-secondary small">

                                            <div className="col-md-4">
                                                <i className="fa-solid fa-building me-1"></i>
                                                {job.joblevel}
                                            </div>

                                            <div className="col-md-4">
                                                <i className="fa-solid fa-location-dot me-1"></i>
                                                {job.location}
                                            </div>

                                            <div className="col-md-4 fw-semibold ">
                                                <i className="fa-solid fa-dollar-sign me-1"></i>
                                                {job.salaryRange_salaryRange}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-3 text-md-end">
                                        <span className="badge bg-success-subtle text-black mb-2 w-100">
                                            {job.workType}
                                        </span>
                                        <p className="text-danger fw-semibold mb-0 small">
                                            <i className="fa-solid fa-clock me-1"></i>
                                            {getDaysRemaining(job.deadline)}
                                        </p>

                                    </div>

                                </div>

                            </div>
                        </div>
                    ))}

                </div>

            </div>

            <div className="container py-5 text-center">

                <p className="text-success fw-bold">Công việc nổi bật</p>

                <h2 className="fw-bold mb-5 text-success">
                    Việc làm nổi bật
                </h2>

                <div className="row g-4">

                    {jobpri.map(job => (
                        <div className="card mb-3 shadow-sm border-0" key={job._id}>
                            <div className="card-body">

                                <div className="row align-items-center g-3">

                                    <div className="col-md-2 col-4">
                                        <img
                                            src={job.imageCover}
                                            alt=""
                                            className="img-fluid rounded border"
                                        />
                                    </div>

                                    <div className="col-md-7 col-8">

                                        <Link
                                            to={`${path.JOB}/${job._id}`}
                                            className="text-decoration-none"
                                        >
                                            <h6 className="fw-bold text-black">
                                                {job.title}
                                            </h6>
                                        </Link>

                                        <div className="row text-secondary small">

                                            <div className="col-md-4">
                                                <i className="fa-solid fa-building me-1"></i>
                                                {job.joblevel}
                                            </div>

                                            <div className="col-md-4">
                                                <i className="fa-solid fa-location-dot me-1"></i>
                                                {job.location}
                                            </div>

                                            <div className="col-md-4 fw-semibold">
                                                <i className="fa-solid fa-dollar-sign me-1"></i>
                                                {job.salaryRange_salaryRange}
                                            </div>

                                        </div>
                                    </div>

                                    <div className="col-md-3 text-md-end">

                                        <span className="badge bg-success-subtle text-black mb-2 w-100">
                                            {job.workType}
                                        </span>

                                        <p className="text-danger fw-semibold mb-0 small">
                                            <i className="fa-solid fa-clock me-1"></i>
                                            {getDaysRemaining(job.deadline)}
                                        </p>

                                    </div>

                                </div>

                            </div>
                        </div>
                    ))}

                </div>

            </div>


            <div className="bg-light py-5">

                <div className="container text-center">

                    <p className="text-success fw-bold text-uppercase small">
                        Quy trình ứng tuyển
                    </p>

                    <h2 className="fw-bold mb-5">
                        Ứng tuyển dễ dàng chỉ với <span className="text-success">3 bước</span>
                    </h2>

                    <div className="row g-4">

                        {/* Step 1 */}
                        <div className="col-md-4">

                            <div className="card border-0 shadow-lg rounded-4 h-100">

                                <div className="card-body py-5">

                                    <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                                        style={{ width: "70px", height: "70px" }}>

                                        <span className="fs-4 fw-bold">1</span>

                                    </div>

                                    <h5 className="fw-bold mb-2">
                                        Tìm kiếm công việc
                                    </h5>

                                    <p className="text-muted">
                                        Dễ dàng tìm kiếm hàng nghìn việc làm phù hợp với kỹ năng của bạn.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* Step 2 */}
                        <div className="col-md-4">

                            <div className="card border-0 shadow-lg rounded-4 h-100">

                                <div className="card-body py-5">

                                    <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                                        style={{ width: "70px", height: "70px" }}>

                                        <span className="fs-4 fw-bold">2</span>

                                    </div>

                                    <h5 className="fw-bold mb-2">
                                        Ứng tuyển công việc
                                    </h5>

                                    <p className="text-muted">
                                        Gửi CV của bạn chỉ với vài thao tác đơn giản.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* Step 3 */}
                        <div className="col-md-4">

                            <div className="card border-0 shadow-lg rounded-4 h-100">

                                <div className="card-body py-5">

                                    <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                                        style={{ width: "70px", height: "70px" }}>

                                        <span className="fs-4 fw-bold">3</span>

                                    </div>

                                    <h5 className="fw-bold mb-2">
                                        Nhận công việc
                                    </h5>

                                    <p className="text-muted">
                                        Kết nối với nhà tuyển dụng và bắt đầu công việc mơ ước.
                                    </p>

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