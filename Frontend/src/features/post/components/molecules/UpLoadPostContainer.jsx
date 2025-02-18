import { Avatar, Button, Col, Form, Row } from "antd";
import { ChefHat, Utensils } from "lucide-react";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import { useState } from "react";
import ModalUploadPost from "./ModalUploadPost";

const UpLoadPostContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    form.submit();
    // setIsModalOpen(false);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };
  return (
    <BoxContainer>
      <Row>
        <Col span={4}>
          <Avatar
            src={
              "https://anhnail.com/wp-content/uploads/2024/11/Hinh-gai-xinh-2k4.jpg"
            }
          ></Avatar>
        </Col>
        <Col span={20}>
          <Button type="default" style={{ width: "100%" }} onClick={showModal}>
            Đăng tải bài viết
          </Button>
        </Col>
      </Row>
      <Row
        justify={"center"}
        style={{ textAlign: "center", marginTop: "8px" }}
        gutter={[16, 16]}
      >
        <Col span={12}>
          <Button type="default" style={{ width: "100%", color: "#03c200" }}>
            <Utensils size={18} color="#03c200" strokeWidth={2.5} />
            Món ngon
          </Button>
        </Col>
        <Col span={12}>
          <Button type="default" style={{ width: "100%", color: "#ff4d4f" }}>
            <ChefHat size={18} color="#ff4d4f" strokeWidth={2.5} /> Quán xịn
          </Button>
        </Col>
      </Row>
      <ModalUploadPost
        form={form}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleOk={handleOk}
        setIsModalOpen={setIsModalOpen}
      />
    </BoxContainer>
  );
};

export default UpLoadPostContainer;
