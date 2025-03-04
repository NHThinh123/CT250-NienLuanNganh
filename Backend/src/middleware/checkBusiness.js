const Business = require("../models/business.model");

const checkAccountStatus = async (req, res, next) => {
    const { email } = req.body;
    const business = await Business.findOne({ email });

    if (!business) {
        return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }
    if (business.status === "pending") {
        return res.status(403).json({ message: "Tài khoản chưa được kích hoạt. Vui lòng thanh toán phí." });
    }
    if (business.status === "suspended") {
        return res.status(403).json({ message: "Tài khoản bị tạm khóa do chưa thanh toán phí duy trì." });
    }

    req.business = business;
    next();
};

module.exports = { checkAccountStatus };