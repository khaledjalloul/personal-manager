import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { Add, Delete, ExpandLess, ExpandMore, Save } from "@mui/icons-material";
import {
  useCreateJournalCategory,
  useCreateJournalSection,
  useDeleteJournalCategory,
  useDeleteJournalSection,
  useEditJournalCategory,
  useEditJournalSection,
  useJournalCategories,
  useJournalSections,
} from "../../api";
import { JournalCategory, JournalSection } from "../../types";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { useCtrlS } from "../../utils";
import { SketchPicker } from "react-color";


const SectionCard = ({
  section,
  setSelectedSections,
  sectionsLength
}: {
  section: JournalSection
  setSelectedSections: Dispatch<SetStateAction<JournalSection[]>>
  sectionsLength: number
}) => {

  const [name, setName] = useState(section.name);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { mutate: editSection, isPending: editLoading } = useEditJournalSection();
  const { mutate: deleteSection, isPending: deleteLoading, isSuccess: deleteSuccess } = useDeleteJournalSection();

  const save = () => {
    if (!name.trim() || name.trim() === section.name) return;
    editSection({
      id: section.id,
      name: name.trim(),
    });
  };

  useCtrlS(save);

  useEffect(() => {
    if (deleteSuccess)
      setSelectedSections((prev) => prev.filter((s) => s.id !== section.id));
  }, [deleteSuccess]);

  return (
    <Fragment>
      <TextField
        variant="standard"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ ml: 3 }}
        slotProps={{
          input: {
            endAdornment: (
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <IconButton
                  size="small"
                  color="success"
                  loading={editLoading}
                  onClick={save}
                  disabled={!name.trim() || name.trim() === section.name}
                >
                  <Save fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  loading={deleteLoading}
                  onClick={() => setConfirmDeleteOpen(true)}
                  disabled={section._count?.entries ? section._count.entries > 0 : false}
                >
                  <Delete fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => editSection({ id: section.id, order: section.order - 1 })}
                  disabled={section.order === 0}
                >
                  <ExpandLess fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => editSection({ id: section.id, order: section.order + 1 })}
                  disabled={section.order === sectionsLength - 1}
                >
                  <ExpandMore fontSize="small" />
                </IconButton>
              </Box>
            ),
          },
        }}
      />
      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={`section: ${section.name}`}
        deleteFn={() => {
          deleteSection({ id: section.id });
        }}
      />
    </Fragment>
  )
}

const CategoryCard = ({
  category,
  setSelectedSections,
  categoriesLength
}: {
  category: JournalCategory
  setSelectedSections: Dispatch<SetStateAction<JournalSection[]>>
  categoriesLength: number
}) => {

  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { data: sections } = useJournalSections({ categoryId: category.id, searchText: "" });

  const { mutate: createSection, isPending: createLoading, isSuccess: createSuccess } = useCreateJournalSection();
  const { mutate: editCategory, isPending: editLoading } = useEditJournalCategory();
  const { mutate: deleteCategory, isPending: deleteLoading } = useDeleteJournalCategory();

  const [newSectionName, setNewSectionName] = useState("")

  const addSection = () => {
    if (!newSectionName.trim()) return;
    createSection({ name: newSectionName.trim(), categoryId: category.id });
  }

  const save = () => {
    if (!name.trim() || (name.trim() === category.name && color === category.color)) return;
    editCategory({
      id: category.id,
      name: name.trim(),
      color,
    });
  };

  useCtrlS(save);
  useCtrlS(addSection);

  useEffect(() => {
    if (createSuccess) setNewSectionName("");
  }, [createSuccess]);

  return (
    <Fragment>
      <TextField
        variant="standard"
        value={name}
        onChange={(e) => setName(e.target.value)}
        slotProps={{
          input: {
            endAdornment: (
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: color,
                    mr: 1,
                    cursor: 'pointer',
                    border: '1px solid gray'
                  }}
                  onClick={() => setColorPickerOpen(true)}
                />
                <IconButton
                  size="small"
                  color="success"
                  loading={editLoading}
                  onClick={save}
                  disabled={!name.trim() || (name.trim() === category.name && color === category.color)}
                >
                  <Save fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  loading={deleteLoading}
                  onClick={() => setConfirmDeleteOpen(true)}
                  disabled={sections ? sections.length > 0 : false}
                >
                  <Delete fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => editCategory({ id: category.id, order: category.order - 1 })}
                  disabled={category.order === 0}
                >
                  <ExpandLess fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => editCategory({ id: category.id, order: category.order + 1 })}
                  disabled={category.order === categoriesLength - 1}
                >
                  <ExpandMore fontSize="small" />
                </IconButton>
              </Box>
            ),
          },
        }}
      />
      {sections && sections.map((section) => (
        <SectionCard
          key={section.id}
          section={section}
          setSelectedSections={setSelectedSections}
          sectionsLength={sections.length}
        />
      ))}
      <TextField
        variant="standard"
        value={newSectionName}
        placeholder="Add new section"
        onChange={(e) => setNewSectionName(e.target.value)}
        sx={{ ml: 3, mb: '24px' }}
        slotProps={{
          input: {
            endAdornment: (
              <IconButton
                size="small"
                color="success"
                disabled={!newSectionName.trim()}
                loading={createLoading}
                onClick={addSection}
              >
                <Add fontSize="small" />
              </IconButton>
            ),
          },
        }}
      />
      <Box
        sx={{
          display: colorPickerOpen ? 'block' : 'none',
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1
        }}
        onClick={() => setColorPickerOpen(false)}
      />

      <Box
        sx={{
          display: colorPickerOpen ? 'block' : 'none',
          position: "absolute",
          backgroundColor: "pink",
          zIndex: 2
        }}>
        <SketchPicker
          color={color}
          onChange={(color) => setColor(color.hex)}
        />
      </Box>
      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={`category: ${category.name}`}
        deleteFn={() => {
          deleteCategory({ id: category.id });
        }}
      />
    </Fragment>
  )
}

export const ManageJournalCategoriesModal = ({
  isOpen,
  setIsOpen,
  setSelectedSections
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedSections: Dispatch<SetStateAction<JournalSection[]>>
}) => {

  const { data: categories } = useJournalCategories({ searchText: "" });
  const { mutate: createCategory, isPending: createLoading, isSuccess: createSuccess } = useCreateJournalCategory();

  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#000000");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const add = () => {
    if (!newCategoryName.trim()) return;
    createCategory({ name: newCategoryName.trim(), color: newCategoryColor });
  }

  useCtrlS(add);

  useEffect(() => {
    if (createSuccess) {
      setNewCategoryName("");
      setNewCategoryColor("#000000");
    }
  }, [createSuccess]);

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <Wrapper>
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">Manage Journal Categories</Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {categories?.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                setSelectedSections={setSelectedSections}
                categoriesLength={categories.length}
              />
            ))}

            <TextField
              variant="standard"
              value={newCategoryName}
              placeholder="Add new category"
              onChange={(e) => setNewCategoryName(e.target.value)}
              sx={{ mb: '24px' }}
              slotProps={{
                input: {
                  endAdornment: (
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: newCategoryColor,
                          mr: 1,
                          cursor: 'pointer',
                          border: '1px solid gray'
                        }}
                        onClick={() => setColorPickerOpen(true)}
                      />
                      <IconButton
                        size="small"
                        color="success"
                        disabled={!newCategoryName.trim()}
                        loading={createLoading}
                        onClick={add}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                  ),
                },
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: colorPickerOpen ? 'block' : 'none',
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1
          }}
          onClick={() => setColorPickerOpen(false)}
        />

        <Box
          sx={{
            display: colorPickerOpen ? 'block' : 'none',
            position: "absolute",
            backgroundColor: "pink",
            zIndex: 2
          }}>
          <SketchPicker
            color={newCategoryColor}
            onChange={(color) => setNewCategoryColor(color.hex)}
          />
        </Box>
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-color: ${({ theme }) => theme.palette.background.default};
  padding: 24px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  outline: none;
  height: 70vh;
  overflow-y: scroll;
`;


