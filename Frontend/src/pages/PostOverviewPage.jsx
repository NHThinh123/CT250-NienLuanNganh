import { useState, useEffect } from "react";
import BoxContainer from "../components/atoms/BoxContainer";
import { Button, Card, Col, Row, Select } from "antd";
import PostOverviewCard from "../features/post/components/organisms/PostOverviewCard";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  usePostFrequency,
  usePostSummary,
} from "../features/post/hooks/usePost";
import useMyPost from "../features/post/hooks/useMyPost";
import { useAuthEntity } from "../hooks/useAuthEntry";
import { ArrowLeft } from "lucide-react";
import PostList from "../features/admin/components/templates/PostList";
import useDeletePost from "../features/post/hooks/useDeletePost";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PostOverviewPage = () => {
  const { entity } = useAuthEntity();
  const [timeRange, setTimeRange] = useState("7days");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { mutate: deletePost, isLoading: isDeleting } = useDeletePost();

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDeletePost = (post_id) => {
    deletePost({ post_id, id: entity.id });
  };

  const { data: frequencyData, isLoading: freqLoading } = usePostFrequency(
    entity.id,
    timeRange
  );
  const { data: summaryData, isLoading: summaryLoading } = usePostSummary(
    entity.id,
    timeRange
  );
  const { data: myPostsData, isLoading: myPostsLoading } = useMyPost({
    id: entity.id,
    sort: "newest",
    limit: 999,
  });

  const getChartData = () => {
    let labels;
    let data;

    const today = new Date();
    if (timeRange === "7days") {
      labels = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        return d.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        });
      });
      data = frequencyData || Array(7).fill(0);
    } else if (timeRange === "28days") {
      labels = Array.from({ length: 28 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (27 - i));
        return d.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        });
      });
      data = frequencyData || Array(28).fill(0);
    } else if (timeRange === "all") {
      labels = frequencyData?.years || [];
      data = frequencyData?.counts || [];
    }

    return {
      labels,
      datasets: [
        {
          label: "Số bài viết",
          data,
          backgroundColor: "#52c41a",
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Cho phép biểu đồ co giãn theo chiều cao
    plugins: {
      legend: { position: "bottom", align: "start" },
      title: {
        display: true,
        text: `Tần suất đăng bài trong ${
          timeRange === "7days"
            ? "7 ngày qua"
            : timeRange === "28days"
            ? "28 ngày qua"
            : "tất cả thời gian"
        }`,
        align: "start",
        font: {
          size: windowWidth <= 576 ? 14 : windowWidth <= 768 ? 16 : 18, // Responsive font
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: windowWidth <= 576 ? 10 : windowWidth <= 768 ? 12 : 14, // Responsive font
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: windowWidth <= 576 ? 10 : windowWidth <= 768 ? 12 : 14, // Responsive font
          },
        },
      },
    },
  };

  const latestPost = myPostsData?.pages[0]?.posts[0];
  const mostPopularPost = myPostsData?.pages[0]?.posts.reduce((prev, curr) => {
    const prevScore = (prev?.likeCount || 0) + (prev?.commentCount || 0);
    const currScore = (curr?.likeCount || 0) + (curr?.commentCount || 0);
    return currScore > prevScore ? curr : prev;
  }, null);

  return (
    <Row
      gutter={[16, 16]} // Thêm gutter để tạo khoảng cách
      justify="center"
      style={{ width: "100%", padding: windowWidth <= 576 ? "8px" : "16px" }}
    >
      <Col xs={24} sm={22} md={21} lg={21} xl={21}>
        <BoxContainer>
          <Button
            href="/posts"
            type="link"
            style={{ padding: 0, color: "black" }}
          >
            <h1
              style={{
                fontWeight: "bold",
                margin: 0,
                fontSize:
                  windowWidth <= 576
                    ? "20px"
                    : windowWidth <= 768
                    ? "24px"
                    : "28px", // Responsive font
                display: "flex",
                alignItems: "center",
              }}
            >
              <ArrowLeft
                strokeWidth={4}
                size={windowWidth <= 576 ? 24 : windowWidth <= 768 ? 28 : 30} // Responsive icon
                style={{ marginRight: 8 }}
              />
              Tổng quan bài viết
            </h1>
          </Button>
        </BoxContainer>
      </Col>

      <Col xs={24} sm={12} md={8} lg={7} xl={7}>
        <BoxContainer>
          <h2
            style={{
              margin: windowWidth <= 576 ? 2 : 4,
              fontWeight: "bold",
              fontSize:
                windowWidth <= 576
                  ? "16px"
                  : windowWidth <= 768
                  ? "18px"
                  : "20px", // Responsive font
            }}
          >
            Bài viết mới nhất
          </h2>
          {myPostsLoading ? (
            <p style={{ fontSize: windowWidth <= 576 ? "14px" : "16px" }}>
              Đang tải...
            </p>
          ) : latestPost ? (
            <PostOverviewCard post={latestPost} />
          ) : (
            <p style={{ fontSize: windowWidth <= 576 ? "14px" : "16px" }}>
              Chưa có bài viết nào
            </p>
          )}
        </BoxContainer>
      </Col>

      <Col xs={24} sm={12} md={8} lg={7} xl={7}>
        <BoxContainer>
          <h2
            style={{
              margin: windowWidth <= 576 ? 2 : 4,
              fontWeight: "bold",
              fontSize:
                windowWidth <= 576
                  ? "16px"
                  : windowWidth <= 768
                  ? "18px"
                  : "20px", // Responsive font
            }}
          >
            Bài viết nổi bật nhất
          </h2>
          {myPostsLoading ? (
            <p style={{ fontSize: windowWidth <= 576 ? "14px" : "16px" }}>
              Đang tải...
            </p>
          ) : mostPopularPost ? (
            <PostOverviewCard post={mostPopularPost} />
          ) : (
            <p style={{ fontSize: windowWidth <= 576 ? "14px" : "16px" }}>
              Chưa có bài viết nào
            </p>
          )}
        </BoxContainer>
      </Col>

      <Col xs={24} sm={24} md={8} lg={7} xl={7}>
        <BoxContainer style={{ padding: windowWidth <= 576 ? 8 : 16 }}>
          <h2
            style={{
              margin: windowWidth <= 576 ? 2 : 4,
              fontWeight: "bold",
              fontSize:
                windowWidth <= 576
                  ? "16px"
                  : windowWidth <= 768
                  ? "18px"
                  : "20px", // Responsive font
            }}
          >
            Tổng quan về các bài viết của bạn
          </h2>
          <Select
            defaultValue="7days"
            style={{
              width: windowWidth <= 576 ? "100%" : 120, // Full width trên mobile
              marginBottom: 16,
              display: "block",
              marginLeft: "auto",
              marginTop: 16,
            }}
            onChange={setTimeRange}
            size={windowWidth <= 576 ? "middle" : "large"} // Responsive size
            options={[
              { value: "7days", label: "7 ngày qua" },
              { value: "28days", label: "28 ngày qua" },
              { value: "all", label: "Tất cả" },
            ]}
          />
          {freqLoading || summaryLoading ? (
            <p style={{ fontSize: windowWidth <= 576 ? "14px" : "16px" }}>
              Đang tải...
            </p>
          ) : (
            <>
              <div
                style={{
                  height:
                    windowWidth <= 576
                      ? "200px"
                      : windowWidth <= 768
                      ? "250px"
                      : "300px",
                }}
              >
                <Bar data={getChartData()} options={chartOptions} />
              </div>
              <Row
                justify="space-between"
                style={{ marginTop: 8, fontWeight: "bold" }}
              >
                <Col
                  span={12}
                  style={{ fontSize: windowWidth <= 576 ? "12px" : "14px" }}
                >
                  Tổng số bài viết
                </Col>
                <Col
                  span={12}
                  style={{
                    textAlign: "right",
                    fontSize: windowWidth <= 576 ? "12px" : "14px",
                  }}
                >
                  {summaryData?.totalPosts}
                </Col>
              </Row>
              <Row
                justify="space-between"
                style={{ marginTop: 8, fontWeight: "bold" }}
              >
                <Col
                  span={12}
                  style={{ fontSize: windowWidth <= 576 ? "12px" : "14px" }}
                >
                  Tổng số lượt thích
                </Col>
                <Col
                  span={12}
                  style={{
                    textAlign: "right",
                    fontSize: windowWidth <= 576 ? "12px" : "14px",
                  }}
                >
                  {summaryData?.totalLikes}
                </Col>
              </Row>
              <Row
                justify="space-between"
                style={{ marginTop: 8, fontWeight: "bold" }}
              >
                <Col
                  span={12}
                  style={{ fontSize: windowWidth <= 576 ? "12px" : "14px" }}
                >
                  Tổng số bình luận
                </Col>
                <Col
                  span={12}
                  style={{
                    textAlign: "right",
                    fontSize: windowWidth <= 576 ? "12px" : "14px",
                  }}
                >
                  {summaryData?.totalComments}
                </Col>
              </Row>
            </>
          )}
        </BoxContainer>
      </Col>

      <Col xs={24} sm={22} md={21} lg={21} xl={21}>
        <Card
          title={
            <span
              style={{
                fontSize:
                  windowWidth <= 576
                    ? "16px"
                    : windowWidth <= 768
                    ? "18px"
                    : "20px", // Responsive font
              }}
            >
              Danh sách bài viết
            </span>
          }
        >
          <PostList
            postData={myPostsData?.pages?.flatMap((page) => page.posts)}
            onDeletePost={handleDeletePost}
            isDeleting={isDeleting}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default PostOverviewPage;
