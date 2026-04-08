import axios from "axios";
import Swal from "sweetalert2";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_SERVER,
});

instance.interceptors.request.use((config) => {
    let token = localStorage.getItem("accessToken");

    if (!token) {
        let localStoData = window.localStorage.getItem("persist:tuyendung/user");
        if (typeof localStoData === 'string') {
            try {
                const parsedData = JSON.parse(localStoData);
                token = parsedData.token ? JSON.parse(parsedData.token) : null;
            } catch (e) {
                console.error("Lỗi parse token:", e);
            }
        }
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


instance.interceptors.response.use(
    (response) => response.data,

    (error) => {
        const errData = error.response?.data || { mes: "Lỗi kết nối server" };
        const status = error.response?.status;
        const message = errData.mes || errData.message;

        const isLoginPage = window.location.pathname === "/login";
        const isLoginAPI = error.config?.url?.includes("/login");

        if (status === 401 && !isLoginAPI) {
            const currentPath =
                window.location.pathname + window.location.search;

            localStorage.setItem("redirectAfterLogin", currentPath);

            if (!isLoginPage) {
                Swal.fire({
                    icon: "warning",
                    title: "Bạn chưa đăng nhập",
                    text: "Vui lòng đăng nhập lại để tiếp tục",
                    confirmButtonText: "OK",
                    showCancelButton: true,
                    cancelButtonText: "Huỷ",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.replace("/login");
                    }
                });
            }

            return Promise.reject(errData);
        }


        Swal.fire({
            icon: "error",
            title: status ? `Lỗi ${status}` : "Lỗi kết nối",
            text: message || "Đã xảy ra lỗi",
        });

        return Promise.reject(errData);
    }
);

export default instance;
