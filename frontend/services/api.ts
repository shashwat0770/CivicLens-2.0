import axios from "axios";

/*
  Environment variable must be defined in Render:
  NEXT_PUBLIC_API_URL=https://civiclens-2-0-1.onrender.com
*/

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  console.error("NEXT_PUBLIC_API_URL is not defined");
}

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

/* ===============================
   Request Interceptor
================================== */
api.interceptors.request.use(
  (config) => {
    // Prevent SSR crash
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===============================
   Response Interceptor
================================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

/* ===============================
   Auth API
================================== */
export const authAPI = {
  register: (data: unknown) => api.post("/auth/register", data),
  login: (data: unknown) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data: unknown) => api.put("/auth/profile", data),
};

/* ===============================
   Complaint API
================================== */
export const complaintAPI = {
  create: (data: FormData) =>
    api.post("/complaints", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAll: (params?: Record<string, unknown>) =>
    api.get("/complaints", { params }),

  getById: (id: string) =>
    api.get(`/complaints/${id}`),

  update: (id: string, data: unknown) =>
    api.put(`/complaints/${id}`, data),

  delete: (id: string) =>
    api.delete(`/complaints/${id}`),

  assign: (id: string, authorityId: string) =>
    api.post(`/complaints/${id}/assign`, { authorityId }),

  addUpdate: (id: string, data: unknown) =>
    api.post(`/complaints/${id}/update-progress`, data),

  getForMap: (params?: Record<string, unknown>) =>
    api.get("/complaints/map", { params }),
};

/* ===============================
   Admin API
================================== */
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),

  getUsers: (params?: Record<string, unknown>) =>
    api.get("/admin/users", { params }),

  updateUserRole: (id: string, role: string) =>
    api.put(`/admin/users/${id}/role`, { role }),

  toggleUserStatus: (id: string) =>
    api.put(`/admin/users/${id}/toggle-status`),

  deleteUser: (id: string) =>
    api.delete(`/admin/users/${id}`),

  getAuthorities: () =>
    api.get("/admin/authorities"),
};

export default api;
