import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, 
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Undgå uendelig loop
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Prøv at forny access token med refresh-token-cookie
        const res = await axios.post("http://localhost:5000/api/auth/refresh", {}, {
          withCredentials: true
        });

        const newToken = res.data.access_token;
        localStorage.setItem("token", newToken);

        // Opdater request med ny token
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(originalRequest);

      } catch (refreshErr) {
        // Refresh fejlede → slet token og redirect til login
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
