import axios from "axios";
import Swal from "sweetalert2";

const instance = axios.create({ baseURL: import.meta.env.VITE_API_SERVER });

instance.interceptors.request.use((config) => {

    let localStoData = window.localStorage.getItem("persist:tuyendung/user");
    if (typeof localStoData === 'string') {
        try {
            const parsedData = JSON.parse(localStoData);
            const accessToken = parsedData.token ? JSON.parse(parsedData.token) : null;
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        } catch (e) {
            console.error("Lỗi parse token từ localStorage:", e);
        }
    }

    return config;
});

instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const errData = error.response?.data || { mes: "Lỗi kết nối server" };
        const status = error.response?.status;
        const message = errData.mes;

        if (message === "Vui lòng đăng nhập để tiếp tục!!!" || status === 401) {
            const currentPath = window.location.pathname + window.location.search;
            localStorage.setItem("redirectAfterLogin", currentPath);

            Swal.fire({
                icon: "warning",
                title: "Bạn chưa đăng nhập",
                text: "Nhấn OK để chuyển đến trang đăng nhập",
                confirmButtonText: "OK",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                window.location.href = "/login";
            });

            return Promise.reject(errData);
        }

        Swal.fire({
            icon: "error",
            title: status ? `Lỗi ${status}` : "Lỗi kết nối",
            text: message || "Đã xảy ra lỗi",
            confirmButtonText: "OK",
        });

        return Promise.reject(errData);
    }
);

export default instance;