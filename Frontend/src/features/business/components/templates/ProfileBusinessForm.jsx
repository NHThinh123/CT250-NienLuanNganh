import { Form, Input, Button, message, Row, Col, Select } from "antd";
import { useState, useEffect } from "react";
import { useUpdateProfileBusiness } from "../../hooks/useProfileBusiness";
import { useContext } from "react";
import { BusinessContext } from "../../../../contexts/business.context";
import { Map as ReactMapGL, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const { Option } = Select;

const ProfileBusinessForm = ({ business, onCancel }) => {
    const [form] = Form.useForm();
    const { business: businessData, setBusiness } = useContext(BusinessContext);
    const updateProfile = useUpdateProfileBusiness({
        onSuccess: (res) => {
            console.log("onSuccess:", res); // Debug
            const updatedBusiness = { ...businessData, business: { ...businessData.business, ...res.business } };
            setBusiness(updatedBusiness);
            localStorage.setItem("authBusiness", JSON.stringify(updatedBusiness));
            onCancel();
        },
        onError: (error) => {
            console.log("onError:", error.message); // Debug
        },
    });

    const [coordinates, setCoordinates] = useState(business.address?.coordinates || [106.6297, 10.8231]);
    const [longitude, latitude] = coordinates;
    const [viewport, setViewport] = useState({
        longitude,
        latitude,
        zoom: 14,
    });

    const mapboxToken = import.meta.env.VITE_TOKENMAPBOX;

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    useEffect(() => {
        console.log("Mapbox Token:", mapboxToken);
        console.log("Coordinates:", coordinates);
        console.log("Viewport:", viewport);
    }, [mapboxToken, coordinates, viewport]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch("https://provinces.open-api.vn/api/p/");
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", error);
                message.error("Không thể tải danh sách tỉnh/thành phố!");
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const response = await fetch(
                        `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
                    );
                    const data = await response.json();
                    setDistricts(data.districts || []);
                    setWards([]);
                    adjustMapToAddress(provinces.find((p) => p.code === selectedProvince)?.name);
                } catch (error) {
                    console.error("Lỗi khi lấy danh sách quận/huyện:", error);
                    message.error("Không thể tải danh sách quận/huyện!");
                }
            };
            fetchDistricts();
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [selectedProvince, provinces]);

    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const response = await fetch(
                        `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
                    );
                    const data = await response.json();
                    setWards(data.wards || []);
                    adjustMapToAddress(
                        `${districts.find((d) => d.code === selectedDistrict)?.name}, ${provinces.find((p) => p.code === selectedProvince)?.name
                        }`
                    );
                } catch (error) {
                    console.error("Lỗi khi lấy danh sách phường/xã:", error);
                    message.error("Không thể tải danh sách phường/xã!");
                }
            };
            fetchWards();
        } else {
            setWards([]);
        }
    }, [selectedDistrict, districts, provinces]);

    useEffect(() => {
        if (selectedWard) {
            const fullAddress = `${wards.find((w) => w.code === selectedWard)?.name}, ${districts.find((d) => d.code === selectedDistrict)?.name
                }, ${provinces.find((p) => p.code === selectedProvince)?.name}`;
            adjustMapToAddress(fullAddress);
        }
    }, [selectedWard, wards, districts, provinces]);

    const adjustMapToAddress = async (addressName) => {
        if (!addressName) return;
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    addressName
                )}.json?access_token=${mapboxToken}`
            );
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].center;
                setCoordinates([lng, lat]);
                setViewport({
                    longitude: lng,
                    latitude: lat,
                    zoom: selectedWard ? 14 : selectedDistrict ? 12 : selectedProvince ? 10 : 5,
                });
            }
        } catch (error) {
            console.error("Lỗi khi điều chỉnh bản đồ:", error);
        }
    };

    const handleMapClick = (event) => {
        const { lng, lat } = event.lngLat;
        setCoordinates([lng, lat]);
        setViewport({ ...viewport, longitude: lng, latitude: lat });
    };

    const handleViewportChange = (evt) => {
        setViewport({
            longitude: evt.viewState.longitude,
            latitude: evt.viewState.latitude,
            zoom: evt.viewState.zoom,
        });
    };

    const handleSubmit = (values) => {
        const provinceName = provinces.find((p) => p.code === selectedProvince)?.name || "";
        const districtName = districts.find((d) => d.code === selectedDistrict)?.name || "";
        const wardName = wards.find((w) => w.code === selectedWard)?.name || "";
        const fullAddress = [wardName, districtName, provinceName].filter(Boolean).join(", ");

        const updatedData = {
            business_name: values.business_name,
            contact_info: values.contact_info,
            location: values.location,
            address: {
                type: "Point",
                coordinates: coordinates,
            },
            open_hours: values.open_hours,
            close_hours: values.close_hours,
        };

        // Thêm mật khẩu nếu có
        if (values.oldPassword || values.newPassword) {
            if (!values.oldPassword || !values.newPassword) {
                message.error("Vui lòng nhập cả mật khẩu cũ và mới để đổi mật khẩu!");
                return;
            }
            updatedData.oldPassword = values.oldPassword;
            updatedData.newPassword = values.newPassword;
        }

        console.log("Gửi dữ liệu:", updatedData); // Debug
        updateProfile.mutate({ id: business.id, data: updatedData });
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                ...business,
                location: business.location || "",
                open_hours: business.open_hours || "",
                close_hours: business.close_hours || "",
            }}
            onFinish={handleSubmit}
        >
            <Form.Item
                label="Tên doanh nghiệp"
                name="business_name"
                rules={[{ required: true, message: "Vui lòng nhập tên doanh nghiệp" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item label="Thông tin liên hệ" name="contact_info">
                <Input />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="location">
                <Input placeholder="Nhập địa chỉ văn bản" />
            </Form.Item>
            <Form.Item label="Giờ mở cửa" name="open_hours">
                <Input placeholder="VD: 08:00 AM" />
            </Form.Item>
            <Form.Item label="Giờ đóng cửa" name="close_hours">
                <Input placeholder="VD: 10:00 PM" />
            </Form.Item>
            <Form.Item
                label="Mật khẩu cũ"
                name="oldPassword"
                rules={[
                    {
                        required: !!form.getFieldValue("newPassword"),
                        message: "Vui lòng nhập mật khẩu cũ khi đổi mật khẩu!",
                    },
                ]}
            >
                <Input.Password placeholder="Nhập mật khẩu cũ" />
            </Form.Item>
            <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                    {
                        required: !!form.getFieldValue("oldPassword"),
                        message: "Vui lòng nhập mật khẩu mới khi đổi mật khẩu!",
                    },
                    {
                        pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$#!%*?&]{8,}$/,
                        message:
                            "Mật khẩu phải dài ít nhất 8 ký tự, chứa 1 chữ cái in hoa, 1 số và 1 ký tự đặc biệt trong @$!%*?&#!",
                    },
                ]}
            >
                <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>

            <Row gutter={16}>
                <Col xs={24} sm={8}>
                    <Form.Item label="Tỉnh/Thành phố" name="province">
                        <Select
                            size="large"
                            placeholder="Chọn tỉnh/thành phố"
                            onChange={(value) => {
                                setSelectedProvince(value);
                                setSelectedDistrict(null);
                                setSelectedWard(null);
                                form.setFieldsValue({ district: null, ward: null });
                            }}
                            style={{ borderRadius: "8px" }}
                        >
                            {provinces.map((province) => (
                                <Option key={province.code} value={province.code}>
                                    {province.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                    <Form.Item label="Quận/Huyện" name="district">
                        <Select
                            size="large"
                            placeholder="Chọn quận/huyện"
                            disabled={!selectedProvince}
                            onChange={(value) => {
                                setSelectedDistrict(value);
                                setSelectedWard(null);
                                form.setFieldsValue({ ward: null });
                            }}
                            style={{ borderRadius: "8px" }}
                        >
                            {districts.map((district) => (
                                <Option key={district.code} value={district.code}>
                                    {district.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                    <Form.Item label="Phường/Xã" name="ward">
                        <Select
                            size="large"
                            placeholder="Chọn phường/xã"
                            disabled={!selectedDistrict}
                            onChange={(value) => setSelectedWard(value)}
                            style={{ borderRadius: "8px" }}
                        >
                            {wards.map((ward) => (
                                <Option key={ward.code} value={ward.code}>
                                    {ward.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item label="Chọn vị trí trên bản đồ">
                {mapboxToken && !isNaN(longitude) && !isNaN(latitude) ? (
                    <ReactMapGL
                        {...viewport}
                        mapStyle="mapbox://styles/mapbox/streets-v11"
                        mapboxAccessToken={mapboxToken}
                        onClick={handleMapClick}
                        onMove={handleViewportChange}
                        style={{ width: "100%", height: "300px" }}
                    >
                        <Marker longitude={longitude} latitude={latitude} color="red" />
                    </ReactMapGL>
                ) : (
                    <p>Không thể hiển thị bản đồ: Vui lòng kiểm tra token Mapbox hoặc tọa độ.</p>
                )}
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={updateProfile.isLoading}>
                Lưu
            </Button>
            <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                Thoát
            </Button>
        </Form>
    );
};

export default ProfileBusinessForm;