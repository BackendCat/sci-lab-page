import { lazy } from "react";

const HomePage = lazy(() => import("@/pages/home/HomePage"));

export const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
];
