import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailPostjobs, getAllPostjobs, uploadCVPostjobs } from "../../../api/job";
import { createWishListJob, checkWishlistJob } from "../../../api/user";
import bg_detail_job from "../../../assets/bg-hoa-mai-job-detail.png";
import Loading from "../../../component/loading/Loading";
import { Link } from "react-router-dom";
import path from "../../../ultils/path";
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
const DetailPostJob = () => {
    const { idp } = useParams();
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [listsuggest, setListsuggest] = useState([])
    const [isLiked, setIsLiked] = useState(false);

    const isLogIn = useSelector(state => state.user.isLogIn)
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getDetailPostjobs(idp);
                if (res.success) {
                    setDetail(res.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchDetail();
    }, [idp]);

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

    useEffect(() => {
        if (!detail?.jobs) return;
        const fetchDetail = async () => {
            try {
                const res = await getAllPostjobs({
                    flatten: true,
                    populate: "salaryRange:salaryRange,min,max", limit: 7, jobs: detail.jobs
                });
                setListsuggest(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDetail();
    }, [detail?.jobs]);


    const [fileCV, setFileCV] = useState(null);

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
        if (!fileCV) {
            toast.error("Vui lòng chọn file PDF trước!");
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("fileCV", fileCV);
            const res = await uploadCVPostjobs(idp, formData);

            if (res.success) {
                toast.success("Nộp CV thành công!");
                hideModal();
            } else {
                toast.error("Nộp CV thất bại!");
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    if (!detail) return <div className="text-center text-danger">Không tìm thấy bài đăng!</div>;




    const getDaysRemaining = (date) => {
        if (!date) return "Không có hạn";
        const end = new Date(date);
        if (isNaN(end.getTime())) return "Ngày không hợp lệ";
        const now = new Date();
        const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

        return diff <= 0 ? "Đã hết hạn" : `${diff} ngày`;
    };

    const checkLike = async () => {
        try {
            const res = await checkWishlistJob(idp);
            setIsLiked(res.isLiked);
        } catch (err) {
            console.log(err);
        }
    };

    const hanleCreateWishlistJob = async () => {
        try {
            const repo = await createWishListJob(idp);
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
        <div className="container py-4" style={{ position: "relative" }}>
            {loading && <Loading />}

            <div className="modal fade" id="uploadCV" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">Nộp CV ứng tuyển</h5>
                            <button type="button" className="btn-close" onClick={hideModal}></button>
                        </div>

                        <div className="modal-body">

                            <label className="fw-semibold mb-2">Chọn file CV (PDF):</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                className="form-control"
                                onChange={handleChangeFile}
                            />

                            {fileCV && (
                                <p className="mt-2 text-success">
                                    <i className="fa-solid fa-file-pdf"></i> Đã chọn: {fileCV.name}
                                </p>
                            )}

                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={hideModal}>
                                Đóng
                            </button>
                            <button type="button" onClick={handleUploadCV} className="btn btn-primary">Nộp CV</button>
                        </div>

                    </div>
                </div>
            </div>
            <div
                style={{
                    backgroundImage: `url(${bg_detail_job})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    minHeight: "100vh",
                    width: "100%",
                }}
            >

                <div className="p-4 shadow-sm rounded mb-3"
                    style={{ background: "linear-gradient(90deg,#28a745,#44c45e)" }}>
                    <h2 className="fw-bold text-white">{detail.title}</h2>
                    <div className="row text-white mt-3">
                        <div className="col-md-4 d-flex align-items-center gap-2">
                            <i className="fa-solid fa-dollar-sign fs-5"></i>
                            <span>{detail.salaryRange?.salaryRange || "Thoả thuận"}</span>
                        </div>
                        <div className="col-md-4 d-flex align-items-center gap-2">
                            <i className="fa-solid fa-location-dot fs-5"></i>
                            <span>{detail.location}</span>
                        </div>
                        <div className="col-md-4 d-flex align-items-center gap-2">
                            <i className="fa-solid fa-briefcase fs-5"></i>
                            <span>{detail.experience}</span>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
                        <div className="text-white">
                            <strong>Hạn nộp hồ sơ:</strong>{" "}
                            {new Date(detail.deadline).toLocaleDateString("vi-VN")}
                        </div>

                        <div className="d-flex gap-3 mt-3 mt-md-0">
                            <button onClick={showModal} className="btn btn-light px-4 py-2 fw-semibold text-success">
                                Ứng tuyển ngay
                            </button>
                            <button
                                onClick={hanleCreateWishlistJob}
                                className="btn btn-outline-light px-4 py-2 fw-semibold"
                            >
                                {isLiked ? (
                                    <i className="fa-solid fa-heart text-danger"></i>
                                ) : (
                                    <i className="fa-regular fa-heart"></i>
                                )}
                                {" "}
                                {isLiked ? "Đã lưu" : "Lưu tin"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="row g-4">
                    {/* LEFT CONTENT */}
                    <div className="col-lg-8">

                        {/* Job Description */}
                        <div className="bg-white p-4 shadow-sm rounded mb-3 border-start border-4 border-success">
                            <h4 className="fw-bold text-success">Chi tiết tin tuyển dụng</h4>

                            {/* Skills */}
                            <div className="mt-3">
                                <strong>Kỹ năng yêu cầu:</strong>
                                <div className="d-flex gap-2 mt-2 flex-wrap">
                                    {detail.skills?.map((s, i) => (
                                        <span key={i} className="badge bg-success bg-opacity-75">{s}</span>
                                    ))}
                                </div>
                            </div>

                            <div
                                className="mt-4 job-description"
                                dangerouslySetInnerHTML={{ __html: detail.description }}
                            ></div>
                            <strong>Hạn nộp hồ sơ:</strong>{" "}
                            {new Date(detail.deadline).toLocaleDateString("vi-VN")}
                            <div className="d-flex gap-3 m-4">
                                <button onClick={showModal} className="btn btn-success px-4 py-2 fw-semibold text-white">
                                    Ứng tuyển ngay
                                </button>
                                <button
                                    onClick={hanleCreateWishlistJob}
                                    className="btn btn-outline-light px-4 py-2 fw-semibold"
                                >
                                    {isLiked ? (
                                        <i className="fa-solid fa-heart text-danger"></i>
                                    ) : (
                                        <i className="fa-regular fa-heart"></i>
                                    )}
                                    {" "}
                                    {isLiked ? "Đã lưu" : "Lưu tin"}
                                </button>
                            </div>
                            <div class="alert alert-danger" role="alert">
                                <i class="fa-solid fa-circle-exclamation"></i>
                                Báo cáo tin tuyển dụng: Nếu bạn thấy rằng tin tuyển dụng này không đúng hoặc có dấu hiệu lừa đảo, hãy phản ánh với chúng tôi.
                            </div>
                            <div className="bg-white p-4 shadow-sm rounded mt-4">
                                <h4 className="fw-bold mb-3 text-success">
                                    <i className="fa-solid fa-lightbulb me-2"></i>
                                    Gợi ý việc làm tương tự
                                </h4>

                                {listsuggest.length === 0 && (
                                    <p className="text-muted fst-italic">Không tìm thấy công việc tương tự.</p>
                                )}

                                {listsuggest.map(job => {
                                    const isExpired = getDaysRemaining(job.deadline) === "Đã hết hạn";

                                    return (
                                        <div className="card mb-3" key={job._id}>
                                            <div className="card-body">
                                                <div className="row g-3 align-items-center">

                                                    <div className="col-md-2 col-4">
                                                        <img
                                                            src={job.imageCover}
                                                            alt=""
                                                            className="img-fluid rounded"
                                                        />
                                                    </div>

                                                    <div className="col-md-7 col-8">

                                                        {/* Nếu hết hạn → không cho click */}
                                                        {isExpired ? (
                                                            <p className="mb-2 text-muted">{job.title}</p>
                                                        ) : (
                                                            <Link to={`${path.JOB}/${job._id}`}>
                                                                <p className="mb-2">{job.title}</p>
                                                            </Link>
                                                        )}

                                                        <div className="row text-secondary">
                                                            <div className="col-4">
                                                                <i className="fa-solid fa-building me-1"></i>
                                                                {job.joblevel}
                                                            </div>

                                                            <div className="col-4">
                                                                <i className="fa-solid fa-location-arrow me-1"></i>
                                                                {job.location}
                                                            </div>

                                                            <div className="col-4 fw-semibold">
                                                                <i className="fa-solid fa-dollar-sign me-1"></i>
                                                                {job.salaryRange_salaryRange}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-3 text-md-end">
                                                        <span className="badge bg-info text-dark mb-2 w-100">
                                                            {job.workType}
                                                        </span>

                                                        <p className={`fw-semibold mb-0 ${isExpired ? "text-muted" : "text-danger"}`}>
                                                            <i className="fa-solid fa-clock me-1"></i>
                                                            {getDaysRemaining(job.deadline)}
                                                        </p>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="col-lg-4">

                        {/* Business Info */}
                        <div className="bg-white p-4 shadow-sm rounded mb-4 border-top border-success border-3">
                            <h4 className="fw-bold text-success mb-3">Thông tin doanh nghiệp</h4>

                            <div className="d-flex align-items-center">
                                <img
                                    src={detail.business?.imageAvatarBusiness}
                                    className="rounded"
                                    width="80"
                                    height="80"
                                    alt="logo"
                                />
                                <div className="ms-3">
                                    <h5 className="text-success">{detail.business?.nameBusiness}</h5>
                                    <p className="text-muted small">
                                        {detail.business?.addressBusiness}
                                    </p>
                                </div>
                            </div>

                            <hr />

                            <p><strong>Quy mô:</strong> {detail.business?.numberOfEmployees}</p>
                            <p><strong>Lĩnh vực:</strong> {detail.business?.FieldBusiness}</p>

                            <p>
                                <strong>Website:</strong><br />
                                <a href={detail.business?.websiteBusiness} target="_blank" rel="noreferrer">
                                    {detail.business?.websiteBusiness}
                                </a>
                            </p>

                            <button className="btn btn-outline-success w-100 mt-3">
                                Xem trang công ty
                            </button>
                        </div>

                        {/* General Info */}
                        <div className="bg-white p-4 shadow-sm rounded border-start border-4 border-success">
                            <h4 className="fw-bold text-success mb-3">Thông tin chung</h4>

                            <div className="d-flex align-items-center mb-3">
                                <i className="fa-brands fa-critical-role text-success fs-4 me-2"></i>
                                Cấp bậc: {detail?.joblevel}
                            </div>

                            <div className="d-flex align-items-center mb-3">
                                <i className="fa-solid fa-atom text-success fs-4 me-2"></i>
                                Nhóm công việc: {detail?.jobs}
                            </div>

                            <div className="d-flex align-items-center mb-3">
                                <i className="fa-solid fa-ranking-star text-success fs-4 me-2"></i>
                                Số lượng tuyển: {detail?.quantity}
                            </div>

                            <div className="d-flex align-items-center">
                                <i className="fa-solid fa-briefcase text-success fs-4 me-2"></i>
                                Hình thức làm việc: {detail?.workType}
                            </div>
                        </div>

                        {/* Safety Tips */}
                        <div className="bg-white p-4 mt-4 shadow-sm rounded border border-success">
                            <h4 className="fw-bold mb-3 text-success">
                                <i className="fa-solid fa-question me-2"></i>
                                Bí kíp Tìm việc an toàn
                            </h4>

                            <p>Dưới đây là những dấu hiệu của các tổ chức, cá nhân tuyển dụng không minh bạch:</p>

                            <h6 className="fw-semibold mt-3 text-success">1. Dấu hiệu phổ biến:</h6>
                            <ul className="list-group list-group-flush mb-3">
                                <li className="list-group-item">Mô tả công việc sơ sài</li>
                                <li className="list-group-item">Hứa hẹn “việc nhẹ lương cao”</li>
                                <li className="list-group-item">Yêu cầu tải app / nạp tiền</li>
                                <li className="list-group-item">Yêu cầu nộp phí phỏng vấn</li>
                                <li className="list-group-item">Yêu cầu nộp giấy tờ gốc</li>
                                <li className="list-group-item">Địa điểm phỏng vấn bất thường</li>
                            </ul>

                            <h6 className="fw-semibold mt-3 text-success">2. Cần làm gì:</h6>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Kiểm tra thông tin công ty trước khi ứng tuyển.</li>
                                <li className="list-group-item">Báo cáo tin tuyển dụng khi thấy đáng ngờ.</li>
                                <li className="list-group-item">
                                    Bộ phận hỗ trợ ứng viên:<br />
                                    <strong>Email:</strong> hotro@topcv.vn<br />
                                    <strong>Hotline:</strong> (024) 6680 5588
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
            <div>
                <div class="bg-white p-4 rounded shadow-sm">
                    <p class="lh-lg">
                        <strong>Cơ hội ứng tuyển việc làm với đãi ngộ hấp dẫn tại các công ty hàng đầu</strong><br />
                        Trước sự phát triển mạnh mẽ của nền kinh tế, nhiều ngành nghề đang rơi vào tình trạng khan hiếm nhân lực,
                        đặc biệt là nguồn nhân lực chất lượng cao. Vì vậy, các trường Đại học đã chủ động liên kết với doanh nghiệp
                        nhằm tạo điều kiện cho sinh viên được học tập, rèn luyện và tiếp cận môi trường làm việc thực tế.
                    </p>

                    <p class="lh-lg">
                        <strong>Vì sao nên tìm việc làm tại TopCV?</strong>
                    </p>

                    <p class="lh-lg">
                        <strong>1. Việc làm chất lượng</strong><br />
                        • Hàng nghìn tin tuyển dụng uy tín được cập nhật liên tục.<br />
                        • Hệ thống thông minh gợi ý công việc phù hợp dựa trên CV của bạn.
                    </p>

                    <p class="lh-lg">
                        <strong>2. Công cụ viết CV đẹp – Miễn phí</strong><br />
                        • Nhiều mẫu CV chuyên nghiệp phù hợp mọi vị trí.<br />
                        • Giao diện trực quan, dễ chỉnh sửa, tạo CV chỉ trong 5 phút.
                    </p>

                    <p class="lh-lg">
                        <strong>3. Hỗ trợ người tìm việc</strong><br />
                        • Nhà tuyển dụng chủ động liên hệ qua hệ thống kết nối ứng viên.<br />
                        • Báo cáo chi tiết về việc xem CV và lời mời phỏng vấn.
                    </p>

                    <p class="lh-lg">
                        TopCV đồng hành cùng bạn trong hành trình sự nghiệp với những cơ hội việc làm lương cao
                        tại các <strong>công ty lớn</strong>, môi trường <strong>chuyên nghiệp – năng động – trẻ trung</strong>.
                        Dù bạn tìm việc tại <strong>Hà Nội</strong> hay <strong>TP.HCM</strong>, TopCV luôn mang đến
                        những vị trí mới nhất và phù hợp nhất.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DetailPostJob;