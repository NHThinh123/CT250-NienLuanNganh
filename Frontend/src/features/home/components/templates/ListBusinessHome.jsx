/* eslint-disable no-unused-vars */
import { Button, Col, Row, Typography } from "antd";
import useBusiness from "../../../business/hooks/useBusiness";
import BoxContainer from "../../../../components/atoms/BoxContainer";

import BusinessInHomePage from "../../../business/components/templates/BusinessesInHomePage";
import { useNavigate } from "react-router-dom";

const ListBusinessHome = () => {
  const { businessData } = useBusiness();
  const navigate = useNavigate();

  return (
    <>
      <Row justify="space-between" align="middle">
        <Col>
          <Typography.Title level={2} style={{ fontWeight: "bold" }}>
            Quán Ăn
          </Typography.Title>
        </Col>
        <Col>
          <Button
            type="link"
            onClick={() => navigate("/businesses")}
            style={{
              margin: 4,
              cursor: "pointer",
              border: "none",
              color: "black",
              fontSize: 15,
              width: "calc(100% - 8px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "blue";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "black";
            }}
          >
            Xem Thêm
          </Button>
        </Col>
      </Row>
      <BusinessInHomePage businessData={businessData}></BusinessInHomePage>
    </>
  );
};

export default ListBusinessHome;
