import React, { useState } from 'react';
import { useAdmin } from '../features/admin/hooks/useAdmin';
import CreateUserForm from '../features/admin/components/templates/CreateUserForm';
import CreateBusinessForm from '../features/admin/components/templates/CreateBusinessForm';
import { Card, Col, Row, Form, Button, Space } from 'antd';

const AdminAddPage = () => {
    const { createUser, createBusiness, createUserLoading, createBusinessLoading } = useAdmin();
    const [userForm] = Form.useForm();
    const [businessForm] = Form.useForm();
    const [activeForm, setActiveForm] = useState('user');

    const handleFilterChange = (formType) => {
        setActiveForm(formType);
    };

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }} justify="center">
                <Col span={18}>
                    {/* Button bộ lọc */}
                    <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            type={activeForm === 'user' ? 'primary' : 'default'}
                            onClick={() => handleFilterChange('user')}
                        >
                            Tạo Người Dùng
                        </Button>
                        <Button
                            type={activeForm === 'business' ? 'primary' : 'default'}
                            onClick={() => handleFilterChange('business')}
                        >
                            Tạo Doanh Nghiệp
                        </Button>
                    </Space>

                    <Card
                        title={activeForm === 'user' ? 'Tạo Người Dùng Mới' : 'Tạo Doanh Nghiệp Mới'}
                        headStyle={{ textAlign: 'center' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            {activeForm === 'user' ? (
                                <CreateUserForm
                                    style={{ width: '100%' }}
                                    onCreateUser={(data) =>
                                        createUser(data, {
                                            onSuccess: () => userForm.resetFields(),
                                        })
                                    }
                                    loading={createUserLoading}
                                    form={userForm}
                                />
                            ) : (
                                <CreateBusinessForm
                                    onCreateBusiness={(data) => {
                                        const [longitude, latitude] = data.address.coordinates
                                            .split(',')
                                            .map((num) => parseFloat(num.trim()));
                                        createBusiness(
                                            {
                                                ...data,
                                                address: {
                                                    ...data.address,
                                                    coordinates: [longitude, latitude],
                                                },
                                            },
                                            {
                                                onSuccess: () => businessForm.resetFields(),
                                            }
                                        );
                                    }}
                                    loading={createBusinessLoading}
                                    form={businessForm}
                                />
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminAddPage;