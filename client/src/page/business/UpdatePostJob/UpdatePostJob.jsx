import { useState, useEffect } from "react";
import {
    getAllExp,
    getAllJob,
    getAllLevel,
    getAllSalaryrange,
    getAllSkill,
    getAllStyleJob,
    getDetailPostjobs
} from "../../../api/job";
import { Editor } from '@tinymce/tinymce-react';
import Select from "react-select";
import Loading from "../../../component/loading/Loading"
import { updatePostJob, getDetailPost } from "../../../api/business"
import Swal from "sweetalert2"
import { useParams } from "react-router-dom"
const UpdatePostJob = () => {
    const [exp, setExp] = useState([]);
    const [job, setJob] = useState([]);
    const [level, setLevel] = useState([]);
    const [Salaryrange, setSalaryrange] = useState([]);
    const [skill, setSkill] = useState([]);
    const [styleJob, setStyleJob] = useState([]);
    const [cities, setCities] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)

    const { idp } = useParams();

    const defaultDeadline = new Date();
    defaultDeadline.setDate(defaultDeadline.getDate() + 6 * 7);
    const formatDate = defaultDeadline.toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        jobs: "",
        experience: "",
        salaryRange: "",
        joblevel: "",
        workType: "",
        location: "",
        skills: [],
        quantity: "",
    });

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
                const json = await res.json();
                setCities(json.data);
            } catch (error) {
                console.error("Lỗi tải tỉnh thành:", error);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [expRes, jobRes, levelRes, salaryRes, skillRes, styleJobRes] =
                    await Promise.all([
                        getAllExp(),
                        getAllJob(),
                        getAllLevel(),
                        getAllSalaryrange(),
                        getAllSkill(),
                        getAllStyleJob()
                    ]);

                setExp(expRes?.data || []);
                setJob(jobRes?.data || []);
                setLevel(levelRes?.data || []);
                setSalaryrange(salaryRes?.data || []);
                setSkill(skillRes?.data || []);
                setStyleJob(styleJobRes?.data || []);
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            }
        };

        fetchAllData();
    }, []);
    const handleChange = async (e) => {
        const { name, value } = e.target;
        if (name == "jobs") {
            const reponre = await getAllSkill({ populate: "job:title,slug", flatten: true, job_title: value })
            setSkill(reponre.data)
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.title.trim()) newErrors.title = "Vui lòng nhập tiêu đề tuyển dụng";
        if (!formData.jobs) newErrors.jobs = "Vui lòng chọn ngành nghề";
        if (!formData.experience) newErrors.experience = "Vui lòng chọn kinh nghiệm";
        if (!formData.salaryRange) newErrors.salaryRange = "Vui lòng chọn mức lương";
        if (!formData.joblevel) newErrors.joblevel = "Vui lòng chọn cấp bậc";
        if (!formData.workType) newErrors.workType = "Vui lòng chọn hình thức làm việc";
        if (!formData.location) newErrors.location = "Vui lòng chọn địa điểm";
        if (!formData.quantity) newErrors.quantity = "Vui lòng nhập số lượng tuyển";
        if (!formData.description || formData.description.trim() === "<p></p>") {
            newErrors.description = "Vui lòng nhập mô tả công việc";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        const fetchPostJob = async () => {
            try {
                const res = await getDetailPost(idp);
                setFormData({
                    title: res.data.title,
                    description: res.data.description,
                    jobs: res.data.jobs,
                    experience: res.data.experience,
                    salaryRange: res.data.salaryRange,
                    joblevel: res.data.joblevel,
                    workType: res.data.workType,
                    location: res.data.location,
                    skills: res.data.skills,
                    quantity: res.data.quantity,
                })
                const respon = await getAllSkill({
                    populate: "job:title,slug",
                    flatten: true,
                    job_title: res.data.jobs
                });
                setSkill(respon.data);
            } catch (error) {
                console.error("Lỗi tải tỉnh thành:", error);
            }
        };
        fetchPostJob();
    }, [])

    const hanleSumitForm = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await updatePostJob(idp, formData);

            if (response?.success) {
                Swal.fire({
                    icon: "success",
                    title: "Cập tin tuyển dụng thành công!",
                    timer: 2000,
                    showConfirmButton: false
                });

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Tạo tin thất bại!",
                    text: response?.message || "Có lỗi xảy ra!"
                });
            }
        } catch (error) {
            console.error("Lỗi submit:", error);
            Swal.fire({
                icon: "error",
                title: "Lỗi kết nối!",
                text: error?.mes || "Không thể gửi dữ liệu!"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            {loading && <Loading />}
            <div className="card shadow border-0 rounded-4 p-4">
                <h3 className="fw-bold mb-4 text-center">Cập nhật bài tuyển dụng</h3>
                <div className="row g-4">
                    <div className="col-12">
                        <label className="form-label fw-semibold">Tên bài tuyển dụng</label>
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                        {errors.title && <p className="text-danger">{errors.title}</p>}
                    </div>

                    {/* JOB */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Lĩnh vực</label>
                        <select
                            className="form-select form-select-lg"
                            name="jobs"
                            value={formData.jobs}
                            onChange={handleChange}
                        >
                            <option value="">-- Chọn ngành nghề --</option>
                            {job.map((item) => (
                                <option key={item.title} value={item.title}>{item.title}</option>
                            ))}
                        </select>
                        {errors.jobs && <p className="text-danger">{errors.jobs}</p>}
                    </div>

                    {/* EXPERIENCE */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Kinh nghiệm</label>
                        <select
                            className="form-select form-select-lg"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                        >
                            <option value="">-- Chọn kinh nghiệm --</option>
                            {exp.map((item) => (
                                <option key={item.experience} value={item.experience}>
                                    {item.experience}
                                </option>
                            ))}
                        </select>
                        {errors.experience && <p className="text-danger">{errors.experience}</p>}
                    </div>

                    {/* SALARY */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Mức lương</label>
                        <select
                            className="form-select form-select-lg"
                            name="salaryRange"
                            value={formData.salaryRange}
                            onChange={handleChange}
                        >
                            <option value="">-- Chọn mức lương --</option>
                            {Salaryrange.map((s) => (
                                <option key={s._id} value={s._id}>{s.salaryRange}</option>
                            ))}
                        </select>
                        {errors.salaryRange && <p className="text-danger">{errors.salaryRange}</p>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Cấp bậc</label>
                        <select
                            className="form-select form-select-lg"
                            name="joblevel"
                            value={formData.joblevel}
                            onChange={handleChange}
                        >
                            <option value="">-- Chọn cấp bậc --</option>
                            {level.map((l) => (
                                <option key={l._id} value={l.nameLevel}>{l.nameLevel}</option>
                            ))}
                        </select>
                        {errors.joblevel && <p className="text-danger">{errors.joblevel}</p>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Hình thức làm việc</label>
                        <select
                            className="form-select form-select-lg"
                            name="workType"
                            value={formData.workType}
                            onChange={handleChange}
                        >
                            <option value="">-- Chọn hình thức --</option>
                            {styleJob.map((st) => (
                                <option key={st._id} value={st.workType}>{st.workType}</option>
                            ))}
                        </select>
                        {errors.workType && <p className="text-danger">{errors.workType}</p>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Kỹ năng</label>
                        <Select
                            isMulti
                            name="skills"
                            placeholder="-- Chọn kỹ năng --"
                            options={skill.map(sk => ({
                                value: sk.nameskill,
                                label: sk.nameskill
                            }))}
                            value={formData.skills.map(s => ({ value: s, label: s }))}
                            onChange={(selected) =>
                                setFormData(prev => ({
                                    ...prev,
                                    skills: selected.map(s => s.value)
                                }))
                            }
                        />
                    </div>

                    {/* QUANTITY */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Số lượng tuyển dụng</label>
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Số lượng..."
                            className="form-control form-control-lg"
                            value={formData.quantity}
                            onChange={handleChange}
                        />
                        {errors.quantity && <p className="text-danger">{errors.quantity}</p>}
                    </div>

                    {/* LOCATION */}
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Địa điểm</label>
                        <select
                            className="form-select form-select-lg"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        >
                            <option value="">-- Chọn Tỉnh/Thành phố --</option>
                            {cities.map((c) => (
                                <option key={c.code} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                        {errors.location && <p className="text-danger">{errors.location}</p>}
                    </div>

                    <div className="col-12">
                        <label className="form-label fw-semibold">Mô tả công việc</label>
                        <div className="border rounded p-2">
                            <Editor
                                name="description"
                                id="description"
                                onEditorChange={(content) =>
                                    setFormData((prev) => ({ ...prev, description: content }))
                                }
                                value={formData.description}
                                apiKey={import.meta.env.VITE_API_MAKE_DOWN}
                                init={{
                                    height: 450,
                                    menubar: true,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar:
                                        'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                                }}
                            />
                        </div>
                        {errors.description && <p className="text-danger">{errors.description}</p>}
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button className="btn btn-primary btn-lg" onClick={hanleSumitForm}>
                        Cập nhật bài đăng
                    </button>
                </div>
            </div>

            <style>{`
              /* Thu nhỏ đồng bộ input + select */
.form-control-lg,
.form-select-lg {
    padding: 8px 12px !important;
    font-size: 14px !important;
    border-radius: 8px !important;
}

/* Khi focus */
.form-select-lg:focus,
.form-control-lg:focus {
    border-color: #0d6efd !important;
    box-shadow: 0 0 0 0.15rem rgba(13, 110, 253, 0.25) !important;
}

/* Label */
label {
    font-size: 14px;
    font-weight: 600;
}

/* Card */
.card {
    border-radius: 16px;
    padding: 24px;
}
    
            `}</style>
        </div>
    );
};

export default UpdatePostJob