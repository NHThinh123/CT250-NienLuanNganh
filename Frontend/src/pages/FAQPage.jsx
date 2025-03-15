import { Col, Row } from "antd";
import BoxContainer from "../components/atoms/BoxContainer";
import FAQ from "../components/atoms/FAQ";

const FAQPage = () => {
  return (
    <Row justify={"center"}>
      <Col span={20}>
        <BoxContainer>
          <FAQ />;
        </BoxContainer>
      </Col>
    </Row>
  );
};

export default FAQPage;
