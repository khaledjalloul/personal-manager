import { Box, Grid } from "@mui/material";
import styled from "styled-components";
import { useVideoGames } from "../../api";
import { HikeCard, VideoGameCard } from "../../components";

export const VideoGames = () => {

  const { data: games } = useVideoGames({});

  return (
    <Wrapper>
      <Grid container spacing={3}>
        {games?.map((game, index) => (
          <Grid key={index} item xs={12} md={6} lg={4} xl={3} sx={{ display: 'flex' }}>
            <VideoGameCard game={game} />
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
