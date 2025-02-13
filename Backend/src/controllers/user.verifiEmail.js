const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require('path');
const userVerification = require("../models/userVerification.model");

const verifyEmail = async (req, res) => {
    let { userId, uniqueString } = req.params;
    userVerification
        .find({ userId })
        .then((result) => {
            if (result.length > 0) {
                //user verification record exist so we proceed
                const { expriseAt } = result[0];
                const hashedUniqueString = result[0].uniqueString;
                //checking for expired unique string
                if (expriseAt < Date.now()) {
                    userVerification
                        .deleteOne({ userId })
                        .then(result => {
                            User
                                .deleteOne({ _id: userId })
                                .then(() => {
                                    let message = "Link hết hạn. Vui lòng đăng nhập lại.";
                                    res.redirect(`?error=true&message=${message}`);
                                })
                                .catch(error => {
                                    let message = "Xóa người dùng với chuỗi duy nhất hết hạn không thành công";
                                    res.redirect(`?error=true&message=${message}`);
                                })
                        })
                        .catch((error) => {
                            console.log(error);
                            let message = "Đã xảy ra lỗi khi xóa bản ghi người dùng đã hết hạn";
                            res.redirect(`?error=true&message=${message}`);
                        })
                } else {
                    //valid record exists so we validate the user string 
                    // first compare the hashed unique string
                    bcrypt
                        .compare(uniqueString, hashedUniqueString)
                        .then(result => {
                            if (result) {
                                //string match
                                User
                                    .updateOne({ _id: userId }, { verified: true })
                                    .then(() => {
                                        userVerification
                                            .deleteOne({ userId })
                                            .then(() => {
                                                //res.sendFile(path.join(__dirname, "./../views/verification.html"));
                                                res.sendFile(path.resolve("views", "verification.html"));

                                            })
                                            .catch(error => {
                                                console.log(error);
                                                let message = "Đã xảy ra lỗi khi hoàn tất xác minh";
                                                res.redirect(`?error=true&message=${message}`);
                                            })
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        let message = "Đã xảy ra lỗi khi cập nhật hồ sơ người dùng để hiển thị đã xác minh";
                                        res.redirect(`?error=true&message=${message}`);
                                    })
                            } else {
                                //existing record but incorred verification
                                let message = "Thông tin xác minh không hợp lệ đã được gửi đến bạn.";
                                res.redirect(`?error=true&message=${message}`);
                            }


                        })
                        .catch(error => {
                            let message = "Đã xảy ra lỗi khi so sánh các chuỗi duy nhất";
                            res.redirect(`?error=true&message=${message}`);
                        })

                }
            } else {
                //user verification record doesn't exist 
                let message = "Tài khoản không tồn tại hoặc đã được xác minh. Xin hãy đăng kí hoặc đăng nhập ";
                res.redirect(`?error=true&message=${message}`);
            }
        })
        .catch((error) => {
            console.log(error);
            let message = "Đã xảy ra lỗi trong khi kiểm tra bản ghi xác minh người dùng hiện có";
            res.redirect(`?error=true&message=${message}`);
        })
};

module.exports = { verifyEmail };
