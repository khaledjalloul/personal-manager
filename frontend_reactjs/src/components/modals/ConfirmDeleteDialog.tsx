import { Box, Button, Modal, Typography } from "@mui/material";
import React, { Fragment, useContext, useState } from "react";
import styled from "styled-components";
import { ThemeContext } from "../../utils";

export const ConfirmDeleteDialog = ({
  itemName,
  deleteFn,
  children
}: {
  itemName: string;
  deleteFn: () => void;
  children: React.ReactElement;
}) => {

  const { themeData } = useContext(ThemeContext);

  const [isOpen, setIsOpen] = useState(false);

  const ChildButton = React.cloneElement(children, {
    onClick: () => setIsOpen(true)
  });

  return (
    <Fragment>
      {ChildButton}
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Wrapper>
          <Typography variant="h6">Confirm Delete</Typography>
          <Typography>Are you sure you want to delete {itemName}?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
            <Button onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={themeData.darkMode ? "outlined" : "contained"}
              color="error"
              onClick={() => { deleteFn(); setIsOpen(false); }}
            >
              Delete
            </Button>
          </Box>
        </Wrapper>
      </Modal>
    </Fragment>
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
  flex-direction: column;
  gap: 8px;
  outline: none;
`;
