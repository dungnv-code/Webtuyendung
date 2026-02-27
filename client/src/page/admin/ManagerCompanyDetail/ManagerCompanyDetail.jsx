import { useParams } from "react-router-dom";
import { getDetailBusiness, changeStatusBusiness } from "../../../api/job";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
const ManagerCompanyDetail = () => {
    const { idb } = useParams();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getDetailBusiness(idb);
                setBusiness(res.data);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [idb]);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (!business) return <p>Không tìm thấy doanh nghiệp!</p>;

    const hanleChangeStatus = async () => {
        try {
            await changeStatusBusiness(idb)
            toast.success("Cập nhật trạng thái thành công")
            const res = await getDetailBusiness(idb);
            setBusiness(res.data);
        } catch (err) {

        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2 className="fw-bold mb-4">Chi tiết doanh nghiệp</h2>

            {/* Ảnh đại diện + ảnh cover */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <img
                    src={business.imageAvatarBusiness}
                    alt="avatar"
                    style={{ width: "120px", height: "120px", borderRadius: "10px", objectFit: "cover" }}
                />
                <img
                    src={business.imageCoverBusiness}
                    alt="cover"
                    style={{ width: "300px", height: "120px", borderRadius: "10px", objectFit: "cover" }}
                />
            </div>

            {/* Thông tin cơ bản */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "700px",
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
            >
                <h4 className="fw-semibold mb-3">Thông tin doanh nghiệp</h4>

                <p><strong>Tên doanh nghiệp:</strong> {business.nameBusiness}</p>
                <p><strong>Mã số thuế:</strong> {business.taxiCodeBusiness}</p>
                <p><strong>Địa chỉ:</strong> {business.addressBusiness}</p>
                <p><strong>Lĩnh vực:</strong> {business.FieldBusiness}</p>
                <p><strong>Số điện thoại:</strong> {business.phoneBusiness}</p>
                <p><strong>Website:</strong>
                    <a href={business.websiteBusiness} target="_blank" rel="noreferrer">
                        {" "}{business.websiteBusiness}
                    </a>
                </p>
                <p><strong>Quy mô nhân sự:</strong> {business.numberOfEmployees}</p>

                <p><strong>Chứng nhận:</strong></p>
                <img
                    src={business.certification}
                    alt="certification"
                    style={{ width: "600px", borderRadius: "10px" }}
                />
                <p><strong>Ngày tạo:</strong> {new Date(business.createdAt).toLocaleString()}</p>
                <p><strong>Ngày cập nhật:</strong> {new Date(business.updatedAt).toLocaleString()}</p>
                <p className="mt-3"><strong>Trạng thái duyệt:</strong> {business.statusBusiness ? "Đã duyệt" : "Chưa duyệt"}</p>
                <button className="btn btn-primary" onClick={hanleChangeStatus}>Cập nhật trạng thái</button>
            </div>
        </div>
    );
};

export default ManagerCompanyDetail;