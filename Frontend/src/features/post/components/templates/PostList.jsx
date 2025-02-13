import { message, Space, Table } from "antd";
import usePost from "../../hooks/usePost";
import { Link } from "react-router-dom";
import useDeletePost from "../../hooks/useDeletePost";

const PostList = () => {
  const { mutate } = useDeletePost();

  const handleDelete = (id) => {
    mutate(id, {
      onSuccess: () => {
        message.success("Post deleted successfully");
      },
      onError: () => {
        message.error("Error deleting post");
      },
    });
  };
  const { postData, loading } = usePost();
  console.log(postData);
  const postDataWithKey = postData.map((post) => ({
    ...post,
    key: post._id,
    username: post.user_id?.username || "Không có tên",
  }));

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      key: "id",
      render: (id) => <Link to={`/posts/${id}`}>{id}</Link>,
    },
    {
      title: "Tiêu Đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Người Viết",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Ngày đăng tải",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Tương tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/posts/${record._id}/edit`}>Sửa</Link>
          <Link
            onClick={() => {
              handleDelete(record._id);
            }}
          >
            Xóa
          </Link>
        </Space>
      ),
    },
  ];
  return (
    <Table
      loading={loading}
      dataSource={postDataWithKey}
      columns={columns}
      pagination={{
        current: 1,
        pageSize: 10,
      }}
    />
  );
};

export default PostList;
