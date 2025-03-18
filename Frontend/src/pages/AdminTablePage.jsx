import { Card, Col, Row } from "antd";
import React from "react";
import UserList from "../features/admin/components/templates/UserList";
import BusinessList from "../features/admin/components/templates/BusinessList";
import { useAdmin } from "../features/admin/hooks/useAdmin";

const AdminTablePage = () => {
    const {
        users,
        updateUser,
        deleteUser,
        businesses,
        updateBusiness,
        deleteBusiness,
    } = useAdmin();

    const handleDeleteUser = (id) => {
        deleteUser(id);
    };

    const handleDeleteBusiness = (id) => {
        deleteBusiness(id);
    };

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={24}>
                    <Card title="User List">
                        <UserList
                            users={users}
                            updateUser={updateUser}
                            onDeleteUser={handleDeleteUser}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={24}>
                    <Card title="Business List">
                        <BusinessList
                            businesses={businesses}
                            updateBusiness={updateBusiness}
                            onDeleteBusiness={handleDeleteBusiness}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminTablePage;