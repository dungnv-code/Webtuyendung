
const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-4 pb-2 mt-5">
            <div className="container">
                <div className="row">

                    <div className="col-md-4 mb-3">
                        <h5>Về chúng tôi</h5>
                        <p>
                            Website tuyển dụng cung cấp việc làm chất lượng, kết nối ứng viên và doanh nghiệp.
                        </p>

                    </div>

                    <div className="col-md-4 mb-3">
                        <h5>Liên kết</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-white text-decoration-none">Trang chủ</a></li>
                            <li><a href="#" className="text-white text-decoration-none">Công việc</a></li>
                            <li><a href="#" className="text-white text-decoration-none">Công ty</a></li>
                            <li><a href="#" className="text-white text-decoration-none">Giới thiệu</a></li>
                        </ul>
                    </div>

                    <div className="col-md-4 mb-3">
                        <h5>Liên hệ</h5>
                        <p>Email: support@gmail.com</p>
                        <p>Hotline: 0123 456 789</p>
                    </div>

                </div>

                <div className="text-center mt-3 border-top pt-2">
                    © 2026 Tuyển dụng. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;