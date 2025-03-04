import AuthLayout from "../features/business/components/templates/AuthLayout";
import LoginForm from "../features/business/components/templates/LoginBusinessForm";
import SocialLogin from "../features/business/components/templates/SocialLogin";

const LoginBusinessPage = () => {
    return (
        <AuthLayout>
            <LoginForm />
            <SocialLogin />
        </AuthLayout>
    );
};

export default LoginBusinessPage;
