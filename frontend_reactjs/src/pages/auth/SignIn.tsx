import { Box, Button, Link, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { AuthSection } from "./Auth";
import { AuthTextField } from "../../components";
import styled from "styled-components";
import { useSignIn } from "../../api";
import { HttpStatusCode } from "axios";

export const SignIn = ({
  setAuthSection,
}: {
  setAuthSection: Dispatch<SetStateAction<AuthSection>>;
}) => {
  const { mutate: signIn, isPending: signInLoading, error } = useSignIn();

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    signIn({
      email: (data.get("email") as string).trim(),
      password: data.get("password") as string,
    });
  };

  const emailError = error?.response?.status === HttpStatusCode.Unauthorized ? "Invalid email or password" : "";

  return (
    <Wrapper
      sx={{
        width: { xs: "80vw", md: "40vw", lg: "30vw" },
        mt: { xs: "10vw", md: 0 },
        mb: { xs: "10vw", md: 0 },
      }}
    >
      <Form onSubmit={handleSubmit}>
        <AuthTextField
          required
          name="email"
          label="Email Address"
          error={Boolean(emailError)}
          helperText={emailError}
        />
        <AuthTextField required name="password" label="Password" />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          loading={signInLoading}
        >
          Sign In
        </Button>
        <Box display={"flex"} flexDirection={"row"}>
          <Typography sx={{ color: "white" }}>Don't have an account?</Typography>
          <Link sx={{ ml: 0.5 }} onClick={() => setAuthSection("signup")}>
            Sign Up
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
  margin-left: 10vw;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
