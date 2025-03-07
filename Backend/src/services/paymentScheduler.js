const cron = require("node-cron");
const Business = require("../models/business.model");
const { sendPaymentReminder } = require("../services/email.service");


// Chạy hàng ngày lúc 00:00
cron.schedule('0 0 * * *', async () => {
    try {
        const businesses = await Business.find({ status: 'active' });
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        for (const business of businesses) {
            const dueDate = new Date(business.nextPaymentDueDate);
            dueDate.setHours(0, 0, 0, 0);

            // Tính khoảng cách ngày
            const timeDiff = dueDate - now;
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            // Gửi email nếu còn đúng 3 ngày
            if (daysDiff === 3) {
                await sendPaymentReminder(
                    business.email,
                    business.business_name,
                    dueDate,
                    business._id
                );
                console.log(`Đã gửi email nhắc nhở tới ${business.email}`);
                business.reminderSent = true;
                await business.save();
            }

            // Tạm khóa nếu quá hạn
            if (dueDate < now) {
                business.status = 'suspended';
                business.reminderSent = false;
                await business.save();
                console.log(`Tài khoản ${business.email} đã bị tạm khóa`);
            }
        }
        console.log('Đã kiểm tra trạng thái thanh toán');
    } catch (error) {
        console.error('Lỗi trong scheduler:', error);
    }
});