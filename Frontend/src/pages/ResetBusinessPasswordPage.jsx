import AuthLayout from "../features/auth/components/templates/AuthLayout";
import ResetPasswordForm from "../features/business/components/templates/ResetBusinessPasswordForm";


const ResetBusinessPasswordPage = () => {
    return (
        <AuthLayout>
            <ResetPasswordForm />
        </AuthLayout>
    );
};

export default ResetBusinessPasswordPage;
