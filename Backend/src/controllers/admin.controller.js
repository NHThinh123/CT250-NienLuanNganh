const User = require("../models/user.model");
const Business = require("../models/business.model");
const bcrypt = require("bcryptjs");
const Payment = require("../models/payment.model");

const stripe = require
// Lấy danh sách tất cả users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ deleted: false });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Tạo user mới
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, dateOfBirth, role, verified } = req.body;


        if (!name || !email || !password || !dateOfBirth || !role) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email đã tồn tại" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            dateOfBirth,
            role,
            verified: verified || false,
        });

        await newUser.save();
        res.status(201).json({ message: "Tạo user thành công", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Cập nhật thông tin user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        const user = await User.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Xóa  user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.delete({ _id: id });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user" });
        }
        res.status(200).json({ message: "Xóa user thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Lấy danh sách tất cả businesses
exports.getAllBusinesses = async (req, res) => {
    try {
        const businesses = await Business.find({ deleted: false });
        res.status(200).json(businesses);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Tạo business mới
exports.createBusiness = async (req, res) => {
    try {
        const {
            business_name,
            email,
            password,
            open_hours,
            close_hours,
            address,
            location,
            contact_info,
            verified,
            status,
        } = req.body;


        if (
            !business_name ||
            !email ||
            !password ||
            !open_hours ||
            !close_hours ||
            !address ||
            !address.coordinates ||
            !location ||
            !contact_info
        ) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }


        const existingBusiness = await Business.findOne({ email });
        if (existingBusiness) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newBusiness = new Business({
            business_name,
            email,
            password: hashedPassword,
            open_hours,
            close_hours,
            address,
            location,
            contact_info,
            verified: verified || false,
            status: status || "pending",
            avatar: "https://res.cloudinary.com/nienluan/image/upload/v1741245839/Business_Avatar_Default_jkhjhf.jpg",
        });

        await newBusiness.save();
        res
            .status(201)
            .json({ message: "Tạo business thành công", business: newBusiness });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Cập nhật thông tin business
exports.updateBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        const business = await Business.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).select("-password");
        if (!business) {
            return res.status(404).json({ message: "Không tìm thấy business" });
        }
        res.status(200).json(business);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};

// Xóa business
exports.deleteBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        const business = await Business.delete({ _id: id });
        if (!business) {
            return res.status(404).json({ message: "Không tìm thấy business" });
        }
        res.status(200).json({ message: "Xóa business thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
};
//Lấy tổng doanh thu
exports.TotalPayment = async (req, res) => {
    try {
        const totalRevenue = await Payment.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        res.json({ totalRevenue: totalRevenue[0]?.total || 0 });
    } catch (error) {
        res.status(500).json({ message: "Error calculating revenue", error });
    }
};
exports.getAllInvoice = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("businessId", "business_name email")
            .sort({ paymentDate: -1 })
            .limit(100);
        res.status(200).json(payments);
    } catch (error) {
        console.error("Error fetching payments from DB:", error);
        res.status(500).json({ error: "Failed to fetch payments from DB" });
    }
};
