import { Box, Button, IconButton, Modal, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useContext } from "react";
import styled from "styled-components";
import { AccessTime, Add, Clear, Flag, Person, Place, Save } from "@mui/icons-material";
import { UserContext } from "../../utils";
import { useNoteCategories } from "../../api";

export const ManageNoteCategoriesModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  // const { userData } = useContext(UserContext);

  const { data: categories } = useNoteCategories({})

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <Wrapper>
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">Manage Note Categories</Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {categories?.map((category) => (
              <TextField
                variant="standard"
                value={category.name}
                onChange={(e) => {
                  // Handle category name change
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            // Handle delete category
                          }}
                        >
                          <Save color="success" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            // Handle delete category
                          }}
                        >
                          <Clear />
                        </IconButton>
                      </Box>
                    ),
                  },
                }}
              />
            ))}

            <TextField
              variant="standard"
              // value={category.name}
              placeholder="Add new category"
              onChange={(e) => {
                // Handle category name change
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          // Handle delete category
                        }}
                      >
                        <Add color="success" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          // Handle delete category
                        }}
                      >
                        <Clear />
                      </IconButton>
                    </Box>
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

const Column = styled(Box)`
  display: flex;
  flex-direction: column;
`;

