import { Clear, Edit, Save } from "@mui/icons-material";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useEditUser } from "../api";
import { useCtrlS } from "../utils";

export const ExpensesStatisticsCard = ({
  title,
  value,
  color,
  isWallet = false
}: {
  title: string,
  value?: number,
  color: string,
  isWallet?: boolean
}) => {

  const [isEditing, setIsEditing] = useState(false);
  const [wallet, setWallet] = useState(value);

  const { mutate: editUser, isPending: editUserLoading, isSuccess: editUserSuccess } = useEditUser();

  const save = () => {
    if (!isWallet || !wallet || isNaN(wallet) || wallet < 0) return;
    editUser({ wallet });
  }

  useCtrlS(save);

  useEffect(() => {
    if (editUserSuccess)
      setIsEditing(false);
  }, [editUserSuccess]);

  return (
    <Wrapper sx={{ backgroundColor: color }}>
      <Typography variant="h6" color="white">
        {title}
      </Typography>

      {!isEditing ? (
        <Typography variant="h3" color="white" sx={{ fontSize: { xs: 40, sm: 48 } }}>
          {value?.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) || "0.00"} CHF
        </Typography>
      ) : (
        <TextField
          variant="standard"
          value={wallet}
          onChange={(e) => setWallet(parseFloat(e.target.value))}
          type="number"
        />
      )}

      {isWallet && (
        !isEditing ? (
          <IconButton
            sx={{ position: 'absolute', top: 16, right: 16 }}
            onClick={() => setIsEditing(true)}
          >
            <Edit fontSize="small" />
          </IconButton>
        ) : (
          <Box
            sx={{ position: 'absolute', top: 16, right: 16 }}
          >
            <IconButton
              loading={editUserLoading}
              disabled={!wallet || isNaN(wallet) || wallet < 0}
              onClick={save}
            >
              <Save color="success" fontSize="small" />
            </IconButton>

            <IconButton onClick={() => {
              setWallet(value);
              setIsEditing(false);
            }}>
              <Clear fontSize="small" />
            </IconButton>
          </Box>
        )
      )}
    </Wrapper>
  )
};

const Wrapper = styled(Box)`
  border-radius: 8px;
  padding: 32px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
`; 