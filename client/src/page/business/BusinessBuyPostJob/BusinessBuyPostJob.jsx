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

    const { totalPrice, ...payloadToSend } = formData;

    useEffect(() => {
        if (isSuccess) {
            setFormData({ typeInvoid: "", title: "", value: 0, price: 0, amount: 1, totalPrice: 0 });
            setErrors({});
        }
    }, [isSuccess]);

    useEffect(() => {
        const fetchPacket = async () => {
            const res = await getAllPacketPost({ status: "ACTIVE" });
            setPacketList(res.data);
        };
        fetchPacket();
    }, []);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };
        if (name === "amount") updated.totalPrice = Number(value) * Number(formData.price);
        setFormData(updated);
    };

    const isPacketSelected = formData.title.trim() !== "";

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .bbp-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 55%, #fff7ed 100%);
                    padding: 1rem 1rem;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .bbp-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #1e1b4b;
                    text-align: center;
                    margin-bottom: 0.35rem;
                    letter-spacing: -0.02em;
                }

                .bbp-sub {
                    text-align: center;
                    font-size: 0.8rem;
                    color: #9ca3af;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 0rem;
                }

                /* ── Card ── */
                .bbp-card {
                    width: 100%;
                    max-width: 580px;
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.08);
                    padding: 1rem 1rem;
                    position: relative;
                    overflow: hidden;
                }

                .bbp-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #6366f1, #f97316);
                    border-radius: 20px 20px 0 0;
                }

                .bbp-card::after {
                    content: '';
                    position: absolute;
                    bottom: -60px; right: -50px;
                    width: 180px; height: 180px;
                    background: radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%);
                    pointer-events: none;
                }

                /* ── Icon header ── */
                .bbp-icon-wrap {
                    width: 52px;
                    height: 52px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, #eef2ff, #fff7ed);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                }

                .bbp-icon-wrap i { font-size: 1.25rem; color: #6366f1; }

                /* ── Section label ── */
                .bbp-section {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.69rem;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #6366f1;
                    margin: 0 0 1.1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .bbp-section::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, #e0e7ff, transparent);
                }

                /* ── Select ── */
                .bbp-label {
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-size: 0.72rem;
                    letter-spacing: 0.09em;
                    text-transform: uppercase;
                    color: #6b7280;
                    font-weight: 500;
                    margin-bottom: 0.4rem;
                }

                .bbp-label i { color: #a5b4fc; font-size: 0.68rem; }

                .bbp-select-wrap { position: relative; margin-bottom: 1.25rem; }

                .bbp-select-wrap::after {
                    content: '▾';
                    position: absolute;
                    right: 0.9rem; top: 50%;
                    transform: translateY(-50%);
                    color: #9ca3af; font-size: 0.75rem;
                    pointer-events: none;
                }

                .bbp-select {
                    width: 100%;
                    background: #f9fafb;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 10px;
                    padding: 0.68rem 2rem 0.68rem 0.95rem;
                    color: #111827;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.88rem;
                    outline: none;
                    appearance: none;
                    transition: border-color 0.22s, box-shadow 0.22s, background 0.22s;
                }

                .bbp-select:focus {
                    background: #fff;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.11);
                }

                .bbp-select.err { border-color: #f43f5e; box-shadow: 0 0 0 3px rgba(244,63,94,0.09); }
                .bbp-err { font-size: 0.71rem; color: #f43f5e; margin-top: 0.28rem; }

                /* ── Divider ── */
                .bbp-divider {
                    border: none;
                    border-top: 1px dashed #e5e7eb;
                    margin: 1.5rem 0 1.25rem;
                }

                /* ── Info grid ── */
                .bbp-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                @media (max-width: 480px) { .bbp-grid { grid-template-columns: 1fr; } }

                /* ── Read-only field ── */
                .bbp-field { display: flex; flex-direction: column; }

                .bbp-ro {
                    background: #f3f4f6;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 10px;
                    padding: 0.65rem 0.95rem;
                    color: #6b7280;
                    font-size: 0.88rem;
                    font-family: 'Inter', sans-serif;
                    user-select: none;
                    min-height: 42px;
                }

                /* ── Editable amount field ── */
                .bbp-input {
                    width: 100%;
                    background: #f9fafb;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 10px;
                    padding: 0.65rem 0.95rem;
                    color: #111827;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.88rem;
                    outline: none;
                    transition: border-color 0.22s, box-shadow 0.22s, background 0.22s;
                }

                .bbp-input:focus {
                    background: #fff;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.11);
                }

                .bbp-input.err { border-color: #f43f5e; }

                /* ── Total price box ── */
                .bbp-total-wrap { margin-bottom: 1.5rem; }

                .bbp-total-box {
                    background: linear-gradient(135deg, #eef2ff, #fff7ed);
                    border: 1.5px solid #e0e7ff;
                    border-radius: 12px;
                    padding: 1rem 1.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .bbp-total-label {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.78rem;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #6366f1;
                }

                .bbp-total-value {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.35rem;
                    font-weight: 700;
                    color: #1e1b4b;
                }

                .bbp-total-value span {
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: #9ca3af;
                    margin-left: 0.25rem;
                }

                /* ── Packet cards ── */
                .bbp-packets {
                    display: flex;
                    flex-direction: column;
                    gap: 0.6rem;
                    margin-bottom: 1.25rem;
                }

                .bbp-packet-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.75rem;
                    background: #f9fafb;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 0.75rem 1rem;
                    cursor: pointer;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                }

                .bbp-packet-item:hover {
                    border-color: #a5b4fc;
                    background: #eef2ff;
                }

                .bbp-packet-item.selected {
                    border-color: #6366f1;
                    background: #eef2ff;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }

                .bbp-packet-name {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #1e1b4b;
                }

                .bbp-packet-meta {
                    font-size: 0.74rem;
                    color: #6b7280;
                    margin-top: 0.1rem;
                }

                .bbp-packet-price {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.92rem;
                    font-weight: 700;
                    color: #6366f1;
                    white-space: nowrap;
                }

                .bbp-packet-check {
                    width: 18px; height: 18px;
                    border-radius: 50%;
                    border: 2px solid #d1d5db;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                    transition: border-color 0.2s, background 0.2s;
                }

                .bbp-packet-item.selected .bbp-packet-check {
                    border-color: #6366f1;
                    background: #6366f1;
                }

                .bbp-packet-check::after {
                    content: '';
                    width: 6px; height: 6px;
                    border-radius: 50%;
                    background: #fff;
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .bbp-packet-item.selected .bbp-packet-check::after { opacity: 1; }

                /* ── PayPal wrapper ── */
                .bbp-paypal {
                    margin-top: 0.5rem;
                    border-radius: 12px;
                    overflow: hidden;
                }
            `}</style>

            <div className="bbp-page">
                <h2 className="bbp-heading">Mua gói đăng tin</h2>
                <p className="bbp-sub">Chọn gói phù hợp để đăng tuyển dụng</p>

                <div className="bbp-card">
                    <div className="bbp-icon-wrap">
                        <i className="fa-solid fa-receipt" />
                    </div>

                    {/* ── Chọn gói ── */}
                    <p className="bbp-section"><i className="fa-solid fa-box-open" />Chọn gói đăng</p>

                    <div className="bbp-packets">
                        {packetList.map((item) => (
                            <div
                                key={item._id}
                                className={`bbp-packet-item ${formData.title === item.namePostPackage ? "selected" : ""}`}
                                onClick={() => handleSelectPacket(item._id)}
                            >
                                <div className="bbp-packet-check" />
                                <div style={{ flex: 1 }}>
                                    <p className="bbp-packet-name">{item.namePostPackage}</p>
                                    <p className="bbp-packet-meta">
                                        {item.typePostPackage} · {item.valuePostPackage} bài đăng
                                    </p>
                                </div>
                                <span className="bbp-packet-price">${item.price}</span>
                            </div>
                        ))}
                    </div>

                    {errors.title && <p className="bbp-err">✕ {errors.title}</p>}

                    {isPacketSelected && (
                        <>
                            <hr className="bbp-divider" />

                            {/* ── Chi tiết gói ── */}
                            <p className="bbp-section"><i className="fa-solid fa-circle-info" />Chi tiết đơn hàng</p>

                            <div className="bbp-grid">
                                <div className="bbp-field">
                                    <label className="bbp-label"><i className="fa-solid fa-tag" />Tên gói</label>
                                    <div className="bbp-ro">{formData.title || "—"}</div>
                                </div>
                                <div className="bbp-field">
                                    <label className="bbp-label"><i className="fa-solid fa-layer-group" />Loại gói</label>
                                    <div className="bbp-ro">{formData.typeInvoid || "—"}</div>
                                </div>
                                <div className="bbp-field">
                                    <label className="bbp-label"><i className="fa-solid fa-file-lines" />Số bài / gói</label>
                                    <div className="bbp-ro">{formData.value}</div>
                                </div>
                                <div className="bbp-field">
                                    <label className="bbp-label"><i className="fa-solid fa-dollar-sign" />Giá / gói ($)</label>
                                    <div className="bbp-ro">${formData.price}</div>
                                </div>
                            </div>

                            {/* Số lượng mua */}
                            <div className="bbp-field" style={{ marginBottom: "1.25rem" }}>
                                <label className="bbp-label"><i className="fa-solid fa-cart-shopping" />Số lượng mua</label>
                                <input
                                    type="number"
                                    name="amount"
                                    className={`bbp-input ${errors.amount ? "err" : ""}`}
                                    value={formData.amount}
                                    onChange={handleChange}
                                    min="1"
                                />
                                {errors.amount && <p className="bbp-err">✕ {errors.amount}</p>}
                            </div>

                            {/* Total */}
                            <div className="bbp-total-wrap">
                                <div className="bbp-total-box">
                                    <span className="bbp-total-label">
                                        <i className="fa-solid fa-wallet" style={{ marginRight: "0.4rem" }} />
                                        Tổng thanh toán
                                    </span>
                                    <span className="bbp-total-value">
                                        ${formData.totalPrice}<span>USD</span>
                                    </span>
                                </div>
                            </div>

                            {/* PayPal */}
                            <div className="bbp-paypal">
                                <App
                                    amount={totalPrice}
                                    payload={payloadToSend}
                                    setIsSuccess={setIsSuccess}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default BusinessBuyPostJob;
