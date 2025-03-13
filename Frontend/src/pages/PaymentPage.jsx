import React, { useContext } from "react";
import { Row } from "antd";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../features/payment/components/templates/PaymentForm";
import PaymentIllustration from "../features/payment/components/templates/PaymentIllustration";
import { BusinessContext } from "../contexts/business.context";

// Định nghĩa stripePromise ngoài component
const stripePromise = loadStripe(
    "pk_test_51QyZcJGzZNrLHYHr52627BnMxat5xTfvscEgExFFySkrSJdDGEnTHUI5auCYCFrIuhzXSCsa1zERdiSdVNpcpPFs005y3lJIc9"
);

const PaymentPage = () => {
    const { businessId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { setBusiness } = useContext(BusinessContext);
    const { amount, planType, email, businessName, fromBusinessDetail } = location.state || {};

    const handlePaymentSuccess = (paymentData) => {
        const { business } = paymentData;
        console.log("Payment successful, data:", paymentData);

        if (fromBusinessDetail) {
            setBusiness({
                isAuthenticated: true,
                business,
            });
            console.log("Navigating to /businesses/", businessId);
            navigate(`/businesses/${businessId}`);
        } else {
            console.log("Navigating to /loginBusiness");
            navigate("/loginBusiness");
        }
    };

    return (
        <Row style={{ minHeight: "100vh", alignItems: "center", backgroundColor: "#f0f2f5" }}>
            <PaymentIllustration />
            <Elements stripe={stripePromise}>
                <PaymentForm
                    businessId={businessId}
                    amount={amount || 50}
                    planType={planType || "monthly"}
                    email={email}
                    businessName={businessName}
                    onPaymentSuccess={handlePaymentSuccess}
                    fromBusinessDetail={fromBusinessDetail}
                />
            </Elements>
        </Row>
    );
};

export default PaymentPage;