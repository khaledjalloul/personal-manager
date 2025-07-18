import { Box, Button, CircularProgress, Link, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AuthSection } from "./Auth";
import { AuthTextField } from "../../components";
import styled from "styled-components";
import { useSignUp } from "../../api";

export const SignUp = ({
  setAuthSection,
}: {
  setAuthSection: Dispatch<SetStateAction<AuthSection>>;
}) => {
  const { mutate: signUp, isPending: signUpLoading, error } = useSignUp();

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const emailReg = new RegExp(/^\S{3,}@(student\.)?ethz\.ch$/);
    const passwordReg = new RegExp(/^\S{8,}$/);

    var valid = true;
    if (!emailReg.test(data.get("email") as string)) {
      setEmailError("Email must end with ethz.ch or student.ethz.ch");
      valid = false;
    }
    if (!passwordReg.test(data.get("password") as string)) {
      setPasswordError("Password must be at least 8 characters");
      valid = false;
    }

    if (valid)
      signUp({
        name: data.get("name") as string,
        email: data.get("email") as string,
        password: data.get("password") as string,
      });
  };

  useEffect(() => {
    if (error && error.message === "CREDENTIALS_TAKEN")
      setEmailError("Email is already in use");
  }, [error]);

  return (
    <Wrapper
      sx={{
        width: { xs: "80vw", md: "40vw", lg: "30vw" },
        mt: { xs: "10vw", md: 0 },
        mb: { xs: "10vw", md: 0 },
      }}
    >
      <Form onSubmit={handleSubmit}>
        <AuthTextField required name="name" label="Name" />
        <AuthTextField
          required
          name="email"
          label="Email Address"
          error={Boolean(emailError)}
          helperText={emailError}
          onChange={() => setEmailError("")}
        />
        <AuthTextField
          required
          name="password"
          label="Password"
          error={Boolean(passwordError)}
          helperText={passwordError}
          onChange={() => setPasswordError("")}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={signUpLoading}
          startIcon={signUpLoading && <CircularProgress size={18} />}
        >
          Sign Up
        </Button>
        <Box display={"flex"} flexDirection={"row"}>
          <Typography sx={{ color: "white" }}>
            Already have an account?
          </Typography>
          <Link sx={{ ml: 0.5 }} onClick={() => setAuthSection("signin")}>
            Sign In
          </Link>
        </Box>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 10vw;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
