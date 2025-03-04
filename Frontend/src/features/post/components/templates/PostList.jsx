import { useState, useEffect, useContext } from "react";
import { Col, List, Row, Spin } from "antd";
import { useInView } from "react-intersection-observer";

import usePost from "../../hooks/usePost";
import PostItem from "../organisms/PostItem";
import SideBar from "../organisms/SideBar";
import PostFilter from "../organisms/PostFilter";
import { AuthContext } from "../../../../contexts/auth.context";

const PostList = () => {
  const { auth } = useContext(AuthContext);
  const [params, setParams] = useState({
    search: "",
    sort: "most_likes",
    limit: 6,
    user_id: auth?.user?.id,
    filter: {
      tags: [],
    },
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

  const handleTagFilter = (selectedTags) => {
    setParams((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        tags: selectedTags,
      },
    }));
  };

  return (
    <>
      <Row style={{ minWidth: "800px" }} justify={"center"}>
        <Col xs={24} sm={24} md={24} lg={16}>
          <PostFilter
            handleSearch={handleSearch}
            handleSortChange={handleSortChange}
            handleTagFilter={handleTagFilter}
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
            <div style={{ textAlign: "center", padding: "10px" }}>
              <Spin />
            </div>
          )}
          <div ref={ref} style={{ height: "20px" }} />
        </Col>
        {auth.user.id && (
          <Col
            xs={24}
            sm={0}
            md={0}
            lg={6}
            style={{
              position: "sticky",
              top: "65px",
              height: "fit-content",
              maxHeight: "calc(100vh - 40px)",
              overflowY: "auto",
            }}
          >
            <SideBar />
          </Col>
        )}
      </Row>
    </>
  );
};

export default PostList;
