import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "../../../component/loading/Loading";
import { updateUser } from "../../../api/user";
import { toast } from "react-toastify";
import { getCurrent } from "../../../redux/userUser/asyncActionUser";

const UserInfo = () => {
    const User = useSelector(state => state.user.current);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [focused, setFocused] = useState("");

    const [formData, setFormData] = useState({
        avatar: "",
        username: "",
        email: "",
        phone: "",
        avatarFile: null,
    });

    useEffect(() => {
        if (User) {
            setFormData({
                avatar: User.avatar,
                username: User.username,
                email: User.email,
                phone: User.phone,
                avatarFile: null
            });
        }
    }, [User]);

    const validate = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Username không được để trống!";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email không hợp lệ!";
        if (!/^[0-9]{9,11}$/.test(formData.phone)) newErrors.phone = "Số điện thoại phải 9 - 11 số!";
        if (formData.avatarFile) {
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!validTypes.includes(formData.avatarFile.type)) newErrors.avatar = "Chỉ chấp nhận JPG, PNG, WEBP";
            if (formData.avatarFile.size > 3 * 1024 * 1024) newErrors.avatar = "Ảnh phải nhỏ hơn 3MB!";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, avatar: URL.createObjectURL(file), avatarFile: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) { toast.error("Vui lòng kiểm tra lại thông tin!"); return; }
        setLoading(true);
        try {
            const data = new FormData();
            if (formData.avatarFile) data.append("avatar", formData.avatarFile);
            data.append("username", formData.username);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            const response = await updateUser(User._id, data);
            if (response?.success) {
                toast.success("Cập nhật thành công!");
                dispatch(getCurrent(response.data));
            } else {
                toast.error("Cập nhật thất bại!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');

                .ui-wrapper {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #e0e7ff 0%, #f0fdf4 50%, #fdf2f8 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 1rem;
                    font-family: 'DM Sans', sans-serif;
                }

                .ui-card {
                    width: 100%;
                    max-width: 480px;
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 20px;
                    padding: 2.5rem 2rem;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(99,102,241,0.1), 0 4px 16px rgba(0,0,0,0.06);
                }

                /* Glow top-left accent */
                .ui-card::before {
                    content: '';
                    position: absolute;
                    top: -60px;
                    left: -60px;
                    width: 200px;
                    height: 200px;
                    background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
                    pointer-events: none;
                }

                /* Glow bottom-right accent */
                .ui-card::after {
                    content: '';
                    position: absolute;
                    bottom: -60px;
                    right: -40px;
                    width: 180px;
                    height: 180px;
                    background: radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 70%);
                    pointer-events: none;
                }

                .ui-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    color: #1e1b4b;
                    text-align: center;
                    margin-bottom: 0.25rem;
                    letter-spacing: 0.01em;
                }

                .ui-subtitle {
                    text-align: center;
                    color: #9ca3af;
                    font-size: 0.8rem;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    margin-bottom: 2rem;
                }

                /* ── Avatar ── */
                .avatar-ring {
                    position: relative;
                    width: 110px;
                    height: 110px;
                    margin: 0 auto 1.5rem;
                    cursor: pointer;
                }

                .avatar-ring img {
                    width: 110px;
                    height: 110px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #e0e7ff;
                    transition: opacity 0.3s;
                    display: block;
                }

                .avatar-ring:hover img { opacity: 0.6; }

                .avatar-overlay {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none;
                }

                .avatar-ring:hover .avatar-overlay { opacity: 1; }

                .avatar-overlay span {
                    font-size: 0.68rem;
                    color: #ffffff;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    font-weight: 600;
                    text-shadow: 0 1px 4px rgba(0,0,0,0.4);
                }

                /* Spinning gradient ring on hover */
                .avatar-ring::before {
                    content: '';
                    position: absolute;
                    inset: -3px;
                    border-radius: 50%;
                    background: conic-gradient(#6366f1, #f472b6, #6366f1);
                    opacity: 0;
                    transition: opacity 0.3s;
                    z-index: -1;
                    animation: spin 3s linear infinite;
                }

                .avatar-ring:hover::before { opacity: 1; }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }

                .avatar-err {
                    color: #f43f5e;
                    font-size: 0.75rem;
                    text-align: center;
                    margin-top: -0.75rem;
                    margin-bottom: 1rem;
                }

                /* ── Fields ── */
                .field-group {
                    margin-bottom: 1.25rem;
                }

                .field-label {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.72rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #6b7280;
                    margin-bottom: 0.4rem;
                    font-weight: 500;
                    transition: color 0.2s;
                }

                .field-label.active { color: #6366f1; }

                .field-label svg {
                    width: 13px;
                    height: 13px;
                    flex-shrink: 0;
                }

                .field-input {
                    width: 100%;
                    background: #f9fafb;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 10px;
                    padding: 0.7rem 1rem;
                    color: #111827;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.9rem;
                    outline: none;
                    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
                }

                .field-input:focus {
                    background: #fff;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
                }

                .field-input.is-invalid {
                    border-color: #f43f5e;
                    box-shadow: 0 0 0 3px rgba(244,63,94,0.1);
                }

                .field-input::placeholder { color: #c4c9d4; }

                .field-err {
                    font-size: 0.72rem;
                    color: #f43f5e;
                    margin-top: 0.3rem;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }

                /* ── Divider ── */
                .ui-divider {
                    border: none;
                    border-top: 1px solid #f0f0f0;
                    margin: 1.5rem 0;
                }

                /* ── Submit ── */
                .ui-btn {
                    width: 100%;
                    padding: 0.8rem;
                    border: none;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 500;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.15s, box-shadow 0.15s;
                }

                .ui-btn::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent);
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .ui-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.35); }
                .ui-btn:hover::after { opacity: 1; }
                .ui-btn:active { transform: translateY(0); }
                .ui-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
            `}</style>

            <div className="ui-wrapper" style={{ marginBottom: "20px" }}>
                {loading && <Loading />}

                <div className="ui-card">
                    <h2 className="ui-title">Hồ sơ cá nhân</h2>
                    <p className="ui-subtitle">Chỉnh sửa thông tin tài khoản</p>

                    <form onSubmit={handleSubmit}>

                        {/* Avatar */}
                        <label style={{ display: "block", cursor: "pointer" }}>
                            <div className="avatar-ring">
                                <img src={formData.avatar || "https://ui-avatars.com/api/?background=6366f1&color=fff&name=U"} alt="avatar" />
                                <div className="avatar-overlay"><span>Đổi ảnh</span></div>
                            </div>
                            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                        </label>
                        {errors.avatar && <p className="avatar-err">⚠ {errors.avatar}</p>}

                        <hr className="ui-divider" />

                        {/* Username */}
                        <div className="field-group">
                            <label className={`field-label ${focused === "username" ? "active" : ""}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                                Tên người dùng
                            </label>
                            <input
                                type="text"
                                name="username"
                                className={`field-input ${errors.username ? "is-invalid" : ""}`}
                                value={formData.username}
                                onChange={handleInputChange}
                                onFocus={() => setFocused("username")}
                                onBlur={() => setFocused("")}
                                placeholder="Nhập tên hiển thị..."
                            />
                            {errors.username && <p className="field-err">✕ {errors.username}</p>}
                        </div>

                        {/* Email */}
                        <div className="field-group">
                            <label className={`field-label ${focused === "email" ? "active" : ""}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" /></svg>
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                className={`field-input ${errors.email ? "is-invalid" : ""}`}
                                value={formData.email}
                                onChange={handleInputChange}
                                onFocus={() => setFocused("email")}
                                onBlur={() => setFocused("")}
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="field-err">✕ {errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div className="field-group">
                            <label className={`field-label ${focused === "phone" ? "active" : ""}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.21 3.58 2 2 0 0 1 3.22 1.4h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z" /></svg>
                                Số điện thoại
                            </label>
                            <input
                                type="text"
                                name="phone"
                                className={`field-input ${errors.phone ? "is-invalid" : ""}`}
                                value={formData.phone}
                                onChange={handleInputChange}
                                onFocus={() => setFocused("phone")}
                                onBlur={() => setFocused("")}
                                placeholder="0xxxxxxxxx"
                            />
                            {errors.phone && <p className="field-err">✕ {errors.phone}</p>}
                        </div>

                        <hr className="ui-divider" />

                        <button type="submit" className="ui-btn" disabled={loading}>
                            {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UserInfo;
