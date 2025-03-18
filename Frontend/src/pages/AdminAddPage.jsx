import { useAdmin } from "../features/admin/hooks/useAdmin";
import CreateUserForm from "../features/admin/components/templates/CreateUserForm";
import CreateBusinessForm from "../features/admin/components/templates/CreateBusinessForm";
import { Card, Col, Row } from "antd";

const AdminAddPage = () => {
  const {
    createUser,
    createBusiness,
    createUserLoading,
    createBusinessLoading,
  } = useAdmin();

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Create New User">
            <CreateUserForm
              onCreateUser={(data) => createUser(data)}
              loading={createUserLoading}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Create New Business">
            <CreateBusinessForm
              onCreateBusiness={(data) => {
                const [longitude, latitude] = data.coordinates
                  .split(",")
                  .map((num) => parseFloat(num.trim()));
                createBusiness({
                  ...data,
                  coordinates: [longitude, latitude],
                });
              }}
              loading={createBusinessLoading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminAddPage;
