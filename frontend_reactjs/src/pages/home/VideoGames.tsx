import { Box, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import { useVideoGames } from "../../api";
import { VideoGameCard } from "../../components";
import { Add, Clear } from "@mui/icons-material";
import { useState } from "react";

export const VideoGames = () => {

  const { data: games } = useVideoGames({});

  const [searchText, setSearchText] = useState("");

  return (
    <Wrapper>
      <Header>
        <Typography variant="h5">
          Video Games
        </Typography>
        <IconButton>
          <Add />
        </IconButton>
        <TextField
          sx={{
            minWidth: "35vw", ml: "auto",
          }}
          label="Search video games"
          placeholder="Name, platform, type"
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
        <Grid container spacing={3}>
          {games?.map((game) => (
            <Grid key={game.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} sx={{ display: 'flex' }}>
              <VideoGameCard game={game} />
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
