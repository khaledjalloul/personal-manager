import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { Add, Delete, Save } from "@mui/icons-material";
import { useCreateNoteCategory, useDeleteNoteCategoy, useEditNoteCategory, useNoteCategories, useNotes } from "../../api";
import { Note, NoteCategory } from "../../types";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { useCtrlS } from "../../utils";

const CategoryCard = ({
  category,
  setSelectedNote
}: {
  category: NoteCategory
  setSelectedNote: Dispatch<SetStateAction<Note | undefined>>
}) => {

  const [name, setName] = useState(category.name);

  const { data: notesInCategory } = useNotes({ searchText: "", categoryId: category.id });

  const { mutate: createCategory, isPending: createLoading, isSuccess: createSuccess } = useCreateNoteCategory();
  const { mutate: editCategory, isPending: editLoading } = useEditNoteCategory();
  const { mutate: deleteCategory, isPending: deleteLoading, isSuccess: deleteSuccess } = useDeleteNoteCategoy();

  const save = () => {
    if (!name.trim() || name.trim() === category.name) return;

    if (category.id === -1)
      createCategory({ name: name.trim() });
    else
      editCategory({
        id: category.id,
        name: name.trim()
      });
  };

  useCtrlS(save);

  useEffect(() => {
    if (createSuccess)
      setName("");
  }, [createSuccess]);

  useEffect(() => {
    if (deleteSuccess) setSelectedNote(undefined);
  }, [deleteSuccess]);

  return (
    <TextField
      variant="standard"
      placeholder={category.id === -1 ? "Add New Category" : "Category Name"}
      value={name}
      onChange={(e) => setName(e.target.value)}
      slotProps={{
        input: {
          endAdornment: (
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <IconButton
                size="small"
                color="success"
                loading={createLoading || editLoading}
                onClick={save}
                disabled={!name.trim() || name.trim() === category.name}
              >
                {category.id === -1 ? <Add fontSize="small" /> : <Save fontSize="small" />}
              </IconButton>

              <ConfirmDeleteDialog
                itemName={`category: ${category.name}`}
                deleteFn={() => deleteCategory({ id: category.id })}
              >
                <IconButton
                  sx={{ display: category.id === -1 ? 'none' : 'block' }}
                  size="small"
                  color="error"
                  loading={deleteLoading}
                  disabled={notesInCategory && notesInCategory.length > 0}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </ConfirmDeleteDialog>
            </Box>
          ),
        },
      }}
    />
  )
}

export const ManageNoteCategoriesModal = ({
  isOpen,
  setIsOpen,
  setSelectedNote
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedNote: Dispatch<SetStateAction<Note | undefined>>
}) => {

  const { data: categories } = useNoteCategories({ searchText: "" });

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <Wrapper>
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">Manage Note Categories</Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {categories?.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                setSelectedNote={setSelectedNote}
              />
            ))}

            <CategoryCard
              category={{ id: -1, name: "" }}
              setSelectedNote={setSelectedNote}
            />
          </Box>
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
`;


