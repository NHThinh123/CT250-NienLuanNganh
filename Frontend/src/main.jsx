import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/global.css";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import PostPage from "./pages/PostPage.jsx";
import PostCreatePage from "./pages/PostCreatePage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import PostEditPage from "./pages/PostEditPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import Loginpage from "./pages/Loginpage.jsx";
import DishDetailPage from "./pages/DishDetailPage.jsx";
import BusinessDetailPage from "./pages/BusinessDetailPage.jsx";
import BusinessListPage from "./pages/BusinessListPage.jsx";
import LoginBusinessPage from "./pages/LoginBusinessPage.jsx";
import SignupBusinessPage from "./pages/SignupBusinessPage.jsx";
import { AuthWrapper } from "./contexts/auth.context.jsx";
import { ChatWrapper } from "./contexts/chat.context.jsx";
import ProfilePage from "./pages/PageProfile.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import { BusinessWrapper } from "./contexts/business.context.jsx";
import ProfileBusinessPage from "./pages/ProfileBusinessPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import SubscriptionPlansPage from "./pages/SubscriptionPlansPage.jsx";

// Thêm import ConfigProvider từ antd
import { ConfigProvider, App as AntdApp } from "antd";
import ResetBusinessPasswordPage from "./pages/ResetBusinessPasswordPage.jsx";
import MyPostList from "./features/post/components/templates/MyPostList.jsx";
import ProtectedRoute from "./components/molecules/ProtectedRoute.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";
import TermsOfUsePage from "./pages/TermsOfUsePage.jsx";
import ProtectedRouteAdmin from "./components/molecules/ProtectedRouteAdmin.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminTablePage from "./pages/AdminTablePage.jsx";
import AdminAddPage from "./pages/AdminAddPage.jsx";
import PostOverviewPage from "./pages/PostOverviewPage.jsx";
import AdminBillingPage from "./pages/AdminBillingPage.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/business-profile/:id",
        element: <ProfileBusinessPage />,
      },
      {
        path: "/posts",
        children: [
          {
            index: true,
            element: <PostPage />,
          },
          {
            path: "my-posts",
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoute redirectPath="/login">
                    <MyPostList />
                  </ProtectedRoute>
                ),
              },
              {
                path: "overview",
                element: <PostOverviewPage />,
              },
            ],
          },
          {
            path: ":id",
            element: <PostDetailPage />,
          },
          {
            path: ":id/edit",
            element: <PostEditPage />,
          },
        ],
      },
      {
        path: "/posts/create",
        element: <PostCreatePage />,
      },
      {
        path: "/dishes",
        children: [
          {
            path: ":id",
            element: <DishDetailPage />,
          },
        ],
      },
      {
        path: "/businesses",
        children: [
          {
            index: true,
            element: <BusinessListPage />,
          },
          {
            path: ":id",
            element: <BusinessDetailPage />,
          },
        ],
      },
      {
        path: "/faq",
        element: <FAQPage />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "/terms-of-use",
        element: <TermsOfUsePage />,
      },
      {
        path: "/admin",
        element: (
          <ProtectedRouteAdmin redirectPath="/login" requiredRole="admin">
            <AdminPage />
          </ProtectedRouteAdmin>
        ),
      },
      {
        path: "/admintable",
        element: (
          <ProtectedRouteAdmin redirectPath="/login" requiredRole="admin">
            <AdminTablePage />
          </ProtectedRouteAdmin>
        ),
      },
      {
        path: "/adminadd",
        element: (
          <ProtectedRouteAdmin redirectPath="/login" requiredRole="admin">
            <AdminAddPage />
          </ProtectedRouteAdmin>
        ),
      },
      {
        path: "/adminbilling",
        element: (
          <ProtectedRouteAdmin redirectPath="/login" requiredRole="admin">
            <AdminBillingPage />
          </ProtectedRouteAdmin>
        ),
      },
    ],
  },
  {
    path: "signup",
    element: <SignupPage />,
  },
  {
    path: "login",
    element: <Loginpage />,
  },
  {
    path: "signupBusiness",
    element: <SignupBusinessPage />,
  },
  {
    path: "loginBusiness",
    element: <LoginBusinessPage />,
  },
  {
    path: "resetpassword",
    element: <ResetPasswordPage />,
  },
  {
    path: "resetbusinesspassword",
    element: <ResetBusinessPasswordPage />,
  },
  {
    path: "payment/activation/:businessId",
    element: <PaymentPage />,
  },
  {
    path: "/subscription/plans/:businessId",
    element: <SubscriptionPlansPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    {/* Thêm ConfigProvider bao quanh ứng dụng */}
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#52c41a", // Màu chính xanh lá cây
          fontFamily: "Bitter, serif", // Font chữ
        },
      }}
    >
      <AntdApp>
        <AuthWrapper>
          <BusinessWrapper>
            <ChatWrapper>
              <RouterProvider router={router} />
            </ChatWrapper>
          </BusinessWrapper>
        </AuthWrapper>
      </AntdApp>
    </ConfigProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
