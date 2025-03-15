import BoxContainer from "../../../../components/atoms/BoxContainer";
import { Select, Space } from "antd";
import DishPriceFilter from "../molecules/DishPriceFilter";

const MenuFilter = () => {
  const options = [];
  for (let i = 10; i < 36; i++) {
    options.push({
      value: i.toString(36) + i,
      label: i.toString(36) + i,
    });
  }
  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
  };
  return (
    <BoxContainer>
      <p>Bộ lọc</p>
      <div>
        <p>Lọc Menu</p>
        <Space
          direction="vertical"
          style={{
            width: "100%",
          }}
        >
          <Select
            mode="tags"
            size={"middle"}
            placeholder="Please select"
            defaultValue={["a10", "c12"]}
            onChange={handleChange}
            style={{
              width: "100%",
            }}
            options={options}
          />
        </Space>
      </div>
      <div style={{ marginTop: 14 }}>
        <p>Lọc giá món</p>
        <DishPriceFilter />
      </div>
    </BoxContainer>
  );
};

export default MenuFilter;
