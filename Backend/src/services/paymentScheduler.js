const cron = require("node-cron");
const Business = require("../models/business.model");
const { sendPaymentReminder } = require("./business.service");


// Chạy hàng ngày lúc 9:00 sáng
cron.schedule("0 9 * * *", async () => {
    try {
        const businesses = await Business.find({ status: "active" });
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        for (const business of businesses) {
            const dueDate = new Date(business.nextPaymentDueDate);

            // Gửi email nhắc nhở nếu còn 3 ngày
            if (
                dueDate.getDate() === threeDaysFromNow.getDate() &&
                dueDate.getMonth() === threeDaysFromNow.getMonth() &&
                dueDate.getFullYear() === threeDaysFromNow.getFullYear()
            ) {
                await sendPaymentReminder(business.email, business.business_name, dueDate, business._id);
            }

            // Tạm khóa nếu quá hạn
            if (dueDate < now) {
                business.status = "suspended";
                await business.save();
                console.log(`Tài khoản ${business.email} đã bị tạm khóa`);
            }
        }
        console.log("Đã kiểm tra trạng thái thanh toán");
    } catch (error) {
        console.error("Lỗi trong scheduler:", error);
    }
});