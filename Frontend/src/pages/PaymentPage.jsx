
import React from "react";
import { Row } from "antd";
import { useParams, useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../features/payment/components/templates/PaymentForm";
import PaymentIllustration from "../features/payment/components/templates/PaymentIllustration";


const stripePromise = loadStripe(
    "pk_test_51QyZcJGzZNrLHYHr52627BnMxat5xTfvscEgExFFySkrSJdDGEnTHUI5auCYCFrIuhzXSCsa1zERdiSdVNpcpPFs005y3lJIc9"
);

const PaymentPage = () => {
    const { businessId } = useParams();
    const location = useLocation();
    const { amount, email, businessName } = location.state || {};

    return (
        <Row style={{ minHeight: "100vh", alignItems: "center", backgroundColor: "#f0f2f5" }}>
            <PaymentIllustration />
            <Elements stripe={stripePromise}>
                <PaymentForm businessId={businessId} amount={amount || 50} email={email} businessName={businessName} />
            </Elements>
        </Row>
    );
};

export default PaymentPage;