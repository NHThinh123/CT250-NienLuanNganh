import { theme } from "antd";

const BoxContainer = ({ children, style = {}, margin = 8, padding = 8 }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <div
      style={{
        backgroundColor: colorBgContainer,
        borderRadius: borderRadiusLG,
        margin,
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default BoxContainer;
