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

  const { mutate: createSection, isPending: createLoading, isSuccess: createSuccess } = useCreateJournalSection();
  const { mutate: editSection, isPending: editLoading } = useEditJournalSection();
  const { mutate: deleteSection, isPending: deleteLoading, isSuccess: deleteSuccess } = useDeleteJournalSection();

  const save = () => {
    if (!name.trim() || name.trim() === section.name) return;

    if (section.id === -1)
      createSection({
        name: name.trim(),
        categoryId: section.category.id
      });
    else
      editSection({
        id: section.id,
        name: name.trim(),
      });
  };

  useCtrlS(save);

  useEffect(() => {
    if (createSuccess)
      setName("");
  }, [createSuccess]);

  useEffect(() => {
    if (deleteSuccess)
      setSelectedSections((prev) => prev.filter((s) => s.id !== section.id));
  }, [deleteSuccess]);

  return (
    <Fragment>
      <TextField
        variant="standard"
        placeholder={section.id === -1 ? "Add New Section" : "Section Name"}
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ ml: 3, mb: section.id === -1 ? 3 : 0 }}
        slotProps={{
          input: {
            endAdornment: (
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <IconButton
                  size="small"
                  color="success"
                  loading={createLoading || editLoading}
                  onClick={save}
                  disabled={!name.trim() || name.trim() === section.name}
                >
                  {section.id === -1 ? <Add fontSize="small" /> : <Save fontSize="small" />}
                </IconButton>
                <IconButton
                  sx={{ display: section.id === -1 ? 'none' : 'block' }}
                  size="small"
                  color="error"
                  loading={deleteLoading}
                  onClick={() => setConfirmDeleteOpen(true)}
                  disabled={section._count?.entries ? section._count.entries > 0 : false}
                >
                  <Delete fontSize="small" />
                </IconButton>
                <IconButton
                  sx={{ display: section.id === -1 ? 'none' : 'block' }}
                  size="small"
                  onClick={() => editSection({ id: section.id, order: section.order - 1 })}
                  disabled={section.order === 0}
                >
                  <ExpandLess fontSize="small" />
                </IconButton>
                <IconButton
                  sx={{ display: section.id === -1 ? 'none' : 'block' }}
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

  const { mutate: createCategory, isPending: createLoading, isSuccess: createSuccess } = useCreateJournalCategory();
  const { mutate: editCategory, isPending: editLoading } = useEditJournalCategory();
  const { mutate: deleteCategory, isPending: deleteLoading } = useDeleteJournalCategory();

  const save = () => {
    if (!name.trim() || (name.trim() === category.name && color === category.color)) return;

    if (category.id === -1)
      createCategory({
        name: name.trim(),
        color
      });
    else
      editCategory({
        id: category.id,
        name: name.trim(),
        color,
      });
  };

  useCtrlS(save);

  useEffect(() => {
    if (createSuccess) {
      setName("");
      setColor("#000000");
    }
  }, [createSuccess]);

  return (
    <Fragment>
      <TextField
        variant="standard"
        placeholder={category.id === -1 ? "Add New Category" : "Category Name"}
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
                  loading={createLoading || editLoading}
                  onClick={save}
                  disabled={!name.trim() || (name.trim() === category.name && color === category.color)}
                >
                  {category.id === -1 ? <Add fontSize="small" /> : <Save fontSize="small" />}
                </IconButton>
                <IconButton
                  sx={{ display: category.id === -1 ? 'none' : 'block' }}
                  size="small"
                  color="error"
                  loading={deleteLoading}
                  onClick={() => setConfirmDeleteOpen(true)}
                  disabled={sections ? sections.length > 0 : false}
                >
                  <Delete fontSize="small" />
                </IconButton>
                <IconButton
                  sx={{ display: category.id === -1 ? 'none' : 'block' }}
                  size="small"
                  onClick={() => editCategory({ id: category.id, order: category.order - 1 })}
                  disabled={category.order === 0}
                >
                  <ExpandLess fontSize="small" />
                </IconButton>
                <IconButton
                  sx={{ display: category.id === -1 ? 'none' : 'block' }}
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
      {category.id !== -1 && (
        <SectionCard
          section={{ id: -1, name: "", category, order: sections ? sections.length : 0 }}
          setSelectedSections={setSelectedSections}
          sectionsLength={sections ? sections.length + 1 : 1}
        />
      )}
      <Box
        sx={{
          display: colorPickerOpen ? 'block' : 'none',
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          backgroundColor: '#00000055'
        }}
        onClick={() => setColorPickerOpen(false)}
      />

      <Box
        sx={{
          display: colorPickerOpen ? 'block' : 'none',
          position: "absolute",
          zIndex: 2,
          top: '25%',
          left: '25%',
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

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <Wrapper>
        <Typography variant="h6" ml={'24px'} mr={'24px'} mb={1}>
          Manage Journal Categories
        </Typography>

        <Box sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflowY: "auto",
          p: '24px',
          pt: 0,
        }}>
          {categories?.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              setSelectedSections={setSelectedSections}
              categoriesLength={categories.length}
            />
          ))}
          <CategoryCard
            category={{ id: -1, name: "", color: "#000000", order: categories ? categories.length : 0 }}
            setSelectedSections={setSelectedSections}
            categoriesLength={categories ? categories.length + 1 : 1}
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
  padding-top: 24px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  outline: none;
  height: 70vh;
  overflow-y: scroll;
`;


