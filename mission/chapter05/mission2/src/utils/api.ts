import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/v1", // 서버 주소
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue: (() => void)[] = [];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push(() => resolve(api(originalRequest)));
        });
      }

      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("리프레시 토큰 없음");

        const res = await axios.post("http://localhost:8000/v1/auth/refresh", {
          refreshToken,
        });

        const { access_token, refresh_token } = res.data;

        localStorage.setItem("auth_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        refreshQueue.forEach((cb) => cb());
        refreshQueue = [];
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
