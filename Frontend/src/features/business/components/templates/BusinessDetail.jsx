import { Col, Row } from "antd";

const BusinessDetail = ({ businessData, isLoading, isError }) => {
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (isError) {
    return <h1>Error...</h1>;
  }
  return (
    <>
      <div style={styles.businessPage}>
        <Row>
          <Col span={3}></Col>
          <Col span={9}>
            <div style={styles.businessAva}>
              <img
                style={{ width: "85%", height: "85%" }}
                src={businessData.avatar}
                alt="Ảnh"
              ></img>
            </div>
          </Col>
          <Col span={9}>
            <div style={styles.businessDetail}>
              <br />
              <p style={styles.businessName}>{businessData.business_name}</p>
              <p style={styles.businessLocation}>
                Địa chỉ: {businessData.location}
              </p>
              <p style={styles.businessContactInfo}>
                Số điện thoại: {businessData.contact_info}
              </p>
              <p style={styles.businessTime}>
                Giờ mở cửa: {businessData.open_hours} -{" "}
                {businessData.close_hours}
              </p>
              <br />
              <hr style={{ height: "2px", border: "no", opacity: "0.5" }} />
            </div>
          </Col>
          <Col span={3}></Col>
        </Row>
      </div>
    </>
  );
};

const styles = {
  businessPage: {
    backgroundColor: "#ffffff",
  },
  businessAva: {
    margin: "18px 0px 25px 0px",
  },
  businessDetail: {
    margin: "0px",
    cursor: "text",
  },
  businessName: {
    fontSize: "25px",
    fontWeight: "bold",
    color: "#464646",
    marginBottom: "5px",
  },
  businessTime: {
    fontSize: "15px",
    color: "#252525",
    marginBottom: "5px",
  },
  businessLocation: {
    fontSize: "15px",
    color: "#252525",
    marginBottom: "5px",
  },
  businessContactInfo: {
    fontSize: "15px",
    color: "#252525",
    marginBottom: "5px",
  },
};

export default BusinessDetail;
