import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { createGlobalStyle } from "styled-components";
import { ThemeData } from "./ThemeContext";

export const Theme = ({
  themeData,
  children
}: {
  themeData: ThemeData
  children: JSX.Element
}) => {
  const lightTheme = createTheme({
    palette: {
      primary: {
        light: "#ddeeff",
        main: "#0077dd",
        contrastText: "#fff",
      },
      action: {
        hover: "#ccddee",
      },
      background: {
        default: "#fff",
      },
      text: {
        primary: "#000",
      },
      success: {
        main: "#2e7d32",
        dark: "#0d660d"
      },
      warning: {
        main: "#ed6c02",
        dark: "#994a00"
      }
    },
    typography: {
      fontFamily: "Poppins, Inter, Segoe UI, sans-serif",
      h3: {
        fontWeight: 300,
      },
      h6: {
        fontWeight: 400,
      },
      button: {
        fontWeight: 500,
        textTransform: "capitalize",
      },
    },
    components: {
      MuiLink: {
        defaultProps: {
          variant: "body1",
          style: {
            cursor: "pointer",
          },
        },
      },
    },
  });

  console.log(lightTheme)

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#00c0ff",
        light: "#74c5ff",
        dark: "#007099",
        contrastText: "#fff",
      },
      secondary: {
        main: "#eef9ff",
        dark: "#dde9ee"
      },
      background: {
        default: "#000",
      },
      text: {
        primary: "#000",
      },
    },
    typography: {
      fontFamily: "Poppins, Inter, Segoe UI, sans-serif",
      h3: {
        fontWeight: 300,
      },
      h6: {
        fontWeight: 400,
      },
      button: {
        fontWeight: 500,
        textTransform: "capitalize",
      },
    },
    components: {
      MuiLink: {
        defaultProps: {
          variant: "body1",
          style: {
            cursor: "pointer",
          },
        },
      },
    },
  });

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themeData.darkMode ? darkTheme : lightTheme}>
        <StyledThemeProvider theme={themeData.darkMode ? darkTheme : lightTheme}>
          <GlobalStyle />
          {children}
        </StyledThemeProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
  p {
    margin: 0;
  }
`;