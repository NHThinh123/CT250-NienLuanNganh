import { Table } from "antd";
import useUser from "../../hooks/useUser";

const columns = [
  {
    title: "Id",
    dataIndex: "_id",
    key: "id",
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
];
const UserList = () => {
  const { userData, loading } = useUser();
  const userDataWithKey = userData.map((user) => ({ ...user, key: user._id }));
  return (
    <Table loading={loading} dataSource={userDataWithKey} columns={columns} />
  );
};

export default UserList;
