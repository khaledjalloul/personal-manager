import { AccountCircle, ArrowBack } from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { MouseEvent, useContext, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ThemeContext, UserContext } from "../utils";
import { Menu as MenuIcon } from "@mui/icons-material";

const toolbarButtons = [
  { label: "Home", path: "/", },
  { label: "Expenses", path: "/expenses" },
  { label: "Diary", path: "/diary" },
  { label: "Journal", path: "/journal" },
  { label: "To Do", path: "/todo" },
  { label: "Notes", path: "/notes" },
  { label: "Piano Pieces", path: "/piano" },
  { label: "Hikes", path: "/hikes" },
  { label: "Video Games", path: "/games" },
  // { label: "Recipes", path: "/recipes" },
];

export const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setUserData } = useContext(UserContext);
  const { themeData, setThemeData } = useContext(ThemeContext);

  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

  return (
    <Box display={"flex"} minHeight={"100vh"} bgcolor={"background.default"}>
      <AppBar sx={{ backgroundColor: "background.default" }}>
        <Toolbar sx={{ gap: 3 }}>
          {location.pathname !== "/" && (
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack sx={{ color: "text.primary" }} />
            </IconButton>
          )}

          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              ml: "auto",
              alignItems: "center",
              gap: 3,
            }}
          >
            {toolbarButtons.map((link, index) => (
              <StyledLink
                key={index}
                $path={link.path}
                $currentPath={location.pathname}
                ml={index === 0 ? "auto" : "none"}
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </StyledLink>
            ))}
            <IconButton
              size="large"
              onClick={(event: MouseEvent<HTMLElement>) =>
                setAccountMenuAnchor(event.currentTarget)
              }
              sx={{ color: "text.primary" }}
              disableTouchRipple
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={accountMenuAnchor}
              open={Boolean(accountMenuAnchor)}
              onClose={() => setAccountMenuAnchor(null)}
            >
              <MenuItem onClick={() => { navigate("/account"); setAccountMenuAnchor(null); }}>
                <Typography variant="body2">Account</Typography>
              </MenuItem>
              <MenuItem onClick={e => setThemeData({ darkMode: !themeData.darkMode })}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">Dark Mode</Typography>
                  <Switch
                    size="small"
                    checked={themeData.darkMode}
                  />
                </Box>
              </MenuItem>
              <MenuItem onClick={() => setUserData(null)}>
                <Typography variant="body2">Sign Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Box
            sx={{
              display: {
                xs: "flex",
                sm: "none",
              },
              ml: "auto",
            }}
          >
            <IconButton
              size="large"
              onClick={(event: MouseEvent<HTMLElement>) =>
                setMobileMenuAnchor(event.currentTarget)
              }
              sx={{ color: "text.primary", ml: "auto" }}
              disableTouchRipple
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={() => setMobileMenuAnchor(null)}
            >
              {toolbarButtons.map((link, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    navigate(link.path);
                    setMobileMenuAnchor(null);
                  }}
                >
                  <Typography variant="body2">{link.label}</Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={() => {
                navigate("/account");
                setMobileMenuAnchor(null);
              }}>
                <Typography variant="body2">Account</Typography>
              </MenuItem>
              <MenuItem onClick={e => setThemeData({ darkMode: !themeData.darkMode })}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">Dark Mode</Typography>
                  <Switch
                    size="small"
                    checked={themeData.darkMode}
                  />
                </Box>
              </MenuItem>
              <MenuItem onClick={() => setUserData(null)}>
                <Typography variant="body2">Sign Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* TODO: Remove fixed height */}
      <Box width={'100vw'} height={'calc(100vh - 64px)'} mt={8}>
        <Outlet />
      </Box>

    </Box>
  );
};

const StyledLink = styled(Link) <{ $path: string; $currentPath: string }>`
  text-decoration: none;
  white-space: nowrap;
  color: ${({ theme, $path, $currentPath }) => {
    return (
      $path === "/"
        ? $currentPath === "/"
          ? theme.palette.primary.main
          : theme.palette.text.primary
        : $currentPath.includes($path)
          ? theme.palette.primary.main
          : theme.palette.text.primary
    )
  }
  };
  transition-duration: 0.3s;

  &:hover {
    color: ${({ theme, $path, $currentPath }) =>
    $path === "/"
      ? $currentPath === "/"
        ? theme.palette.primary.main
        : theme.palette.primary.main // TODO: Fix
      : $currentPath.includes($path)
        ? theme.palette.primary.main
        : theme.palette.primary.main // TODO: Fix
  };
  }
`;
