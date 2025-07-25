import { Box, Button, Link, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { AuthSection } from "./Auth";
import { AuthTextField } from "../../components";
import styled from "styled-components";
import { useSignUp } from "../../api";
import { HttpStatusCode } from "axios";

export const SignUp = ({
  setAuthSection,
}: {
  setAuthSection: Dispatch<SetStateAction<AuthSection>>;
}) => {
  const { mutate: signUp, isPending: signUpLoading, error } = useSignUp();

  const [passwordError, setPasswordError] = useState<string>("");

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const passwordReg = new RegExp(/^\S{8,}$/);

    var valid = true;
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

  const emailError = error?.response?.status === HttpStatusCode.Conflict ? "Email is already in use" : "";

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
          loading={signUpLoading}
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
