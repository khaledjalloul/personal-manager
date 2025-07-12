import { MutableRefObject, useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Box } from "@mui/material";
import { About } from "../home";

export type AuthSection = "signin" | "signup";

const scrollToSection = (
  authSection: MutableRefObject<AuthSection>,
  behavior: "smooth" | "auto",
  scrollRef: MutableRefObject<HTMLDivElement | null>
) => {
  if (scrollRef.current) scrollRef.current.style.overflowX = "auto";
  if (authSection.current === "signup")
    scrollRef.current?.scroll({
      left: window.innerWidth,
      behavior,
    });
  else if (behavior === "smooth")
    scrollRef.current?.scroll({
      left: 0,
      behavior,
    });
  if (scrollRef.current) scrollRef.current.style.overflowX = "hidden";
};

export const Auth = () => {
  const [authSection, setAuthSection] = useState<AuthSection>("signin");

  const pageScrollRef = useRef<HTMLDivElement | null>(null);
  const authScrollRef = useRef<HTMLDivElement | null>(null);
  const authSectionRef = useRef(authSection);

  useEffect(() => {
    const scroll = () => scrollToSection(authSectionRef, "auto", authScrollRef);
    window.addEventListener("resize", scroll);
    return () => window.removeEventListener("resize", scroll);
  }, []);

  useEffect(() => {
    authSectionRef.current = authSection;
    scrollToSection(authSectionRef, "smooth", authScrollRef);
  }, [authSection]);

  return (
    <Box ref={pageScrollRef} height={"100vh"} overflow={"scroll"}>
      <HideScrollBar />
      <Box position={"relative"} zIndex={1}>
        <AuthWrapper ref={authScrollRef}>
          <ParallaxImageContainer>
            <ParallaxImage />

            <SignIn setAuthSection={setAuthSection} />
            <SignUp setAuthSection={setAuthSection} />
          </ParallaxImageContainer>
        </AuthWrapper>

        <ExpandDiv
          sx={{
            justifyContent: {
              xs: "flex-end",
              md: "center",
            },
          }}
        >
          <StyledExpandMore
            as={ExpandMore}
            fontSize="medium"
            onClick={() =>
              pageScrollRef.current?.scroll({
                top: window.innerHeight,
                behavior: "smooth",
              })
            }
          />
        </ExpandDiv>
      </Box>

      <About />

      <StyledExpandLess
        as={ExpandLess}
        sx={{ fontSize: { sx: "24px", md: "35px" } }}
        onClick={() =>
          pageScrollRef.current?.scroll({
            top: 0,
            behavior: "smooth",
          })
        }
      />
    </Box>
  );
};

const AuthWrapper = styled(Box)`
  min-height: 100vh;
  width: 100vw;
  position: relative;
  overflow-y: hidden;
  overflow-x: hidden; // Toggles on click
  perspective: 1px;
`;

const ParallaxImageContainer = styled(Box)`
  min-height: 100vh;
  width: 200vw;
  display: flex;
  justify-content: space-between;
  position: relative;
  transform-style: preserve-3d;
  ${({ theme }) => theme.breakpoints.up("xs")} {
    background: rgba(0, 0, 0, 0.75);
  }
  ${({ theme }) => theme.breakpoints.up("md")} {
    background: linear-gradient(
      -90deg,
      rgba(0, 0, 0, 0.9),
      rgba(0, 0, 0, 0.8),
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0.6),
      rgba(0, 0, 0, 0.3),
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.3),
      rgba(0, 0, 0, 0.6),
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0.8),
      rgba(0, 0, 0, 0.9)
    );
  }
`;

const ParallaxImage = styled(Box)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-image: url("assets/images/eth-background2.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  transform: translateZ(-2px) scale(3);
  z-index: -1;
`;

const ExpandDiv = styled(Box)`
  position: absolute;
  left: 0;
  right: 0;
  padding-left: 24px;
  padding-right: 24px;
  bottom: 24px;
  display: flex;
`;

const StyledExpandMore = styled(ExpandMore)`
  padding: 8px;
  border-radius: 100px;
  background-color: ${({ theme }) => theme.palette.background.default};
  cursor: pointer;
  opacity: 0.5;

  &:hover {
    transition-duration: 0.3s !important;
    color: ${({ theme }) => theme.palette.background.default};
    background-color: ${({ theme }) => theme.palette.primary.main};
    opacity: 0.9;
  }
`;

const StyledExpandLess = styled(StyledExpandMore)`
  position: absolute;
  bottom: 24px;
  right: 24px;
`;

const HideScrollBar = createGlobalStyle`
  body {
    overflow-x: hidden;
  }
  
  ::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
`;
