import { Form, Input, Select, Button } from "antd";

const { Option } = Select;

const CreateBusinessForm = ({ onCreateBusiness }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onCreateBusiness({
      business_name: values.business_name,
      email: values.email,
      password: values.password,
      open_hours: values.open_hours,
      close_hours: values.close_hours,
      address: { type: "Point", coordinates: values.coordinates },
      location: values.location,
      contact_info: values.contact_info,
      verified: values.verified,
      status: values.status,
    });
    form.resetFields();
  };

  return (
    <Form
      form={form}
      name="createBusiness"
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 600, margin: "20px 0" }}
    >
      <Form.Item
        name="business_name"
        label="Business Name"
        rules={[{ required: true, message: "Please input the name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Please input the email!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please input the password!" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="open_hours"
        label="Open Hours"
        rules={[{ required: true, message: "Please input open hours!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="close_hours"
        label="Close Hours"
        rules={[{ required: true, message: "Please input close hours!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="coordinates"
        label="Coordinates (Longitude, Latitude)"
        rules={[{ required: true, message: "Please input coordinates!" }]}
      >
        <Input placeholder="e.g., 106.6297, 10.8231" />
      </Form.Item>
      <Form.Item
        name="location"
        label="Location"
        rules={[{ required: true, message: "Please input location!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="contact_info"
        label="Contact Info"
        rules={[{ required: true, message: "Please input contact info!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="verified" label="Verified" valuePropName="checked">
        <Input type="checkbox" />
      </Form.Item>
      <Form.Item name="status" label="Status" initialValue="pending">
        <Select>
          <Option value="pending">Pending</Option>
          <Option value="active">Active</Option>
          <Option value="suspended">Suspended</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Business
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateBusinessForm;
