import {
  Box,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import styled from "styled-components";
import { useContext, useEffect, useMemo, useState } from "react";
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
  const [groupBySection, setGroupBySection] = useState(userData?.journalGroupBySection || false);
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

  const journalEntriesGroupped = useMemo(() => {
    if (!groupBySection || !allSections) return { "": journalEntries || [] };

    // Create a separate map from allSections to update the grouped section names in case they are changed
    const sectionNameMap = new Map(allSections.map(s => [s.id, `${s.category.name}: ${s.name}`]));
    const grouped: Record<string, JournalEntry[]> = {};

    // Initialize grouped object in the same order of allSections
    allSections.forEach(section => {
      if (!selectedSections.some(s => s.id === section.id)) return;
      const sectionName = sectionNameMap.get(section.id) || section.name;
      grouped[sectionName] = [];
    });

    journalEntries?.forEach(entry => {
      entry.sections.forEach(section => {
        const sectionName = sectionNameMap.get(section.id) || section.name;
        if (grouped[sectionName])
          grouped[sectionName].push(entry);
      });
    });

    return grouped;

  }, [journalEntries, groupBySection, allSections]);

  useEffect(() => {
    if (userData && allSections)
      setUserData({
        ...userData,
        journalLastSelectedSectionIds: selectedSections.map(s => s.id),
        journalSortOrder: sortOrder,
        journalGroupBySection: groupBySection,
      });
  }, [selectedSections, sortOrder, groupBySection]);

  useEffect(() => {
    if (!allSections) return;

    if (searchTextQuery)
      setSelectedSections(allSections);
    else if (userData?.journalLastSelectedSectionIds) {
      const lastSelected = allSections.filter(s => userData.journalLastSelectedSectionIds?.includes(s.id));
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: { xs: 0, sm: 'auto' } }}>
          <Typography>Group by Section</Typography>
          <Switch
            checked={groupBySection}
            onChange={(e) => setGroupBySection(e.target.checked)}
          />
        </Box>

        <IconButton
          size="small"
          sx={{ mr: 2 }}
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

          {groupBySection && Object.entries(journalEntriesGroupped).map(([sectionName, entries], index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" sx={{ mt: 2 }}>{sectionName}</Typography>
              {entries.map(entry => (
                <JournalEntryContainer
                  key={entry.id}
                  entry={entry}
                  searchText={searchTextQuery}
                  isAddingEntry={false}
                  setIsAddingEntry={setIsAddingEntry}
                />
              ))}
            </Box>
          ))}

          {!groupBySection && journalEntries?.map(entry => (
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
