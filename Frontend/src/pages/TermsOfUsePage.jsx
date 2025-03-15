import { Col, Row } from "antd";

import BoxContainer from "../components/atoms/BoxContainer";
import TermsOfUse from "../components/atoms/TermsOfUse";

const TermsOfUsePage = () => {
  return (
    <Row justify={"center"}>
      <Col span={20}>
        <BoxContainer>
          <TermsOfUse />
        </BoxContainer>
      </Col>
    </Row>
  );
};

export default TermsOfUsePage;
