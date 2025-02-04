import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import useCreatePost from "../../hooks/useCreatePost";
import useUpdatePost from "../../hooks/useUpdatePost";

const PostForm = ({ initialValues, mode = "create" }) => {
  const navigate = useNavigate();
  const { mutate: createPost } = useCreatePost();
  const { mutate: updatePost } = useUpdatePost();

  // Chỉ đặt giá trị mặc định nếu không có initialValues
  const defaultValues = {
    title: "bài đăng 1",
    content: "nội dung bài đăng 1",
  };

  const formInitialValues =
    mode === "edit" && initialValues ? initialValues : defaultValues;

  const onFinish = (values) => {
    if (mode === "create") {
      createPost(
        {
          userId: "678b2f5ffc88df85ce348612",
          title: values.title,
          content: values.content,
        },
        {
          onSuccess: () => {
            message.success("Bài viết đã được tạo thành công!");
            navigate("/posts");
          },
          onError: () => {
            message.error("Lỗi khi tạo bài viết!");
          },
        }
      );
    } else if (mode === "edit" && initialValues?._id) {
      updatePost(
        {
          id: initialValues._id,
          data: {
            title: values.title,
            content: values.content,
          },
        },
        {
          onSuccess: () => {
            message.success("Bài viết đã được cập nhật!");
            navigate("/posts");
          },
          onError: () => {
            message.error("Lỗi khi cập nhật bài viết!");
          },
        }
      );
    }
  };

  return (
    <Form
      name="postForm"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 800, marginTop: 50 }}
      initialValues={formInitialValues}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Tiêu đề"
        name="title"
        rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Nội dung"
        name="content"
        rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {mode === "edit" ? "Cập nhật" : "Đăng tải"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PostForm;
