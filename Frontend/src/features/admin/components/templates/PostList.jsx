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
import { useState, useRef } from "react";
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
  const searchInput = useRef(null);

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
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
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
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
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
      width: 300,
      ...getColumnSearchProps("title"),
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={
              record?.media?.[0]?.url ||
              "https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg"
            }
            alt={text || "Ảnh bài viết"}
            style={{
              width: 40,
              height: 40,
              marginRight: 10,
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
                maxWidth: "250px",
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
                maxWidth: "200px",
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
      width: 150,
      ...getColumnSearchProps("author.name"),
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>{record?.author?.name || "Ẩn danh"}</span>
        </div>
      ),
    },
    {
      title: "Lượt thích",
      dataIndex: "likeCount",
      key: "likeCount",
      sorter: (a, b) => a.likeCount - b.likeCount,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Lượt bình luận",
      dataIndex: "commentCount",
      key: "commentCount",
      sorter: (a, b) => a.commentCount - b.commentCount,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Trạng Thái",
      dataIndex: "edited",
      key: "edited",
      filters: [
        { text: "Đã chỉnh sửa", value: true },
        { text: "Chưa chỉnh sửa", value: false },
      ],
      onFilter: (value, record) => record.edited === value,
      render: (edited) => (
        <Tag color={edited ? "yellow" : "gray"}>
          {edited ? "Đã chỉnh sửa" : "Chưa chỉnh sửa"}
        </Tag>
      ),
    },
    {
      title: "Ngày Đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      ...getDateSearchProps("createdAt"),
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleShowModalUpdatePost(record)}
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => showDeleteConfirm(record)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#141414", // Header background color
            headerSortHoverBg: "#141414",
            headerSortActiveBg: "#141414",
            headerColor: "#fff", // Header text color
            // Customize sort icons color
            colorIcon: "#fff", // Default icon color
            colorIconHover: "#fff", // Icon color on hover
          },
        },
      }}
    >
      <Table
        dataSource={postData}
        columns={columns}
        rowKey="_id"
        scroll={{ x: 1000 }}
        pagination={{ pageSize: 5, position: ["bottomCenter"] }}
        rowClassName={() => "custom-table-row"}
      />
      <Modal
        title={`Xác nhận xóa bài viết "${postToDelete?.title || "N/A"}"`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: isDeleting }}
        cancelButtonProps={{ disabled: isDeleting }}
      >
        <p>Bạn có chắc chắn muốn xóa bài viết này không?</p>
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
