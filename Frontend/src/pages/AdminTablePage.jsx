import { Card, Col, Row } from "antd";
import UserList from "../features/admin/components/templates/UserList";
import BusinessList from "../features/admin/components/templates/BusinessList";
import { useAdmin } from "../features/admin/hooks/useAdmin";
import { usePost } from "../features/post/hooks/usePost";
import PostList from "../features/admin/components/templates/PostList";
import useDeletePost from "../features/post/hooks/useDeletePost";
import { useAuthEntity } from "../hooks/useAuthEntry";

const AdminTablePage = () => {
  const {
    users,
    updateUser,
    deleteUser,
    businesses,
    updateBusiness,
    deleteBusiness,
  } = useAdmin();
  const { data: postData } = usePost({
    sort: "most_likes",
    limit: 999,
  });
  const { entity } = useAuthEntity();
  const { mutate: deletePost, isLoading: isDeleting } = useDeletePost();
  const handleDeleteUser = (id) => {
    deleteUser(id);
  };

  const handleDeleteBusiness = (id) => {
    deleteBusiness(id);
  };
  const handleDeletePost = (post_id) => {
    deletePost({ post_id, id: entity.id });
  };
  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Danh sách người dùng">
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
          <Card title="Danh sách doanh nghiệp">
            <BusinessList
              businesses={businesses}
              updateBusiness={updateBusiness}
              onDeleteBusiness={handleDeleteBusiness}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Danh sách bài viết">
            <PostList
              postData={postData?.pages?.flatMap((page) => page.posts)}
              onDeletePost={handleDeletePost}
              isDeleting={isDeleting}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminTablePage;
