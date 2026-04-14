import {
  Box,
  Checkbox,
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
  Add,
  ArrowDownward,
  ArrowUpward,
  CheckBox,
  Clear,
  CreateNewFolder,
} from "@mui/icons-material";
import { useJournalCategories, useJournalEntries, useJournalSections } from "../../api";
import { JournalEntry, JournalSection } from "../../types";
import { JournalCategoryContainer, JournalEntryContainer, ManageJournalCategoriesModal } from "../../components";
import { UserContext } from "../../utils";


const emptyEntry: JournalEntry = {
  id: -1,
  date: new Date(),
  content: "",
  subEntries: [],
  sections: []
};


export const Journal = () => {
  const { userData, setUserData } = useContext(UserContext);
  const theme = useTheme();

  const [searchText, setSearchText] = useState("");
  const [selectedSections, setSelectedSections] = useState<JournalSection[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(userData?.journalSortOrder || "desc");
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);

  const searchTextQuery = searchText.trim().length >= 3 ? searchText.trim() : "";

  const { data: categories } = useJournalCategories({ searchText: searchTextQuery });
  const { data: allSections } = useJournalSections({ searchText: searchTextQuery });
  const { data: allEntries } = useJournalEntries({
    searchText: searchTextQuery,
    sectionIds: allSections ? allSections.map(s => s.id) : [],
    sortOrder
  });
  const { data: journalEntries } = useJournalEntries({
    searchText: searchTextQuery,
    sectionIds: selectedSections.map(s => s.id),
    sortOrder
  });

  useEffect(() => {
    if (userData && allSections)
      setUserData({ ...userData, lastSelectedJournalSectionIds: selectedSections.map(s => s.id), journalSortOrder: sortOrder });
  }, [selectedSections, sortOrder]);

  useEffect(() => {
    if (!allSections) return;

    if (searchTextQuery)
      setSelectedSections(allSections);
    else if (userData?.lastSelectedJournalSectionIds) {
      const lastSelected = allSections.filter(s => userData.lastSelectedJournalSectionIds?.includes(s.id));
      setSelectedSections(lastSelected);
    }
  }, [searchTextQuery, allSections]);

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
          Journal ({allEntries?.length || 0})
        </Typography>

        <IconButton onClick={() => setIsAddingEntry(true)}>
          <Add />
        </IconButton>

        <IconButton
          size="small"
          sx={{ ml: { xs: 0, sm: 'auto' }, mr: 2 }}
          onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? <ArrowDownward /> : <ArrowUpward />}
        </IconButton>

        <TextField
          sx={{
            minWidth: { xs: 0, sm: "35vw" },
          }}
          label="Search journal"
          placeholder="Category, section, content"
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

      <Grid
        container
        spacing={{ xs: 4, sm: 2 }}
        sx={{
          flexGrow: 1,
          height: 'calc(100% - 80px)',
          boxSizing: 'border-box',
        }}
      >
        <Grid
          size={{ xs: 12, sm: 3, lg: 2 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            pl: '32px',
            pb: { xs: 0, sm: '32px' },
            pr: { xs: '32px', sm: 0 },
            maxHeight: { xs: 'auto', sm: '100%' },
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.6, gap: 1 }}>
            <Typography variant="h6" mr={1}>
              Categories
            </Typography>
            <Checkbox
              size="small"
              sx={{ p: 0 }}
              checked={selectedSections.length === allSections?.length}
              onChange={(e) => setSelectedSections(e.target.checked && allSections ? allSections : [])}
              checkedIcon={<CheckBox htmlColor={theme.palette.text.primary} />}
            />
            <IconButton size="small" onClick={() => setIsCategoriesModalOpen(true)}>
              <CreateNewFolder />
            </IconButton>
          </Box>

          <Box sx={{
            flexGrow: 1,
            borderRadius: '8px',
            border: `solid 1px`,
            borderColor: 'grey.700',
            overflowY: 'auto',
          }}>
            {categories?.map((category) => (
              <JournalCategoryContainer
                key={category.id}
                category={category}
                searchText={searchTextQuery}
                selectedSections={selectedSections}
                setSelectedSections={setSelectedSections}
              />
            ))}
          </Box>
        </Grid>

        <Grid
          size={{ xs: 12, sm: 9, lg: 10 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pr: '32px',
            pb: '32px',
            pl: { xs: '32px', sm: 0 },
            height: { sx: 'auto', sm: '100%' },
            overflowY: 'auto',
          }}
        >
          {isAddingEntry && (
            <JournalEntryContainer
              entry={emptyEntry}
              searchText={searchTextQuery}
              isAddingEntry={isAddingEntry}
              setIsAddingEntry={setIsAddingEntry}
            />
          )}

          {journalEntries?.map(entry => (
            <JournalEntryContainer
              key={entry.id}
              entry={entry}
              searchText={searchTextQuery}
              isAddingEntry={false}
              setIsAddingEntry={setIsAddingEntry}
            />
          ))}
        </Grid>
      </Grid>

      <ManageJournalCategoriesModal
        isOpen={isCategoriesModalOpen}
        setIsOpen={setIsCategoriesModalOpen}
        setSelectedSections={setSelectedSections}
      />

    </Wrapper >
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
