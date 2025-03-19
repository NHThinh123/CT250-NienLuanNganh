import { useState } from "react";
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
  const [timeRange, setTimeRange] = useState("7days"); // Thêm state để quản lý timeRange
  const { mutate: deletePost, isLoading: isDeleting } = useDeletePost();

  const handleDeletePost = (post_id) => {
    deletePost({ post_id, id: entity.id });
  };
  // Lấy tần suất đăng bài với timeRange
  const { data: frequencyData, isLoading: freqLoading } = usePostFrequency(
    entity.id,
    timeRange
  );

  // Lấy tổng quan bài viết với timeRange
  const { data: summaryData, isLoading: summaryLoading } = usePostSummary(
    entity.id,
    timeRange
  );

  // Lấy danh sách bài viết của người dùng để tìm bài gần nhất và nổi bật nhất
  const { data: myPostsData, isLoading: myPostsLoading } = useMyPost({
    id: entity.id,
    sort: "newest", // Sắp xếp theo bài mới nhất
    limit: 999, // Giới hạn số lượng bài để tối ưu
  });

  // Hàm tạo dữ liệu biểu đồ dựa trên timeRange
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
      },
    },
  };

  // Lấy bài viết gần nhất (dựa trên createdAt)
  const latestPost = myPostsData?.pages[0]?.posts[0];

  // Lấy bài viết nổi bật nhất (dựa trên likeCount hoặc commentCount)
  const mostPopularPost = myPostsData?.pages[0]?.posts.reduce((prev, curr) => {
    const prevScore = (prev?.likeCount || 0) + (prev?.commentCount || 0);
    const currScore = (curr?.likeCount || 0) + (curr?.commentCount || 0);
    return currScore > prevScore ? curr : prev;
  }, null);

  return (
    <Row justify={"center"}>
      <Col span={21}>
        <BoxContainer>
          <Button
            href="/posts"
            type="link"
            style={{ padding: 0, color: "black" }}
          >
            <h1 style={{ fontWeight: "bold", margin: 0 }}>
              <ArrowLeft strokeWidth={4} size={30} style={{ paddingTop: 12 }} />
              Tổng quan bài viết
            </h1>
          </Button>
        </BoxContainer>
      </Col>
      <Col span={7}>
        <BoxContainer>
          <h2 style={{ margin: 4, fontWeight: "bold" }}>Bài viết mới nhất</h2>
          {myPostsLoading ? (
            <p>Đang tải...</p>
          ) : latestPost ? (
            <PostOverviewCard post={latestPost} />
          ) : (
            <p>Chưa có bài viết nào</p>
          )}
        </BoxContainer>
      </Col>
      <Col span={7}>
        <BoxContainer>
          <h2 style={{ margin: 4, fontWeight: "bold" }}>
            Bài viết nổi bật nhất
          </h2>
          {myPostsLoading ? (
            <p>Đang tải...</p>
          ) : mostPopularPost ? (
            <PostOverviewCard post={mostPopularPost} />
          ) : (
            <p>Chưa có bài viết nào</p>
          )}
        </BoxContainer>
      </Col>
      <Col span={7}>
        <BoxContainer style={{ padding: 16 }}>
          <h2 style={{ margin: 4, fontWeight: "bold" }}>
            Tổng quan về các bài viết của bạn
          </h2>
          <Select
            defaultValue="7days"
            style={{
              width: 120,
              marginBottom: 16,
              display: "block",
              marginLeft: "auto",
              marginTop: 16,
            }}
            onChange={setTimeRange}
            options={[
              { value: "7days", label: "7 ngày qua" },
              { value: "28days", label: "28 ngày qua" },
              { value: "all", label: "Tất cả" },
            ]}
          />
          {freqLoading || summaryLoading ? (
            <p>Đang tải...</p>
          ) : (
            <>
              <Bar data={getChartData()} options={chartOptions} />
              <Row
                justify="space-between"
                style={{ marginTop: 8, fontWeight: "bold" }}
              >
                <Col span={12}>Tổng số bài viết</Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  {summaryData?.totalPosts}
                </Col>
              </Row>
              <Row
                justify="space-between"
                style={{ marginTop: 8, fontWeight: "bold" }}
              >
                <Col span={12}>Tổng số lượt thích</Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  {summaryData?.totalLikes}
                </Col>
              </Row>
              <Row
                justify="space-between"
                style={{ marginTop: 8, fontWeight: "bold" }}
              >
                <Col span={12}>Tổng số bình luận</Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  {summaryData?.totalComments}
                </Col>
              </Row>
            </>
          )}
        </BoxContainer>
      </Col>
      <Col span={21}>
        <Card title="Danh sách bài viết">
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
