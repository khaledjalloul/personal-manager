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
import { Dispatch, SetStateAction, useState } from "react";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


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
  const [monthLearned, setMonthLearned] = useState(pianoPiece.monthLearned ? dayjs(pianoPiece.monthLearned) : undefined);
  const [youtubeUrl, setYoutubeUrl] = useState(pianoPiece.youtubeUrl);
  const [sheetMusicUrl, setSheetMusicUrl] = useState(pianoPiece.sheetMusicUrl);

  return (
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
        {!isEditing ? status :
          <Select
            variant="standard"
            value={status}
            sx={{ width: '100%' }}
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
        {!isEditing ? (monthLearned ? monthLearned.format("MMMM YYYY") : "") :
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Month"
              views={["year", "month"]}
              openTo="month"
              value={monthLearned}
              onChange={(newValue) => setMonthLearned(newValue ?? dayjs(new Date()))}
              enableAccessibleFieldDOMStructure={false}
              slots={{
                textField: props => <TextField {...props} size="small"
                  value={monthLearned ? monthLearned.format('MMMM YYYY') : ''}
                />
              }}
            />
          </LocalizationProvider>
        }
      </TableCell>

      {!isEditing ? (
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small">
              <YouTube sx={{ color: "#F00" }} />
            </IconButton>

            <IconButton size="small">
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

            <IconButton size="small">
              <Delete color="error" />
            </IconButton>
          </Box>
        </TableCell>
      ) : (
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small">
              <Save color="success" />
            </IconButton>

            <IconButton size="small" onClick={() => {
              if (!isAddingPiece) {
                setName(pianoPiece.name);
                setOrigin(pianoPiece.origin);
                setComposer(pianoPiece.composer);
                setStatus(pianoPiece.status);
                setMonthLearned(pianoPiece.monthLearned ? dayjs(pianoPiece.monthLearned) : undefined);
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
  )
}
