import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import {
  Clear,
  CreateNewFolder
} from "@mui/icons-material";
import { useJournalCategories, useJournalEntries } from "../../api";
import { JournalCategory } from "../../types";
import { UserContext } from "../../utils";


export const Journal = () => {

  const { palette } = useTheme();
  const { userData, setUserData } = useContext(UserContext);

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<JournalCategory>();
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);

  const { data: entries } = useJournalEntries({ searchText: searchText.trim() })
  const { data: categories } = useJournalCategories({ searchText: searchText.trim() });

  useEffect(() => {
    if (categories && userData && userData.lastOpenedJournalCategoryId) {
      const lastOpenCategory = categories.find(category => category.id === userData.lastOpenedJournalCategoryId);
      if (lastOpenCategory)
        setSelectedCategory(lastOpenCategory);
    }
  }, [JSON.stringify(categories)]);

  return (
    <Wrapper>
      <Header
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 1 }
        }}
      >
        <Typography variant="h5">
          Journal ({categories?.length || 0})
        </Typography>

        <TextField
          sx={{
            ml: { xs: 0, sm: 'auto' },
            minWidth: { xs: 0, sm: "35vw" },
          }}
          label="Search journal"
          placeholder="Category, section, content"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            if (selectedCategory) {
              setSelectedCategory(undefined);
            }
          }}
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

      <Grid
        container
        spacing={{ xs: 4, sm: 2 }}
        sx={{
          height: 'calc(100% - 80px)',
          p: '32px',
          pt: 0
        }}
      >
        <Grid size={{ xs: 12, sm: 3, lg: 2 }} sx={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.6 }}>
            <Typography variant="h6" mr={1}>
              Categories
            </Typography>
            <IconButton size="small" onClick={() => setIsCategoriesModalOpen(true)}>
              <CreateNewFolder />
            </IconButton>
          </Box>

          <Box sx={{
            flexGrow: 1,
            borderRadius: '8px',
            border: `solid 1px ${palette.text.primary}`,
            overflowY: 'auto',
          }}>

          </Box>
        </Grid>

        <Grid
          size={{ xs: 12, sm: 9, lg: 10 }}
          sx={{ display: 'flex', flexDirection: 'column', minHeight: '50vh', height: '100%' }}
        >

        </Grid>
      </Grid>

    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  height: 100%;
  box-sizing: border-box;
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
`;

const Header = styled(Box)`
  display: flex;
  padding: 0 32px 0 32px;
`;
