import { Typography, Divider } from "antd";

const { Title, Paragraph } = Typography;

const FAQ = () => {
  return (
    <div>
      <Title level={2}>FAQ - Câu hỏi thường gặp</Title>
      <Paragraph>
        <strong>
          Chào mừng bạn đến với Yumzy – Nơi kết nối cộng đồng yêu ẩm thực Việt
          Nam!
        </strong>{" "}
        Dưới đây là những câu hỏi thường gặp để giúp bạn hiểu rõ hơn về cách sử
        dụng website của chúng tôi.
      </Paragraph>
      <Divider />
      <Paragraph>
        <strong>1. Yumzy là gì?</strong>
        <br />
        Yumzy là website chuyên về blog ẩm thực, nơi người dùng có thể tìm kiếm,
        chia sẻ và đánh giá các trải nghiệm ăn uống tại Việt Nam. Chúng tôi kết
        nối khách hàng, doanh nghiệp ẩm thực và cộng đồng yêu thích ẩm thực
        thông qua các bài viết, hình ảnh và đánh giá chân thực.
      </Paragraph>
      <Paragraph>
        <strong>2. Làm thế nào để đăng ký tài khoản trên Yumzy?</strong>
        <br />
        - Truy cập mục Đăng ký trên trang chủ.
        <br />
        - Điền đầy đủ thông tin như email, tên đăng nhập, mật khẩu và số điện
        thoại (tùy chọn).
        <br />
        - Sau khi đăng ký, kiểm tra email để xác nhận tài khoản.
        <br />- Đối với doanh nghiệp ẩm thực, bạn cần thanh toán phí đăng ký để
        kích hoạt tài khoản đầy đủ chức năng.
      </Paragraph>
      <Paragraph>
        <strong>3. Tôi có thể làm gì nếu quên mật khẩu?</strong>
        <br />
        Nếu quên mật khẩu, nhấp vào Quên mật khẩu tại trang đăng nhập, nhập
        email hoặc số điện thoại đã đăng ký. Hệ thống sẽ gửi hướng dẫn khôi phục
        mật khẩu qua email.
      </Paragraph>
      <Paragraph>
        <strong>4. Ai có thể đăng bài viết trên Yumzy?</strong>
        <br />
        Người dùng có tài khoản (bao gồm cá nhân và doanh nghiệp ẩm thực) sau
        khi đăng nhập có thể đăng tải bài viết về trải nghiệm ẩm thực, kèm hình
        ảnh, video và đánh giá.
      </Paragraph>
      <Paragraph>
        <strong>5. Làm sao để tìm kiếm món ăn trên Yumzy?</strong>
        <br />
        Tại trang chủ, nhập từ khóa món ăn vào thanh tìm kiếm. Hệ thống sẽ hiển
        thị danh sách bài viết phù hợp. Nếu không tìm thấy, bạn sẽ nhận thông
        báo Không tìm thấy món ăn phù hợp.
      </Paragraph>
      <Paragraph>
        <strong>
          6. Doanh nghiệp ẩm thực có lợi ích gì khi tham gia Yumzy?
        </strong>
        <br />
        Doanh nghiệp có thể:
        <br />
        - Quản lý thông tin (thực đơn, địa chỉ, giờ mở cửa).
        <br />
        - Đăng bài viết quảng bá.
        <br />
        - Trả lời phản hồi từ khách hàng để cải thiện dịch vụ.
        <br />- Thanh toán phí duy trì để tiếp tục sử dụng các tính năng nâng
        cao.
      </Paragraph>
      <Paragraph>
        <strong>7. Nội dung trên Yumzy có được kiểm duyệt không?</strong>
        <br />
        Có, đội ngũ quản trị viên của chúng tôi kiểm duyệt bài viết để đảm bảo
        tuân thủ tiêu chuẩn cộng đồng. Bài viết vi phạm sẽ bị xóa sau khi xem
        xét.
      </Paragraph>
      <Paragraph>
        <strong>8. Tôi có thể liên hệ hỗ trợ ở đâu?</strong>
        <br />
        Bạn có thể gửi câu hỏi qua mục Liên hệ hoặc chatbot tích hợp trên
        website. Chúng tôi sẽ phản hồi sớm nhất có thể!
      </Paragraph>
      <Paragraph>
        <strong>9. Yumzy có ứng dụng di động không?</strong>
        <br />
        Hiện tại, Yumzy hoạt động trên trình duyệt web và tương thích với mọi
        thiết bị (điện thoại, máy tính bảng, laptop). Chúng tôi đang xem xét
        phát triển ứng dụng trong tương lai.
      </Paragraph>
      <Paragraph>
        <strong>Còn câu hỏi nào khác?</strong> Hãy liên hệ với chúng tôi để được
        giải đáp!
      </Paragraph>
    </div>
  );
};

export default FAQ;
