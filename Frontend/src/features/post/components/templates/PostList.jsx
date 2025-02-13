/* eslint-disable no-unused-vars */
import { Col, List, Row, Space, Table } from "antd";
import usePost from "../../hooks/usePost";
import { Link } from "react-router-dom";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import PostItem from "../organisms/PostItem";
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
  console.log(postData);
  // const postDataWithKey = postData.map((post) => ({
  //   ...post,
  //   key: post._id,
  //   username: post.user_id?.username || "Không có tên",
  // }));

  return (
    <>
      <Row>
        <Col span={6}>
          <BoxContainer>aaa</BoxContainer>
        </Col>
        <Col span={12}>
          <List
            dataSource={postData}
            grid={{ gutter: 8, column: 1 }}
            renderItem={(item) => (
              <List.Item style={{ padding: "0px", margin: "0px" }}>
                <PostItem postData={item}></PostItem>
              </List.Item>
            )}
          />
        </Col>
        <Col span={6}>
          <BoxContainer>ccc</BoxContainer>
        </Col>
      </Row>
    </>
  );
};

export default PostList;
