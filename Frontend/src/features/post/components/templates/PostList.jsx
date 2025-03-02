import { useState, useEffect } from "react";
import { Col, List, Row, Spin } from "antd";
import { useInView } from "react-intersection-observer";

import usePost from "../../hooks/usePost";
import PostItem from "../organisms/PostItem";
import SideBar from "../organisms/SideBar";
import PostFilter from "../organisms/PostFilter";

const PostList = () => {
  const [params, setParams] = useState({
    search: "",
    sort: "newest",
    limit: 5,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePost(params);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleSearch = (value) => {
    setParams((prev) => ({ ...prev, search: value }));
  };

  const handleSortChange = (value) => {
    setParams((prev) => ({ ...prev, sort: value }));
  };

  return (
    <>
      <Row style={{ minWidth: "800px" }} justify={"center"}>
        <Col xs={24} sm={24} md={24} lg={16}>
          <PostFilter
            handleSearch={handleSearch}
            handleSortChange={handleSortChange}
          />
          <List
            dataSource={data?.pages?.flatMap((page) => page.posts)}
            grid={{ gutter: 8, column: 1 }}
            renderItem={(item) => (
              <List.Item style={{ padding: "0px", margin: "0px" }}>
                <PostItem postData={item} />
              </List.Item>
            )}
          />
          {isFetchingNextPage && (
            <div style={{ textAlign: "center" }}>
              <Spin />
            </div>
          )}
          <div ref={ref} style={{ height: "20px" }} />
        </Col>
        <Col xs={24} sm={0} md={0} lg={6}>
          <SideBar />
        </Col>
      </Row>
    </>
  );
};

export default PostList;
