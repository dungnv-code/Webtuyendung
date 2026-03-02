import { useState, useEffect } from "react";
import PaginationCustom from "../../../component/pagination/pagination";
import { getAllBusiness } from "../../../api/job";
import { RedoOutlined, SearchOutlined } from '@ant-design/icons';

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
        <div className="container py-4">

            {/* Search */}
            <div className="card shadow-sm p-4">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm theo tên công ty..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    {error?.inputValue && (
                        <p className="text-danger mt-2">{error.inputValue}</p>
                    )}
                </div>

                <div className="d-flex gap-3 justify-content-center">
                    <button className="btn btn-primary" onClick={hanleSearch}>
                        <SearchOutlined /> Tìm kiếm
                    </button>

                    <button className="btn btn-secondary" onClick={hanleReset}>
                        <RedoOutlined /> Hủy
                    </button>
                </div>
            </div>

            {/* BOX GRID */}
            <div className="row mt-4 g-4">
                {listBusiness?.map((item, index) => (
                    <div className="col-md-4 col-sm-6" key={item._id}>
                        <div className="card shadow-sm h-100 border-0">

                            {/* Cover */}
                            <div className="position-relative">
                                <img
                                    src={item.imageCoverBusiness}
                                    className="card-img-top"
                                    style={{ height: "140px", objectFit: "cover" }}
                                    alt="cover"
                                />

                                <img
                                    src={item.imageAvatarBusiness}
                                    alt="avatar"
                                    className="rounded-circle position-absolute"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        objectFit: "cover",
                                        bottom: "-35px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        border: "3px solid white",
                                    }}
                                />
                            </div>

                            <div className="card-body mt-4 text-center">
                                <h5 className="fw-bold">{item.nameBusiness}</h5>

                                <p className="text-muted small">{item.addressBusiness}</p>

                                <p className="text-secondary small">
                                    {item.descriptionBusiness?.slice(0, 90)}...
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
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