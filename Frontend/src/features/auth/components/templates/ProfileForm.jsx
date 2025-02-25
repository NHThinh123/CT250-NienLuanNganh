import { Form, Input, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";
import { useUpdateProfile } from "../../hooks/useProfile";
import { useContext } from "react";
import { AuthContext } from "../../../../contexts/auth.context";

const ProfileForm = ({ user, onCancel }) => {
    const [form] = Form.useForm();
    const { auth, setAuth } = useContext(AuthContext);
    const updateProfile = useUpdateProfile();

    const disabledDate = (current) => {
        return current && current.isAfter(dayjs().endOf("day"));
    };
    const handleSubmit = async (values) => {
        const updatedData = {
            name: values.name,
            dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
        };

        try {
            const res = await updateProfile.mutateAsync({ id: user.id, data: updatedData });

            // Cập nhật thông tin người dùng trong context
            const updatedUser = { ...auth.user, ...res.user };
            setAuth({ isAuthenticated: true, user: updatedUser });
            localStorage.setItem("authUser", JSON.stringify(updatedUser));

            message.success("Cập nhật thông tin thành công!");
            onCancel();
        } catch (error) {
            message.error("Cập nhật thất bại, vui lòng thử lại.");
            console.error("Lỗi cập nhật user:", error);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{ ...user, dateOfBirth: dayjs(user.dateOfBirth) }}
            onFinish={handleSubmit}
        >
            <Form.Item label="Họ và Tên" name="name" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Ngày sinh" name="dateOfBirth">
                <DatePicker
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                    disabledDate={disabledDate} // Sửa lỗi ở đây
                />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={updateProfile.isLoading}>
                Lưu
            </Button>
            <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                Thoát
            </Button>
        </Form>
    );
};

export default ProfileForm;
