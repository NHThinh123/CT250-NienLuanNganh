import { Card, Statistic, Row, Col } from "antd";

const DashboardSummary = ({ userCount, businessCount, postCount }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Card>
          <Statistic
            title={
              <span style={{ fontWeight: "bold" }}>Số Lượng Người Dùng</span>
            }
            value={userCount}
            valueStyle={{ color: "#52c41a" }}
            suffix=" User"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title={
              <span style={{ fontWeight: "bold" }}>Số Lượng Doanh Nghiệp</span>
            }
            value={businessCount}
            valueStyle={{ color: "#52c41a" }}
            suffix="Business"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Số lượng post"
            value={postCount}
            valueStyle={{ color: "#52c41a" }}
            suffix="Post"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Sales"
            value="$103,430"
            valueStyle={{ color: "#52c41a" }}
            suffix="+5% than yesterday"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardSummary;
