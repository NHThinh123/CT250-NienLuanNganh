import { Typography, Divider } from "antd";

const { Title, Paragraph } = Typography;

const TermsOfUse = () => {
  return (
    <div style={{ marginTop: 68 }}>
      <Title level={2}>Điều khoản sử dụng</Title>
      <Paragraph>
        <strong>Cập nhật lần cuối: Ngày 15 tháng 3 năm 2025</strong>
      </Paragraph>
      <Paragraph>
        Chào mừng bạn đến với Yumzy! Khi sử dụng website của chúng tôi, bạn đồng
        ý tuân thủ các điều khoản dưới đây. Vui lòng đọc kỹ trước khi tham gia.
      </Paragraph>
      <Divider />
      <Paragraph>
        <strong>1. Chấp nhận điều khoản</strong>
        <br />
        Bằng cách truy cập hoặc sử dụng Yumzy, bạn xác nhận đã đọc, hiểu và đồng
        ý với các điều khoản này. Nếu không đồng ý, vui lòng không sử dụng
        website.
      </Paragraph>
      <Paragraph>
        <strong>2. Đối tượng sử dụng</strong>
        <br />- <strong>Người dùng vãng lai:</strong> Có thể tìm kiếm món ăn và
        xem bài viết mà không cần tài khoản.
        <br />- <strong>Người dùng có tài khoản:</strong> Được đăng bài, tương
        tác và quản lý thông tin cá nhân sau khi đăng ký.
        <br />- <strong>Doanh nghiệp ẩm thực:</strong> Được quảng bá, quản lý
        thông tin và trả lời phản hồi sau khi đăng ký và thanh toán phí.
        <br />- <strong>Quản trị viên:</strong> Có quyền kiểm duyệt nội dung và
        quản lý hệ thống.
      </Paragraph>
      <Paragraph>
        <strong>3. Quy định về nội dung</strong>
        <br />
        - Người dùng chịu trách nhiệm về bài viết, hình ảnh, video đăng tải. Nội
        dung không được:
        <br />
        + Vi phạm pháp luật Việt Nam.
        <br />
        + Chứa thông tin sai lệch, xúc phạm, bạo lực hoặc khiêu dâm.
        <br />
        + Xâm phạm quyền sở hữu trí tuệ của bên khác.
        <br />- Chúng tôi có quyền xóa hoặc từ chối hiển thị nội dung không phù
        hợp mà không cần thông báo trước.
      </Paragraph>
      <Paragraph>
        <strong>4. Tài khoản và thanh toán</strong>
        <br />
        - Bạn phải cung cấp thông tin chính xác khi đăng ký.
        <br />
        - Doanh nghiệp ẩm thực cần thanh toán phí đăng ký và duy trì qua Visa
        hoặc ví điện tử. Phí không hoàn lại trừ khi có lỗi từ hệ thống.
        <br />- Không chia sẻ tài khoản hoặc mật khẩu với người khác. Yumzy
        không chịu trách nhiệm nếu tài khoản bị xâm phạm do lỗi người dùng.
      </Paragraph>
      <Paragraph>
        <strong>5. Quyền sở hữu trí tuệ</strong>
        <br />
        - Nội dung do bạn đăng tải thuộc quyền sở hữu của bạn, nhưng bạn cấp cho
        Yumzy quyền sử dụng (hiển thị, lưu trữ) để vận hành website.
        <br />- Giao diện, logo và thiết kế của Yumzy thuộc quyền sở hữu của
        chúng tôi.
      </Paragraph>
      <Paragraph>
        <strong>6. Giới hạn trách nhiệm</strong>
        <br />
        - Yumzy không chịu trách nhiệm về thiệt hại gián tiếp từ việc sử dụng
        website (ví dụ: mất dữ liệu do lỗi thiết bị).
        <br />- Chúng tôi không đảm bảo mọi nội dung trên website đều chính xác
        100%, vì đây là đóng góp từ cộng đồng.
      </Paragraph>
      <Paragraph>
        <strong>7. Chấm dứt dịch vụ</strong>
        <br />
        Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản của bạn nếu:
        <br />
        - Vi phạm điều khoản sử dụng.
        <br />- Có hành vi gây hại đến hệ thống hoặc người dùng khác.
      </Paragraph>
      <Paragraph>
        <strong>8. Luật áp dụng</strong>
        <br />
        Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh
        chấp sẽ được giải quyết tại tòa án có thẩm quyền tại Cần Thơ.
      </Paragraph>
      <Paragraph>
        <strong>9. Liên hệ</strong>
        <br />
        Nếu cần hỗ trợ, vui lòng liên hệ qua email:{" "}
        <a href="mailto:support@yumzy.vn">support@yumzy.vn</a>
      </Paragraph>
    </div>
  );
};

export default TermsOfUse;
