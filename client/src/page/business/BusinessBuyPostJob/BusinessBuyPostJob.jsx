import { useEffect, useState } from "react";
import { getAllPacketPost } from "../../../api/job";
import { App } from "../../../component";
const BusinessBuyPostJob = () => {
    const [packetList, setPacketList] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        typeInvoid: "",
        title: "",
        value: 0,
        price: 0,
        amount: 1,
        totalPrice: 0,
    });

    useEffect(() => {
        const fetchDataPacket = async () => {
            const response = await getAllPacketPost();
            setPacketList(response.data);
        };
        fetchDataPacket();
    }, []);

    // Validate Form
    const validate = () => {
        const newErr = {};

        if (!formData.title.trim()) {
            newErr.title = "Vui lòng chọn gói đăng!";
        }
        if (!formData.amount || Number(formData.amount) < 1) {
            newErr.amount = "Số lượng mua phải lớn hơn 0!";
        }

        setErrors(newErr);
        return Object.keys(newErr).length === 0;
    };

    // Khi chọn gói đăng
    const handleSelectPacket = (id) => {
        const packet = packetList.find((item) => item._id === id);
        if (!packet) return;

        setFormData({
            ...formData,
            typeInvoid: packet.typePostPackage,
            title: packet.namePostPackage,
            value: packet.valuePostPackage,
            price: packet.price,
            amount: 1,
            totalPrice: packet.price * 1,
        });

        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };

        if (name === "amount") {
            updatedData.totalPrice = Number(value) * Number(formData.price);
        }

        setFormData(updatedData);
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     if (!validate()) return;

    //     console.log("Tạo hóa đơn:", formData);
    // };

    return (
        <div className="container mt-4">
            <div className="mx-auto p-4 shadow rounded-4" style={{ maxWidth: "600px", background: "#fff" }}>
                <h3 className="fw-bold mb-4 text-primary text-center">
                    Tạo Hóa Đơn Mua Gói Đăng
                </h3>

                {/* SELECT GÓI */}
                <div className="mb-3">
                    <label className="form-label fw-semibold">Chọn gói đăng</label>
                    <select
                        className={`form-select ${errors.title ? "is-invalid" : ""}`}
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
                {/* onSubmit={handleSubmit} */}
                <form >
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
                            <label className="form-label fw-bold">Tổng tiền  ($)</label>
                            <input
                                type="number"
                                className="form-control bg-light fw-bold"
                                value={formData.totalPrice}
                                disabled
                            />
                        </div>
                    </div>

                    <button className="btn btn-primary w-100 fw-bold py-2 rounded-3 mt-2">
                        <App />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BusinessBuyPostJob;