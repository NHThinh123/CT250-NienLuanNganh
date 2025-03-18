import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Card, Col, Row } from "antd";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Charts = () => {
    const websiteViewsData = {
        labels: ["M", "T", "W", "T", "F", "S", "S"],
        datasets: [
            {
                label: "Views",
                data: [50, 60, 70, 80, 90, 100, 110],
                backgroundColor: "#52c41a",
                borderColor: "#52c41a",
                borderWidth: 1,
            },
        ],
    };

    const dailySalesData = {
        labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        datasets: [
            {
                label: "Sales",
                data: [200, 300, 400, 500, 600, 400, 300, 200, 400, 500, 600, 700],
                fill: false,
                borderColor: "#52c41a",
                tension: 0.1,
            },
        ],
    };

    const completedTasksData = {
        labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Tasks",
                data: [100, 200, 300, 400, 300, 200, 100, 200, 300],
                backgroundColor: "#52c41a",
                borderColor: "#52c41a",
                borderWidth: 1,
            },
        ],
    };

    return (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={8}>
                <Card title="Website Views - Last Campaign Performance">
                    <Bar data={websiteViewsData} />
                    <p style={{ textAlign: "right", fontSize: 12 }}>Campaign sent 2 days ago</p>
                </Card>
            </Col>
            <Col span={8}>
                <Card title="Daily Sales (14% increase in today sales)">
                    <Line data={dailySalesData} />
                    <p style={{ textAlign: "right", fontSize: 12 }}>Updated 4 min ago</p>
                </Card>
            </Col>
            <Col span={8}>
                <Card title="Completed Tasks - Last Campaign Performance">
                    <Line data={completedTasksData} />
                    <p style={{ textAlign: "right", fontSize: 12 }}>Just updated</p>
                </Card>
            </Col>
        </Row>
    );
};

export default Charts;