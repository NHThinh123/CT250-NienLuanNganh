import { useState, useEffect } from "react";
import { Col, List, Row, Spin } from "antd";
import { useInView } from "react-intersection-observer";

import PostItem from "../organisms/PostItem";
import SideBar from "../organisms/SideBar";
import PostFilter from "../organisms/PostFilter";

import { useAuthEntity } from "../../../../hooks/useAuthEntry";
import useMyPost from "../../hooks/useMyPost";

const MyPostList = () => {
  const { entity } = useAuthEntity();
  const [params, setParams] = useState({
    search: "",
    sort: "newest",
    limit: 2,
    id: entity.id,
    filter: {
      tags: [],
    },
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMyPost(params);
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

  if (!entity.id) {
    return <div>Vui lòng đăng nhập để xem bài viết của bạn.</div>;
  }

  return (
    <Row style={{ minWidth: "800px" }} justify="center">
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
          locale={{ emptyText: "Bạn chưa có bài viết nào." }}
        />
        {isFetchingNextPage && (
          <div style={{ textAlign: "center", padding: "10px" }}>
            <Spin />
          </div>
        )}
        <div ref={ref} style={{ height: "20px" }} />{" "}
      </Col>
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
    </Row>
  );
};

export default MyPostList;
