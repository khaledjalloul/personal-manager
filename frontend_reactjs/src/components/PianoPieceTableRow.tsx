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
import { Clear, Delete, Edit, PictureAsPdf, Save, Star, StarOutlineOutlined, YouTube } from "@mui/icons-material";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCreatePianoPiece, useDeletePianoPiece, useEditPianoPiece } from "../api";
import { ConfirmDeleteDialog } from "./modals";
import { useCtrlS } from "../utils";
import { SearchTextHighlight } from "./SearchTextHighlight";

const pianoPieceStatusOptions = {
  [PianoPieceStatus.Planned]: "Planned",
  [PianoPieceStatus.Learning]: "Learning",
  [PianoPieceStatus.Learned]: "Learned",
  [PianoPieceStatus.Learned_Forgotten]: "Learned (Forgotten)",
}

export const PianoPieceTableRow = ({
  pianoPiece,
  index,
  searchText,
  isAddingPiece,
  setIsAddingPiece
}: {
  pianoPiece: PianoPiece;
  index: number;
  searchText: string;
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

  const { mutate: createPiece, isPending: createLoading, isSuccess: createSuccess } = useCreatePianoPiece();
  const { mutate: editPiece, isPending: editLoading, isSuccess: editSuccess } = useEditPianoPiece();
  const { mutate: deletePiece, isPending: deleteLoading } = useDeletePianoPiece();

  const save = () => {
    if (!isEditing || !name.trim()) return;
    if (!isAddingPiece)
      editPiece({
        id: pianoPiece.id,
        name: name.trim(),
        origin: origin.trim(),
        composer: composer.trim(),
        status,
        monthLearned: monthLearned ? monthLearned.toDate() : null,
        youtubeUrl: youtubeUrl.trim(),
        sheetMusicUrl: sheetMusicUrl.trim()
      });
    else
      createPiece({
        name: name.trim(),
        origin: origin.trim(),
        composer: composer.trim(),
        status,
        monthLearned: monthLearned ? monthLearned.toDate() : null,
        youtubeUrl: youtubeUrl.trim(),
        sheetMusicUrl: sheetMusicUrl.trim(),
        isFavorite: false,
      });
  };

  useCtrlS(save);

  useEffect(() => {
    if (createSuccess) setIsAddingPiece(false);
  }, [createSuccess]);

  useEffect(() => {
    if (editSuccess) setIsEditing(false);
  }, [editSuccess]);

  return (
    <Fragment>

      <TableRow
        sx={{
          backgroundColor: index % 2 === 0 ? "background.default" : "primary.light",
          ":hover": { backgroundColor: "action.hover" }
        }}
        onDoubleClick={() => setIsEditing(true)}
      >

        <TableCell sx={{ width: 3 }}>
          {!isEditing && <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" onClick={() => {
              editPiece({
                id: pianoPiece.id,
                isFavorite: !pianoPiece.isFavorite,
              });
            }}>
              {pianoPiece.isFavorite ? <Star fontSize="small" sx={{ color: 'yellow' }} /> : <StarOutlineOutlined fontSize="small" />}
            </IconButton>
          </Box>}
        </TableCell>

        <TableCell sx={{ fontWeight: 'bold' }}>
          {!isEditing ? <SearchTextHighlight text={name} searchText={searchText.trim()} /> :
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
          {!isEditing ? <SearchTextHighlight text={origin} searchText={searchText.trim()} /> :
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
          {!isEditing ? <SearchTextHighlight text={composer} searchText={searchText.trim()} /> :
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
                  onChange={(newValue) => setMonthLearned(newValue ?? dayjs())}
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
                <Clear fontSize="small" />
              </IconButton>
            </Box>
          }
        </TableCell>

        {!isEditing ? (
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                size="small"
                disabled={!youtubeUrl.trim()}
                onClick={() => window.open(pianoPiece.youtubeUrl, "_blank")}
              >
                <YouTube sx={{ color: youtubeUrl.trim() ? "#F00" : "" }} fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                disabled={!sheetMusicUrl.trim()}
                onClick={() => window.open(pianoPiece.sheetMusicUrl, "_blank")
                }>
                <PictureAsPdf fontSize="small" />
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
                <Edit fontSize="small" />
              </IconButton>

            </Box>
          </TableCell>
        ) : (
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="success"
                size="small"
                loading={createLoading || editLoading}
                disabled={!name.trim()}
                onClick={save}
              >
                <Save fontSize="small" />
              </IconButton>

              {!isAddingPiece && (
                <IconButton
                  size="small"
                  color="error"
                  loading={deleteLoading}
                  onClick={() => setConfirmDeleteOpen(true)}
                >
                  <Delete fontSize="small" />
                </IconButton>)}

              <IconButton size="small" onClick={() => {
                if (!isAddingPiece) {
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
                <Clear fontSize="small" />
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
    </Fragment >
  )
}
