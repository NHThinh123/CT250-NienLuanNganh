import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const ButtonCustomize = ({
  type = "primary",
  size = "middle",
  loading = false,
  disabled = false,
  icon = null,
  margin = 16,
  padding = 16,
  onClick,
  to, // Prop để điều hướng
  children,
  style = {},
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to); // Điều hướng nếu có 'to'
    } else if (onClick) {
      onClick(); // Nếu có sự kiện onClick thì thực thi
    }
  };

  return (
    <Button
      type={type}
      size={size}
      loading={loading}
      disabled={disabled}
      icon={icon}
      onClick={handleClick}
      style={{ margin, padding, ...style }}
    >
      {children}
    </Button>
  );
};

export default ButtonCustomize;
