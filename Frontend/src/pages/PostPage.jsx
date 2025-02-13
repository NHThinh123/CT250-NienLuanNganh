//import ButtonCustomize from "../components/atoms/ButtonCustomize";
import PostList from "../features/post/components/templates/PostList";

const PostPage = () => {
  return (
    <>
      {/* <ButtonCustomize margin={"8px 0px"} to={"/posts/create"}>
        Thêm bài đăng
      </ButtonCustomize> */}
      <PostList />;
    </>
  );
};

export default PostPage;
