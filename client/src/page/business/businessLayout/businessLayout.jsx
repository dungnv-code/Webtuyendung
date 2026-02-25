import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import path from "../../../ultils/path";

import { useEffect } from "react";


const BusinessLayout = () => {

    return (
        <div className="business-layout">
            <div>
                <h1>Business Header</h1>
            </div>
            <div className="business-content" style={{ marginLeft: "20%" }}>
                <Outlet />
            </div>
            <div className="business-footer">
                <p>Business Footer</p>
            </div>
        </div>
    );
}

export default BusinessLayout;