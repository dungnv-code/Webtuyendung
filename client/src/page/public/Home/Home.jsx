import { Link } from 'react-router-dom';
import banner from '../../../assets/banner.png';
import path from '../../../ultils/path';
import { getSkill } from "../../../redux/userJob/asyncActionJob";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
const Home = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await dispatch(getSkill());
                console.log("Skills:", response);
            } catch (error) {
                console.error("Error fetching skills:", error);
            }
        };

        fetchSkills();
    }, [dispatch]);

    return (
        <div className="home">
            <div>
                <img src={banner} alt="Banner" width="100%" height="400" />
            </div>

            <div style={{ marginTop: "50px", textAlign: "center" }}>
                <div>
                    <p>Lĩnh công việc nổi bật</p>
                    <h1>Danh mục ngành nghề</h1>
                </div>

                <div style={{ display: "flex", gap: "20px", marginTop: "40px" }}>
                    <div style={{ flex: 1, backgroundColor: "#f0f0f0", padding: "20px", borderRadius: "8px" }}>
                        <h2>Ngành IT</h2>
                        <p>Phát triển phần mềm, quản trị mạng, an ninh mạng...</p>
                    </div>
                    <div style={{ flex: 1, backgroundColor: "#f0f0f0", padding: "20px", borderRadius: "8px" }}>
                        <h2>Ngành Marketing</h2>
                        <p>Quảng cáo, truyền thông, nghiên cứu thị trường...</p>
                    </div>
                    <div style={{ flex: 1, backgroundColor: "#f0f0f0", padding: "20px", borderRadius: "8px" }}>
                        <h2>Ngành Tài chính</h2>
                        <p>Kế toán, phân tích tài chính, ngân hàng...</p>
                    </div>
                    <div style={{ flex: 1, backgroundColor: "#f0f0f0", padding: "20px", borderRadius: "8px" }}>
                        <h2>Ngành Sản xuất</h2>
                        <p>Quản lý sản xuất, kỹ thuật, vận hành...</p>
                    </div>
                </div>
            </div>

            {/* Banner */}
            <div style={{ marginTop: "50px", textAlign: "center" }}>
                <div style={{ position: "relative" }}>
                    <img
                        src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/company_covers/yb1I4bHCyIFi2WrPAdyN.jpg"
                        alt="Banner"
                        style={{ width: "100%", height: "400px", objectFit: "cover" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0,0,0,0.4)"
                        }}
                    ></div>

                    <div
                        style={{
                            position: "absolute",
                            top: "30%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            color: "white",
                            textAlign: "center"
                        }}
                    >
                        <h1>Top công ty tuyển dụng</h1>
                        <p>Cơ hội làm việc tại các công ty hàng đầu</p>

                        <button
                            style={{
                                marginTop: "40px",
                                padding: "10px 20px",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px"
                            }}
                        >
                            <Link to={path.JOB} style={{ color: "#fff", textDecoration: "none" }}>
                                Tìm việc ngay
                            </Link>
                        </button>
                    </div>
                </div>
            </div>

            {/* Công việc mới */}
            <div style={{ marginTop: "50px", textAlign: "center" }}>
                <p>Công việc mới nhất</p>
                <h1>Việc làm mới nhất</h1>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "40px", marginTop: "40px" }}>
                    <div style={{ backgroundColor: "#f0f0f0", width: "80%", padding: "10px", borderRadius: "8px" }}>
                        <h2>Chuyên viên Marketing</h2>
                        <p>Công ty ABC - Hà Nội</p>
                    </div>
                    <div style={{ backgroundColor: "#f0f0f0", width: "80%", padding: "10px", borderRadius: "8px" }}>
                        <h2>Kỹ sư phần mềm</h2>
                        <p>Công ty XYZ - Hồ Chí Minh</p>
                    </div>
                    <div style={{ backgroundColor: "#f0f0f0", width: "80%", padding: "10px", borderRadius: "8px" }}>
                        <h2>Kế toán viên</h2>
                        <p>Công ty DEF - Đà Nẵng</p>
                    </div>
                </div>
            </div>

            {/* Quy trình ứng tuyển */}
            <div style={{ marginTop: "50px", textAlign: "center", backgroundColor: "#f9f9f9", padding: "40px 20px" }}>
                <p>Quy trình ứng tuyển đơn giản</p>
                <h1>Ứng tuyển dễ dàng chỉ với 3 bước</h1>

                <div style={{ display: "flex", gap: "80px", marginTop: "40px", justifyContent: "center" }}>
                    <div style={{ backgroundColor: "#f0f0f0", padding: "20px", borderRadius: "8px", width: "200px" }}>
                        <h2>Bước 1</h2>
                        <p>Tìm kiếm công việc</p>
                    </div>
                    <div style={{ backgroundColor: "#f0f0f0", padding: "20px", borderRadius: "8px", width: "200px" }}>
                        <h2>Bước 2</h2>
                        <p>Ứng tuyển công việc</p>
                    </div>
                    <div style={{ backgroundColor: "#f0f0f0", padding: "20px", borderRadius: "8px", width: "200px" }}>
                        <h2>Bước 3</h2>
                        <p>Nhận công việc</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;