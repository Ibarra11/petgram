import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dogs from "./routes/dogs.jsx";
import "./index.css";

import Root from "./routes/root.jsx";
import Popular from "./routes/popular.jsx";
import Favorites from "./routes/favorites.jsx";
import UploadedDogs from "./routes/uploaded.jsx";
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Dogs /> },
      { path: "/popular", element: <Popular /> },
      { path: "/favorites", element: <Favorites /> },
      { path: "/uploaded", element: <UploadedDogs /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>
        <ReactQueryDevtools initialIsOpen={false} />
      </RouterProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
