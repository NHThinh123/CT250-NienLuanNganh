const bcrypt = require("bcrypt");
const transporter = require("../config/emailConfig");
const UserVerification = require("../models/userVerification.model");

const sendVerificationEmail = async (user) => {
    const { _id, email } = user;
    const uniqueString = require("uuid").v4() + _id;
    const hashedUniqueString = await bcrypt.hash(uniqueString, 10);

    const newVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000, // 1 hour expiry
    });

    await newVerification.save();

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Xác thực tài khoản",
        html: `<p>Nhấn vào <a href="http://localhost:8080/api/user/verify/${_id}/${uniqueString}">đây</a> để xác thực tài khoản.</p>`,
    };

    await transporter.sendMail(mailOptions);
};
const sendResetPasswordEmail = async (email, resetToken) => {
    const resetLink = `http://localhost:8080/api/user/reset-password/${resetToken}`;


    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Đặt lại mật khẩu",
        html: `<p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link bên dưới để tiếp tục:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>Liên kết này sẽ hết hạn sau 15 phút.</p>`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendResetPasswordEmail };
