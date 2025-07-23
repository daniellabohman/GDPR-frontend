import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token !== "null" && token !== "undefined") {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isValid = Date.now() < payload.exp * 1000;

      if (isValid) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        localStorage.removeItem("token");
      }
    } catch (err) {
      localStorage.removeItem("token");
    }
  }

  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    const skipRefresh =
      originalRequest.url.includes("/gdpr/analyze") ||
      originalRequest.url.includes("/auth/refresh");

    if (err.response?.status === 401 && !originalRequest._retry && !skipRefresh) {
      originalRequest._retry = true;

      try {
        const res = await axios.post("http://localhost:5000/api/auth/refresh", {}, {
          withCredentials: true,
        });

        const newToken = res.data.access_token;
        localStorage.setItem("token", newToken);

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
