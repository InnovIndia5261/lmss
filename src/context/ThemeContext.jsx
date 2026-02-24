import React, { createContext, useState, useEffect, useContext } from "react";
import { OrganizationContext } from "./OrganizationContext";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { currentOrg } = useContext(OrganizationContext);
  const [theme, setTheme] = useState({ mode: "light", primary: "#4F46E5", secondary: "#7C3AED" });

  useEffect(() => {
    if (currentOrg) {
      setTheme({
        mode: currentOrg.themeSettings?.mode || "light",
        primary: currentOrg.primaryColor || "#4F46E5",
        secondary: currentOrg.secondaryColor || "#7C3AED",
      });
      if (currentOrg.primaryColor) {
        document.documentElement.style.setProperty("--color-primary", currentOrg.primaryColor);
      }
      if (currentOrg.secondaryColor) {
        document.documentElement.style.setProperty("--color-secondary", currentOrg.secondaryColor);
      }
    }
  }, [currentOrg]);

  const value = { theme, setTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

