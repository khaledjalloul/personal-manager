import { Box, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import { useHikes } from "../../api";
import { HikeCard } from "../../components";
import { Add, Clear } from "@mui/icons-material";
import { useState } from "react";
import { Hike } from "../../types";

const emptyHike: Hike = {
  id: -1,
  date: new Date(),
  description: "",
  ascent: 0,
  descent: 0,
  distance: 0,
  duration: 0,
  durationWithBreaks: 0,
  coverImage: "",
  googleMapsUrl: "",
  images: []
}

export const Hikes = () => {

  const { data: hikes } = useHikes({});

  const [searchText, setSearchText] = useState("");
  const [isAddingHike, setIsAddingHike] = useState(false);

  return (
    <Wrapper>
      <Header>
        <Typography variant="h5">
          Hikes
        </Typography>
        <IconButton onClick={() => setIsAddingHike(true)}>
          <Add />
        </IconButton>
        <TextField
          sx={{
            minWidth: "35vw", ml: "auto",
          }}
          label="Search hikes"
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
        <Grid container spacing={3} >
          {isAddingHike && (
            <Grid
              key={emptyHike.id}
              size={{ xs: 12, md: 6, lg: 4, xl: 3 }}
              sx={{ display: 'flex' }}
            >
              <HikeCard hike={emptyHike}
                isAddingHike={isAddingHike}
                setIsAddingHike={setIsAddingHike}
              />
            </Grid>
          )}
          {hikes?.map((hike) => (
            <Grid
              key={hike.id}
              size={{ xs: 12, md: 6, lg: 4, xl: 3 }}
              sx={{ display: 'flex' }}
            >
              <HikeCard hike={hike}
                isAddingHike={isAddingHike}
                setIsAddingHike={setIsAddingHike}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Wrapper>
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
