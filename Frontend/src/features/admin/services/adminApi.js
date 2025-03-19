import instance from "../../../services/axios.customize";

const API_URL = "/api/admin";

const getAllUsers = async () => {
    try {
        const response = await instance.get(`${API_URL}/users`);
        return response;
    } catch (error) {
        console.error("Error fetching users:", error.message);
        throw error;
    }
};

const createUser = async (data) => {
    const response = await instance.post(`${API_URL}/create/users`, data);
    // Kiểm tra phản hồi từ axioscustomize
    if (response?.message === "Email đã tồn tại") {
        throw new Error(response.message);
    }
    return response;
};

const getAllBusinesses = async () => {
    try {
        const response = await instance.get(`${API_URL}/businesses`);
        return response;
    } catch (error) {
        console.error("Error fetching businesses:", error.message);
        throw error;
    }
};

const createBusiness = async (data) => {
    const response = await instance.post(`${API_URL}/create/businesses`, data);
    if (response?.message === "Email đã tồn tại") {
        throw new Error(response.message);
    }
    return response;
};
// Cập nhật user
const updateUser = async ({ id, data }) => {
    try {
        const response = await instance.put(`${API_URL}/users/${id}`, data);
        return response;
    } catch (error) {
        console.error("Error updating user:", error.message);
        throw error;
    }
};

// Xóa user (xóa mềm)
const deleteUser = async (id) => {
    try {
        // Nếu API của bạn thực sự sử dụng DELETE thay vì PUT, thì sửa lại như sau:
        const response = await instance.delete(`${API_URL}/users/${id}`);
        return response;
    } catch (error) {
        console.error("Error deleting user:", error.message);
        throw error;
    }
};

// Cập nhật business
const updateBusiness = async ({ id, data }) => {
    try {
        const response = await instance.put(`${API_URL}/businesses/${id}`, data);
        return response;
    } catch (error) {
        console.error("Error updating user:", error.message);
        throw error;
    }
};

// Xóa business (xóa mềm)
const deleteBusiness = async (id) => {
    try {
        // Nếu API của bạn thực sự sử dụng DELETE thay vì PUT, thì sửa lại như sau:
        const response = await instance.delete(`${API_URL}/businesses/${id}`);
        return response;
    } catch (error) {
        console.error("Error deleting user:", error.message);
        throw error;
    }
};
const getTotalRevenue = async () => {
    try {
        const response = await instance.get(`${API_URL}/total-revenue`);

        const data = response || { totalRevenue: 0 };
        return data;
    } catch (error) {
        console.error("Error fetching total revenue:", error.message);
        const fallbackData = { totalRevenue: 0 };
        console.log("Returning fallback data due to error:", fallbackData);
        return fallbackData;
    }
};
const getAllInvoices = async () => {
    try {
        const response = await instance.get(`${API_URL}/invoices`);
        return response;
    } catch (error) {
        console.error("Error fetching invoices:", error.message);
        throw error;
    }
};
export { getAllUsers, createUser, getAllBusinesses, createBusiness, updateUser, deleteUser, updateBusiness, deleteBusiness, getTotalRevenue, getAllInvoices };