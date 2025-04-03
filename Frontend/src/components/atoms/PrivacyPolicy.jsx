import { Typography, Divider } from "antd";

const { Title, Paragraph } = Typography;

const PrivacyPolicy = () => {
  return (
    <div style={{ marginTop: 68 }}>
      <Title level={2}>Chính sách bảo mật</Title>
      <Paragraph>
        <strong>Cập nhật lần cuối: Ngày 15 tháng 3 năm 2025</strong>
      </Paragraph>
      <Paragraph>
        Tại Yumzy, chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Chính
        sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và
        bảo vệ dữ liệu của người dùng.
      </Paragraph>
      <Divider />
      <Paragraph>
        <strong>1. Thông tin chúng tôi thu thập</strong>
        <br />
        Chúng tôi thu thập các loại thông tin sau:
        <br />- <strong>Thông tin cá nhân:</strong> Tên, email, số điện thoại
        (tùy chọn) khi bạn đăng ký tài khoản.
        <br />- <strong>Thông tin doanh nghiệp:</strong> Tên doanh nghiệp, địa
        chỉ, thực đơn, thông tin liên hệ khi doanh nghiệp ẩm thực đăng ký.
        <br />- <strong>Dữ liệu sử dụng:</strong> Nội dung bài viết, hình ảnh,
        video bạn đăng tải; lượt thích, bình luận và tương tác trên website.
        <br />- <strong>Dữ liệu kỹ thuật:</strong> Địa chỉ IP, loại thiết bị, hệ
        điều hành và trình duyệt khi bạn truy cập Yumzy.
      </Paragraph>
      <Paragraph>
        <strong>2. Cách chúng tôi sử dụng thông tin</strong>
        <br />
        - Cung cấp và cải thiện dịch vụ (đăng bài, tìm kiếm món ăn, quản lý tài
        khoản).
        <br />
        - Gửi email xác nhận tài khoản, thông báo tương tác hoặc phản hồi từ
        doanh nghiệp.
        <br />
        - Phân tích dữ liệu để tối ưu trải nghiệm người dùng và tạo báo cáo
        thống kê (dành cho quản trị viên).
        <br />- Hỗ trợ thanh toán phí dịch vụ cho doanh nghiệp ẩm thực.
      </Paragraph>
      <Paragraph>
        <strong>3. Chia sẻ thông tin</strong>
        <br />
        Chúng tôi không chia sẻ thông tin cá nhân với bên thứ ba, trừ khi:
        <br />
        - Được bạn đồng ý rõ ràng.
        <br />
        - Tuân thủ quy định pháp luật Việt Nam (ví dụ: Luật An ninh mạng, Nghị
        định 72/2013/NĐ-CP).
        <br />- Hợp tác với đối tác thanh toán (PayPal, Visa) để xử lý giao dịch
        (dữ liệu được mã hóa).
      </Paragraph>
      <Paragraph>
        <strong>4. Bảo mật thông tin</strong>
        <br />
        - Mật khẩu người dùng được mã hóa và lưu trữ an toàn.
        <br />
        - Sử dụng xác thực hai yếu tố (2FA) để tăng cường bảo vệ tài khoản.
        <br />
        - Áp dụng tường lửa và mã hóa dữ liệu để chống truy cập trái phép.
        <br />- Tuân thủ tiêu chuẩn ISO/IEC 27001:2013 về quản lý an ninh thông
        tin.
      </Paragraph>
      <Paragraph>
        <strong>5. Quyền của người dùng</strong>
        <br />
        - Bạn có thể xem, chỉnh sửa hoặc xóa thông tin cá nhân trong mục Quản lý
        thông tin cá nhân.
        <br />
        - Yêu cầu ngừng chia sẻ dữ liệu với bên thứ ba (nếu có).
        <br />- Liên hệ chúng tôi để yêu cầu xóa tài khoản và dữ liệu liên quan.
      </Paragraph>
      <Paragraph>
        <strong>6. Cookie và công nghệ theo dõi</strong>
        <br />
        Chúng tôi sử dụng cookie để nâng cao trải nghiệm người dùng (ví dụ: lưu
        tùy chọn tìm kiếm). Bạn có thể tắt cookie trong cài đặt trình duyệt,
        nhưng điều này có thể ảnh hưởng đến một số chức năng.
      </Paragraph>
      <Paragraph>
        <strong>7. Thay đổi chính sách</strong>
        <br />
        Chúng tôi có thể cập nhật chính sách này khi cần thiết. Mọi thay đổi sẽ
        được thông báo qua email hoặc trên website.
      </Paragraph>
      <Paragraph>
        <strong>8. Liên hệ</strong>
        <br />
        Nếu có thắc mắc, vui lòng liên hệ qua email:{" "}
        <a href="mailto:support@yumzy.vn">support@yumzy.vn</a>
      </Paragraph>
    </div>
  );
};

export default PrivacyPolicy;
