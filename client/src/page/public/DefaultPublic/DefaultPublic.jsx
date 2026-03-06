import { Outlet } from "react-router-dom";
import { Header, Footer, ChatBox } from '../../../component';

const DefaultPublic = () => {
    return <>
        <div style={{ position: "relative" }}>
            <ChatBox />
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