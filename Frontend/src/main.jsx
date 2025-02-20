import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/global.css";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
//import UserPage from "./pages/UserPage.jsx";
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
import ProfilePage from "./pages/PageProfile.jsx";


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
        element: <ProfilePage />
      },
      // {
      //   path: "/users",
      //   element: <UserPage />,
      // },
      {
        path: "/posts",
        children: [
          {
            index: true,
            element: <PostPage />,
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
          // {
          //   index: true,
          //   element: <DishPage />,
          // },
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
  }
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthWrapper> {/* Bọc ứng dụng bằng AuthWrapper */}
        <RouterProvider router={router} />
      </AuthWrapper>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
