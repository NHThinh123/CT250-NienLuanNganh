import AuthLayout from "../features/auth/components/templates/AuthLayout";
import SignupForm from "../features/auth/components/templates/SignupForm";
import SocialLogin from "../features/auth/components/templates/SocialLogin";

const SignupPage = () => {
    return (
        <AuthLayout>
            <SignupForm />
            <SocialLogin />
        </AuthLayout>
    );
};

export default SignupPage;
