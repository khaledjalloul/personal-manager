import { Box, Button, CircularProgress, Link, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AuthSection } from "./Auth";
import { AuthTextField } from "../../components";
import styled from "styled-components";
import { useSignIn } from "../../api";

export const SignIn = ({
  setAuthSection,
}: {
  setAuthSection: Dispatch<SetStateAction<AuthSection>>;
}) => {
  const { mutate: signIn, isPending: signInLoading, error } = useSignIn();

  const [emailError, setEmailError] = useState<string>("");

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    signIn({
      email: data.get("email") as string,
      password: data.get("password") as string,
    });
  };

  useEffect(() => {
    if (error && error.message === "CREDENTIALS_INCORRECT")
      setEmailError("Invalid email or password");
  }, [error]);

  return (
    <Wrapper
      component={"form"}
      onSubmit={handleSubmit}
      sx={{
        width: { xs: "80vw", md: "40vw", lg: "30vw" },
        mt: { xs: "10vw", md: 0 },
        mb: { xs: "10vw", md: 0 },
      }}
    >
      <AuthTextField
        required
        name="email"
        label="Email Address"
        error={Boolean(emailError)}
        helperText={emailError}
        onChange={() => setEmailError("")}
      />
      <AuthTextField required name="password" label="Password" />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={signInLoading}
        startIcon={signInLoading && <CircularProgress size={18} />}
      >
        Sign In
      </Button>
      <Box display={"flex"} flexDirection={"row"}>
        <Typography sx={{ color: "white" }}>Don't have an account?</Typography>
        <Link sx={{ ml: 0.5 }} onClick={() => setAuthSection("signup")}>
          Sign Up
        </Link>
      </Box>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
  margin-left: 10vw;
`;
