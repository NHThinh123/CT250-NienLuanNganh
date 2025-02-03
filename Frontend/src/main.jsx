import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/global.css";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import UserPage from "./pages/UserPage.jsx";
import PostPage from "./pages/PostPage.jsx";

import PostCreatePage from "./pages/PostCreatePage.jsx";

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
        path: "/users",
        element: <UserPage />,
      },
      {
        path: "/posts",
        element: <PostPage />,
      },
      {
        path: "/posts/create",
        element: <PostCreatePage />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
