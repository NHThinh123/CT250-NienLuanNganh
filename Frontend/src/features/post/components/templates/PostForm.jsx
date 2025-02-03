import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import useCreatePost from "../../hooks/useCreatePost";

const PostForm = () => {
  const navigate = useNavigate();
  const { mutate } = useCreatePost();

  const onFinish = (values) => {
    console.log("Success:", values);
    mutate(
      {
        userId: "678b2f5ffc88df85ce348612",
        title: values.title,
        content: values.content,
      },
      {
        onSuccess: () => {
          message.success("Post created successfully");
          navigate("/posts");
        },
        onError: () => {
          message.error("Error creating post");
        },
      }
    );
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      name="basic"
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 800,
        marginTop: 50,
      }}
      initialValues={{
        title: "bài đăng 1",
        content: "nội dung bài đăng 1",
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Tiêu đề"
        name="title"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tiêu đề!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Nội dung"
        name="content"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập nội dung!",
          },
        ]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Đăng tải
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PostForm;
