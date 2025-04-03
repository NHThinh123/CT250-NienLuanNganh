import { useState, useEffect } from "react";
import { Col, List, Row, Spin, Button, Drawer } from "antd";
import { useInView } from "react-intersection-observer";
import { usePost, useLikedPosts, useCommentedPosts } from "../../hooks/usePost";
import PostItem from "../organisms/PostItem";
import SideBar from "../organisms/SideBar";
import PostFilter from "../organisms/PostFilter";
import { useAuthEntity } from "../../../../hooks/useAuthEntry";
import { MenuOutlined } from "@ant-design/icons";

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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [drawerVisible, setDrawerVisible] = useState(false); // Trạng thái Drawer

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Mở/đóng Drawer
  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  return (
    <Row style={{ width: "100%", overflowX: "hidden" }}>
      <Col
        xs={24} // Mobile nhỏ: Toàn chiều rộng
        sm={24} // Tablet nhỏ: 22/24 để có padding
        md={24} // Tablet lớn: 20/24
        lg={18} // Desktop: 16/24
        xl={18} // Desktop lớn: 16/24
        xxl={18} // Desktop rất lớn: 14/24 để gọn hơn
        style={{
          paddingTop: 68,
        }}
      >
        <PostFilter
          handleSearch={handleSearch}
          handleSortChange={handleSortChange}
          handleTagFilter={handleTagFilter}
        />
        <List
          dataSource={data?.pages?.flatMap((page) => page.posts)}
          grid={{
            gutter: 8,
            xs: 1, // Mobile nhỏ: 1 cột
            sm: 1, // Tablet nhỏ: 1 cột
            md: 1, // Tablet lớn: 1 cột
            lg: 1, // Desktop: 1 cột
            xl: 1, // Desktop lớn: 1 cột
            xxl: 1, // Desktop rất lớn: 1 cột
          }}
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

      {/* SideBar fixed trên desktop (từ 992px trở lên) */}
      {entity.id && windowWidth > 992 && (
        <Col
          xs={0} // Ẩn trên mobile nhỏ (<576px)
          sm={0} // Ẩn trên tablet nhỏ (576px - 768px)
          md={0} // Ẩn trên tablet lớn (768px - 992px)
          lg={6} // Desktop: 6/24
          xl={6} // Desktop lớn: 6/24
          xxl={6} // Desktop rất lớn: 6/24
          style={{
            position: "fixed", // Đổi từ sticky sang fixed
            top: "65px",
            right: 0, // Cố định bên phải màn hình

            height: "calc(100vh - 65px)", // Chiều cao full màn hình trừ header
            overflowY: "auto",

            zIndex: 100, // Đảm bảo nằm trên các phần tử khác
          }}
        >
          <SideBar listType={listType} onChange={handleListTypeChange} />
        </Col>
      )}

      {/* Nút fixed để mở Drawer trên tablet và nhỏ hơn */}
      {entity.id && windowWidth <= 992 && (
        <Button
          icon={<MenuOutlined />}
          onClick={showDrawer}
          style={{
            position: "fixed", // Fixed trên mobile/tablet
            top: "70px", // Dưới header (giả sử header cao 64px + margin)
            right: "10px",
            zIndex: 1000, // Đảm bảo nút nằm trên cùng
            fontSize: 20,
            width: "52px",
            height: "40px",
          }}
        />
      )}

      {/* Drawer cho SideBar trên tablet và nhỏ hơn */}
      {entity.id && (
        <Drawer
          title="Menu"
          placement="right"
          onClose={closeDrawer}
          visible={drawerVisible && windowWidth <= 992} // Chỉ hiển thị Drawer khi nhỏ hơn hoặc bằng 992px
          width={windowWidth <= 576 ? "80vw" : "300px"} // Responsive width
          bodyStyle={{ padding: "0 10px" }}
        >
          <SideBar listType={listType} onChange={handleListTypeChange} />
        </Drawer>
      )}
    </Row>
  );
};

export default PostList;
