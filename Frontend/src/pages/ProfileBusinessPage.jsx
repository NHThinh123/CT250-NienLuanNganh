import { useContext, useState } from "react";
import { BusinessContext } from "../contexts/business.context";
import { Card, Button, message } from "antd";
import AvatarBusinessUpload from "../features/business/components/templates/AvatarBusinessUpload";

import ProfileBusinessInfo from "../features/business/components/templates/ProfileBusinessInfo";
import { useUpdateProfileBusiness } from "../features/business/hooks/useProfileBusiness";
import ProfileBusinessForm from "../features/business/components/templates/ProfilebusinessForm";

const ProfileBusinessPage = () => {
    const { business, setBusiness } = useContext(BusinessContext);
    const { mutate: updateProfile, isLoading } = useUpdateProfileBusiness();
    const [isEditing, setIsEditing] = useState(false);

    if (!business.isAuthenticated) {
        return <p>Vui lòng đăng nhập để xem hồ sơ doanh nghiệp.</p>;
    }

    const handleUpdate = (updatedData) => {
        updateProfile(
            { id: business.business.id, data: updatedData },
            {
                onSuccess: (newBusiness) => {
                    setBusiness({ isAuthenticated: true, business: newBusiness });
                    message.success("Cập nhật thông tin doanh nghiệp thành công!");
                    setIsEditing(false);
                },
            }
        );
    };

    return (
        <Card title={<span style={{ fontWeight: 'bold' }}>Hồ sơ Doanh Nghiệp</span>} style={{ maxWidth: 600, margin: "auto", textAlign: "center" }}>
            <AvatarBusinessUpload avatar={business.business.avatar} onUpdate={handleUpdate} />
            {isEditing ? (
                <ProfileBusinessForm business={business.business} onSave={handleUpdate} onCancel={() => setIsEditing(false)} />
            ) : (
                <ProfileBusinessInfo business={business.business} onEdit={() => setIsEditing(true)} />
            )}
        </Card>
    );
};

export default ProfileBusinessPage;
