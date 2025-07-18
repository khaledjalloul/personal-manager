import {
  Box,
  IconButton,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { PianoPiece, PianoPieceStatus } from "../types";
import { Clear, Delete, Edit, PictureAsPdf, Save, YouTube } from "@mui/icons-material";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCreatePianoPiece, useDeletePianoPiece, useEditPianoPiece } from "../api";
import { ConfirmDeleteDialog } from "./modals";

const pianoPieceStatusOptions = {
  [PianoPieceStatus.Planned]: "Planned",
  [PianoPieceStatus.Learning]: "Learning",
  [PianoPieceStatus.Learned]: "Learned",
  [PianoPieceStatus.Learned_Forgotten]: "Learned (Forgotten)",
}

export const PianoPieceTableRow = ({
  pianoPiece,
  index,
  isAddingPiece,
  setIsAddingPiece
}: {
  pianoPiece: PianoPiece;
  index: number;
  isAddingPiece: boolean;
  setIsAddingPiece: Dispatch<SetStateAction<boolean>>;
}) => {

  const [isEditing, setIsEditing] = useState(isAddingPiece);
  const [name, setName] = useState(pianoPiece.name);
  const [origin, setOrigin] = useState(pianoPiece.origin);
  const [composer, setComposer] = useState(pianoPiece.composer);
  const [status, setStatus] = useState(pianoPiece.status);
  const [monthLearned, setMonthLearned] = useState(pianoPiece.monthLearned && dayjs(pianoPiece.monthLearned));
  const [youtubeUrl, setYoutubeUrl] = useState(pianoPiece.youtubeUrl);
  const [sheetMusicUrl, setSheetMusicUrl] = useState(pianoPiece.sheetMusicUrl);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { mutate: createPiece } = useCreatePianoPiece();
  const { mutate: editPiece } = useEditPianoPiece();
  const { mutate: deletePiece } = useDeletePianoPiece();

  return (
    <Fragment>

      <TableRow
        sx={{
          backgroundColor: index % 2 === 0 ? "white" : "secondary.main",
          ":hover": { backgroundColor: "secondary.dark" }
        }}
      >
        <TableCell sx={{ fontWeight: 'bold' }}>
          {!isEditing ? name :
            <TextField
              variant="standard"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ width: "100%" }}
            />
          }
        </TableCell>

        <TableCell>
          {!isEditing ? origin :
            <TextField
              variant="standard"
              placeholder="Origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              sx={{ width: "100%" }}
            />
          }
        </TableCell>

        <TableCell>
          {!isEditing ? composer :
            <TextField
              variant="standard"
              placeholder="Composer"
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
            />
          }
        </TableCell>

        <TableCell>
          {!isEditing ? pianoPieceStatusOptions[status] :
            <Select
              variant="standard"
              value={status}
              sx={{ width: '100%' }}
              onChange={(e) => setStatus(e.target.value as PianoPieceStatus)}
            >
              <MenuItem value={PianoPieceStatus.Planned}>{pianoPieceStatusOptions[PianoPieceStatus.Planned]}</MenuItem>
              <MenuItem value={PianoPieceStatus.Learning}>{pianoPieceStatusOptions[PianoPieceStatus.Learning]}</MenuItem>
              <MenuItem value={PianoPieceStatus.Learned}>{pianoPieceStatusOptions[PianoPieceStatus.Learned]}</MenuItem>
              <MenuItem value={PianoPieceStatus.Learned_Forgotten}>{pianoPieceStatusOptions[PianoPieceStatus.Learned_Forgotten]}</MenuItem>
            </Select>
          }
        </TableCell>

        <TableCell>
          {!isEditing ? (monthLearned ? monthLearned.format("MMMM YYYY") : "") :
            <Box sx={{ display: 'flex', alignItems: 'center', }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year", "month"]}
                  openTo="month"
                  value={monthLearned ?? null}
                  onChange={(newValue) => setMonthLearned(newValue ?? dayjs(new Date()))}
                  enableAccessibleFieldDOMStructure={false}
                  format="MMMM YYYY"
                  slotProps={{
                    textField: {
                      size: "small",
                      variant: "standard",
                      placeholder: "Month Learned",
                    }
                  }}
                />
              </LocalizationProvider>
              <IconButton size="small" onClick={() => setMonthLearned(undefined)}>
                <Clear />
              </IconButton>
            </Box>
          }
        </TableCell>

        {!isEditing ? (
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton size="small" onClick={() => {
                if (pianoPiece.youtubeUrl) {
                  window.open(pianoPiece.youtubeUrl, "_blank");
                }
              }}
              >
                <YouTube sx={{ color: "#F00" }} />
              </IconButton>

              <IconButton size="small" onClick={() => {
                if (pianoPiece.sheetMusicUrl) {
                  window.open(pianoPiece.sheetMusicUrl, "_blank");
                }
              }
              }>
                <PictureAsPdf />
              </IconButton>
            </Box>
          </TableCell>
        ) : (
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                variant="standard"
                placeholder="YouTube URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />

              <TextField
                variant="standard"
                placeholder="Sheet Music URL"
                value={sheetMusicUrl}
                onChange={(e) => setSheetMusicUrl(e.target.value)}
              />
            </Box>
          </TableCell>
        )}

        {!isEditing ? (
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton size="small" onClick={() => setIsEditing(true)}>
                <Edit />
              </IconButton>

              <IconButton
                size="small"
                color="error"
                onClick={() => setConfirmDeleteOpen(true)}
              >
                <Delete />
              </IconButton>
            </Box>
          </TableCell>
        ) : (
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="success"
                size="small"
                onClick={() => {
                  if (pianoPiece.id !== -1) {
                    editPiece({
                      id: pianoPiece.id,
                      name,
                      origin,
                      composer,
                      status,
                      monthLearned: monthLearned && monthLearned.toDate(),
                      youtubeUrl,
                      sheetMusicUrl
                    });
                    setIsEditing(false);
                  } else {
                    createPiece({
                      name,
                      origin,
                      composer,
                      status,
                      monthLearned: monthLearned && monthLearned.toDate(),
                      youtubeUrl,
                      sheetMusicUrl
                    });
                    setIsAddingPiece(false);
                  }
                }}
              >
                <Save />
              </IconButton>

              <IconButton size="small" onClick={() => {
                if (pianoPiece.id !== -1) {
                  setName(pianoPiece.name);
                  setOrigin(pianoPiece.origin);
                  setComposer(pianoPiece.composer);
                  setStatus(pianoPiece.status);
                  setMonthLearned(pianoPiece.monthLearned && dayjs(pianoPiece.monthLearned));
                  setYoutubeUrl(pianoPiece.youtubeUrl);
                  setSheetMusicUrl(pianoPiece.sheetMusicUrl);
                  setIsEditing(false);
                } else {
                  setIsAddingPiece(false);
                }
              }}>
                <Clear />
              </IconButton>
            </Box>
          </TableCell>
        )}
      </TableRow>
      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={`piano piece: ${name}`}
        deleteFn={() => deletePiece({ id: pianoPiece.id })}
      />
    </Fragment>
  )
}
