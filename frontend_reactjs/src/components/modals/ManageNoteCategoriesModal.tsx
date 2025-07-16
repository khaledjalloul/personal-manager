import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { Add, Delete, Save } from "@mui/icons-material";
import { useCreateNoteCategory, useDeleteNoteCategoy, useEditNoteCategory, useNoteCategories } from "../../api";
import { NoteCategory } from "../../types";

const CategoryCard = ({
  category
}: {
  category: NoteCategory
}) => {

  const [name, setName] = useState(category.name);

  const { mutate: editCategory } = useEditNoteCategory();
  const { mutate: deleteCategory } = useDeleteNoteCategoy();

  return (
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
                onClick={() => {
                  editCategory({
                    id: category.id,
                    name
                  });
                }}
              >
                <Save />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  deleteCategory({ id: category.id });
                }}
              >
                <Delete />
              </IconButton>
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
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {

  const { data: categories } = useNoteCategories({});
  const { mutate: createCategory } = useCreateNoteCategory();

  const [newCategoryName, setNewCategoryName] = useState("")

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <Wrapper>
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">Manage Note Categories</Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
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
                      onClick={() => {
                        createCategory({
                          name: newCategoryName,
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


