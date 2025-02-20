/* eslint-disable no-unused-vars */
import { Col, Row, Typography } from "antd";
import useBusiness from "../../../business/hooks/useBusiness";
import BoxContainer from "../../../../components/atoms/BoxContainer";

import Business from "../../../business/components/templates/Businesses";

const ListBusinessHome = () => {
  const { businessData } = useBusiness();

  return (
    <Row>
      <Col span={24}>
        <Typography.Title level={2} style={{ fontWeight: "bold" }}>
          Quán ăn
        </Typography.Title>

        <Business businessData={businessData}></Business>
      </Col>
    </Row>
  );
};

export default ListBusinessHome;
