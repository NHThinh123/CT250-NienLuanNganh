import AuthLayout from "../features/auth/components/templates/AuthLayout";
import LoginForm from "../features/auth/components/templates/LoginForm";
import SocialLogin from "../features/auth/components/templates/SocialLogin";

const LoginPage = () => {
    return (
        <AuthLayout>
            <LoginForm />
            <SocialLogin />
        </AuthLayout>
    );
};

export default LoginPage;
