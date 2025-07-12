import styled from "styled-components";
import { Bolt } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const InfoBox = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: {
        xs: "column",
        sm: "row",
      },
      alignItems: "center",
      gap: {
        xs: 2,
        sm: 3,
        md: 4,
        lg: 5,
      },
      p: {
        xs: 3,
        md: 4,
        lg: 5,
      },
      backgroundColor: "secondary.main",
      borderRadius: 3,
    }}
  >
    <Bolt sx={{ fontSize: "70px" }} color="primary" />
    <Typography>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
      molestiae quas vel sint commodi repudiandae consequuntur voluptatum
      laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga
      praesentium optio, eaque rerum! Provident similique accusantium nemo
      autem.
    </Typography>
  </Box>
);

export const About = () => {
  return (
    <Wrapper
      sx={{
        p: {
          xs: 5,
          sm: 7,
          md: 9,
          lg: 10,
        },
        gap: {
          xs: 3,
          sm: 4,
          md: 5,
          lg: 6,
        },
      }}
    >
      <Typography variant="h3" textAlign={"center"}>
        Title
      </Typography>

      <Typography>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
        mollitia, molestiae quas vel sint commodi repudiandae consequuntur
        voluptatum laborum numquam blanditiis harum quisquam eius sed odit
        fugiat iusto fuga praesentium optio, eaque rerum! Provident similique
        accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut
        molestias architecto voluptate aliquam nihil, eveniet aliquid culpa
        officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum
        nesciunt ipsum debitis quas aliquid. Reprehenderit, quia. Quo neque
        error repudiandae fuga? Ipsa laudantium molestias eos sapiente officiis
        modi at sunt excepturi expedita sint? Sed quibusdam recusandae alias
        error harum maxime adipisci amet laborum. Perspiciatis minima nesciunt
        dolorem!
      </Typography>

      <Typography variant="h4">Subtitle</Typography>

      <InfoBox />
      <InfoBox />
      <InfoBox />
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
`;
