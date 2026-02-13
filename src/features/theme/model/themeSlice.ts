import { createSlice } from "@reduxjs/toolkit";

import type { ThemeMode } from "./types";

const STORAGE_KEY = "sci-theme";

const getInitialTheme = (): ThemeMode => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
};

type ThemeState = {
  mode: ThemeMode;
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
