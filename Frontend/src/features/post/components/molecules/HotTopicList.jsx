import { List, Typography } from "antd";
import BoxContainer from "../../../../components/atoms/BoxContainer";
import { Link } from "react-router-dom";

const HotTopicList = () => {
  return (
    <BoxContainer>
      <Typography.Title level={4}>Chủ đề xu hướng</Typography.Title>
      <List
        dataSource={[
          "Món ngon",
          "Quán xịn",
          "Mẹo nấu ăn",
          "Công thức",
          "Mẹo ăn uống",
        ]}
        renderItem={(item) => (
          <List.Item>
            <Link>#{item}</Link>
          </List.Item>
        )}
      ></List>
    </BoxContainer>
  );
};

export default HotTopicList;
