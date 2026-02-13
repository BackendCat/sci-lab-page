import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "@/app/store";

export const RootLayout = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <Outlet />;
};
