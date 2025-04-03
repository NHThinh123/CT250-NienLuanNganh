import { Card, Statistic, Row, Col } from "antd";

const DashboardSummary = ({
  userCount,
  businessCount,
  totalRevenue,
  postCount,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable>
          <Statistic
            title={
              <span style={{ fontWeight: "bold" }}>Số Lượng Doanh Nghiệp</span>
            }
            value={businessCount}
            valueStyle={{ color: "#1890ff" }}
            suffix="Quán ăn"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable>
          <Statistic
            title={
              <span style={{ fontWeight: "bold" }}>Số Lượng Người Dùng</span>
            }
            value={userCount}
            valueStyle={{ color: "#ec407a" }}
            suffix="Người dùng"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable>
          <Statistic
            title={<span style={{ fontWeight: "bold" }}>Số lượng post</span>}
            value={postCount}
            valueStyle={{ color: "#52c41a" }}
            suffix="Bài viết"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable>
          <Statistic
            title={<span style={{ fontWeight: "bold" }}>Doanh Thu</span>}
            value={totalRevenue}
            valueStyle={{ color: "#008080" }}
            suffix="VND"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardSummary;