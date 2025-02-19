/* eslint-disable no-unused-vars */
import { Col, List, Row, Typography } from "antd";
import useBusiness from "../../../business/hooks/useBusiness";
import BoxContainer from "../../../../components/atoms/BoxContainer";

const ListBusinessHome = () => {
  // const { businessData } = useBusiness();
  return (
    <Row>
      <Col span={24}>
        <Typography.Title level={2} style={{ fontWeight: "bold" }}>
          Quán ăn
        </Typography.Title>
        <BoxContainer></BoxContainer>
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
