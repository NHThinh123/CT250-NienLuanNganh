import { Col, Row } from "antd";

import PrivacyPolicy from "../components/atoms/PrivacyPolicy";
import BoxContainer from "../components/atoms/BoxContainer";

const PrivacyPolicyPage = () => {
  return (
    <Row justify={"center"}>
      <Col span={20}>
        <BoxContainer>
          <PrivacyPolicy />
        </BoxContainer>
      </Col>
    </Row>
  );
};

export default PrivacyPolicyPage;
