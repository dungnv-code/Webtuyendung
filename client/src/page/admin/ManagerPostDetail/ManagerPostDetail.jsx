import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { changeStatusPostjobs, getDetailPostjobs } from "../../../api/job";
import { toast } from "react-toastify";

const ManagerPostDetail = () => {
    const { idp } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusLoading, setStatusLoading] = useState(false);

    const fetchPostDetail = async () => {
        try {
            const res = await getDetailPostjobs(idp);
            setPost(res.data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPostDetail();
    }, [idp]);

    const handleChangeStatus = async () => {
        if (!post) return;

        setStatusLoading(true);
        try {
            await changeStatusPostjobs(post._id);
            await fetchPostDetail();
            toast.success("Cập nhật trạng thái thành công!");
        } catch (err) {
            console.error("Change status error:", err);
            toast.error("Cập nhật trạng thái thất bại!");
        } finally {
            setStatusLoading(false);
        }
    };

    const renderStatus = () => {
        if (post.status === "active")
            return { text: "Đã duyệt", color: "green" };

        if (post.status === "rejected")
            return { text: "Từ chối", color: "red" };

        return { text: "Chưa kiểm duyệt", color: "orange" };
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (!post) return <p>Không tìm thấy bài đăng!</p>;

    const statusInfo = renderStatus();

    return (
        <div style={{ padding: "20px" }}>
            <h2 className="fw-bold mb-3">Chi tiết bài đăng tuyển dụng</h2>

            <div
                style={{
                    padding: "20px",
                    borderRadius: "12px",
                    background: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    maxWidth: "900px",
                }}
            >
                <p><strong>Tiêu đề:</strong> {post.title}</p>

                <p><strong>Slug:</strong> {post.slug}</p>

                <p><strong>Ngành nghề:</strong> {post.jobs}</p>

                <p><strong>Kinh nghiệm:</strong> {post.experience}</p>

                <p><strong>Cấp bậc:</strong> {post.joblevel}</p>

                <p><strong>Hình thức làm việc:</strong> {post.workType}</p>

                <p><strong>Mức lương:</strong> {post.salaryRange?.salaryRange}</p>

                <p><strong>Địa điểm:</strong> {post.location}</p>

                <p><strong>Số lượng tuyển:</strong> {post.quantity}</p>

                {/* Business */}
                <div style={{ marginTop: "20px" }}>
                    <h5>Thông tin doanh nghiệp</h5>

                    <p><strong>Tên:</strong> {post.business?.nameBusiness}</p>

                    <p><strong>Lĩnh vực:</strong> {post.business?.FieldBusiness}</p>

                    <p><strong>Địa chỉ:</strong> {post.business?.addressBusiness}</p>

                    <p><strong>SĐT:</strong> {post.business?.phoneBusiness}</p>

                    <p><strong>Website:</strong> {post.business?.websiteBusiness}</p>

                    <img
                        src={post.business?.imageAvatarBusiness}
                        alt=""
                        style={{ width: "120px", marginTop: "10px" }}
                    />
                </div>

                {/* Skills */}
                <p style={{ marginTop: "20px" }}>
                    <strong>Kỹ năng yêu cầu:</strong>{" "}
                    {post.skills?.length > 0
                        ? post.skills.join(", ")
                        : "Không có dữ liệu"}
                </p>

                {/* Description */}
                <div style={{ marginTop: "20px" }}>
                    <strong>Mô tả công việc:</strong>

                    <div
                        dangerouslySetInnerHTML={{ __html: post.description }}
                    />
                </div>

                <p>
                    <strong>Deadline:</strong>{" "}
                    {new Date(post.deadline).toLocaleDateString()}
                </p>

                {/* Status */}
                <p>
                    <strong>Trạng thái:</strong>{" "}
                    <span
                        style={{
                            color: statusInfo.color,
                            fontWeight: "bold",
                        }}
                    >
                        {statusInfo.text}
                    </span>
                </p>

                <p>
                    <strong>Ngày tạo:</strong>{" "}
                    {new Date(post.createdAt).toLocaleString()}
                </p>

                <p>
                    <strong>Ngày cập nhật:</strong>{" "}
                    {new Date(post.updatedAt).toLocaleString()}
                </p>

                {/* Button */}
                <div style={{ marginTop: "20px" }}>
                    <button
                        className="btn btn-success"
                        disabled={statusLoading}
                        onClick={handleChangeStatus}
                    >
                        {statusLoading
                            ? "Đang cập nhật..."
                            : "Cập nhật trạng thái"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManagerPostDetail;