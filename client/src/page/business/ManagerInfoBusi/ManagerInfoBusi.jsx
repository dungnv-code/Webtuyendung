import { useState, useEffect } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { getDetailByBusiness, updateBusiness } from "../../../api/business";
import path from "../../../ultils/path"
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
    const [loading, setLoading] = useState(false)
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

                    // Preview ảnh từ BE
                    setPreview({
                        imageCoverBusiness: b.imageCoverBusiness,
                        imageAvatarBusiness: b.imageAvatarBusiness,
                        certification: b.certification,
                    });
                }
            }
            catch (err) {
                console.error("GET business error", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBusiness();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        // Xử lý file
        if (type === "file") {
            const file = files[0];

            setForm(prev => ({
                ...prev,
                [name]: file
            }));

            setPreview(prev => ({
                ...prev,
                [name]: URL.createObjectURL(file)
            }));

            return;
        }

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
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
        // if (!form.imageCoverBusiness) newErr.imageCoverBusiness = "Vui lòng chọn ảnh cover!";
        // if (!form.imageAvatarBusiness) newErr.imageAvatarBusiness = "Vui lòng chọn ảnh đại diện!";
        // if (!form.certification) newErr.certification = "Vui lòng tải lên chứng nhận doanh nghiệp!";

        setError(newErr);
        return Object.keys(newErr).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        const formData = new FormData();

        // Append text fields
        Object.keys(form).forEach(key => {
            if (
                key !== "imageCoverBusiness" &&
                key !== "imageAvatarBusiness" &&
                key !== "certification"
            ) {
                formData.append(key, form[key]);
            }
        });

        if (form.imageCoverBusiness instanceof File)
            formData.append("imageCoverBusiness", form.imageCoverBusiness);

        if (form.imageAvatarBusiness instanceof File)
            formData.append("imageAvatarBusiness", form.imageAvatarBusiness);

        if (form.certification instanceof File)
            formData.append("certification", form.certification);

        setLoading(true);

        try {
            const response = await updateBusiness(formData);

            if (response?.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật thành công!',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "Lỗi API",
                text: "Không thể cập nhật doanh nghiệp!"
            });
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            {loading && <Loading />}
            <div className="text-center mb-4">
                <h1>Cập nhật doanh nghiệp</h1>
            </div>

            <form onSubmit={handleSubmit} className="row g-4 p-4 bg-white shadow rounded">

                {/* ===== INPUT TEXT FIELDS ===== */}

                <div className="col-md-6">
                    <label className="form-label fw-semibold">Tên doanh nghiệp</label>
                    <input
                        type="text"
                        name="nameBusiness"
                        className={`form-control ${error.nameBusiness ? "is-invalid" : ""}`}
                        value={form.nameBusiness}
                        onChange={handleChange}
                        placeholder="VD: Công ty TNHH ABC"
                    />
                    {error.nameBusiness && <div className="invalid-feedback">{error.nameBusiness}</div>}
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-semibold">Mã số thuế</label>
                    <input
                        type="text"
                        name="taxiCodeBusiness"
                        className={`form-control ${error.taxiCodeBusiness ? "is-invalid" : ""}`}
                        value={form.taxiCodeBusiness}
                        onChange={handleChange}
                    />
                    {error.taxiCodeBusiness && <div className="invalid-feedback">{error.taxiCodeBusiness}</div>}
                </div>

                <div className="col-md-12">
                    <label className="form-label fw-semibold">Địa chỉ</label>
                    <input
                        type="text"
                        name="addressBusiness"
                        className={`form-control ${error.addressBusiness ? "is-invalid" : ""}`}
                        value={form.addressBusiness}
                        onChange={handleChange}
                    />
                    {error.addressBusiness && <div className="invalid-feedback">{error.addressBusiness}</div>}
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-semibold">Lĩnh vực</label>
                    <input
                        type="text"
                        name="FieldBusiness"
                        className={`form-control ${error.FieldBusiness ? "is-invalid" : ""}`}
                        value={form.FieldBusiness}
                        onChange={handleChange}
                    />
                    {error.FieldBusiness && <div className="invalid-feedback">{error.FieldBusiness}</div>}
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-semibold">Số điện thoại</label>
                    <input
                        type="text"
                        name="phoneBusiness"
                        className={`form-control ${error.phoneBusiness ? "is-invalid" : ""}`}
                        value={form.phoneBusiness}
                        onChange={handleChange}
                    />
                    {error.phoneBusiness && <div className="invalid-feedback">{error.phoneBusiness}</div>}
                </div>

                <div className="col-md-12">
                    <label className="form-label fw-semibold">Website</label>
                    <input
                        type="text"
                        name="websiteBusiness"
                        className={`form-control ${error.websiteBusiness ? "is-invalid" : ""}`}
                        value={form.websiteBusiness}
                        onChange={handleChange}
                    />
                    {error.websiteBusiness && <div className="invalid-feedback">{error.websiteBusiness}</div>}
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-semibold">Số lượng nhân viên</label>
                    <select
                        name="numberOfEmployees"
                        className={`form-select ${error.numberOfEmployees ? "is-invalid" : ""}`}
                        value={form.numberOfEmployees}
                        onChange={handleChange}
                    >
                        <option value="">-- Chọn --</option>
                        <option value="1-9 nhân viên">1-9 nhân viên</option>
                        <option value="10-24 nhân viên">10-24 nhân viên</option>
                        <option value="25-99 nhân viên">25-99 nhân viên</option>
                        <option value="100-499 nhân viên">100-499 nhân viên</option>
                        <option value="500+ nhân viên">500+ nhân viên</option>
                    </select>
                    {error.numberOfEmployees && <div className="invalid-feedback">{error.numberOfEmployees}</div>}
                </div>

                {/* ===== IMAGE UPLOAD PREVIEW ===== */}

                <div className="col-md-6">
                    <label className="form-label fw-semibold">Ảnh cover</label>
                    <input
                        type="file"
                        name="imageCoverBusiness"
                        className={`form-control ${error.imageCoverBusiness ? "is-invalid" : ""}`}
                        onChange={handleChange}
                        accept="image/*"
                    />
                    {error.imageCoverBusiness && <div className="invalid-feedback">{error.imageCoverBusiness}</div>}

                    {preview.imageCoverBusiness && (
                        <img
                            src={preview.imageCoverBusiness}
                            alt="cover"
                            className="img-fluid mt-2 rounded shadow-sm"
                            style={{ height: "160px", width: "100%", objectFit: "cover" }}
                        />
                    )}
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-semibold">Ảnh đại diện</label>
                    <input
                        type="file"
                        name="imageAvatarBusiness"
                        className={`form-control ${error.imageAvatarBusiness ? "is-invalid" : ""}`}
                        onChange={handleChange}
                        accept="image/*"
                    />
                    {error.imageAvatarBusiness && <div className="invalid-feedback">{error.imageAvatarBusiness}</div>}

                    {preview.imageAvatarBusiness && (
                        <img
                            src={preview.imageAvatarBusiness}
                            alt="avatar"
                            className="img-fluid mt-2 rounded-circle shadow-sm"
                            style={{ height: "140px", width: "140px", objectFit: "cover" }}
                        />
                    )}
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-semibold">Chứng nhận doanh nghiệp</label>
                    <input
                        type="file"
                        name="certification"
                        className={`form-control ${error.certification ? "is-invalid" : ""}`}
                        onChange={handleChange}
                        accept="image/*"
                    />
                    {error.certification && <div className="invalid-feedback">{error.certification}</div>}

                    {preview.certification && (
                        <img
                            src={preview.certification}
                            alt="certificate"
                            className="img-fluid mt-2 rounded shadow-sm"
                            style={{ height: "150px", width: "150px", objectFit: "cover" }}
                        />
                    )}
                </div>

                <div>
                    <label htmlFor="descriptionBusiness" className="form-label p-2">Mô tả</label>
                    <Editor
                        name="descriptionBusiness"
                        id="descriptionBusiness"
                        value={form.descriptionBusiness}   // <-- control editor bằng state
                        onEditorChange={(content) => {
                            setForm(prev => ({
                                ...prev,
                                descriptionBusiness: content
                            }));
                        }}
                        apiKey={import.meta.env.VITE_API_MAKE_DOWN}
                        init={{
                            height: 500,
                            menubar: true,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            toolbar:
                                'undo redo | blocks | bold italic forecolor | ' +
                                'alignleft aligncenter alignright alignjustify | ' +
                                'bullist numlist outdent indent | removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />
                </div>

                <div className="col-12">
                    <button className="btn btn-primary w-100 py-2 mt-3">
                        Cập nhật thông tin
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManagerInfoBusi;