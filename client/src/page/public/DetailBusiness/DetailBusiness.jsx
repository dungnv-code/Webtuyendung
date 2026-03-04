import { useEffect, useState } from "react";
import { getDetailBusiness } from "../../../api/job";
import { useParams } from "react-router-dom";
import { CodeSandboxOutlined, ContainerOutlined, EnvironmentOutlined } from '@ant-design/icons';
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { toast } from "react-toastify"
const DetailBusiness = () => {

    const [data, setData] = useState({});
    const { idb } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const repo = await getDetailBusiness(idb);
                setData(repo.data);
            } catch { }
        };
        fetchData();
    }, []);

    const generateMapIframe = (address) => {
        const encoded = encodeURIComponent(address);
        return `https://www.google.com/maps?q=${encoded}&output=embed`;
    };

    return (
        <>
            <div className="container my-4">

                {/* Cover */}
                <div className="position-relative">
                    <img
                        src={data.imageCoverBusiness}
                        className="img-fluid w-100 rounded"
                        style={{ height: "400px", objectFit: "cover" }}
                        alt="cover"
                    />

                    <div className="position-absolute w-100" style={{ top: "205px" }}>
                        <div className="container rounded shadow p-4" style={{ background: "linear-gradient(to right, #007bff, #00c6ff)" }}>
                            <div className="row text-center align-items-center g-3">
                                <div className="col-12 col-md-4">
                                    <img
                                        src={data.imageAvatarBusiness}
                                        className="border border-3 border-white shadow"
                                        style={{ width: "180px", height: "140px", objectFit: "cover" }}
                                        alt="avatar"
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <h5 className="fw-bold">{data.nameBusiness}</h5>
                                    <p className="text-muted mb-1">
                                        <ContainerOutlined className="me-2" />
                                        Lĩnh vực: {data.FieldBusiness}
                                    </p>
                                    <p className="text-muted mb-1">

                                        Nhân lực: {data.numberOfEmployees}
                                    </p>
                                </div>

                                {/* Cột 3: Website + button */}
                                <div className="col-12 col-md-4">
                                    <div className="bg-light rounded p-3 shadow-sm">
                                        <p className="mb-2">
                                            <CodeSandboxOutlined className="me-2" />
                                            Website:
                                            <a
                                                href={data.websiteBusiness}
                                                target="_blank"
                                                className="ms-1 text-primary text-decoration-none"
                                            >
                                                {data.websiteBusiness}
                                            </a>
                                        </p>

                                        <button className="btn btn-primary w-100">
                                            Theo dõi
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="row mt-2 g-4">

                        <div className="col-lg-8 col-md-7">
                            <div className="p-3 bg-white rounded" style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.15)" }}>
                                <div style={{ textAlign: "center", color: "#0066cc" }} >
                                    <h4 className="fw-semibold"> Giới thiệu công ty</h4>
                                </div>
                                <div className="text-secondary small">
                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                        {data.descriptionBusiness}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {/* Cột thông tin liên hệ */}
                        <div className="col-lg-4 col-md-5">
                            <div className="bg-white rounded p-3" style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.15)" }}>
                                <h5 className="text-center mb-3 fw-bold" style={{ color: "#0066cc" }}>
                                    Thông tin liên hệ
                                </h5>

                                <div className="mb-2">
                                    <span className="fw-semibold">
                                        <EnvironmentOutlined className="me-2" /> Địa chỉ công ty:
                                    </span>
                                    <div className="mt-1 ps-4 text-secondary">
                                        {data.addressBusiness}
                                    </div>
                                </div>

                                <div className="mt-3 mb-2 fw-semibold">
                                    <i className="fa-solid fa-map me-2"></i>
                                    Xem bản đồ:
                                </div>

                                <div className="mt-2">
                                    <iframe
                                        src={generateMapIframe(data.addressBusiness)}
                                        className="w-100"
                                        height="250"
                                        style={{
                                            border: 0,
                                            borderRadius: "10px",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                                        }}
                                        loading="lazy"
                                    ></iframe>
                                </div>
                            </div>
                            <div className="bg-white rounded p-3 mt-3" style={{ boxShadow: "0 6px 18px rgba(0,0,0,0.15)" }}>
                                <h5 className="text-center mb-3 fw-bold" style={{ color: "#0066cc" }}>
                                    Chia sẻ công ty tới bạn bè
                                </h5>
                                <div className="mb-2">
                                    <span className="fw-semibold">
                                        Sao chép đường dẫn:
                                    </span>
                                    <div
                                        className="mt-1 ps-4 text-secondary d-flex align-items-center"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            navigator.clipboard.writeText(data.websiteBusiness);
                                            toast.success("Đã sao chép link website!");
                                        }}
                                    >
                                        {data.websiteBusiness}
                                        <i className="fa-solid fa-copy ms-2"></i>
                                    </div>
                                    <span className="fw-semibold">
                                        Chia sẻ qua mạng xã hội
                                    </span>

                                    <div className="mt-2 ps-4 text-secondary social-icons d-flex align-items-center gap-2">
                                        <i className="fa-brands fa-facebook"></i>
                                        <i className="fa-brands fa-twitter"></i>
                                        <i className="fa-brands fa-linkedin"></i>
                                        <i className="fa-brands fa-tiktok"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default DetailBusiness;