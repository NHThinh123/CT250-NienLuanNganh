/* eslint-disable no-unused-vars */
import { Button, Col, List, Row } from "antd";

import usePost from "../../../post/hooks/usePost";
import PostCard from "../../../post/components/organisms/PostCard";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../contexts/auth.context";
const ListPostHome = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [params, setParams] = useState({
    search: "",
    sort: "most_likes",
    limit: 6,
    user_id: auth?.user?.id,
  });

  const { data, isLoading } = usePost(params);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Row justify="center">
      <Col span={24}>
        <List
          dataSource={data?.pages?.flatMap((page) => page.posts)}
          grid={{ gutter: 8, column: 1 }}
          renderItem={(item) => (
            <List.Item style={{ padding: "0px", margin: "0px" }}>
              <PostCard post={item} />
            </List.Item>
          )}
        />
        <div style={{ margin: "8px" }}>
          <Button
            onClick={() => navigate("/posts")}
            type="dashed"
            style={{ width: "100%", padding: "16px" }}
          >
            Xem thêm
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default ListPostHome;
