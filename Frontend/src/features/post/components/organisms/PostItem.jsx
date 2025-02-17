import BoxContainer from "../../../../components/atoms/BoxContainer";

import PostHeader from "../molecules/PostHeader";
import PostBody from "../molecules/PostBody";
import PostFooter from "../molecules/PostFooter";
import PostImages from "../molecules/PostImages";

const PostItem = ({ postData }) => {
  return (
    <BoxContainer style={{ minWidth: "500px" }}>
      <PostHeader userData={postData?.user}></PostHeader>
      <PostBody postData={postData}></PostBody>
      <PostImages imagesData={postData?.images}></PostImages>
      <PostFooter postData={postData}></PostFooter>
    </BoxContainer>
  );
};

export default PostItem;
