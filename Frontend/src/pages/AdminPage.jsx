import { useAdmin } from "../features/admin/hooks/useAdmin";
import DashboardSummary from "../features/admin/components/templates/DashboardSummary";
import Charts from "../features/admin/components/templates/Charts";
import { usePost } from "../features/post/hooks/usePost";

const AdminPage = () => {
  const {
    isUsersLoading,
    usersError,
    users,
    isBusinessesLoading,
    businesses,
    businessesError,
  } = useAdmin();
  const { data: postData } = usePost();
  const postCount = postData?.pages[0].pagination?.totalPosts;
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
        postCount={postCount}
      />
      <Charts />
    </div>
  );
};

export default AdminPage;
