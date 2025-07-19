import { Box, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import { useVideoGames } from "../../api";
import { VideoGameCard } from "../../components";
import { Add, Clear } from "@mui/icons-material";
import { useState } from "react";
import { VideoGame, VideoGameType } from "../../types";

const emptyGame: VideoGame = {
  id: -1,
  name: "",
  platform: "",
  type: VideoGameType.Single_Player,
  firstPlayed: new Date(),
  completionCount: 0,
  price: "",
  extraPurchases: "",
  coverImage: "",
  storeUrl: ""
};

export const VideoGames = () => {

  const [searchText, setSearchText] = useState("");
  const [isAddingGame, setIsAddingGame] = useState(false);

  const { data: games } = useVideoGames({
    searchText: searchText.trim(),
  });

  return (
    <Wrapper>
      <Header>
        <Typography variant="h5">
          Video Games ({games?.length || 0})
        </Typography>
        <IconButton onClick={() => setIsAddingGame(true)}>
          <Add />
        </IconButton>
        <TextField
          sx={{
            minWidth: "35vw", ml: "auto",
          }}
          label="Search video games"
          placeholder="Name, platform"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          slotProps={{
            input: {
              endAdornment: searchText.length > 0 && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setSearchText("")}
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }
          }}
        />
      </Header>

      <Box style={{ overflowY: 'auto' }}>
        {!isAddingGame && games?.length === 0 && (
          <Typography align="center" mt={7}>No video games.</Typography>
        )}
        <Grid container spacing={3}>
          {isAddingGame && (
            <Grid
              key={emptyGame.id}
              size={{ xs: 12, md: 6, lg: 4, xl: 3 }}
              sx={{ display: 'flex' }}
            >
              <VideoGameCard
                game={emptyGame}
                isAddingGame={isAddingGame}
                setIsAddingGame={setIsAddingGame}
              />
            </Grid>
          )}
          {games?.map((game) => (
            <Grid
              key={game.id}
              size={{ xs: 12, md: 6, lg: 4, xl: 3 }}
              sx={{ display: 'flex' }}
            >
              <VideoGameCard
                game={game}
                isAddingGame={isAddingGame}
                setIsAddingGame={setIsAddingGame}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Wrapper >
  );
}

const Wrapper = styled(Box)`
  height: 100%;
  box-sizing: border-box;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;
