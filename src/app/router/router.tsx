import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { RootLayout } from "@/app/layouts";

import { routes } from "./routes";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: routes,
  },
]);

export const AppRouter = () => {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};
