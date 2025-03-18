import React from "react";
import { Row, Col, Card } from "antd";
import { useAdmin } from "../features/admin/hooks/useAdmin";
import DashboardSummary from "../features/admin/components/templates/DashboardSummary";
import Charts from "../features/admin/components/templates/Charts";
import CreateUserForm from "../features/admin/components/templates/CreateUserForm";
import CreateBusinessForm from "../features/admin/components/templates/CreateBusinessForm";

const AdminPage = () => {
    const {
        isUsersLoading,
        usersError,
        users,
        isBusinessesLoading,
        businesses,
        businessesError,
    } = useAdmin();
    // Xử lý giá trị hiển thị cho Statistic
    const userCount = isUsersLoading
        ? "Loading..."
        : usersError
            ? "Error"
            : users.length;
    const businessCount = isBusinessesLoading
        ? "Loading..."
        : businessesError
            ? "Error"
            : businesses.length;



    if (isUsersLoading || isBusinessesLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <DashboardSummary
                userCount={userCount}
                businessCount={businessCount}
            />
            <Charts />


        </div>
    );
};

export default AdminPage;