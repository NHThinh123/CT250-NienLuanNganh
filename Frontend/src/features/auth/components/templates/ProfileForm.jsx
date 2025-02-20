import { Form, Input, DatePicker, Button } from "antd";
import dayjs from "dayjs";

const ProfileForm = ({ user, onSave, onCancel }) => {
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        onSave({ ...user, ...values, dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD") });
    };

    return (
        <Form form={form} layout="vertical" initialValues={{ ...user, dateOfBirth: dayjs(user.dateOfBirth) }} onFinish={handleSubmit}>
            <Form.Item label="Họ và Tên" name="name" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Ngày sinh" name="dateOfBirth">
                <DatePicker />
            </Form.Item>
            <Button type="primary" htmlType="submit">
                Lưu
            </Button>
            <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                Hủy
            </Button>
        </Form>
    );
};

export default ProfileForm;
