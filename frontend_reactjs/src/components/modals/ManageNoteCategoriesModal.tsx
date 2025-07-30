import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { Add, Delete, Save } from "@mui/icons-material";
import { useCreateNoteCategory, useDeleteNoteCategoy, useEditNoteCategory, useNoteCategories } from "../../api";
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
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { mutate: editCategory, isPending: editLoading } = useEditNoteCategory();
  const { mutate: deleteCategory, isPending: deletePending, isSuccess: deleteSuccess } = useDeleteNoteCategoy();

  const save = () => {
    editCategory({
      id: category.id,
      name: name.trim()
    });
  };

  useCtrlS(save);

  useEffect(() => {
    if (deleteSuccess) setSelectedNote(undefined);
  }, [deleteSuccess]);

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
                  onClick={save}
                >
                  <Save fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  loading={deletePending}
                  onClick={() => setConfirmDeleteOpen(true)}
                >
                  <Delete fontSize="small" />
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

  const { data: categories } = useNoteCategories({ searchText: "" });
  const { mutate: createCategory, isPending: createLoading, isSuccess: createSuccess } = useCreateNoteCategory();

  const [newCategoryName, setNewCategoryName] = useState("")

  const add = () => {
    if (!newCategoryName.trim()) return;
    createCategory({ name: newCategoryName.trim() });
  }

  useCtrlS(add);

  useEffect(() => {
    if (createSuccess) setNewCategoryName("");
  }, [createSuccess]);

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
                      disabled={!newCategoryName.trim()}
                      loading={createLoading}
                      onClick={add}
                    >
                      <Add fontSize="small" />
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


