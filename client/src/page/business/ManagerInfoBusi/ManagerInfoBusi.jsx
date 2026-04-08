import { useState, useEffect } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { getDetailByBusiness, updateBusiness } from "../../../api/business";
import path from "../../../ultils/path";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../../component/loading/Loading";

const ManagerInfoBusi = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nameBusiness: "",
        taxiCodeBusiness: "",
        addressBusiness: "",
        FieldBusiness: "",
        phoneBusiness: "",
        websiteBusiness: "",
        descriptionBusiness: "",
        numberOfEmployees: "",
        imageCoverBusiness: null,
        imageAvatarBusiness: null,
        certification: null,
    });

    const [preview, setPreview] = useState({
        imageCoverBusiness: "",
        imageAvatarBusiness: "",
        certification: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    useEffect(() => {
        const fetchBusiness = async () => {
            setLoading(true);
            try {
                const response = await getDetailByBusiness();
                if (response?.success) {
                    const b = response.data;
                    setForm({
                        nameBusiness: b.nameBusiness || "",
                        taxiCodeBusiness: b.taxiCodeBusiness || "",
                        addressBusiness: b.addressBusiness || "",
                        FieldBusiness: b.FieldBusiness || "",
                        phoneBusiness: b.phoneBusiness || "",
                        websiteBusiness: b.websiteBusiness || "",
                        descriptionBusiness: b.descriptionBusiness || "",
                        numberOfEmployees: b.numberOfEmployees || "",
                        imageCoverBusiness: null,
                        imageAvatarBusiness: null,
                        certification: null,
                    });
                    setPreview({
                        imageCoverBusiness: b.imageCoverBusiness,
                        imageAvatarBusiness: b.imageAvatarBusiness,
                        certification: b.certification,
                    });
                }
            } catch (err) {
                console.error("GET business error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBusiness();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            const file = files[0];
            setForm(prev => ({ ...prev, [name]: file }));
            setPreview(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
            return;
        }
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErr = {};
        if (!form.nameBusiness.trim()) newErr.nameBusiness = "Tên doanh nghiệp không được để trống!";
        if (!form.taxiCodeBusiness.trim()) newErr.taxiCodeBusiness = "Mã số thuế bắt buộc!";
        if (!form.addressBusiness.trim()) newErr.addressBusiness = "Địa chỉ không được để trống!";
        if (!form.FieldBusiness.trim()) newErr.FieldBusiness = "Lĩnh vực không được để trống!";
        if (!form.phoneBusiness.trim()) newErr.phoneBusiness = "Số điện thoại bắt buộc!";
        if (!form.websiteBusiness.trim()) newErr.websiteBusiness = "Website không được để trống!";
        if (!form.numberOfEmployees.trim()) newErr.numberOfEmployees = "Vui lòng chọn số lượng nhân viên!";
        setError(newErr);
        return Object.keys(newErr).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (!["imageCoverBusiness", "imageAvatarBusiness", "certification"].includes(key)) {
                formData.append(key, form[key]);
            }
        });
        if (form.imageCoverBusiness instanceof File) formData.append("imageCoverBusiness", form.imageCoverBusiness);
        if (form.imageAvatarBusiness instanceof File) formData.append("imageAvatarBusiness", form.imageAvatarBusiness);
        if (form.certification instanceof File) formData.append("certification", form.certification);

        setLoading(true);
        try {
            const response = await updateBusiness(formData);
            if (response?.success) {
                Swal.fire({ icon: 'success', title: 'Cập nhật thành công!', timer: 1500, showConfirmButton: false });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Lỗi API", text: "Không thể cập nhật doanh nghiệp!" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');

                .mb-page {
                    min-height: 100vh;
                    background: linear-gradient(160deg, #f0f4ff 0%, #fafafa 55%, #f0fdf4 100%);
                    padding: 1rem 1rem;
                    font-family: 'Inter', sans-serif;
                }

                .mb-heading {
                    font-family: 'Sora', sans-serif;
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #1e1b4b;
                    text-align: center;
                    margin-bottom: 0.35rem;
                    letter-spacing: -0.02em;
                }

                .mb-sub {
                    text-align: center;
                    font-size: 0.8rem;
                    color: #9ca3af;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 1rem;
                }

                /* ── Form card ── */
                .mb-form {
                    max-width: 900px;
                    margin: 0 auto;
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid #eef0f6;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.08);
                    padding: 2.5rem 2rem;
                    position: relative;
                    overflow: hidden;
                }

                /* top accent bar */
                .mb-form::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #6366f1, #10b981);
                    border-radius: 20px 20px 0 0;
                }

                /* ── Section title ── */
                .mb-section {
                    font-family: 'Sora', sans-serif;
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #6366f1;
                    margin: 0 0 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .mb-section::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, #e0e7ff, transparent);
                }

                /* ── Grid ── */
                .mb-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.1rem;
                    margin-bottom: 1.1rem;
                }

                .mb-grid.full { grid-template-columns: 1fr; }

                @media (max-width: 600px) {
                    .mb-grid { grid-template-columns: 1fr; }
                }

                /* ── Divider ── */
                .mb-divider {
                    border: none;
                    border-top: 1px dashed #e5e7eb;
                    margin: 1.75rem 0 1.5rem;
                }

                /* ── Field ── */
                .mb-label {
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

                .mb-label i { color: #a5b4fc; font-size: 0.68rem; }

                .mb-input, .mb-select {
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
                    appearance: none;
                }

                .mb-input:focus, .mb-select:focus {
                    background: #fff;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.11);
                }

                .mb-input.err, .mb-select.err {
                    border-color: #f43f5e;
                    box-shadow: 0 0 0 3px rgba(244,63,94,0.09);
                }

                .mb-input::placeholder { color: #c4c9d4; }

                .mb-err {
                    font-size: 0.71rem;
                    color: #f43f5e;
                    margin-top: 0.28rem;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }

                /* ── Select arrow ── */
                .mb-select-wrap { position: relative; }

                .mb-select-wrap::after {
                    content: '▾';
                    position: absolute;
                    right: 0.85rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9ca3af;
                    font-size: 0.75rem;
                    pointer-events: none;
                }

                /* ── File upload ── */
                .mb-file-label {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    background: #f9fafb;
                    border: 1.5px dashed #d1d5db;
                    border-radius: 10px;
                    padding: 0.65rem 0.95rem;
                    cursor: pointer;
                    font-size: 0.82rem;
                    color: #6b7280;
                    transition: border-color 0.2s, background 0.2s;
                }

                .mb-file-label:hover {
                    border-color: #6366f1;
                    background: #eef2ff;
                    color: #6366f1;
                }

                .mb-file-label i { font-size: 0.85rem; }

                /* ── Image preview ── */
                .mb-preview-cover {
                    margin-top: 0.75rem;
                    width: 100%;
                    height: 130px;
                    object-fit: cover;
                    border-radius: 10px;
                    border: 1px solid #e5e7eb;
                }

                .mb-preview-avatar {
                    margin-top: 0.75rem;
                    width: 100px;
                    height: 100px;
                    object-fit: cover;
                    border-radius: 12px;
                    border: 2px solid #e0e7ff;
                    box-shadow: 0 2px 10px rgba(99,102,241,0.1);
                }

                .mb-preview-cert {
                    margin-top: 0.75rem;
                    width: 130px;
                    height: 130px;
                    object-fit: cover;
                    border-radius: 10px;
                    border: 1px solid #e5e7eb;
                }

                /* ── Submit ── */
                .mb-btn {
                    width: 100%;
                    padding: 0.85rem;
                    border: none;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    color: #fff;
                    font-family: 'Sora', sans-serif;
                    font-size: 0.85rem;
                    font-weight: 600;
                    letter-spacing: 0.07em;
                    text-transform: uppercase;
                    cursor: pointer;
                    margin-top: 1rem;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.15s, box-shadow 0.15s;
                }

                .mb-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(99,102,241,0.32);
                }

                .mb-btn:active { transform: translateY(0); }
                .mb-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>

            <div className="mb-page">
                {loading && <Loading />}

                <h2 className="mb-heading">Cập nhật doanh nghiệp</h2>
                <p className="mb-sub">Quản lý thông tin hồ sơ công ty</p>

                <form className="mb-form" onSubmit={handleSubmit}>
                    <p className="mb-section"><i className="fa-solid fa-building" /> Thông tin cơ bản</p>

                    <div className="mb-grid">
                        <div>
                            <label className="mb-label"><i className="fa-solid fa-tag" /> Tên doanh nghiệp</label>
                            <input
                                type="text" name="nameBusiness"
                                className={`mb-input ${error.nameBusiness ? "err" : ""}`}
                                value={form.nameBusiness} onChange={handleChange}
                                placeholder="VD: Công ty TNHH ABC"
                            />
                            {error.nameBusiness && <p className="mb-err">✕ {error.nameBusiness}</p>}
                        </div>
                        <div>
                            <label className="mb-label"><i className="fa-solid fa-file-invoice" /> Mã số thuế</label>
                            <input
                                type="text" name="taxiCodeBusiness"
                                className={`mb-input ${error.taxiCodeBusiness ? "err" : ""}`}
                                value={form.taxiCodeBusiness} onChange={handleChange}
                                placeholder="0123456789"
                            />
                            {error.taxiCodeBusiness && <p className="mb-err">✕ {error.taxiCodeBusiness}</p>}
                        </div>
                    </div>

                    <div className="mb-grid full" style={{ marginBottom: "1.1rem" }}>
                        <div>
                            <label className="mb-label"><i className="fa-solid fa-location-dot" /> Địa chỉ</label>
                            <input
                                type="text" name="addressBusiness"
                                className={`mb-input ${error.addressBusiness ? "err" : ""}`}
                                value={form.addressBusiness} onChange={handleChange}
                                placeholder="Số nhà, đường, quận, thành phố..."
                            />
                            {error.addressBusiness && <p className="mb-err">✕ {error.addressBusiness}</p>}
                        </div>
                    </div>

                    <div className="mb-grid">
                        <div>
                            <label className="mb-label"><i className="fa-solid fa-layer-group" /> Lĩnh vực</label>
                            <input
                                type="text" name="FieldBusiness"
                                className={`mb-input ${error.FieldBusiness ? "err" : ""}`}
                                value={form.FieldBusiness} onChange={handleChange}
                                placeholder="VD: Công nghệ thông tin"
                            />
                            {error.FieldBusiness && <p className="mb-err">✕ {error.FieldBusiness}</p>}
                        </div>

                        <div>
                            <label className="mb-label"><i className="fa-solid fa-phone" /> Số điện thoại</label>
                            <input
                                type="text" name="phoneBusiness"
                                className={`mb-input ${error.phoneBusiness ? "err" : ""}`}
                                value={form.phoneBusiness} onChange={handleChange}
                                placeholder="0xxxxxxxxx"
                            />
                            {error.phoneBusiness && <p className="mb-err">✕ {error.phoneBusiness}</p>}
                        </div>
                    </div>

                    <div className="mb-grid">
                        <div>
                            <label className="mb-label"><i className="fa-solid fa-globe" /> Website</label>
                            <input
                                type="text" name="websiteBusiness"
                                className={`mb-input ${error.websiteBusiness ? "err" : ""}`}
                                value={form.websiteBusiness} onChange={handleChange}
                                placeholder="https://company.com"
                            />
                            {error.websiteBusiness && <p className="mb-err">✕ {error.websiteBusiness}</p>}
                        </div>

                        <div>
                            <label className="mb-label"><i className="fa-solid fa-users" /> Số lượng nhân viên</label>
                            <div className="mb-select-wrap">
                                <select
                                    name="numberOfEmployees"
                                    className={`mb-select ${error.numberOfEmployees ? "err" : ""}`}
                                    value={form.numberOfEmployees} onChange={handleChange}
                                >
                                    <option value="">-- Chọn quy mô --</option>
                                    <option value="1-9 nhân viên">1 - 9 nhân viên</option>
                                    <option value="10-24 nhân viên">10 - 24 nhân viên</option>
                                    <option value="25-99 nhân viên">25 - 99 nhân viên</option>
                                    <option value="100-499 nhân viên">100 - 499 nhân viên</option>
                                    <option value="500+ nhân viên">500+ nhân viên</option>
                                </select>
                            </div>
                            {error.numberOfEmployees && <p className="mb-err">✕ {error.numberOfEmployees}</p>}
                        </div>
                    </div>

                    <hr className="mb-divider" />

                    <p className="mb-section"><i className="fa-solid fa-image" /> Hình ảnh & Giấy tờ</p>

                    <div className="mb-grid">
                        <div>
                            <label className="mb-label"><i className="fa-solid fa-panorama" /> Ảnh cover</label>
                            <label className="mb-file-label">
                                <i className="fa-solid fa-cloud-arrow-up" />
                                Chọn ảnh cover
                                <input type="file" name="imageCoverBusiness" accept="image/*" onChange={handleChange} style={{ display: "none" }} />
                            </label>
                            {error.imageCoverBusiness && <p className="mb-err">✕ {error.imageCoverBusiness}</p>}
                            {preview.imageCoverBusiness && (
                                <img src={preview.imageCoverBusiness} alt="cover" className="mb-preview-cover" />
                            )}
                        </div>

                        <div>
                            <label className="mb-label"><i className="fa-solid fa-id-badge" /> Ảnh đại diện</label>
                            <label className="mb-file-label">
                                <i className="fa-solid fa-cloud-arrow-up" />
                                Chọn ảnh đại diện
                                <input type="file" name="imageAvatarBusiness" accept="image/*" onChange={handleChange} style={{ display: "none" }} />
                            </label>
                            {error.imageAvatarBusiness && <p className="mb-err">✕ {error.imageAvatarBusiness}</p>}
                            {preview.imageAvatarBusiness && (
                                <img src={preview.imageAvatarBusiness} alt="avatar" className="mb-preview-avatar" />
                            )}
                        </div>
                    </div>

                    <div className="mb-grid full" style={{ marginBottom: "1.1rem" }}>
                        <div>
                            <label className="mb-label"><i className="fa-solid fa-certificate" /> Chứng nhận doanh nghiệp</label>
                            <label className="mb-file-label">
                                <i className="fa-solid fa-cloud-arrow-up" />
                                Tải lên chứng nhận
                                <input type="file" name="certification" accept="image/*" onChange={handleChange} style={{ display: "none" }} />
                            </label>
                            {error.certification && <p className="mb-err">✕ {error.certification}</p>}
                            {preview.certification && (
                                <img src={preview.certification} alt="certificate" className="mb-preview-cert" />
                            )}
                        </div>
                    </div>

                    <hr className="mb-divider" />

                    <p className="mb-section"><i className="fa-solid fa-align-left" /> Mô tả doanh nghiệp</p>

                    <Editor
                        name="descriptionBusiness"
                        id="descriptionBusiness"
                        value={form.descriptionBusiness}
                        onEditorChange={(content) => setForm(prev => ({ ...prev, descriptionBusiness: content }))}
                        apiKey={import.meta.env.VITE_API_MAKE_DOWN}
                        init={{
                            height: 400,
                            menubar: true,
                            plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
                            toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                            content_style: "body { font-family: 'Inter', sans-serif; font-size: 14px; color: #111827; }",
                        }}
                    />

                    <button type="submit" className="mb-btn" disabled={loading}>
                        {loading ? "Đang lưu..." : "Cập nhật thông tin"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default ManagerInfoBusi;
