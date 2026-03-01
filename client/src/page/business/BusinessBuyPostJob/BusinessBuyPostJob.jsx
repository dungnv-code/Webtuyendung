import { useEffect, useState } from "react";
import { getAllPacketPost } from "../../../api/job";
import { App } from "../../../component";

const BusinessBuyPostJob = () => {
    const [packetList, setPacketList] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        typeInvoid: "",
        title: "",
        value: 0,
        price: 0,
        amount: 1,
        totalPrice: 0,
    });

    // Tách totalPrice ra khỏi payload
    const { totalPrice, ...payloadToSend } = formData;

    // Reset form sau thanh toán thành công
    useEffect(() => {
        if (isSuccess) {
            setFormData({
                typeInvoid: "",
                title: "",
                value: 0,
                price: 0,
                amount: 1,
                totalPrice: 0,
            });

            setErrors({});
        }
    }, [isSuccess]);

    // Lấy danh sách gói đăng
    useEffect(() => {
        const fetchPacket = async () => {
            const res = await getAllPacketPost({ status: "ACTIVE" });
            setPacketList(res.data);
        };
        fetchPacket();
    }, []);

    // Khi chọn gói
    const handleSelectPacket = (id) => {
        const packet = packetList.find((p) => p._id === id);
        if (!packet) return;

        setFormData({
            typeInvoid: packet.typePostPackage,
            title: packet.namePostPackage,
            value: packet.valuePostPackage,
            price: packet.price,
            amount: 1,
            totalPrice: packet.price,
        });

        setErrors({});
    };

    // Khi nhập số lượng mua
    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };

        if (name === "amount") {
            updated.totalPrice = Number(value) * Number(formData.price);
        }

        setFormData(updated);
    };

    // Chưa chọn gói → không cho bấm PayPal
    const isPacketSelected = formData.title.trim() !== "";

    return (
        <div className="container" style={{ margin: "30px 0px" }}>
            <div className="mx-auto p-4 shadow rounded-4" style={{ maxWidth: "600px", background: "#fff" }}>

                <h3 className="fw-bold mb-4 text-primary text-center">
                    Tạo Hóa Đơn Mua Gói Đăng
                </h3>

                {/* SELECT GÓI */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Chọn gói đăng</label>
                    <select
                        className={`form-select ${errors.title ? "is-invalid" : ""}`}
                        value={formData.title ? packetList.find(x => x.namePostPackage === formData.title)?._id : ""}
                        onChange={(e) => handleSelectPacket(e.target.value)}
                    >
                        <option value="">-- Chọn gói đăng --</option>
                        {packetList.map((item) => (
                            <option key={item._id} value={item._id}>
                                {item.namePostPackage} ({item.typePostPackage})
                            </option>
                        ))}
                    </select>
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                {/* FORM */}
                <form>
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Title</label>
                            <input type="text" className="form-control" value={formData.title} disabled />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Loại gói</label>
                            <input type="text" className="form-control" value={formData.typeInvoid} disabled />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Số lượng bài</label>
                            <input type="number" className="form-control" value={formData.value} disabled />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Giá/gói ($)</label>
                            <input type="number" className="form-control" value={formData.price} disabled />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Số lượng mua</label>
                            <input
                                type="number"
                                name="amount"
                                className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                                value={formData.amount}
                                onChange={handleChange}
                                min="1"
                            />
                            {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                        </div>

                        <div className="col-md-12 mb-3">
                            <label className="form-label fw-bold">Tổng tiền ($)</label>
                            <input type="number" className="form-control bg-light fw-bold" value={formData.totalPrice} disabled />
                        </div>
                    </div>

                    {/* PAYPAL BUTTON */}
                    {
                        isPacketSelected && <div className="mt-3">
                            <App
                                amount={totalPrice}
                                payload={payloadToSend}
                                setIsSuccess={setIsSuccess}
                            />
                        </div>
                    }
                </form>
            </div>
        </div>
    );
};

export default BusinessBuyPostJob;