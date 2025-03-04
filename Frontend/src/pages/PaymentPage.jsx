// features/payment/pages/PaymentPage.jsx
import React from "react";
import { Row } from "antd";
import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentIllustration from "../features/payment/components/templates/PaymentIllustration";
import PaymentForm from "../features/payment/components/templates/PaymentForm";


// Khởi tạo Stripe với Publishable Key
const stripePromise = loadStripe(
    "pk_test_51QyZcJGzZNrLHYHr52627BnMxat5xTfvscEgExFFySkrSJdDGEnTHUI5auCYCFrIuhzXSCsa1zERdiSdVNpcpPFs005y3lJIc9"
);

const PaymentPage = () => {
    const { businessId } = useParams();

    return (
        <Row style={{ minHeight: "100vh", alignItems: "center", backgroundColor: "#f0f2f5" }}>
            <PaymentIllustration />
            <Elements stripe={stripePromise}>
                <PaymentForm businessId={businessId} />
            </Elements>
        </Row>
    );
};

export default PaymentPage;