import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import path from "../../../ultils/path";
import { useEffect } from "react";
import { Adminsibar } from "../../../component";

const AdminLayout = () => {

    return (
        <div className="admin-layout">
            <div>
                <Adminsibar />
            </div>
            <div className="admin-content" style={{ marginLeft: "23%" }}>
                <Outlet />
            </div>
            <div className="admin-footer">
                <p>Admin Footer</p>
            </div>
        </div>
    );
}

export default AdminLayout;