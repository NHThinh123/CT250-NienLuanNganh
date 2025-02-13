import BoxContainer from "../../../../components/atoms/BoxContainer";

import PostHeader from "../molecules/PostHeader";
import PostBody from "../molecules/PostBody";
import PostFooter from "../molecules/PostFooter";
import PostImages from "../molecules/PostImages";

const PostItem = ({ postData }) => {
  return (
    <BoxContainer>
      <PostHeader userData={postData?.user_id}></PostHeader>
      <PostBody postData={postData}></PostBody>
      <PostImages imagesData={postData?.images}></PostImages>
      <PostFooter></PostFooter>
    </BoxContainer>
  );
};

export default PostItem;
