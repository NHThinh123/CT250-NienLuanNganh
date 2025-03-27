
import axios from "../../../services/axios.customize";

const API_URL = "/api/chat";
const BUSINESS_API_URL = "/api/businesses";
const USER_API_URL = "/api/users";

// Gửi tin nhắn
export const sendMessage = async (messageData) => {
    const response = await axios.post(`${API_URL}/messages`, messageData);
    return response.data;
};

// Lấy danh sách tin nhắn
export const fetchMessages = async ({ userId, businessId }) => {
    try {
        const response = await axios.get(`${API_URL}/messages/${userId}/${businessId}`);
        return response.data || [];
    } catch (error) {
        console.error("Lỗi khi lấy tin nhắn:", error);
        return [];
    }
};

// Đánh dấu tin nhắn đã đọc
export const markMessageAsRead = async (messageId) => {
    const response = await axios.put(`${API_URL}/messages/${messageId}/read`, {});
    return response.data;
};

// Lấy danh sách Business mà user đã chat
export const fetchBusinessesForUser = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/businesses/${userId}`);
        return response.data || [];
    } catch (error) {
        console.error("Lỗi khi lấy danh sách Business:", error);
        return [];
    }
};

// Lấy danh sách User mà Business đã chat
export const fetchUsersForBusiness = async (businessId) => {
    try {
        const response = await axios.get(`${API_URL}/users/${businessId}`);
        return response.data || [];
    } catch (error) {
        console.error("Lỗi khi lấy danh sách User:", error);
        return [];
    }
};
