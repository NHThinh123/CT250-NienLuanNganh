import BoxContainer from "../../../../components/atoms/BoxContainer";

import PostHeader from "../molecules/PostHeader";
import PostBody from "../molecules/PostBody";
import PostFooter from "../molecules/PostFooter";
import PostImages from "../molecules/PostImages";

import CommentModal from "../../../comment/components/templates/CommentModal";
import { useState } from "react";

const PostItem = ({ postData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const isBusiness = postData?.business_id ? true : false;
  return (
    <BoxContainer style={{ minWidth: "500px" }}>
      <PostHeader
        isBusiness={isBusiness}
        userData={postData?.author}
        createAt={postData.createdAt}
      ></PostHeader>
      <PostBody postData={postData}></PostBody>
      {postData?.images.length > 0 && (
        <PostImages imagesData={postData?.images}></PostImages>
      )}
      <PostFooter
        postData={postData}
        showModal={showModal}
        commentCount={postData?.commentCount}
      ></PostFooter>
      {isModalOpen && (
        <CommentModal
          post_id={postData?._id}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        ></CommentModal>
      )}
    </BoxContainer>
  );
};

export default PostItem;
