import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Card, Col, Row, Spin } from "antd";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const GenericChart = ({ eventName, title, yAxisLabel, dataLabel, color }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: dataLabel,
                data: [],
                backgroundColor: color || "#52c41a",
                borderColor: color || "#52c41a",
                borderWidth: 1,
            },
        ],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");
        ws.onopen = () => console.log(`Connected to WebSocket for ${eventName}`);
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.event === eventName) {
                const stats = message.data;
                setChartData({
                    labels: stats.map((item) => item._id),
                    datasets: [
                        {
                            label: dataLabel,
                            data: stats.map((item) => item.count),
                            backgroundColor: color || "#52c41a",
                            borderColor: color || "#52c41a",
                            borderWidth: 1,
                        },
                    ],
                });
                setLoading(false);
            }
        };
        ws.onerror = (error) => {
            console.error(`WebSocket error (${eventName}):`, error);
            setLoading(false);
        };
        ws.onclose = () => console.log(`WebSocket closed for ${eventName}`);

        // Set a timeout to handle connection issues
        const timeout = setTimeout(() => {
            if (loading) setLoading(false);
        }, 10000);

        return () => {
            ws.close();
            clearTimeout(timeout);
        };
    }, [eventName, color, dataLabel]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Cập Nhật Mỗi Ngày" },
        },
        scales: {
            y: { beginAtZero: true, title: { display: true, text: yAxisLabel } },
            x: { title: { display: true, text: "Ngày" } },
        },
    };

    return (
        <Card title={title} headStyle={{ textAlign: "center" }}>
            <div style={{ height: "300px", position: "relative" }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <Spin />
                    </div>
                ) : (
                    <Bar data={chartData} options={options} />
                )}
            </div>
            <p style={{ textAlign: "right", fontSize: 12 }}>Yumzy</p>
        </Card>
    );
};

// Component cho biểu đồ số tiền thanh toán theo ngày
const PaymentChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Số tiền thanh toán",
                data: [],
                borderColor: "#52c41a",
                backgroundColor: "rgba(82, 196, 26, 0.2)",
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                pointBackgroundColor: "#52c41a",
                pointBorderColor: "#52c41a",
                pointRadius: 5,
            },
        ],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");
        ws.onopen = () => console.log("Connected to WebSocket for paymentStats");
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.event === "paymentStats") {
                const stats = message.data;
                setChartData({
                    labels: stats.map((item) => {
                        // Định dạng ngày thành "DD/MM" để hiển thị ngắn gọn
                        const date = new Date(item._id);
                        return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`;
                    }),
                    datasets: [
                        {
                            label: "Số tiền thanh toán",
                            data: stats.map((item) => item.totalAmount),
                            borderColor: "#008080",
                            backgroundColor: "#008080",
                            borderWidth: 2,
                            fill: false,
                            tension: 0.1,
                            pointBackgroundColor: "#008080",
                            pointBorderColor: "#008080",
                            pointRadius: 5,
                        },
                    ],
                });
                setLoading(false);
            }
        };
        ws.onerror = (error) => {
            console.error("WebSocket error (paymentStats):", error);
            setLoading(false);
        };
        ws.onclose = () => console.log("WebSocket closed for paymentStats");

        // Set a timeout to handle connection issues
        const timeout = setTimeout(() => {
            if (loading) setLoading(false);
        }, 10000);

        return () => {
            ws.close();
            clearTimeout(timeout);
        };
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Cập Nhật Mỗi Ngày" },
            subtitle: {
                display: true,
                text: "",
                color: "#008080",
                font: { size: 12 },
                padding: { top: 5, bottom: 10 },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: "Số tiền (VND)" },
            },
            x: {
                title: { display: true, text: "Ngày" },
            },
        },
    };

    return (
        <Card title="Số tiền thanh toán theo ngày" headStyle={{ textAlign: "center" }}>
            <div style={{ height: "300px", position: "relative" }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <Spin />
                    </div>
                ) : (
                    <Line data={chartData} options={options} />
                )}
            </div>
            <p style={{ textAlign: "right", fontSize: 12 }}>
                Yumzy
            </p>
        </Card>
    );
};

export const BusinessChart = () => (
    <GenericChart
        eventName="businessStats"
        title="Số lượng Business Tham Gia Yumzy"
        yAxisLabel="Số Business"
        dataLabel="Số lượng Business"
        color="#1890ff"
    />
);

export const UserChart = () => (
    <GenericChart
        eventName="userStats"
        title="Số lượng User Tham Gia Yumzy"
        yAxisLabel="Số User"
        dataLabel="Số lượng User"
        color="#ec407a"
    />
);

export const Charts = () => (
    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
            <BusinessChart />
        </Col>
        <Col xs={24} lg={12}>
            <UserChart />
        </Col>
        <Col xs={24}>
            <PaymentChart />
        </Col>
    </Row>
);