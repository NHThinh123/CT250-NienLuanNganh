const express = require('express');
const router = express.Router();
//mongodb user
const User = require('./../models/user.model');
//mongodb Userverification
const UserVerification = require('../models/userVerification.model');
//mongodb passwordreset
const PasswordReset = require('./../models/userResetpassword.model');
//email handler
const nodemailer = require('nodemailer');
//unique string
const { v4: uuidv4 } = require('uuid');
//env variable
require('dotenv').config();
const bcrypt = require('bcrypt');
//path for static verified page
const path = require("path");
//nodemailer stuff
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS
  }
});
//test success
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready");
    console.log(success);
  }
});
const moment = require('moment');
const { error } = require('console');
//signup
router.post('/signup', (req, res) => {
  let { name, email, password, dateOfBirth } = req.body;
  name = name.trim().replace(/\s+/g, ' ');
  email = email.trim();
  password = password.trim();
  dateOfBirth = dateOfBirth.trim();
  if (name == "" || email == "" || password == "" || dateOfBirth == "") {
    res.json({
      status: "FAILED",
      message: "Dữ liệu trống"
    });
  } else if (!/^[\p{L}\s]+$/u.test(name)) {
    res.json({
      status: "FAILED",
      message: "Tên đăng nhập không hợp lệ."
    });
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "Email không hợp lệ"
    });
  } else if (!moment(dateOfBirth, 'YYYY-MM-DD', true).isValid()) {
    res.json({
      status: "FAILED",
      message: "Ngày - Tháng - Năm không hợp lệ"
    });
  } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
    res.json({
      status: "FAILED",
      message: "Mật khẩu không hợp lệ. Mật khẩu phải có chữ Hoa(A,B,C),chữ thường(a,b,c), số(1,2,3), kí tự đặc biệt(!,@,#,$,%) và có độ dài lớn hơn 8 kí tự!"
    });
  } else {
    User.find({ email }).then(result => {
      if (result.length) {
        res.json({
          status: "FAILED",
          message: "Người dùng đã tồn tại"
        });
      } else {
        const saltRound = 10;
        bcrypt.hash(password, saltRound).then(hashedPassword => {
          const newUser = new User({
            name,
            email,
            password: hashedPassword,
            dateOfBirth: moment(dateOfBirth, 'YYYY-MM-DD').toDate(),
            verified: false
          });
          newUser.save().then(result => {
            //handle account verification
            sendVerificationEmail(result, res);
          })
            .catch(err => {
              res.json({
                status: "FAILED",
                message: "Lỗi khi save tài khoản người dùng"
              })
            })
        })
          .catch(err => {
            res.json({
              status: "FAILED",
              message: "Lỗi khi băm mật khẩu"
            })
          })
      }
    }).catch(err => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "Lỗi khi kiểm tra người dùng hiện tại"
      })
    })
  }

})
//send verification email
const sendVerificationEmail = ({ _id, email }, res) => {
  const currentURl = "http://localhost:8080/";
  const uniqueString = uuidv4() + _id;

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Xác thực tài khoản",
    html: `<p>Chào mừng bạn đến với GinD</p><b>
        <p>Xác thực email của bạn để có thể hoàn thành việc đăng kí và có thể đăng nhập vào tài khoản của bạn.</p>
        <p>Liên kết này có thời hạn trong 1 giờ.</p><b>
        <p>Nhấn vào link để xác thực email<a href=${currentURl + "user/verify/" + _id + "/" + uniqueString}>tại đây</a></p>
        <p>Dear: GinD</p>`
  };

  //hash  the uniqueString
  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      //set value in userVerification
      const newVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniqueString,
        createAt: Date.now(),
        expriseAt: Date.now() + 3600000,
      });
      newVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              res.json({
                status: "PENDING",
                message: "Đã gửi xác thực email"
              })
            })
            .catch((eror) => {
              console.log(error);
              res.json({
                status: "FAILED",
                message: "Xác thực email thất bại"
              })
            })
        })
        .catch((error) => {
          console.log(error);
          res.json({
            status: "FAILED",
            message: "Không thể lưu dữ liệu xác thực email"
          })
        })
    })
    .catch(() => {
      res.json({
        status: "FAILED",
        message: "Xảy ra lỗi khi băm dữ liệu email"
      });
    })
};
router.get("/verify/:userId/:uniqueString", (req, res) => {
  let { userId, uniqueString } = req.params;
  UserVerification
    .find({ userId })
    .then((result) => {
      if (result.length > 0) {
        //user verification record exist so we proceed
        const { expriseAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;
        //checking for expired unique string
        if (expriseAt < Date.now()) {
          UserVerification
            .deleteOne({ userId })
            .then(result => {
              User
                .deleteOne({ _id: userId })
                .then(() => {
                  let message = "Link hết hạn. Vui lòng đăng nhập lại.";
                  res.redirect(`/user/verified/error=true&message=${message}`);
                })
                .catch(error => {
                  let message = "Xóa người dùng với chuỗi duy nhất hết hạn không thành công";
                  res.redirect(`/user/verified/error=true&message=${message}`);
                })
            })
            .catch((error) => {
              console.log(error);
              let message = "Đã xảy ra lỗi khi xóa bản ghi người dùng đã hết hạn";
              res.redirect(`/user/verified/error=true&message=${message}`);
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
                    UserVerification
                      .deleteOne({ userId })
                      .then(() => {
                        res.sendFile(path.join(__dirname, "./../views/verified.html"));
                      })
                      .catch(error => {
                        console.log(error);
                        let message = "Đã xảy ra lỗi khi hoàn tất xác minh";
                        res.redirect(`/user/verified/error=true&message=${message}`);
                      })
                  })
                  .catch(error => {
                    console.log(error);
                    let message = "Đã xảy ra lỗi khi cập nhật hồ sơ người dùng để hiển thị đã xác minh";
                    res.redirect(`/user/verified/error=true&message=${message}`);
                  })
              } else {
                //existing record but incorred verification
                let message = "Thông tin xác minh không hợp lệ đã được gửi đến bạn.";
                res.redirect(`/user/verified/error=true&message=${message}`);
              }


            })
            .catch(error => {
              let message = "Đã xảy ra lỗi khi so sánh các chuỗi duy nhất";
              res.redirect(`/user/verified/error=true&message=${message}`);
            })

        }
      } else {
        //user verification record doesn't exist 
        let message = "Tài khoản không tồn tại hoặc đã được xác minh. Xin hãy đăng kí hoặc đăng nhập ";
        res.redirect(`/user/verified/error=true&message=${message}`);
      }
    })
    .catch((error) => {
      console.log(error);
      let message = "Đã xảy ra lỗi trong khi kiểm tra bản ghi xác minh người dùng hiện có";
      res.redirect(`/user/verified/error=true&message=${message}`);
    })
});
//verified page route
router.get('/verified', (req, res) => {
  res.sendFile(path.join(__dirname, "./../views/verification.html"));
})

//singin
router.post('/signin', (req, res) => {
  let { email, password, } = req.body;
  email = email.trim();
  password = password.trim();

  if (email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Thông tin đăng nhập trống"
    })
  } else {
    //check if user exits
    User.find({ email }).then(data => {
      if (data.length) {
        //user exits

        //check if user is verified
        if (!data[0].verified) {
          res.json({
            status: "FAILED",
            message: "Email chưa được xác minh. Vui lòng kiểm tra hộp thư của bạn."
          })

        } else {
          const hashedPassword = data[0].password;
          bcrypt.compare(password, hashedPassword).then(result => {
            if (result) {
              res.json({
                status: "SUCCESS",
                message: "Đăng nhập thành công",
                data: data,
              })
            } else {
              res.json({
                status: "FAILED",
                message: "Mật khẩu không hợp lệ"
              })
            }
          })
            .catch(err => {
              res.json({
                status: "FAILED",
                message: "Đã xảy ra lỗi khi so sánh mật khẩu",
              })
            })
        }

      } else {
        res.json({
          status: "FAILED",
          message: "Thông tin đăng nhập không hợp lệ",
        })
      }
    })
      .catch(err => {
        res.json({
          status: "FAILED",
          message: "Đã xảy ra lỗi khi kiểm tra người dùng hiện tại",
        })
      })
  }
})
//password reset stuff
router.post("/requestPasswordReset", (req, res) => {
  const { email, redirectUrl } = req.body;
  //check if email exists
  User
    .find({ email })
    .then((data) => {
      if (data.length) {
        //user exists

        //check if user is verified
        if (!data[0].verified) {
          res.json({
            status: "FAILED",
            message: "Email chưa được xác thực. Kiểm tra lại email",
          })
        } else {
          //proceed with email to reset password
          sendResetEmail(data[0], redirectUrl, res);
        }

      } else {
        res.json({
          status: "FAILED",
          message: "Không có tài khoản phù hợp với email cung cấp",
        })
      }
    })
    .catch(error => {
      console.log(error);
      res.json({
        status: "FAILED",
        message: "Đã xảy ra lỗi khi kiểm tra người dùng hiện tại",
      })
    })

})
//send password reset email
const sendResetEmail = ({ _id, email }, redirectUrl, res) => {
  const resetString = uuidv4() + _id;
  //first, we clear existing reset record
  PasswordReset
    .deleteMany({ userId: _id })
    .then(result => {
      //reset records delete successully
      //now we send the email
      //mail option
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Đặt lại mật khẩu",
        html: `<p>Chào mừng bạn đến với GinD</p><b>
                <p>Chúng tôi được biết bạn đã quên mất mậu khẩu.</p>
                <p>Đừng lo lắng nhé. Bạn hãy nhấn vào link bên dưới để đặt lại mật khẩu mới và tiếp tục sử dụng dịch vụ của chúng tôi</p>
                <p>Liên kết này có thời hạn trong 1 giờ.</p><b>
                <p>Nhấn vào link để đặt lại mật khẩu<a href=${redirectUrl + "/" + _id + "/" + resetString}>tại đây</a></p>
                <p>Dear: GinD</p>`
      };
      //hash the reset string
      const saltRounds = 10;
      bcrypt
        .hash(resetString, saltRounds)
        .then(hashedResetString => {
          //set value in password reset collection
          const newPasswordReset = new PasswordReset({
            userId: _id,
            resetString: hashedResetString,
            createAt: Date.now(),
            expriseAt: Date.now() + 3600000
          });
          newPasswordReset
            .save()
            .then(() => {
              transporter
                .sendMail(mailOptions)
                .then(() => {
                  res.json({
                    status: "PENDING",
                    message: "Đã gửi email đặt lại mật khẩu"
                  })
                })
                .catch(error => {
                  console.log(error);
                  res.json({
                    status: "FAILED",
                    message: "Email đặt lại mật khẩu thất bại",
                  })
                })
            })
            .catch(error => {
              console.log(error);
              res.json({
                status: "FAILED",
                message: "Không thể lưu dữ liệu đặt lại mật khẩu",
              })

            })

        })
        .catch(error => {
          console.log(error);
          res.json({
            status: "FAILED",
            message: "Đã xảy ra lỗi khi băm mật khẩu đặt lại tài khoản",
          })
        })
    })
    .catch(error => {
      //error while clearing existing records 
      console.log(error);
      res.json({
        status: "FAILED",
        message: "Xóa các bản ghi đặt lại mật khẩu hiện có không thành công",
      })
    })

}
//Actually reset the password
router.post("/resetPassword", (req, res) => {
  let { userId, resetString, newPassword } = req.body;

  PasswordReset.find({ userId })
    .then(result => {
      if (result.length > 0) {
        // Password reset record exists
        const { expriseAt, resetString: hashedResetString } = result[0];

        // Check for expired reset string
        if (expriseAt < Date.now()) {
          PasswordReset.deleteOne({ userId })
            .then(() => {
              res.json({
                status: "FAILED",
                message: "Liên kết đặt lại mật khẩu đã hết hạn",
              });
            })
            .catch(error => {
              console.log(error);
              res.json({
                status: "FAILED",
                message: "Xóa bản ghi đặt lại mật khẩu không thành công",
              });
            });
        } else {
          // Verify reset string
          bcrypt.compare(resetString, hashedResetString)
            .then(match => {
              if (match) {
                // Strings match
                const saltRounds = 10;
                bcrypt.hash(newPassword, saltRounds)
                  .then(hashedNewPassword => {
                    // Update user password
                    User.updateOne({ _id: userId }, { password: hashedNewPassword })
                      .then(() => {
                        // Delete reset record
                        PasswordReset.deleteOne({ userId })
                          .then(() => {
                            res.json({
                              status: "SUCCESS",
                              message: "Mật khẩu đặt lại thành công",
                            });
                          })
                          .catch(error => {
                            console.log(error);
                            res.json({
                              status: "FAILED",
                              message: "Đã xảy ra lỗi trong việc hoàn thành đặt lại mật khẩu",
                            });
                          });
                      })
                      .catch(error => {
                        console.log(error);
                        res.json({
                          status: "FAILED",
                          message: "Cập nhật mật khẩu thất bại",
                        });
                      });
                  })
                  .catch(error => {
                    console.log(error);
                    res.json({
                      status: "FAILED",
                      message: "Đã xảy ra lỗi khi băm mật khẩu mới",
                    });
                  });
              } else {
                res.json({
                  status: "FAILED",
                  message: "Thông tin đặt lại mật khẩu không hợp lệ",
                });
              }
            })
            .catch(error => {
              console.log(error);
              res.json({
                status: "FAILED",
                message: "So sánh chuỗi đặt lại mật khẩu không thành công",
              });
            });
        }
      } else {
        res.json({
          status: "FAILED",
          message: "Không tìm thấy yêu cầu đặt lại mật khẩu",
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.json({
        status: "FAILED",
        message: "Không kiểm tra được bản ghi đặt lại mật khẩu hiện có",
      });
    });
});


module.exports = router;