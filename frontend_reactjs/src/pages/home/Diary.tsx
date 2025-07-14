import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import { Clear } from "@mui/icons-material";
import { useDiaryEntries } from "../../api";
import { DiaryGridRow } from "../../components";

export const Diary = () => {

  const { data: diaryEntries } = useDiaryEntries({});

  const [searchText, setSearchText] = useState("");

  return (
    <Wrapper>
      <Header>

        {/* year picker with buttons up and down */}

        {/* month picker horizontal slider or buttons */}

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

      <Grid container rowSpacing={1} flexGrow={1}>
        {diaryEntries?.map((entry, index) => (
          <DiaryGridRow key={index} entry={entry} />
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
