import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getAllBusiness } from "../../../api/job";
import { RedoOutlined, SearchOutlined } from '@ant-design/icons';
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Link } from "react-router-dom"
import path from "../../../ultils/path"
const Company = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [listBusiness, setListBusiness] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState({});
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllBusiness({
                    page: currentPage,
                    limit,
                    sort: "-createdAt",
                    nameBusiness: inputValue || undefined,
                });

                setListBusiness(response.data);
                setTotalPages(response.totalPages);

            } catch (error) {
                console.error("Error fetching business:", error);
            }
        };
        fetchData();
    }, [currentPage, limit, reload]);

    const hanleSearch = () => {
        const newError = {};
        if (!inputValue.trim()) {
            newError.inputValue = "Vui lòng nhập tên công ty bạn muốn tìm!";
        }
        setError(newError);

        if (Object.keys(newError).length === 0) {
            setCurrentPage(1);
            setReload(!reload);
        }
    };

    const hanleReset = () => {
        setInputValue("");
        setCurrentPage(1);
        setReload(!reload);
    };

    return (
        <div className="container ">
            <div className="card border-0 shadow-sm mb-4 text-success">
                <div className="card-body">
                    <h5 className="fw-bold text-center mb-3">
                        <i className="fa-solid fa-building me-2"></i>
                        Tìm kiếm công ty
                    </h5>

                    <div className="row g-2">
                        <div className="col-md-9">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập tên công ty..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            {error?.inputValue && (
                                <p className="text-danger small mt-1">{error.inputValue}</p>
                            )}
                        </div>

                        <div className="col-md-3 d-flex gap-2">
                            <button
                                className="btn btn-success w-100"
                                onClick={hanleSearch}
                            >
                                <SearchOutlined /> Tìm
                            </button>

                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={hanleReset}
                            >
                                <RedoOutlined />
                            </button>
                        </div>
                    </div>

                </div>
            </div>


            {/* COMPANY LIST */}
            <div className="row g-4">

                {listBusiness?.map((item) => (
                    <div className="col-lg-4 col-md-6" key={item._id}>

                        <div className="card h-100 border-0 shadow-sm">

                            {/* Cover */}
                            <div className="position-relative">

                                <img
                                    src={item.imageCoverBusiness}
                                    className="card-img-top"
                                    style={{ height: "150px", objectFit: "cover" }}
                                    alt=""
                                />

                                {/* Avatar */}
                                <img
                                    src={item.imageAvatarBusiness}
                                    alt=""
                                    className="rounded-circle position-absolute start-50 translate-middle border border-3 border-white shadow"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "cover",
                                        top: "100%"
                                    }}
                                />

                            </div>


                            {/* Body */}
                            <div className="card-body text-center pt-5">

                                <Link
                                    to={`${path.COMPANY}/${item._id}`}
                                    className="text-decoration-none"
                                >
                                    <h5 className="fw-bold text-dark mb-1">
                                        {item.nameBusiness}
                                    </h5>
                                </Link>

                                <p className="text-muted small mb-2">
                                    <i className="fa-solid fa-location-dot me-1"></i>
                                    {item.addressBusiness}
                                </p>

                                <div className="text-secondary small">
                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                        {(item.descriptionBusiness || "").slice(0, 90) + "..."}
                                    </ReactMarkdown>
                                </div>

                            </div>

                        </div>

                    </div>
                ))}

            </div>


            <div className="d-flex justify-content-center mt-5">
                <PaginationCustom
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    limit={limit}
                    totalPages={totalPages}
                />
            </div>

        </div>
    );
};

export default Company;