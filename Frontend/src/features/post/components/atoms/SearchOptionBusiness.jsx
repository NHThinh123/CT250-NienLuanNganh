/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { Avatar, Rate, Typography } from "antd";

const { Text } = Typography;

const SearchOptionBusiness = ({
  onSelect,
  businessData,
  isLoading,
  initialRestaurant,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Trạng thái điều khiển menu
  const selectRef = useRef(null);

  // Thiết lập giá trị mặc định từ initialRestaurant
  const defaultValue = initialRestaurant
    ? {
        value: initialRestaurant._id,
        label: initialRestaurant.business_name,
        data: initialRestaurant,
      }
    : null;

  const loadOptions = (inputValue, callback) => {
    if (!businessData) {
      callback([]);
      return;
    }

    if (!inputValue) {
      const options = businessData.map((business) => ({
        value: business._id,
        label: business.business_name,
        data: business,
      }));
      callback(options);
      return;
    }

    const filteredData = businessData.filter((business) =>
      business.business_name.toLowerCase().includes(inputValue.toLowerCase())
    );

    const options = filteredData.map((business) => ({
      value: business._id,
      label: business.business_name,
      data: business,
    }));

    callback(options);
  };

  // Cập nhật inputValue khi initialRestaurant thay đổi
  useEffect(() => {
    setInputValue(initialRestaurant?.business_name || "");
    // Nếu có initialRestaurant, đóng menu
    if (initialRestaurant) {
      setIsMenuOpen(false);
    }
  }, [initialRestaurant]);

  // Chỉ mở menu khi không có initialRestaurant ban đầu
  useEffect(() => {
    if (
      !isLoading &&
      businessData &&
      businessData.length > 0 &&
      selectRef.current &&
      !initialRestaurant
    ) {
      selectRef.current.onMenuOpen();
    }
  }, [isLoading, businessData, initialRestaurant]);

  const CustomOption = ({ data, innerProps }) => (
    <div
      {...innerProps}
      style={{ display: "flex", padding: "8px", alignItems: "center" }}
    >
      <Avatar src={data.data.avatar} size={40} style={{ marginRight: "8px" }} />
      <div>
        <Text strong>{data.data.business_name}</Text>
        <br />
        <Text type="secondary">{data.data.location}</Text>
        <br />
        <Rate
          disabled
          defaultValue={data.data.rating_average}
          allowHalf
          style={{ fontSize: 12 }}
        />{" "}
        {data.data.rating_average?.toFixed(1) || "N/A"}
      </div>
    </div>
  );

  const handleFocus = () => {
    const modalContent = document.querySelector(".ant-modal-content");
    if (modalContent) {
      modalContent.scrollTop = 0;
    }
    // Mở menu khi focus nếu không có giá trị mặc định hoặc người dùng tương tác
    setIsMenuOpen(true);
  };

  const handleBlur = () => {
    // Đóng menu khi mất focus
    setIsMenuOpen(false);
  };

  const handleInputChange = (value) => {
    setInputValue(value);
    // Nếu người dùng bắt đầu nhập, mở menu
    if (value) {
      setIsMenuOpen(true);
    }
  };

  return (
    <AsyncSelect
      ref={selectRef}
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      onInputChange={handleInputChange}
      onChange={(selected) => {
        onSelect(selected?.data);
        setIsMenuOpen(false); // Đóng menu sau khi chọn
      }}
      placeholder="Tìm kiếm quán ăn..."
      components={{ Option: CustomOption }}
      menuPlacement="bottom"
      menuPosition="fixed"
      onFocus={handleFocus}
      onBlur={handleBlur}
      isLoading={isLoading}
      value={defaultValue} // Giá trị mặc định
      menuIsOpen={isMenuOpen} // Điều khiển menu
      noOptionsMessage={() =>
        isLoading ? "Đang tải dữ liệu..." : "Không tìm thấy quán ăn"
      }
      styles={{
        menu: (provided) => ({
          ...provided,
          zIndex: 9999,
          maxHeight: "300px",
          overflowY: "auto",
          scrollbarWidth: "thin",
        }),
        control: (provided, state) => ({
          ...provided,
          width: "100%",
          borderWidth: "0.5px",
          borderColor: "#52c41a",
          "&:hover": {
            borderColor: "#52c41a",
          },
          boxShadow: state.isFocused
            ? "0 0 0 0.5px #52c41a"
            : provided.boxShadow,
        }),
      }}
    />
  );
};

export default SearchOptionBusiness;
