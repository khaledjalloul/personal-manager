import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { Expense, PianoPiece, PianoPieceStatus } from "../types";
import { Clear, Delete, Edit, PictureAsPdf, Save, YouTube } from "@mui/icons-material";
import { useState } from "react";
import { useExpenseCategories } from "../api";


export const PianoPieceTableRow = ({ pianoPiece, index, editable = false }: {
  pianoPiece: PianoPiece;
  index: number;
  editable?: boolean;
}) => {

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(pianoPiece.name);
  const [origin, setOrigin] = useState(pianoPiece.origin);
  const [composer, setComposer] = useState(pianoPiece.composer);
  const [status, setStatus] = useState(pianoPiece.status);
  const [monthLearned, setMonthLearned] = useState(pianoPiece.monthLearned);

  return (
    <TableRow
      sx={{
        backgroundColor: index % 2 === 0 ? "white" : "secondary.main",
        ":hover": editable ? { backgroundColor: "secondary.dark" } : {}
      }}

    >

      <TableCell>
        {!isEditing ? pianoPiece.name :
          <TextField
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ width: "100%" }}
          />
        }
      </TableCell>

      <TableCell width={"40%"}>
        {!isEditing ? pianoPiece.origin :
          <TextField
            variant="standard"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            sx={{ width: "100%" }}
          />
        }
      </TableCell>

      <TableCell>
        {!isEditing ? pianoPiece.composer :
          <TextField
            variant="standard"
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
          />
        }
      </TableCell>

      <TableCell>
        {!isEditing ? pianoPiece.status :
          <Select
            variant="standard"
            value={status}

            onChange={(e) => setStatus(e.target.value as PianoPieceStatus)}
          >
            <MenuItem value={PianoPieceStatus.PLANNED}>Planned</MenuItem>
            <MenuItem value={PianoPieceStatus.LEARNING}>Learning</MenuItem>
            <MenuItem value={PianoPieceStatus.LEARNED}>Learned</MenuItem>
            <MenuItem value={PianoPieceStatus.LEARNED_FORGOTTEN}>Learned (Forgotten)</MenuItem>
          </Select>
        }
      </TableCell>

      <TableCell>
        {!isEditing ? pianoPiece.monthLearned.toLocaleDateString() :
          <TextField
            variant="standard"
            value={monthLearned.toLocaleDateString("en-US")}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              setMonthLearned(isNaN(newDate.getTime()) ? monthLearned : newDate);
            }}
          />
        }
      </TableCell>

      {!isEditing ? (
        <TableCell sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small">
            <YouTube />
          </IconButton>

          <IconButton size="small">
            <PictureAsPdf />
          </IconButton>
        </TableCell>
      ) : (
        <TableCell sx={{ display: 'flex', gap: 1 }}>
          <TextField
            variant="standard"
            value={monthLearned.toLocaleDateString("en-US")}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              setMonthLearned(isNaN(newDate.getTime()) ? monthLearned : newDate);
            }}
          />

          <TextField
            variant="standard"
            value={monthLearned.toLocaleDateString("en-US")}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              setMonthLearned(isNaN(newDate.getTime()) ? monthLearned : newDate);
            }}
          />
        </TableCell>
      )}

      {editable && (
        !isEditing ? (
          <TableCell sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>

            <IconButton size="small">
              <Delete color="error" />
            </IconButton>
          </TableCell>
        ) : (
          <TableCell sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small">
              <Save color="success" />
            </IconButton>

            <IconButton size="small" onClick={() => {
              setName(pianoPiece.name);
              setOrigin(pianoPiece.origin);
              setComposer(pianoPiece.composer);
              setStatus(pianoPiece.status);
              setMonthLearned(pianoPiece.monthLearned);
              setIsEditing(false)
            }}>
              <Clear />
            </IconButton>
          </TableCell>
        )
      )}
    </TableRow>
  )

}

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  gap: 16px;
`;