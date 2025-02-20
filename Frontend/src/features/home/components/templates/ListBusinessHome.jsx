/* eslint-disable no-unused-vars */
import { Card, Col, List, Row, Typography } from "antd";
import useBusiness from "../../../business/hooks/useBusiness";
import BoxContainer from "../../../../components/atoms/BoxContainer";

import { useNavigate } from "react-router-dom";

const ListBusinessHome = () => {
  const { businessData } = useBusiness();
  const navigate = useNavigate();
  return (
    <Row>
      <Col span={24}>
        <Typography.Title level={2} style={{ fontWeight: "bold" }}>
          Quán ăn
        </Typography.Title>

        <BoxContainer>
          <Row gutter={[16, 16]}>
            {businessData.map((business) => (
              <Col
                key={business._id}
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={4}
                style={{ padding: "10px" }}
              >
                <Card
                  hoverable
                  cover={
                    <img
                      style={{ width: "100%", height: "150px" }}
                      alt="business avatar"
                      src={business.avatar}
                    />
                  }
                  onClick={() => navigate(`/businesses/${business._id}`)}
                >
                  <Card.Meta
                    title={business.business_name}
                    description={business.location}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </BoxContainer>
        {/* <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={businessData}
          renderItem={(item) => (
            <List.Item>
              <div>
                <div>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <Typography.Title level={5}>{item.name}</Typography.Title>
                  <Typography.Text>{item.address}</Typography.Text>
                </div>
              </div>
            </List.Item>
          )}
        ></List> */}
      </Col>
    </Row>
  );
};

export default ListBusinessHome;
