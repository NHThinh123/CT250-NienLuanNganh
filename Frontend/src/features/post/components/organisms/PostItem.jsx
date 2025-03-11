import BoxContainer from "../../../../components/atoms/BoxContainer";

import PostHeader from "../molecules/PostHeader";
import PostBody from "../molecules/PostBody";
import PostFooter from "../molecules/PostFooter";

import CommentModal from "../../../comment/components/templates/CommentModal";
import { useState } from "react";
import PostMedia from "../molecules/PostMedia";

const PostItem = ({ postData, onDelete, isDeleting, isMyPost }) => {
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
        onDelete={onDelete}
        isDeleting={isDeleting}
        post_id={postData?._id}
        isMyPost={isMyPost}
      ></PostHeader>
      <PostBody postData={postData}></PostBody>
      {postData?.media.length > 0 && (
        <PostMedia mediaData={postData?.media}></PostMedia>
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
