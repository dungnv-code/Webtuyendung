import { useState, useEffect } from "react";
import { Pagination } from 'antd';
const PaginationCustom = ({ currentPage, setCurrentPage, limit, totalPages, }) => {
    const handleChange = (page) => {
        setCurrentPage(page);
    }
    return (<>
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination defaultCurrent={currentPage} onChange={handleChange} pageSize={limit} total={totalPages * limit} />
        </div>
    </>)
}

export default PaginationCustom;