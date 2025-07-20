import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
  ThemeOptions
} from "@mui/material";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { createGlobalStyle } from "styled-components";
import { ThemeData } from "./ThemeContext";

const lightPalette: ThemeOptions["palette"] = {
  primary: {
    light: "#ddeeff",
    main: "#0077dd",
    dark: "#0077dd",
    contrastText: "#fff",
  },
  action: {
    hover: "#ccddee",
  },
  text: {
    primary: "#000",
  },
  warning: {
    main: "#ed6c02",
    dark: "#994a00"
  }
}

const darkPalette: ThemeOptions["palette"] = {
  mode: "dark",
  primary: {
    light: "#151922",
    main: "#0088ff",
    dark: "#00549e",
    contrastText: "#fff",
  },
  background: {
    default: "#1e2022"
  },
  action: {
    hover: "#10131a",
  },
  text: {
    primary: "#fff",
  },
  success: {
    main: "#66bb6a",
    dark: "#215324"
  },
  warning: {
    main: "#ed6c02",
    dark: "#683200"
  }
}

export const Theme = ({
  themeData,
  children
}: {
  themeData: ThemeData
  children: JSX.Element
}) => {

  const palette = themeData.darkMode ? darkPalette : lightPalette
  const theme = createTheme({
    palette,
    typography: {
      allVariants: themeData.darkMode ? {
        color: palette.text?.primary
      } : {},
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
      <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
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