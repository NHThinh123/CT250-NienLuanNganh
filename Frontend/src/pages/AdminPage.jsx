import { useAdmin } from "../features/admin/hooks/useAdmin";
import DashboardSummary from "../features/admin/components/templates/DashboardSummary";
import { Charts } from "../features/admin/components/templates/Charts";
import { usePost } from "../features/post/hooks/usePost";
import { Spin } from "antd";

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
  const { data } = usePost({
    search: "",
    limit: 9999,
  });
  const postCount = data?.pages[0]?.pagination?.totalPosts;
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
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 lg:p-6">
      <DashboardSummary
        userCount={userCount}
        businessCount={businessCount}
        totalRevenue={revenue}
        postCount={postCount}
      />
      <Charts />
    </div>
  );
};

export default AdminPage;