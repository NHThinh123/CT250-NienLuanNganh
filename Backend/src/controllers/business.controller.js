const { createBusinessService, getBusinessService, getBusinessByIdService, updateBusinessService } = require('../services/business.service');
const AppError = require("../utils/AppError");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Business = require('../models/business.model');

//Tạo một business
const createBusiness = async (req, res, next) => {
    try {
        const { business_name, open_hours, close_hours, location, contact_info, email, password } = req.body;
        //const data = await createBusinessService(business_name, open_hours, close_hours, location, contact_info, email, password);
        const data = await createBusinessService(req, res);

        res.status(200).json(data);
    } catch (error) {
        return next(
            new AppError(500, "Lỗi! Không thể tạo business")
        );
    }
};
const getBusiness = async (req, res, next) => {
    try {
        const data = await getBusinessService();
        res.status(200).json(data);
    } catch (error) {
        return next(
            new AppError(500, "Lỗi! Không thể lấy business")
        );
    }
};
//lấy id business
// const getBusinessById = async (req, res, next) => {
//     try {
//         const data = await getBusinessByIdService(req.params.businessId);
//         if (!data) {
//             return next(new AppError(404, "Tài nguyên không tìm thấy"));
//         }
//         res.status(200).json(data);
//     } catch (error) {
//         return next(new AppError(500, "Lỗi! Không thể lấy business"));
//     }
// };
const getBusinessById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await getBusinessByIdService(id);

        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};


//cập nhật thông tin business
const updateBusiness = async (req, res, next) => {
    try {
        const { id } = req.params;  // Lấy đúng tham số từ route
        const updateData = req.body;

        const data = await updateBusinessService(id, updateData);
        if (!data) {
            return next(new AppError(404, "Tài nguyên không tìm thấy"));
        }

        res.status(200).json({
            message: "Cập nhật thông tin Business thành công",
            data
        });
    } catch (error) {
        return next(new AppError(500, "Lỗi! Không thể cập nhật thông tin business"));
    }
};

// Signup
const signupBusiness = async (req, res, next) => {
    try {
        const { business_name, open_hours, close_hours, location, contact_info, email, password } = req.body;

        // Kiểm tra business đã tồn tại chưa
        const existingBusiness = await Business.findOne({ email });
        if (existingBusiness) {
            return res.status(400).json({ message: 'Business already exists' });
        }

        // Mã hóa mật khẩu trước khi lưu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo business mới
        const newBusiness = new Business({
            business_name,
            open_hours,
            close_hours,
            location,
            contact_info,
            email,
            password: hashedPassword
        });

        await newBusiness.save();
        res.status(201).json({ message: 'Business registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const loginBusiness = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Tìm business theo email
        const business = await Business.findOne({ email });
        if (!business) {
            return res.status(404).json({ message: "Email not found" });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, business.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password" });
        }

        // Tạo token
        const token = jwt.sign(
            { id: business._id, email: business.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Trả về thông tin đăng nhập thành công
        res.status(200).json({
            message: "Login successful",
            business: {
                id: business._id,
                business_name: business.business_name,
                email: business.email,
                contact_info: business.contact_info,
                location: business.location
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



module.exports = { createBusiness, getBusiness, getBusinessById, updateBusiness, signupBusiness, loginBusiness };