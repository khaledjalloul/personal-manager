import { createContext } from "react";

export type ThemeData = {
  darkMode: boolean;
};

export const ThemeContext = createContext<{
  readonly themeData: ThemeData;
  readonly setThemeData: (themeData: ThemeData) => void;
}>({
  themeData: { darkMode: false },
  setThemeData: () => { },
});
