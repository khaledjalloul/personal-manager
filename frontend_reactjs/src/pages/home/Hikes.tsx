import { AccessTime, Image, MoreTime, Straighten, Today, TrendingDown, TrendingUp } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import styled from "styled-components";
import { useHikes } from "../../api";
import { HikeCard } from "../../components";

export const Hikes = () => {

  const { data: hikes } = useHikes({});

  return (
    <Wrapper>
      <Grid container spacing={3}>
        {hikes?.map((hike, index) => (
          <Grid key={index} item xs={12} md={6} lg={4} xl={3} sx={{ display: 'flex' }}>
            <HikeCard hike={hike} />
          </Grid>
        ))}
      </Grid>

    </Wrapper>
  );
}

const Wrapper = styled(Box)`
    flex-grow: 1;
    padding: 32px;
`;
