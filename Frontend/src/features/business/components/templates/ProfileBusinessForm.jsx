import { Form, Input, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";
import { useUpdateProfileBusiness } from "../../hooks/useProfileBusiness";
import { useContext } from "react";
import { BusinessContext } from "../../../../contexts/business.context";

const ProfileBusinessForm = ({ business, onCancel }) => {
    const [form] = Form.useForm();
    const { business: businessData, setBusiness } = useContext(BusinessContext);
    const updateProfile = useUpdateProfileBusiness();

    const disabledDate = (current) => {
        return current && current.isAfter(dayjs().endOf("day"));
    };

    const handleSubmit = async (values) => {
        const updatedData = {
            business_name: values.business_name,
            contact_info: values.contact_info,
            location: values.location,
            open_hours: values.open_hours,
            close_hours: values.close_hours,
        };

        try {
            const res = await updateProfile.mutateAsync({ id: business.id, data: updatedData });

            // Cập nhật thông tin business trong context
            const updatedBusiness = { ...businessData, business: { ...businessData.business, ...res.business } };
            setBusiness(updatedBusiness);
            localStorage.setItem("authBusiness", JSON.stringify(updatedBusiness));

            message.success("Cập nhật thông tin thành công!");
            onCancel();
        } catch (error) {
            message.error("Cập nhật thất bại, vui lòng thử lại.");
            console.error("Lỗi cập nhật business:", error);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                ...business,
                open_hours: business.open_hours || "",
                close_hours: business.close_hours || "",
            }}
            onFinish={handleSubmit}
        >
            <Form.Item label="Tên doanh nghiệp" name="business_name" rules={[{ required: true, message: "Vui lòng nhập tên doanh nghiệp" }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Thông tin liên hệ" name="contact_info">
                <Input />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="location">
                <Input />
            </Form.Item>
            <Form.Item label="Giờ mở cửa" name="open_hours">
                <Input placeholder="VD: 08:00 AM" />
            </Form.Item>
            <Form.Item label="Giờ đóng cửa" name="close_hours">
                <Input placeholder="VD: 10:00 PM" />
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

export default ProfileBusinessForm;
