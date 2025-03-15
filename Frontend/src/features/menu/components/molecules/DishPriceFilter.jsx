import { Slider } from "antd";

const MenuFilter = () => {
  return (
    <Slider
      range={{
        draggableTrack: true,
      }}
      defaultValue={[20, 50]}
    />
  );
};

export default MenuFilter;
