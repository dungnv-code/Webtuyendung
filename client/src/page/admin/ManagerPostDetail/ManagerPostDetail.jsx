import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { changeStatusPostjobs, getDetailPostjobs } from "../../../api/job";
import { toast } from "react-toastify";

const ManagerPostDetail = () => {
    const { idp } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusLoading, setStatusLoading] = useState(false);

    useEffect(() => {
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

        fetchPostDetail();
    }, [idp]);

    const handleChangeStatus = async () => {
        if (!post) return;

        setStatusLoading(true);
        try {
            const res = await changeStatusPostjobs(post._id);
            const respo = await getDetailPostjobs(idp);
            setPost(respo.data);
            toast.success("Cập nhật trạng thái thành công!")
        } catch (err) {
            console.error("Change status error:", err);
        } finally {
            setStatusLoading(false);
        }
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (!post) return <p>Không tìm thấy bài đăng!</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2 className="fw-bold mb-3">Chi tiết bài đăng tuyển dụng</h2>

            <div
                style={{
                    padding: "20px",
                    borderRadius: "12px",
                    background: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    maxWidth: "750px",
                }}
            >
                <p><strong>Tiêu đề:</strong> {post.title}</p>
                <p><strong>Slug:</strong> {post.slug}</p>
                <p><strong>Mô tả:</strong> {post.description}</p>
                <p><strong>Ngành nghề:</strong> {post.jobs}</p>
                <p><strong>Kinh nghiệm:</strong> {post.experience}</p>
                <p><strong>Cấp bậc:</strong> {post.joblevel}</p>
                <p><strong>Hình thức làm việc:</strong> {post.workType}</p>
                <p><strong>Gói bài đăng:</strong> {post.postPackage}</p>
                <p><strong>Doanh nghiệp ID:</strong> {post.business}</p>
                <p><strong>Số lượng tuyển:</strong> {post.quantity}</p>

                <p>
                    <strong>Kỹ năng yêu cầu:</strong>{" "}
                    {post.skills?.length > 0
                        ? post.skills.join(", ")
                        : "Không có dữ liệu"}
                </p>

                <p>
                    <strong>Deadline:</strong>{" "}
                    {new Date(post.deadline).toLocaleDateString()}
                </p>

                <p>
                    <strong>Trạng thái hiện tại:</strong>{" "}
                    <span
                        style={{
                            color:
                                post.status === "approved"
                                    ? "green"
                                    : post.status === "rejected"
                                        ? "red"
                                        : "orange",
                            fontWeight: "bold",
                        }}
                    >
                        {post.status == "pendding" ? "Chưa kiểm duyệt" : "Đã kiểm duyệt"}
                    </span>
                </p>

                <p><strong>Ngày tạo:</strong> {new Date(post.createdAt).toLocaleString()}</p>
                <p><strong>Ngày cập nhật:</strong> {new Date(post.updatedAt).toLocaleString()}</p>

                {/* Buttons change status */}
                <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                    <button
                        className="btn btn-success"
                        disabled={statusLoading}
                        onClick={() => handleChangeStatus()}
                    >
                        Cập nhật trạng thái
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManagerPostDetail;