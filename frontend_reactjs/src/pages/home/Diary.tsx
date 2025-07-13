import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { Fragment, useState } from "react";
import { Clear } from "@mui/icons-material";
import { useDiaryEntries } from "../../api";

export const Diary = () => {

  const { data: diaryEntries } = useDiaryEntries({});

  const [searchText, setSearchText] = useState("");

  return (
    <Wrapper>
      <Header>
        <TextField
          sx={{
            ml: 'auto',
            minWidth: "35vw",
          }}
          label="Search for diary entries"
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

      <Grid container rowSpacing={2} flexGrow={1}>
        {diaryEntries?.map((entry, index) => (
          <Fragment key={index}>

            <Grid item xs={2} sx={{ display: 'flex' }}>
              <Box sx={{
                flexGrow: 1,
                borderRadius: 1,
                backgroundColor: 'secondary.main',
                p: 1,
                mr: 1,
                display: 'flex',
                alignItems: 'center',
              }}>
                <Typography variant="body1" >
                  {entry.date.toLocaleDateString("en-US")}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={7} sx={{ display: 'flex' }}>
              <Box sx={{
                flexGrow: 1,
                borderTopLeftRadius: 1,
                borderBottomLeftRadius: 1,
                backgroundColor: 'secondary.main',
                p: 1,
                pr: 2,
              }}>
                <Typography variant="body1" >
                  {entry.content}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={3} sx={{ display: 'flex' }}>
              <Box sx={{
                flexGrow: 1,
                borderTopRightRadius: 1,
                borderBottomRightRadius: 1,
                backgroundColor: 'secondary.main',
                p: 1,
                pl: 2,
              }}>
                <Typography variant="body1">
                  {entry.workContent}
                </Typography>
              </Box>
            </Grid>

          </Fragment>
        ))}

      </Grid>

    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  flex-grow: 1;
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
