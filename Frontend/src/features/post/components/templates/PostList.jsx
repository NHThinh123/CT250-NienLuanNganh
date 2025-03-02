import { Col, List, Pagination, Row } from "antd";
import usePost from "../../hooks/usePost";

import PostItem from "../organisms/PostItem";

import SideBar from "../organisms/SideBar";
import { useState } from "react";

import SpinLoading from "../../../../components/atoms/SpinLoading";

import PostFilter from "../organisms/PostFilter";

const PostList = () => {
  const [params, setParams] = useState({
    search: "",
    sort: "newest",
    page: 1,
    limit: 5,
  });

  const { data, isLoading } = usePost(params);

  const handleSearch = (value) => {
    setParams((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleSortChange = (value) => {
    setParams((prev) => ({ ...prev, sort: value }));
  };

  const handlePageChange = (page, pageSize) => {
    setParams((prev) => ({ ...prev, page, limit: pageSize || 5 }));
  };
  if (isLoading) return <SpinLoading />;
  return (
    <>
      <Row style={{ minWidth: "800px" }} justify={"center"}>
        <Col xs={24} sm={24} md={24} lg={16}>
          <PostFilter
            handleSearch={handleSearch}
            handleSortChange={handleSortChange}
          />
          <List
            dataSource={data.posts}
            grid={{ gutter: 8, column: 1 }}
            renderItem={(item) => (
              <List.Item style={{ padding: "0px", margin: "0px" }}>
                <PostItem postData={item}></PostItem>
              </List.Item>
            )}
          />
          <Pagination
            current={params.page}
            total={data?.pagination.totalPosts}
            pageSize={params.limit}
            onChange={handlePageChange}
            showSizeChanger
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
