import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography
} from "@mui/material";
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
  const [sortByDate, setSortByDate] = useState(false);
  const [showUncompleted, setShowUncompleted] = useState(false);

  const { data: games } = useVideoGames({
    searchText: searchText.trim(),
    sortByDate,
    showUncompleted
  });

  return (
    <Wrapper>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: { xs: 'stretch', lg: 'center' },
          gap: 2,
          padding: '0 32px 0 32px'
        }}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          flexGrow: 1,
          gap: { xs: 2, sm: 0 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5">
              Video Games ({games?.length || 0})
            </Typography>
            <IconButton onClick={() => setIsAddingGame(true)}>
              <Add />
            </IconButton>
          </Box>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            ml: 'auto',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Sort by Date</Typography>
              <Switch
                checked={sortByDate}
                onChange={(e) => setSortByDate(e.target.checked)}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Not Played</Typography>
              <Switch
                checked={showUncompleted}
                onChange={(e) => setShowUncompleted(e.target.checked)}
              />
            </Box>
          </Box>

        </Box>

        <TextField
          sx={{
            minWidth: { xs: 0, lg: "35vw" },
            ml: { xs: 0, lg: "auto" },
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
      </Box>

      <Box sx={{ overflowY: 'auto', p: '32px', pt: 0 }}>
        {!isAddingGame && games?.length === 0 && (
          <Typography align="center" mt={7}>No video games.</Typography>
        )}
        <Grid container spacing={3}>
          {isAddingGame && (
            <Grid
              key={emptyGame.id}
              size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}
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
              size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}
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
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
