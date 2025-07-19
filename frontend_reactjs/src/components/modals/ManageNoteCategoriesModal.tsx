import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import styled from "styled-components";
import { Add, Delete, Save } from "@mui/icons-material";
import { useCreateNoteCategory, useDeleteNoteCategoy, useEditNoteCategory, useNoteCategories } from "../../api";
import { Note, NoteCategory } from "../../types";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

const CategoryCard = ({
  category,
  setSelectedNote
}: {
  category: NoteCategory
  setSelectedNote: Dispatch<SetStateAction<Note | undefined>>
}) => {

  const { mutate: editCategory, isPending: editLoading } = useEditNoteCategory();
  const { mutate: deleteCategory, isPending: deletePending } = useDeleteNoteCategoy();

  const [name, setName] = useState(category.name);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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
                <IconButton
                  size="small"
                  color="success"
                  loading={editLoading}
                  onClick={() => {
                    editCategory({
                      id: category.id,
                      name: name.trim()
                    });
                  }}
                >
                  <Save />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  loading={deletePending}
                  onClick={() => setConfirmDeleteOpen(true)}
                >
                  <Delete />
                </IconButton>
              </Box>
            ),
          },
        }}
      />
      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={`category: ${category.name}`}
        deleteFn={() => {
          deleteCategory({ id: category.id });
          setSelectedNote(undefined);
        }}
      />
    </Fragment>
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

  const { data: categories } = useNoteCategories();
  const { mutate: createCategory, isPending: createLoading } = useCreateNoteCategory();

  const [newCategoryName, setNewCategoryName] = useState("")

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

            <TextField
              variant="standard"
              value={newCategoryName}
              placeholder="Add new category"
              onChange={(e) => setNewCategoryName(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <IconButton
                      size="small"
                      color="success"
                      disabled={!newCategoryName}
                      loading={createLoading}
                      onClick={() => {
                        createCategory({
                          name: newCategoryName.trim(),
                        });
                        setNewCategoryName("");
                      }}
                    >
                      <Add />
                    </IconButton>
                  ),
                },
              }}
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


