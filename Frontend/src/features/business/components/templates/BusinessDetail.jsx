import { Col, Row } from 'antd';

const DishDetail = ({businessData, isLoading, isError}) => {

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
                <Col span={3}>
                </Col>
                <Col span={9}>
                    <div style={styles.businessAva}>
                        <img style={{width: '100%', height: '100%'}} src={businessData.avatar} alt="Ảnh" ></img>
                    </div>
                    
                    
                </Col>
                <Col span={9}>
                    <div style={styles.businessDetail}>
                        <br />
                        <p style={styles.businessName}>{businessData.business_name}</p>
                        <p style={styles.businessLocation}>Địa chỉ: {businessData.location}</p>
                        <p style={styles.businessContactInfo}>Số điện thoại: {businessData.contact_info}</p>
                        <p style={styles.businessTime}>Giờ mở cửa: {businessData.open_hours} - {businessData.close_hours}</p>
                        <br />
                        <hr />
                    </div>
                </Col>
                <Col span={3}>
                </Col>

            </Row>
        </div>
    </>
  )
}

const styles = {
    businessPage: {
        backgroundColor: "#ffffff",
    },
    businessAva: {
        margin: "30px",
        marginLeft: "0",
    },
    businessDetail: {
        margin: "30px",
    },
    businessName: {
        fontSize: "30px",
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

export default DishDetail;
