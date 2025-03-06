const bcrypt = require("bcrypt");
const transporter = require("../config/emailConfig");
const userVerification = require("../models/userVerification.model");

const sendVerificationEmail = async (user) => {
    try {
        const { _id, email } = user;
        const uniqueString = require("uuid").v4() + _id;
        const hashedUniqueString = await bcrypt.hash(uniqueString, 10);

        // Lưu bản hashed vào database
        const newVerification = new userVerification({
            userId: _id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000, // 1 hour expiry
        });

        await newVerification.save();

        // URL xác thực
        const verificationUrl = `http://localhost:8080/api/user/verify/${_id}/${uniqueString}`;

        // Nội dung email
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Chào mừng bạn đến với Yumzy – Hãy xác thực tài khoản của bạn!",
            html: `
                <h1>Yumzy</h1>
                <p>Xin chào <strong>${user.name || "bạn"}</strong>,</p>
                <p>Chào mừng bạn đến với <strong>Yumzy</strong> – nơi chia sẻ những công thức nấu ăn ngon và bí quyết ẩm thực độc đáo! 🎉</p>
                <p>🔹 Để hoàn tất đăng ký và bắt đầu khám phá hàng ngàn công thức hấp dẫn, vui lòng xác thực tài khoản của bạn bằng cách nhấp vào nút bên dưới:</p>
               <p style="display: flex; justify-content: center;">
                    <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px;">Xác thực tài khoản ngay</a>
                </p>

                <p>Cảm ơn bạn đã tham gia Yumzy! Hãy sẵn sàng để khám phá và chia sẻ niềm đam mê nấu nướng cùng chúng tôi.</p>
                <p>Chúc bạn có những trải nghiệm tuyệt vời,</p>
                <p><strong>Đội ngũ Yumzy</strong></p>
                <p>🌍 <a href="https://yumzy.com">yumzy.com</a> | 📧 support@yumzy.com</p>
            `,
        };

        // Gửi email
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully.");
    } catch (error) {
        console.error("Error sending verification email:", error);
    }
};

const sendResetPasswordEmail = async (email, resetToken) => {
    const resetLink = `http://localhost:8080/api/user/reset-password/${resetToken}`;


    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Đặt lại mật khẩu Yumzy",
        html: `<h1>Yumzy</h1>
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link bên dưới để tiếp tục:</p>
             <a href="${resetLink}">Đặt lại mật khẩu</a>
             <p>Liên kết này sẽ hết hạn sau 15 phút.</p>`,
    };

    await transporter.sendMail(mailOptions);
};


module.exports = { sendVerificationEmail, sendResetPasswordEmail };
