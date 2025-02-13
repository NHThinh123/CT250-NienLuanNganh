import { List, Row } from "antd";

const PostImages = ({ imagesData }) => {
  return (
    <Row>
      {imagesData?.length > 0 && (
        <List
          dataSource={imagesData}
          renderItem={(item) => (
            <List.Item>
              <img
                src={item?.url}
                style={{ width: "100%", height: "auto" }}
              ></img>
            </List.Item>
          )}
        />
      )}
    </Row>
  );
};

export default PostImages;
