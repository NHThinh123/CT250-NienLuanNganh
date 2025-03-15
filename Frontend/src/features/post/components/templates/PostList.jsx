import { useState, useEffect } from "react";
import { Col, List, Row, Spin } from "antd";
import { useInView } from "react-intersection-observer";

import { usePost, useLikedPosts, useCommentedPosts } from "../../hooks/usePost";
import PostItem from "../organisms/PostItem";
import SideBar from "../organisms/SideBar";
import PostFilter from "../organisms/PostFilter";

import { useAuthEntity } from "../../../../hooks/useAuthEntry";

const PostList = () => {
  const { entity } = useAuthEntity();
  const [params, setParams] = useState({
    search: "",
    sort: "most_likes",
    limit: 2,
    id: entity.id,
    filter: {
      tags: [],
    },
  });
  const [listType, setListType] = useState("all"); // Loại danh sách: all, my-posts, liked, commented

  // Chọn hook dựa trên listType
  const postHooks = {
    all: usePost,
    "liked-posts": useLikedPosts,
    "commented-posts": useCommentedPosts,
  };
  const useSelectedPostHook = postHooks[listType];
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSelectedPostHook(params);

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

  const handleListTypeChange = (value) => {
    setListType(value);
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
        {entity.id && (
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
            <SideBar listType={listType} onChange={handleListTypeChange} />
          </Col>
        )}
      </Row>
    </>
  );
};

export default PostList;
