import path from '../../ultils/path';
import { Link } from 'react-router-dom';
import logo from '../../assets/topcv-logo.png';
const Header = () => {
    return <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">

                {/* Logo bên trái */}
                <Link className="navbar-brand" to={path.HOME}>
                    <img src={logo} alt="Logo" width="100" height="40" />
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to={path.HOME}>Trang chủ</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={path.JOB}>Công việc</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={path.COMPANY}>Công ty</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={path.INTRODUCTION}>Giới thiệu</Link>
                        </li>
                    </ul>

                    {/* Login bên phải */}
                    <div className="d-flex gap-2 ms-auto">
                        <Link className="btn btn-outline-primary" to={path.LOGIN}>
                            Đăng nhập
                        </Link>
                        <Link className="btn btn-outline-primary" to={path.REGISTER}>
                            Đăng ký
                        </Link>
                    </div>
                </div>

            </div>
        </nav>
    </>
}

export default Header;