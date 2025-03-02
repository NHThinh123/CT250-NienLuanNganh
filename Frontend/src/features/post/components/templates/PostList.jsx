/* eslint-disable no-unused-vars */
import { Col, List, Row, Space, Table } from "antd";
import usePost from "../../hooks/usePost";
import { Link } from "react-router-dom";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import PostItem from "../organisms/PostItem";

import SideBar from "../organisms/SideBar";
//import useDeletePost from "../../hooks/useDeletePost";

const PostList = () => {
  //const { mutate } = useDeletePost();

  // const handleDelete = (id) => {
  //   mutate(id, {
  //     onSuccess: () => {
  //       message.success("Post deleted successfully");
  //     },
  //     onError: () => {
  //       message.error("Error deleting post");
  //     },
  //   });
  // };
  const { postData, loading } = usePost();

  // const postDataWithKey = postData.map((post) => ({
  //   ...post,
  //   key: post._id,
  //   username: post.user_id?.username || "Không có tên",
  // }));
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Row style={{ minWidth: "800px" }} justify={"center"}>
        <Col xs={24} sm={24} md={24} lg={16}>
          <List
            dataSource={postData.posts}
            grid={{ gutter: 8, column: 1 }}
            renderItem={(item) => (
              <List.Item style={{ padding: "0px", margin: "0px" }}>
                <PostItem postData={item}></PostItem>
              </List.Item>
            )}
          />
        </Col>
        <Col xs={24} sm={0} md={0} lg={6}>
          <SideBar />
        </Col>
      </Row>
    </>
  );
};

export default PostList;
