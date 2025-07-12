import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { createGlobalStyle } from "styled-components";

export const Theme = ({ children }: { children: JSX.Element }) => {
  const theme = createTheme({
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
        default: "#fff",
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

  const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
  p {
    margin: 0;
  }
`;

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
