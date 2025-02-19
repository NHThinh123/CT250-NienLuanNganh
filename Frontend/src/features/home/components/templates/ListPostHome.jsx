import { Button, Col, List, Row } from "antd";

import usePost from "../../../post/hooks/usePost";
import PostCard from "../../../post/components/organisms/PostCard";
const ListPostHome = () => {
  const { postData, loading } = usePost();
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Row justify="center">
      <Col span={24}>
        <List
          dataSource={postData}
          grid={{ gutter: 8, column: 1 }}
          renderItem={(item) => (
            <List.Item style={{ padding: "0px", margin: "0px" }}>
              <PostCard post={item} />
            </List.Item>
          )}
        />
        <div style={{ margin: "8px" }}>
          <Button type="dashed" style={{ width: "100%", padding: "16px" }}>
            Xem thêm
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default ListPostHome;
