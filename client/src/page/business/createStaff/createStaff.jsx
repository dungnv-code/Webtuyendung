import { useState } from "react";
import Swal from "sweetalert2";
import Loading from "../../../component/loading/Loading";
import { createStaffBusiness } from "../../../api/business";

const createStaff = () => {
    const [inputValue, setInputValue] = useState({ username: "", email: "", phone: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [focused, setFocused] = useState("");

    const handleChange = (e) => {
        setInputValue({ ...inputValue, [e.target.name]: e.target.value });
        setError({ ...error, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newError = {};
        if (!inputValue.username.trim()) newError.username = "Vui lòng nhập tên nhân viên!";
        if (!inputValue.email.trim()) newError.email = "Vui lòng nhập email!";
        else if (!/\S+@\S+\.\S+/.test(inputValue.email)) newError.email = "Email không hợp lệ!";
        if (!inputValue.phone.trim()) newError.phone = "Vui lòng nhập số điện thoại!";
        else if (!/^[0-9]{8,12}$/.test(inputValue.phone)) newError.phone = "Số điện thoại không hợp lệ!";
        setError(newError);
        if (Object.keys(newError).length > 0) return;

        setLoading(true);
        try {
            const repon = await createStaffBusiness(inputValue);
            if (repon?.success) {
                Swal.fire({ icon: "success", title: "Thêm nhân viên thành công!", timer: 1800, showConfirmButton: false });
                setInputValue({ username: "", email: "", phone: "" });
            } else {
                Swal.fire({ icon: "error", title: "Thêm nhân viên thất bại!", text: repon?.message || "Lỗi không xác định!" });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Lỗi server!" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .cs-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 55%, #f0fdf4 100%);
                    padding: 3rem 1rem;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .cs-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #1e1b4b;
                    text-align: center;
                    margin-bottom: 0.35rem;
                    letter-spacing: -0.02em;
                }

                .cs-sub {
                    text-align: center;
                    font-size: 0.8rem;
                    color: #9ca3af;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 2.5rem;
                }

                /* ── Card ── */
                .cs-card {
                    width: 100%;
                    max-width: 560px;
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.08);
                    padding: 2.5rem 2rem;
                    position: relative;
                    overflow: hidden;
                }

                .cs-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #6366f1, #06b6d4);
                    border-radius: 20px 20px 0 0;
                }

                /* glow accents */
                .cs-card::after {
                    content: '';
                    position: absolute;
                    bottom: -60px; right: -50px;
                    width: 180px; height: 180px;
                    background: radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%);
                    pointer-events: none;
                }

                /* ── Icon header ── */
                .cs-icon-wrap {
                    width: 52px;
                    height: 52px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, #eef2ff, #e0f2fe);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                }

                .cs-icon-wrap i {
                    font-size: 1.2rem;
                    color: #6366f1;
                }

                /* ── Section label ── */
                .cs-section {
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

                .cs-section::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, #e0e7ff, transparent);
                }

                /* ── Grid ── */
                .cs-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                @media (max-width: 480px) { .cs-grid { grid-template-columns: 1fr; } }

                /* ── Field ── */
                .cs-field { margin-bottom: 1.1rem; }

                .cs-label {
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-size: 0.72rem;
                    letter-spacing: 0.09em;
                    text-transform: uppercase;
                    color: #6b7280;
                    font-weight: 500;
                    margin-bottom: 0.4rem;
                    transition: color 0.2s;
                }

                .cs-label.active { color: #6366f1; }
                .cs-label i { color: #a5b4fc; font-size: 0.68rem; }

                .cs-input {
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

                .cs-input:focus {
                    background: #fff;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.11);
                }

                .cs-input.err {
                    border-color: #f43f5e;
                    box-shadow: 0 0 0 3px rgba(244,63,94,0.09);
                }

                .cs-input::placeholder { color: #c4c9d4; }

                .cs-err {
                    font-size: 0.71rem;
                    color: #f43f5e;
                    margin-top: 0.28rem;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }

                /* ── Divider ── */
                .cs-divider {
                    border: none;
                    border-top: 1px dashed #e5e7eb;
                    margin: 1.5rem 0 1.25rem;
                }

                /* ── Submit ── */
                .cs-btn {
                    width: 100%;
                    padding: 0.82rem;
                    border: none;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
                    color: #fff;
                    font-family: 'Sora', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 600;
                    letter-spacing: 0.07em;
                    text-transform: uppercase;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: transform 0.15s, box-shadow 0.15s;
                    position: relative;
                    overflow: hidden;
                }

                .cs-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(99,102,241,0.3);
                }

                .cs-btn:active { transform: translateY(0); }
                .cs-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
            `}</style>

            <div className="cs-page">
                {loading && <Loading />}

                <h2 className="cs-heading">Thêm nhân viên</h2>
                <p className="cs-sub">Tạo tài khoản nhân viên mới cho doanh nghiệp</p>

                <div className="cs-card">
                    <div className="cs-icon-wrap">
                        <i className="fa-solid fa-user-plus" />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <p className="cs-section"><i className="fa-solid fa-id-card" />Thông tin nhân viên</p>

                        {/* Username — full width */}
                        <div className="cs-field">
                            <label className={`cs-label ${focused === "username" ? "active" : ""}`}>
                                <i className="fa-solid fa-user" /> Tên nhân viên
                            </label>
                            <input
                                type="text"
                                name="username"
                                className={`cs-input ${error.username ? "err" : ""}`}
                                placeholder="Nhập tên nhân viên..."
                                value={inputValue.username}
                                onChange={handleChange}
                                onFocus={() => setFocused("username")}
                                onBlur={() => setFocused("")}
                            />
                            {error.username && <p className="cs-err">✕ {error.username}</p>}
                        </div>

                        {/* Email + Phone — 2 cols */}
                        <div className="cs-grid">
                            <div>
                                <label className={`cs-label ${focused === "email" ? "active" : ""}`}>
                                    <i className="fa-solid fa-envelope" /> Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className={`cs-input ${error.email ? "err" : ""}`}
                                    placeholder="you@company.com"
                                    value={inputValue.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused("")}
                                />
                                {error.email && <p className="cs-err">✕ {error.email}</p>}
                            </div>

                            <div>
                                <label className={`cs-label ${focused === "phone" ? "active" : ""}`}>
                                    <i className="fa-solid fa-phone" /> Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    className={`cs-input ${error.phone ? "err" : ""}`}
                                    placeholder="0xxxxxxxxx"
                                    value={inputValue.phone}
                                    onChange={handleChange}
                                    onFocus={() => setFocused("phone")}
                                    onBlur={() => setFocused("")}
                                />
                                {error.phone && <p className="cs-err">✕ {error.phone}</p>}
                            </div>
                        </div>

                        <hr className="cs-divider" />

                        <button type="submit" className="cs-btn" disabled={loading}>
                            <i className="fa-solid fa-plus" />
                            {loading ? "Đang xử lý..." : "Thêm nhân viên"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default createStaff;
