import { useEffect, useState } from "react";
import { getDetailBusiness } from "../../../api/job";
import { getPostJobUserBusiness } from "../../../api/business";
import { useParams, Link } from "react-router-dom";
import {
    CodeSandboxOutlined,
    ContainerOutlined,
    EnvironmentOutlined
} from "@ant-design/icons";
import { createWishListBusiness, checkWishlistBusiness } from "../../../api/user";
import { toast } from "react-toastify";
import PaginationCustom from "../../../component/pagination/pagination";
import path from "../../../ultils/path";
import { useSelector } from "react-redux"
const DetailBusiness = () => {
    const { idb } = useParams();

    const [data, setData] = useState({});
    const [listjob, setListjob] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(7);
    const [totalPages, setTotalPages] = useState(0);
    const isLogIn = useSelector(state => state.user.isLogIn)
    const [isLiked, setIsLiked] = useState(false);
    // Fetch business detail
    useEffect(() => {
        const fetchData = async () => {
            try {
                const repo = await getDetailBusiness(idb);
                setData(repo.data);
            } catch (err) {
                console.log("Error load business", err);
            }
        };
        fetchData();
    }, [idb]);

    // Fetch jobs by business
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const repo = await getPostJobUserBusiness(idb, {
                    page: currentPage,
                    limit,
                });

                setListjob(repo.data || []);
                setTotalPages(repo.totalPages || 0);
            } catch (err) {
                console.log("Error load jobs", err);
            }
        };
        fetchJobs();
    }, [idb, currentPage, limit]);

    // Calculate days remaining
    const getDaysRemaining = (deadline) => {
        const end = new Date(deadline).getTime();
        const now = Date.now();
        const distance = end - now;

        if (distance <= 0) return "Đã hết hạn";
        const days = Math.ceil(distance / (1000 * 60 * 60 * 24));
        return `Còn ${days} ngày`;
    };

    // Generate map URL
    const generateMapIframe = (address) => {
        const encoded = encodeURIComponent(address);
        return `https://www.google.com/maps?q=${encoded}&output=embed`;
    };

    const checkLike = async () => {
        try {
            const res = await checkWishlistBusiness(idb);
            setIsLiked(res.isLiked);
        } catch (err) {
            console.log(err);
        }
    };

    const hanleCreateWishlistJob = async () => {
        try {
            const repo = await createWishListBusiness(idb);
            if (repo.success) {
                toast.success(repo.message)
                checkLike()
            }
        }
        catch (err) {
        }
    }

    if (isLogIn) {
        checkLike();
    }

    return (
        <>
            <div className="container">
                {/* Cover */}
                <div className="position-relative">
                    <img
                        src={data?.imageCoverBusiness}
                        className="img-fluid w-100 rounded"
                        style={{ height: "400px", objectFit: "cover" }}
                        alt="cover"
                    />

                    {/* Overlay */}
                    <div className="position-absolute w-100" style={{ top: "205px" }}>
                        <div
                            className="container rounded-4 shadow-lg p-4 text-white"
                            style={{
                                background: "rgba(255,255,255,0.15)",
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                                border: "1px solid rgba(255,255,255,0.3)",
                            }}
                        >
                            <div className="row text-center align-items-center g-3">

                                <div className="col-12 col-md-4">
                                    <img
                                        src={data?.imageAvatarBusiness}
                                        className="border border-3 border-white shadow"
                                        style={{
                                            width: "180px",
                                            height: "140px",
                                            objectFit: "cover",
                                            borderRadius: "12px"
                                        }}
                                        alt="avatar"
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <h5 className="fw-bold">{data?.nameBusiness}</h5>

                                    <p className="text-light mb-1">
                                        <ContainerOutlined className="me-2" />
                                        Lĩnh vực: {data?.FieldBusiness}
                                    </p>

                                    <p className="text-light mb-1">
                                        <i className="fa-solid fa-building me-2"></i>
                                        Nhân lực: {data?.numberOfEmployees}
                                    </p>
                                </div>

                                <div className="col-12 col-md-4">
                                    <div
                                        className="rounded-3 p-3"
                                        style={{
                                            background: "rgba(255,255,255,0.25)",
                                            backdropFilter: "blur(10px)"
                                        }}
                                    >
                                        <p className="mb-2">
                                            <CodeSandboxOutlined className="me-2" />
                                            Website:
                                            <a
                                                href={data?.websiteBusiness}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ms-1 text-success "
                                            >
                                                {data?.websiteBusiness}
                                            </a>
                                        </p>

                                        <button
                                            onClick={hanleCreateWishlistJob}
                                            className="btn btn-success px-4 py-2 fw-semibold"
                                        >
                                            {isLiked ? (
                                                <i className="fa-solid fa-heart text-danger"></i>
                                            ) : (
                                                <i className="fa-regular fa-heart"></i>
                                            )}
                                            {" "}
                                            {isLiked ? "Đã theo dõi" : "Theo dõi"}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Main body */}
                    <div className="row mt-2 g-4">
                        {/* Left column */}
                        <div className="col-lg-8 col-md-7">
                            <div
                                className="p-3 bg-white rounded"
                                style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.15)" }}
                            >
                                <div style={{ textAlign: "center", color: "#28a745" }}>
                                    <h4 className="fw-semibold">Giới thiệu công ty</h4>
                                </div>

                                <div className="text-secondary small mt-4">
                                    {data?.descriptionBusiness ? (
                                        <div
                                            className="job-description"
                                            dangerouslySetInnerHTML={{ __html: data.descriptionBusiness }}
                                        ></div>
                                    ) : (
                                        <p className="text-muted fst-italic">
                                            Công ty chưa cập nhật phần giới thiệu.
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <h5>Các bài đăng doanh nghiệp</h5>
                                </div>
                                {listjob.map((job) => (
                                    <div className="card mb-3" key={job._id}>
                                        <div className="card-body">
                                            <div className="row g-3 align-items-center">
                                                <div className="col-md-2 col-4">
                                                    <img
                                                        src={job?.imageCover}
                                                        alt=""
                                                        className="img-fluid rounded"
                                                    />
                                                </div>

                                                <div className="col-md-7 col-8">
                                                    {getDaysRemaining(job?.deadline) === "Đã hết hạn" ? (
                                                        <p
                                                            className="mb-2 text-muted"
                                                            style={{ cursor: "not-allowed" }}
                                                        >
                                                            {job?.title}
                                                        </p>
                                                    ) : (
                                                        <Link to={`${path.JOB}/${job._id}`}>
                                                            <p className="mb-2">{job?.title}</p>
                                                        </Link>
                                                    )}
                                                    <div className="row text-secondary">
                                                        <div className="col-4">
                                                            <i className="fa-solid fa-building me-1"></i>
                                                            {job?.joblevel}
                                                        </div>

                                                        <div className="col-4">
                                                            <i className="fa-solid fa-location-arrow me-1"></i>
                                                            {job?.location}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-3 text-md-end">
                                                    <span className="badge bg-success text-light mb-2 w-100">
                                                        {job?.workType}
                                                    </span>

                                                    <p className="text-danger fw-semibold mb-0">
                                                        <i className="fa-solid fa-clock me-1"></i>
                                                        {getDaysRemaining(job?.deadline)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination */}
                                <div className="d-flex justify-content-center mt-3">
                                    <PaginationCustom
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        limit={limit}
                                        totalPages={totalPages}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="col-lg-4 col-md-5">
                            <div
                                className="bg-white rounded p-3"
                                style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.15)" }}
                            >
                                <h5
                                    className="text-center mb-3 fw-bold"
                                    style={{ color: "#28a745" }}
                                >
                                    Thông tin liên hệ
                                </h5>

                                <div className="mb-2">
                                    <span className="fw-semibold">
                                        <EnvironmentOutlined className="me-2" />
                                        Địa chỉ công ty:
                                    </span>
                                    <div className="mt-1 ps-4 text-secondary">
                                        {data?.addressBusiness}
                                    </div>
                                </div>

                                <div className="mt-3 mb-2 fw-semibold">
                                    <i className="fa-solid fa-map me-2"></i>
                                    Xem bản đồ:
                                </div>

                                <div className="mt-2">
                                    <iframe
                                        src={generateMapIframe(data?.addressBusiness)}
                                        className="w-100"
                                        height="250"
                                        style={{
                                            border: 0,
                                            borderRadius: "10px",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                        }}
                                        loading="lazy"
                                    ></iframe>
                                </div>
                            </div>

                            <div
                                className="bg-white rounded p-3 mt-3"
                                style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.15)" }}
                            >
                                <h5
                                    className="text-center mb-3 fw-bold"
                                    style={{ color: "#28a745" }}
                                >
                                    Chia sẻ công ty tới bạn bè
                                </h5>

                                <div className="mb-2">
                                    <span className="fw-semibold">Sao chép đường dẫn:</span>

                                    <div
                                        className="mt-1 ps-4 text-secondary d-flex align-items-center"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                data?.websiteBusiness
                                            );
                                            toast.success("Đã sao chép link website!");
                                        }}
                                    >
                                        {data?.websiteBusiness}
                                        <i className="fa-solid fa-copy ms-2"></i>
                                    </div>

                                    <span className="fw-semibold">
                                        Chia sẻ qua mạng xã hội
                                    </span>

                                    <div className="mt-2 ps-4 text-secondary social-icons d-flex align-items-center gap-2">
                                        <i className="fa-brands fa-facebook"></i>
                                        <i className="fa-brands fa-twitter"></i>
                                        <i className="fa-brands fa-linkedin"></i>
                                        <i className="fa-brands fa-tiktok"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailBusiness;