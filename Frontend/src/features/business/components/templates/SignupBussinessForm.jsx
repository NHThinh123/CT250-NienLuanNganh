import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Col, Row, TimePicker, Typography, message, Select } from "antd";
import { useBusinessSignup } from "../../hooks/useBusinessSignup";
import { Map as ReactMapGL, NavigationControl, Marker } from "react-map-gl";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const { Title } = Typography;
const { Option } = Select;

const SignupBusinessForm = () => {
    const navigate = useNavigate();
    const { mutate: register, isPending } = useBusinessSignup();
    const [form] = Form.useForm();
    const [mapAddress, setMapAddress] = useState({ coordinates: null });
    const [viewport, setViewport] = useState({
        latitude: 16.0471,
        longitude: 108.2062,
        zoom: 5,
    });
    const [addressText, setAddressText] = useState("");
    const mapRef = useRef();

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

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
    }, [selectedProvince]);

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
    }, [selectedDistrict]);

    useEffect(() => {
        if (selectedWard) {
            const fullAddress = `${wards.find((w) => w.code === selectedWard)?.name}, ${districts.find((d) => d.code === selectedDistrict)?.name
                }, ${provinces.find((p) => p.code === selectedProvince)?.name}`;
            adjustMapToAddress(fullAddress);
        }
    }, [selectedWard]);

    const adjustMapToAddress = async (addressName) => {
        if (!addressName) return;
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addressName)}.json?access_token=${import.meta.env.VITE_TOKENMAPBOX}`
            );
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                const [longitude, latitude] = data.features[0].center;
                const zoomLevel = selectedWard ? 14 : selectedDistrict ? 12 : selectedProvince ? 10 : 5;
                setViewport({ latitude, longitude, zoom: zoomLevel });
            } else {
                console.warn("Không tìm thấy tọa độ cho:", addressName);
            }
        } catch (error) {
            console.error("Lỗi khi điều chỉnh bản đồ:", error);
        }
    };

    const handleMapClick = (event) => {
        const { lngLat } = event;
        const longitude = lngLat.lng;
        const latitude = lngLat.lat;
        setMapAddress({ coordinates: [longitude, latitude] });
        getAddressFromCoordinates(longitude, latitude);
    };

    const getAddressFromCoordinates = async (longitude, latitude) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${import.meta.env.VITE_TOKENMAPBOX}`
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                setAddressText(data.features[0].place_name);
                form.setFieldsValue({ address: data.features[0].place_name });
            } else {
                setAddressText("Không tìm thấy thông tin vị trí");
                form.setFieldsValue({ address: "Không tìm thấy thông tin vị trí" });
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin vị trí:", error);
            setAddressText("Lỗi khi lấy thông tin vị trí");
            form.setFieldsValue({ address: "Lỗi khi lấy thông tin vị trí" });
        }
    };

    const handleViewportChange = (evt) => {
        setViewport({
            latitude: evt.viewState.latitude,
            longitude: evt.viewState.longitude,
            zoom: evt.viewState.zoom,
        });
    };

    const onFinish = (values) => {
        if (!mapAddress.coordinates) {
            message.error("Vui lòng nhấp vào bản đồ để xác định vị trí!");
            return;
        }

        const provinceName = provinces.find((p) => p.code === selectedProvince)?.name || "";
        const districtName = districts.find((d) => d.code === selectedDistrict)?.name || "";
        const wardName = wards.find((w) => w.code === selectedWard)?.name || "";
        const address = [wardName, districtName, provinceName].filter(Boolean).join(", ");

        const formData = new FormData();
        formData.append("business_name", values.businessName);
        formData.append("email", values.email);
        formData.append("location", values.location);
        formData.append("address", JSON.stringify({ type: "Point", coordinates: mapAddress.coordinates }));
        formData.append("contact_info", values.contactInfo);
        formData.append("open_hours", dayjs(values.openHours).format("HH:mm"));
        formData.append("close_hours", dayjs(values.closeHours).format("HH:mm"));
        formData.append("password", values.password);

        console.log("Dữ liệu gửi lên:", {
            business_name: values.businessName,
            email: values.email,
            location: values.location,
            address: { type: "Point", coordinates: mapAddress.coordinates },
            contact_info: values.contactInfo,
            open_hours: dayjs(values.openHours).format("HH:mm"),
            close_hours: dayjs(values.closeHours).format("HH:mm"),
            password: values.password,
        });

        register(formData, {
            onSuccess: (data) => {
                console.log("Phản hồi từ API:", data);

                // Kiểm tra nếu API trả về thông điệp "Email đã tồn tại!"
                if (data.message && data.message.toLowerCase().includes("email đã tồn tại")) {
                    message.error("Email đã tồn tại! Vui lòng sử dụng email khác.");
                    return; // Dừng xử lý tiếp
                }

                // Xử lý logic tìm businessId
                let businessId;
                if (data.business && data.business.id) {
                    businessId = data.business.id;
                } else if (data.id) {
                    businessId = data.id;
                } else if (data.data && data.data.id) {
                    businessId = data.data.id;
                } else if (data.business && data.business._id) {
                    businessId = data.business._id;
                } else {
                    businessId = null;
                }

                if (businessId) {
                    navigate(`/subscription/plans/${businessId}`, {
                        state: { email: values.email, businessName: values.businessName },
                    });
                } else {
                    console.error("Không tìm thấy business.id trong response:", data);
                    message.error("Đăng ký thất bại: Không nhận được thông tin doanh nghiệp!");
                }
            },
            onError: (error) => {
                console.error("Đăng ký thất bại:", error);
                const errorMessage = error.response?.data?.message || "Lỗi không xác định";
                if (errorMessage.toLowerCase().includes("email đã tồn tại")) {
                    message.error("Email đã tồn tại! Vui lòng sử dụng email khác.");
                } else {
                    message.error("Đăng ký thất bại: " + errorMessage);
                }
            },
        });
    };

    const passwordValidator = (_, value) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;
        if (!value || passwordRegex.test(value)) return Promise.resolve();
        return Promise.reject(new Error("Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt!"));
    };

    const phoneValidator = (_, value) => {
        const phoneRegex = /^\d{10}$/;
        if (!value || phoneRegex.test(value)) return Promise.resolve();
        return Promise.reject(new Error("Số điện thoại phải là 10 chữ số!"));
    };

    return (
        <Col xs={24} md={15} style={{ padding: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ maxWidth: "800px", width: "100%", padding: "40px", backgroundColor: "#ffffff", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}>
                <Title level={3} style={{ textAlign: "center", marginBottom: "30px" }}>
                    Đăng ký doanh nghiệp ẩm thực
                </Title>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Tên doanh nghiệp ẩm thực" name="businessName" rules={[{ required: true, message: "Vui lòng nhập tên doanh nghiệp!" }]}>
                                <Input size="large" placeholder="Tên doanh nghiệp ẩm thực" style={{ borderRadius: "8px" }} />
                            </Form.Item>
                            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}>
                                <Input size="large" placeholder="Email" style={{ borderRadius: "8px" }} />
                            </Form.Item>
                            <Form.Item label="Liên hệ" name="contactInfo" rules={[{ required: true, validator: phoneValidator }]}>
                                <Input size="large" placeholder="Số điện thoại" style={{ borderRadius: "8px" }} />
                            </Form.Item>
                            <Form.Item label="Địa chỉ" name="location" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
                                <Input size="large" placeholder="Địa chỉ" style={{ borderRadius: "8px" }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Giờ mở cửa" name="openHours" rules={[{ required: true, message: "Vui lòng chọn giờ mở cửa!" }]}>
                                <TimePicker size="large" format="HH:mm" style={{ width: "100%", borderRadius: "8px" }} placeholder="Chọn giờ" />
                            </Form.Item>
                            <Form.Item label="Giờ đóng cửa" name="closeHours" rules={[{ required: true, message: "Vui lòng chọn giờ đóng cửa!" }]}>
                                <TimePicker size="large" format="HH:mm" style={{ width: "100%", borderRadius: "8px" }} placeholder="Chọn giờ" />
                            </Form.Item>
                            <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, validator: passwordValidator }]}>
                                <Input.Password size="large" placeholder="Mật khẩu" style={{ borderRadius: "8px" }} />
                            </Form.Item>
                            <Form.Item label="Xác nhận mật khẩu" name="confirmPassword" dependencies={["password"]} rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue("password") === value) return Promise.resolve(); return Promise.reject(new Error("Mật khẩu không khớp!")); } })]}>
                                <Input.Password size="large" placeholder="Xác nhận mật khẩu" style={{ borderRadius: "8px" }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={8}>
                            <Form.Item label="Tỉnh/Thành phố" name="province" rules={[{ required: false, message: "Vui lòng chọn tỉnh/thành phố!" }]}>
                                <Select
                                    size="large"
                                    placeholder="Chọn tỉnh/thành phố"
                                    onChange={(value) => {
                                        setSelectedProvince(value);
                                        setSelectedDistrict(null);
                                        setSelectedWard(null);
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
                            <Form.Item label="Quận/Huyện" name="district" rules={[{ required: false, message: "Vui lòng chọn quận/huyện!" }]}>
                                <Select
                                    size="large"
                                    placeholder="Chọn quận/huyện"
                                    disabled={!selectedProvince}
                                    onChange={(value) => {
                                        setSelectedDistrict(value);
                                        setSelectedWard(null);
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
                            <Form.Item label="Phường/Xã" name="ward" rules={[{ required: false, message: "Vui lòng chọn phường/xã!" }]}>
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

                    <Form.Item label="Vị trí đã chọn" name="address">
                        <Input
                            size="large"
                            disabled
                            value={addressText}
                            style={{ borderRadius: "8px", backgroundColor: "#f5f5f5" }}
                            placeholder="Nhấp vào bản đồ để chọn vị trí"
                        />
                    </Form.Item>

                    <Form.Item label="Chọn vị trí trên bản đồ">
                        <div style={{ width: "100%", height: "300px", position: "relative" }}>
                            <ReactMapGL
                                {...viewport}
                                mapStyle="mapbox://styles/mapbox/streets-v11"
                                mapboxAccessToken={import.meta.env.VITE_TOKENMAPBOX}
                                onMove={handleViewportChange}
                                onClick={handleMapClick}
                                doubleClickZoom={false}
                                scrollZoom={true}
                                ref={mapRef}
                            >
                                {mapAddress.coordinates && (
                                    <Marker
                                        longitude={mapAddress.coordinates[0]}
                                        latitude={mapAddress.coordinates[1]}
                                        color="red"
                                    />
                                )}
                                <NavigationControl style={{ top: 10, right: "10px" }} />
                            </ReactMapGL>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isPending} block size="large" style={{ borderRadius: "8px", height: "35px", backgroundColor: "#52c41a", borderColor: "#52c41a" }}>
                            Tạo tài khoản
                        </Button>
                        <Button type="default" block size="large" onClick={() => navigate("/")} style={{ marginTop: "10px", height: "35px" }}>
                            Quay về trang chủ
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <p style={{ marginTop: "20px", color: "#888" }}>
                            Đã có tài khoản?{" "}
                            <a href="/loginBusiness" style={{ color: "#1a73e8", fontWeight: "bold" }}>
                                Đăng nhập Business
                            </a>
                        </p>
                    </div>
                </Form>
            </div>
        </Col>
    );
};

export default SignupBusinessForm;