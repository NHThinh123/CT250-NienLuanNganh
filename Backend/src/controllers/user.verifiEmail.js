const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require('path');
const userVerification = require("../models/userVerification.model");

const verifyEmail = async (req, res) => {
    let { userId, uniqueString } = req.params;
    try {
        const verificationRecord = await userVerification.findOne({ userId });

        if (!verificationRecord) {
            return res.redirect('/api/user/verified?error=true&message=Tài khoản không tồn tại hoặc đã được xác minh');
        }

        const { expriseAt, uniqueString: hashedUniqueString } = verificationRecord;

        if (expriseAt < Date.now()) {
            await userVerification.deleteOne({ userId });
            await User.deleteOne({ _id: userId });
            return res.redirect('/api/user/verified?error=true&message=Link hết hạn');
        }

        const validString = await bcrypt.compare(uniqueString, hashedUniqueString);

        if (!validString) {
            return res.redirect('/api/user/verified?error=true&message=Mã xác thực không hợp lệ');
        }

        await User.updateOne({ _id: userId }, { verified: true });
        await userVerification.deleteOne({ userId });

        // Chuyển hướng đến trang thành công
        res.redirect('/api/user/verified');

    } catch (error) {
        console.error('Verification error:', error);
        res.redirect('/api/user/verified?error=true&message=Có lỗi xảy ra trong quá trình xác thực');
    }
};

module.exports = { verifyEmail };
