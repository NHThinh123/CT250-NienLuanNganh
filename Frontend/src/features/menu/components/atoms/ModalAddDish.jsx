import {
  // Avatar,
  // Button,
  Col,
  // Form,
  // Input,
  // message,
  Modal,
  // Popover,
  Row,
  Typography,
} from "antd";
// import { Images, MapPinned, Tags } from "lucide-react";
// import { useContext, useState } from "react";
// import useCreateDish from "../../../dish/hooks/useCreateDish";

// import SpinLoading from "../../../../components/atoms/SpinLoading";
// import { BusinessContext } from "../../../../contexts/business.context";

const ModalAddDish = ({
  isModalOpen,
  handleCancel,
  handleOk,
  // form,
  // setIsModalOpen,
}) => {
  // const { business } = useContext(BusinessContext);
  // const { mutate: createDish, isPending } = useCreateDish();
  //   const [fileList, setFileList] = useState([]);
  //   const [isShowUploadImage, setIsShowUploadImage] = useState(false);
  //   const [isShowUploadTag, setIsShowUploadTag] = useState(false);
  //   // eslint-disable-next-line no-unused-vars
  //   const [isShowUploadLocation, setIsShowUploadLocation] = useState(false);

  //   const handleShowUploadImage = () => {
  //     setIsShowUploadImage(true);
  //   };
  //   const handleShowUploadTag = () => {
  //     setIsShowUploadTag(true);
  //   };
  //   const handleShowUploadLocation = () => {
  //     setIsShowUploadLocation(true);
  //   };

  // const onFinish = (values) => {
  //   const formData = new FormData();
  //   formData.append("user_id", business?.user?.id); //hakfhakffsaf
  //   formData.append("title", values.title);
  //   //     formData.append("content", values.content);
  //   //     formData.append("tags", JSON.stringify(tags));
  //   //     fileList.forEach((file) => {
  //   //       formData.append("images", file.originFileObj);
  //   //     });
  //   //     // formData.forEach((value, key) => {
  //   //     //   console.log(key, value);
  //   //     // });
  //   createDish(formData, {
  //     onSuccess: () => {
  //       message.success("Món ăn đã được tạo thành công!");
  //       form.resetFields();
  //       //         setIsShowUploadImage(false);
  //       //         setIsShowUploadTag(false);
  //       //         setIsShowUploadLocation(false);
  //       //         setFileList([]);
  //       //         setTags([]);
  //       setIsModalOpen(false);
  //     },
  //     onError: () => {
  //       message.error("Lỗi khi tạo bài viết!");
  //     },
  //   });
  // };

  return (
    <Modal
      title="Basic Modal"
      // title={
      //   <Typography.Title level={4} style={{ textAlign: "center" }}>
      //     Tạo món ăn
      //   </Typography.Title>
      // }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      // onCancel={() => {
      //   handleCancel();
      //   //     setIsShowUploadImage(false);
      //   //     setIsShowUploadTag(false);
      //   //     setIsShowUploadLocation(false);
      //   //     setFileList([]);
      //   //     setTags([]);
      // }}
      // okText={isPending ? "Đang tạo..." : "Đăng tải"}
      // cancelText="Hủy"
      // maskClosable={false}
      // centered
      // style={{ minWidth: "50%" }}
    >
      {/* {isPending && <SpinLoading />} */}
      <Row>
        <Col span={2}>{/* <Avatar></Avatar> */}</Col>
        <Col span={20}>
          <Typography.Text style={{ fontWeight: "bold" }}></Typography.Text>
        </Col>
      </Row>
      {/* <Row
        style={{
          marginTop: "16px",
          maxHeight: "320px",
          overflowY: "auto",
          padding: "8px",
          scrollbarWidth: "thin",
        }}
      >
        <Col span={24}>
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              name="title"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tiêu đề bài viết!",
                },
              ]}
            >
              <Input size="large" placeholder="Nhập tiêu đề bài viết"></Input>
            </Form.Item>
            <Form.Item
              name="content"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tiêu nội dung viết!",
                },
              ]}
            >
              <Input.TextArea
                size="large"
                placeholder="Hãy viết về trải nghiệm ẩm thực của bạn hôm nay!"
                autoSize={{ minRows: 4, maxRows: 10 }}
              ></Input.TextArea>
            </Form.Item>
          </Form>
        </Col>
      </Row> */}

      {/* <Row
        style={{
          border: "1px solid #000",
          borderRadius: "8px",
          padding: "8px",
          marginTop: "16px",
          textAlign: "center",
        }}
        align={"middle"}
      >
        <Col span={12}>
          <Typography.Text style={{ fontWeight: "bold", textAlign: "right" }}>
            Thêm vào bài viết của bạn:
          </Typography.Text>
        </Col>
        <Col span={4}>
          <Button
            type="text"
            style={{ padding: "4px 18px" }}
            // onClick={handleShowUploadImage}
          >
            <Popover content="Thêm ảnh">
              <Images color="#03c200" size={24} strokeWidth={2.5} />
            </Popover>
          </Button>
        </Col>
        <Col span={4}>
          <Button
            type="text"
            style={{ padding: "4px 18px" }}
            // onClick={handleShowUploadTag}
          >
            <Popover content="Thêm chủ đề">
              <Tags color="#e09c0b" size={24} strokeWidth={2.5} />
            </Popover>
          </Button>
        </Col>
        <Col span={4}>
          <Button
            type="text"
            style={{ padding: "4px 18px" }}
            // onClick={handleShowUploadLocation}
          >
            <Popover content="Thêm địa điểm">
              <MapPinned color="#ff4d4f" size={24} strokeWidth={2.5} />
            </Popover>
          </Button>
        </Col>
      </Row> */}
    </Modal>
  );
};

export default ModalAddDish;
