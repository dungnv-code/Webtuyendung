import { Outlet } from "react-router-dom";
import { Header, Footer, ChatBox } from '../../../component';

const DefaultPublic = () => {
    return <>
        <div style={{ position: "relative" }}>
            <div style={{ position: "fixed", bottom: "5%", right: "5%", zIndex: 1000 }}>
                <div
                    className="bg-info"
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ChatBox />
                </div>
            </div>
            <div>
                <Header />
            </div>
            <div className="container" style={{ minHeight: "calc(100vh - 100px)", paddingTop: "30px" }}>
                <Outlet />
            </div>
            <div>
                <Footer />
            </div>
        </div>
    </>
}

export default DefaultPublic;