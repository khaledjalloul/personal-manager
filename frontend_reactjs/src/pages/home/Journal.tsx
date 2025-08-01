import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import {
  Add,
  Clear,
  Delete,
  Edit,
  Save
} from "@mui/icons-material";
import {
  useCreateJournalCategory,
  useCreateJournalSection,
  useDeleteJournalCategory,
  useEditJournalCategory,
  useJournalCategories,
  useJournalEntries,
  useJournalSections
} from "../../api";
import { JournalCategory, JournalSection } from "../../types";
import { useCtrlS, UserContext } from "../../utils";
import { ConfirmDeleteDialog, JournalSectionContainer, SearchTextHighlight } from "../../components";

const uncategorizedCategory: JournalCategory = {
  id: -1,
  name: "Uncategorized",
};

const uncategorizedSection: JournalSection = {
  id: -1,
  name: "All Uncategorized Entries",
  category: uncategorizedCategory,
};

const CategoryBox = ({
  category,
  searchText,
  selectedCategory,
  setSelectedCategory
}: {
  category: JournalCategory;
  searchText: string;
  selectedCategory?: JournalCategory;
  setSelectedCategory: Dispatch<SetStateAction<JournalCategory | undefined>>;
}) => {
  const totalEntryCount = category.sections?.reduce((acc, section) => acc + section.entries.length, 0) || 0;

  return (
    <Box
      onClick={() => setSelectedCategory(category)}
      sx={{
        p: 1,
        pl: 1.5,
        cursor: 'pointer',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        alignItems: 'center',
        backgroundColor: selectedCategory?.id === category.id ? "primary.light" : "background.default",
        ":hover": selectedCategory?.id !== category.id ? { backgroundColor: "action.hover" } : {},
      }}
    >
      <Typography variant="body1">
        <SearchTextHighlight text={category.name} searchText={searchText.trim()} />
        {" "}({totalEntryCount})
      </Typography>
    </Box>
  );
}

export const Journal = () => {

  const { userData, setUserData } = useContext(UserContext);

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<JournalCategory>();
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>();
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { data: categories } = useJournalCategories({ searchText: searchText.trim() });
  const { data: sectionsRaw } = useJournalSections({ categoryId: selectedCategory?.id, searchText: searchText.trim() });
  const { data: uncategorizedEntries } = useJournalEntries({
    sectionId: -1,
    searchText: searchText.trim()
  });

  const sections: JournalSection[] | undefined = selectedCategory?.id === -1 ? [uncategorizedSection] : sectionsRaw;

  const { mutate: createCategory, isPending: createCategoryLoading } = useCreateJournalCategory();
  const { mutate: editCategory, isPending: editCategoryLoading, isSuccess: editCategorySuccess } = useEditJournalCategory();
  const { mutate: deleteCategory, isPending: deleteCategoryLoading, isSuccess: deleteCategorySuccess } = useDeleteJournalCategory();
  const { mutate: createSection, isPending: createSectionLoading, isSuccess: createSectionSuccess } = useCreateJournalSection();

  const saveEditCategory = () => {
    if (!selectedCategory || !isEditingCategory || !selectedCategoryName?.trim()) return;

    editCategory({
      id: selectedCategory.id,
      name: selectedCategoryName.trim()
    });
  };

  const saveCreateSection = () => {
    if (!selectedCategory || !isAddingSection || !newSectionName.trim()) return;

    createSection({
      categoryId: selectedCategory.id,
      name: newSectionName.trim()
    });
  };

  useCtrlS(() => { saveEditCategory(); saveCreateSection(); });

  useEffect(() => {
    if (editCategorySuccess) setIsEditingCategory(false);
  }, [editCategorySuccess]);

  useEffect(() => {
    if (deleteCategorySuccess) {
      setSelectedCategory(undefined);
      setIsEditingCategory(false);
    }
  }, [deleteCategorySuccess]);

  useEffect(() => {
    if (createSectionSuccess) {
      setIsAddingSection(false);
      setNewSectionName("");
    }
  }, [createSectionSuccess]);

  useEffect(() => {
    setIsAddingSection(false);
    if (selectedCategory) {
      setSelectedCategoryName(selectedCategory.name);
      if (userData)
        setUserData({ ...userData, lastOpenedJournalCategoryId: selectedCategory.id });
    } else {
      setSelectedCategoryName("");
    }
  }, [selectedCategory?.id]);

  useEffect(() => {
    if (categories) {
      const categoriesToSearch = uncategorizedEntries?.length ? [...categories, uncategorizedCategory] : categories;

      if (!searchText.trim() && userData && userData.lastOpenedJournalCategoryId) {
        const lastOpenCategory = categoriesToSearch.find(category => category.id === userData.lastOpenedJournalCategoryId);
        if (lastOpenCategory)
          setSelectedCategory(lastOpenCategory);
      } else if (searchText.trim()) {
        if (categoriesToSearch.length > 0) setSelectedCategory(categoriesToSearch[0]);
        else setSelectedCategory(undefined);
      }
    }
  }, [JSON.stringify(categories), JSON.stringify(uncategorizedEntries), searchText]);

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
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.6 }}>
            <Typography variant="h6" mr={1}>
              Categories
            </Typography>
            <IconButton
              size="small"
              loading={createCategoryLoading}
              onClick={() => createCategory({ name: "New Category" })}>
              <Add />
            </IconButton>
          </Box>

          <Box sx={{
            flexGrow: 1,
            borderRadius: '8px',
            border: `solid 1px`,
            borderColor: 'grey.700',
            overflowY: 'auto',
          }}>
            {uncategorizedEntries?.length ? (
              <CategoryBox
                key={-1}
                category={{
                  ...uncategorizedCategory,
                  sections: [{ entries: uncategorizedEntries }]
                }}
                searchText={searchText}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            ) : null}
            {categories?.map((category) => (
              <CategoryBox
                key={category.id}
                category={category}
                searchText={searchText}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
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
          {!isEditingCategory ? (
            <Box
              sx={{ display: 'flex', alignItems: 'center' }}
              onDoubleClick={selectedCategory && selectedCategory.id !== -1 ? () => setIsEditingCategory(true) : undefined}
            >
              <Typography variant="h6">
                {selectedCategoryName ?
                  <SearchTextHighlight text={selectedCategoryName} searchText={searchText.trim()} />
                  : "Select a category"
                }
              </Typography>

              {selectedCategory && selectedCategory.id !== -1 && (
                <IconButton
                  sx={{ ml: 2 }}
                  onClick={() => setIsEditingCategory(true)}
                >
                  <Edit />
                </IconButton>
              )}

              {selectedCategory && selectedCategory.id !== -1 && (
                <IconButton
                  onClick={() => setIsAddingSection(true)}
                >
                  <Add />
                </IconButton>
              )}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="Category Name"
                variant="standard"
                value={selectedCategoryName || ""}
                onChange={(e) => setSelectedCategoryName(e.target.value)} />

              <IconButton
                sx={{ ml: 1 }}
                color="success"
                loading={editCategoryLoading}
                disabled={!selectedCategoryName?.trim()}
                onClick={saveEditCategory}
              >
                <Save />
              </IconButton>

              <IconButton
                color="error"
                loading={deleteCategoryLoading}
                onClick={() => {
                  if (selectedCategory)
                    setConfirmDeleteOpen(true);
                }}
              >
                <Delete />
              </IconButton>

              <IconButton
                onClick={() => {
                  setSelectedCategoryName(selectedCategory?.name);
                  setIsEditingCategory(false);
                }}
              >
                <Clear />
              </IconButton>
            </Box>
          )}

          {isAddingSection && selectedCategory && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="New Section Name"
                variant="standard"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
              />
              <IconButton
                sx={{ ml: 1 }}
                color="success"
                loading={createSectionLoading}
                disabled={!newSectionName.trim()}
                onClick={saveCreateSection}
              >
                <Save fontSize="small" />
              </IconButton>

              <IconButton
                onClick={() => {
                  setIsAddingSection(false);
                  setNewSectionName("");
                }}
              >
                <Clear fontSize="small" />
              </IconButton>
            </Box>
          )}

          {sections?.map((section) => (
            <JournalSectionContainer
              key={section.id}
              section={section}
              searchText={searchText}
            />
          ))}
        </Grid>
      </Grid>

      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={`journal category: ${selectedCategory?.name}`}
        deleteFn={() => {
          if (selectedCategory)
            deleteCategory({ id: selectedCategory.id });
        }}
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
