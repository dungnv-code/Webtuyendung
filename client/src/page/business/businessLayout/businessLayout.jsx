import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import path from "../../../ultils/path";
import { Businesssibar } from "../../../component/"
import { useEffect } from "react";

const BusinessLayout = () => {

    return (
        <div className="business-layout">
            <div>
                <Businesssibar />
            </div>
            <div className="business-content" style={{ marginLeft: "25%" }}>
                <Outlet />
            </div>
        </div>
    );
}

export default BusinessLayout;