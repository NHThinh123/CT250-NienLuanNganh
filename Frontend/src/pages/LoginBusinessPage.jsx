import AuthLayout from "../features/business/component/template/AuthLayout";
import LoginForm from "../features/business/component/template/LoginForm";
import SocialLogin from "../features/business/component/template/SocialLogin";

const LoginBusinessPage = () => {
    return (
        <AuthLayout>
            <LoginForm />
            <SocialLogin />
        </AuthLayout>
    );
};

export default LoginBusinessPage;
