import { Box, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import { useHikes } from "../../api";
import { HikeCard } from "../../components";
import { Add, Clear } from "@mui/icons-material";
import { useState } from "react";

export const Hikes = () => {

  const { data: hikes } = useHikes({});

  const [searchText, setSearchText] = useState("");

  return (
    <Wrapper>
      <Header>
        <Typography variant="h5">
          Hikes
        </Typography>
        <IconButton>
          <Add />
        </IconButton>
        <TextField
          sx={{
            minWidth: "35vw", ml: "auto",
          }}
          label="Search hikes"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            endAdornment: searchText.length > 0 && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setSearchText("")}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Header>

      <Box style={{ overflowY: 'auto' }}>
        <Grid container spacing={3} >
          {hikes?.map((hike, index) => (
            <Grid key={index} item xs={12} md={6} lg={4} xl={3} sx={{ display: 'flex' }}>
              <HikeCard hike={hike} />
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
