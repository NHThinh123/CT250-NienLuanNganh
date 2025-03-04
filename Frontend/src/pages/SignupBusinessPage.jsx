// features/register/pages/RegisterPage.jsx
import React from "react";
import { Row } from "antd";
import RegisterIllustration from "../features/business/components/templates/RegisterIllustration";
import SignupBusinessForm from "../features/business/components/templates/SignupBussinessForm";
import AuthLayout from "../features/business/components/templates/AuthLayout";

const SignupBusinessPage = () => {
    return (
        <AuthLayout>
            <Row style={{ minHeight: "100vh", alignItems: "center" }}>
                <RegisterIllustration />
                <SignupBusinessForm />
            </Row>
        </AuthLayout>
    );
};

export default SignupBusinessPage;