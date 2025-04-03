import { useState, useRef, useEffect } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Modal,
  Table,
  Tag,
  Input,
  Space,
  DatePicker,
  ConfigProvider,
} from "antd";
import dayjs from "dayjs";
import ModalUpdatePost from "../../../post/components/molecules/ModalUpdatePost";
import Highlighter from "react-highlight-words";

const { RangePicker } = DatePicker;

const PostList = ({ postData = [], onDeletePost, isDeleting }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShowModalUpdatePost, setIsShowModalUpdatePost] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [postToUpdate, setPostToUpdate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const searchInput = useRef(null);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
            width: windowWidth <= 576 ? "100%" : 200, // Responsive width
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size={windowWidth <= 576 ? "small" : "middle"} // Responsive size
            style={{ width: windowWidth <= 576 ? 80 : 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size={windowWidth <= 576 ? "small" : "middle"} // Responsive size
            style={{ width: windowWidth <= 576 ? 80 : 90 }}
          >
            Xóa
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : "white" }} />
    ),
    onFilter: (value, record) => {
      const text = record[dataIndex]?.toString().toLowerCase();
      return text?.includes(value.toLowerCase());
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const getDateSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <RangePicker
          value={
            selectedKeys[0]
              ? [dayjs(selectedKeys[0][0]), dayjs(selectedKeys[0][1])]
              : []
          }
          onChange={(dates) =>
            setSelectedKeys(
              dates ? [[dates[0].toDate(), dates[1].toDate()]] : []
            )
          }
          style={{
            marginBottom: 8,
            display: "block",
            width: windowWidth <= 576 ? "100%" : 250, // Responsive width
          }}
          size={windowWidth <= 576 ? "small" : "middle"} // Responsive size
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size={windowWidth <= 576 ? "small" : "middle"} // Responsive size
            style={{ width: windowWidth <= 576 ? 80 : 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size={windowWidth <= 576 ? "small" : "middle"} // Responsive size
            style={{ width: windowWidth <= 576 ? 80 : 90 }}
          >
            Xóa
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : "white" }} />
    ),
    onFilter: (value, record) => {
      const date = dayjs(record[dataIndex]);
      return date.isAfter(value[0]) && date.isBefore(value[1]);
    },
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    sortDirections: ["ascend", "descend"],
  });

  const showDeleteConfirm = (post) => {
    setPostToDelete(post);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    if (postToDelete?._id) {
      onDeletePost(postToDelete._id);
    }
    setPostToDelete(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setPostToDelete(null);
  };

  const handleShowModalUpdatePost = (post) => {
    setPostToUpdate(post);
    setIsShowModalUpdatePost(true);
  };

  const handleCancelModalUpdatePost = () => {
    setIsShowModalUpdatePost(false);
    setPostToUpdate(null);
  };

  const columns = [
    {
      title: "Bài viết",
      dataIndex: "title",
      key: "title",
      width: windowWidth <= 576 ? 200 : 300, // Responsive width
      ...getColumnSearchProps("title"),
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={
              record?.media?.[0]?.url ||
              "https://res.cloudinary.com/nienluan/image/upload/v1741245839/Business_Avatar_Default_jkhjhf.jpg"
            }
            alt={text || "Ảnh bài viết"}
            style={{
              width: windowWidth <= 576 ? 30 : 40, // Responsive image size
              height: windowWidth <= 576 ? 30 : 40,
              marginRight: windowWidth <= 576 ? 6 : 10,
              objectFit: "cover",
            }}
          />
          <span>
            <p
              style={{
                margin: 0,
                fontWeight: "bold",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: windowWidth <= 576 ? "150px" : "250px", // Responsive maxWidth
                fontSize: windowWidth <= 576 ? "12px" : "14px", // Responsive font
              }}
            >
              {text || "Không có tiêu đề"}
            </p>
            <small
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: windowWidth <= 576 ? "120px" : "200px", // Responsive maxWidth
                fontSize: windowWidth <= 576 ? "10px" : "12px", // Responsive font
              }}
            >
              {record?.content || "Không có nội dung"}
            </small>
          </span>
        </div>
      ),
    },
    {
      title: "Người đăng",
      dataIndex: "author",
      key: "author",
      width: windowWidth <= 576 ? 100 : 150, // Responsive width
      ...getColumnSearchProps("author.name"),
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: windowWidth <= 576 ? "12px" : "14px" }}>
            {record?.author?.name || "Ẩn danh"}
          </span>
        </div>
      ),
    },
    {
      title: "Lượt thích",
      dataIndex: "likeCount",
      key: "likeCount",
      width: windowWidth <= 576 ? 80 : 100, // Responsive width
      sorter: (a, b) => a.likeCount - b.likeCount,
      sortDirections: ["ascend", "descend"],
      render: (text) => (
        <span style={{ fontSize: windowWidth <= 576 ? "12px" : "14px" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Lượt bình luận",
      dataIndex: "commentCount",
      key: "commentCount",
      width: windowWidth <= 576 ? 80 : 100, // Responsive width
      sorter: (a, b) => a.commentCount - b.commentCount,
      sortDirections: ["ascend", "descend"],
      render: (text) => (
        <span style={{ fontSize: windowWidth <= 576 ? "12px" : "14px" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "edited",
      key: "edited",
      width: windowWidth <= 576 ? 100 : 120, // Responsive width
      filters: [
        { text: "Đã chỉnh sửa", value: true },
        { text: "Chưa chỉnh sửa", value: false },
      ],
      onFilter: (value, record) => record.edited === value,
      render: (edited) => (
        <Tag
          color={edited ? "yellow" : "gray"}
          style={{ fontSize: windowWidth <= 576 ? "10px" : "12px" }}
        >
          {edited ? "Đã chỉnh sửa" : "Chưa chỉnh sửa"}
        </Tag>
      ),
    },
    {
      title: "Ngày Đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      width: windowWidth <= 576 ? 100 : 120, // Responsive width
      ...getDateSearchProps("createdAt"),
      render: (date) => (
        <span style={{ fontSize: windowWidth <= 576 ? "12px" : "14px" }}>
          {date ? dayjs(date).format("YYYY-MM-DD") : "N/A"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: windowWidth <= 576 ? 120 : 150, // Responsive width
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            size={windowWidth <= 576 ? "small" : "middle"} // Responsive size
            onClick={() => handleShowModalUpdatePost(record)}
          >
            {windowWidth > 576 && "Sửa"}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            size={windowWidth <= 576 ? "small" : "middle"} // Responsive size
            danger
            onClick={() => showDeleteConfirm(record)}
          >
            {windowWidth > 576 && "Xóa"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#141414",
            headerSortHoverBg: "#141414",
            headerSortActiveBg: "#141414",
            headerColor: "#fff",
            colorIcon: "#fff",
            colorIconHover: "#fff",
            fontSize: windowWidth <= 576 ? 12 : 14, // Responsive font size
          },
        },
      }}
    >
      <Table
        dataSource={postData}
        columns={columns}
        rowKey="_id"
        scroll={{ x: windowWidth <= 576 ? 800 : 1000 }} // Responsive scroll
        pagination={{
          pageSize: windowWidth <= 576 ? 5 : 10, // Responsive page size
          position: ["bottomCenter"],
          size: windowWidth <= 576 ? "small" : "default", // Responsive pagination size
        }}
        rowClassName={() => "custom-table-row"}
      />
      <Modal
        title={`Xác nhận xóa bài viết "${postToDelete?.title || "N/A"}"`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{
          danger: true,
          loading: isDeleting,
          size: windowWidth <= 576 ? "small" : "middle", // Responsive size
        }}
        cancelButtonProps={{
          disabled: isDeleting,
          size: windowWidth <= 576 ? "small" : "middle", // Responsive size
        }}
        width={windowWidth <= 576 ? "90%" : windowWidth <= 768 ? 400 : 500} // Responsive width
      >
        <p style={{ fontSize: windowWidth <= 576 ? "14px" : "16px" }}>
          Bạn có chắc chắn muốn xóa bài viết này không?
        </p>
      </Modal>
      <ModalUpdatePost
        handleCancel={handleCancelModalUpdatePost}
        isModalOpen={isShowModalUpdatePost}
        postData={postToUpdate}
        setIsModalOpen={setIsShowModalUpdatePost}
      />
    </ConfigProvider>
  );
};

export default PostList;
