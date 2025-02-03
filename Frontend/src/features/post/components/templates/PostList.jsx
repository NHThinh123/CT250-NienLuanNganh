/* eslint-disable no-unused-vars */
import { Space, Table } from "antd";
import usePost from "../../hooks/usePost";

const columns = [
  {
    title: "Id",
    dataIndex: "_id",
    key: "id",
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
        <a>Sửa</a>
        <a>Xóa</a>
      </Space>
    ),
  },
];
const PostList = () => {
  const { postData, loading } = usePost();
  const postDataWithKey = postData.map((post) => ({
    ...post,
    key: post._id,
    username: post.userId?.username || "Không có tên",
  }));

  //   console.log(postData);
  //   console.log("add key", postDataWithKey);

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
