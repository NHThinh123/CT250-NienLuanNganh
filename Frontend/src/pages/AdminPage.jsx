import React from "react";
import { useAdmin } from "../features/admin/hooks/useAdmin";
import DashboardSummary from "../features/admin/components/templates/DashboardSummary";
import { Charts } from "../features/admin/components/templates/Charts";



const AdminPage = () => {
    const {
        isUsersLoading,
        usersError,
        users,
        isBusinessesLoading,
        businesses,
        businessesError,
        totalRevenue,
        isRevenueLoading,
        revenueError,
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
    const revenue = isRevenueLoading
        ? "Loading..."
        : revenueError
            ? "Error"
            : `${totalRevenue.toLocaleString()}`;


    if (isUsersLoading || isBusinessesLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <DashboardSummary
                userCount={userCount}
                businessCount={businessCount}
                totalRevenue={revenue}
            />
            <Charts />


        </div>
    );
};

export default AdminPage;