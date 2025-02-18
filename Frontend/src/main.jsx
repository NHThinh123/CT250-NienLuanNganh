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
          }
        ]
      },
      {
        path: "/business",
        children: [
          // {
          //   index: true,
          //   element: <BusinessPage />,
          // },
          {
            path: ":id",
            element: <BusinessDetailPage />,
          }
        ]
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
  }
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
