import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { path } from '../../../ultils/path';
// import { getCurrent } from "../../../redux/userSlice/asyncActionUser";
import { useEffect } from "react";
// import { Adminsibar } from "../../../component";
// import { getCategoris } from "../../../redux/Slice/asyncActionProducts";

const AdminLayout = () => {
    const { isLogIn, current } = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isLogIn && !current) {
            dispatch(getCurrent());
        }
    }, [isLogIn, current, dispatch]);

    useEffect(() => {
        dispatch(getCategoris())
    }, [])

    // Nếu chưa login → redirect ngay
    if (!isLogIn) {
        return <Navigate to={path.LOGIN} replace />;
    }

    if (current?.role == "1945") {
        return <Navigate to={path.HOME} replace />;
    }

    if (isLogIn && !current) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-layout">
            <div>
                <Adminsibar />
            </div>
            <div className="admin-content" style={{ marginLeft: "20%" }}>
                <Outlet />
            </div>
            <div className="admin-footer">
                <p>Admin Footer</p>
            </div>
        </div>
    );
}

export default AdminLayout;