import {
  IconButton,
  InputAdornment,
  TableCell,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Run } from "../types";
import { Clear, Delete, Edit, Link, Save, Upload } from "@mui/icons-material";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useCreateRun, useDeleteRun, useEditRun, useUploadRunFitFile } from "../api";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ConfirmDeleteDialog } from "./modals";
import { useCtrlS } from "../utils";
import { SearchTextHighlight } from "./SearchTextHighlight";
import { useNavigate } from "react-router-dom";
import styled, { DefaultTheme, keyframes } from "styled-components";

export const RunningTableRow = ({
  run,
  index,
  searchText,
  highlightedId,
  isAddingRun,
  setIsAddingRun,
}: {
  run: Run;
  index: number;
  searchText: string;
  highlightedId?: number;
  isAddingRun?: boolean;
  setIsAddingRun?: Dispatch<SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(isAddingRun ?? false);
  const [date, setDate] = useState(dayjs(run.date));
  const [description, setDescription] = useState(run.description);
  const [distance, setDistance] = useState(run.distance);
  const [duration, setDuration] = useState(run.duration);
  const [elevationGain, setElevationGain] = useState(run.elevationGain);
  const [stravaUrl, setStravaUrl] = useState(run.stravaUrl);

  const pace = distance > 0 ? duration / distance : 0;

  const { mutate: createRun, isPending: createLoading, isSuccess: createSuccess } = useCreateRun();
  const { mutate: editRun, isPending: editLoading, isSuccess: editSuccess } = useEditRun();
  const { mutate: uploadFitFile, data: uploadFitFileData, isPending: uploadFitFileLoading, isSuccess: uploadFitFileSuccess } = useUploadRunFitFile();
  const { mutate: deleteRun, isPending: deleteLoading } = useDeleteRun();

  const save = () => {
    if (!isEditing) return;
    if (!isAddingRun)
      editRun({
        id: run.id,
        date: date.toDate(),
        description: description.trim(),
        distance,
        duration,
        elevationGain,
        stravaUrl: stravaUrl.trim(),
      });
    else if (setIsAddingRun)
      createRun({
        date: date.toDate(),
        description: description.trim(),
        distance,
        duration,
        elevationGain,
        stravaUrl: stravaUrl.trim(),
      });
  };

  useCtrlS(save);

  const runRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    if (highlightedId === run.id)
      runRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightedId]);

  useEffect(() => {
    if (createSuccess && setIsAddingRun) setIsAddingRun(false);
  }, [createSuccess]);

  useEffect(() => {
    if (editSuccess) setIsEditing(false);
  }, [editSuccess]);

  useEffect(() => {
    if (uploadFitFileSuccess && uploadFitFileData) {
      setDate(dayjs(uploadFitFileData.date));
      setDistance(uploadFitFileData.distance);
      setDuration(uploadFitFileData.duration);
      setElevationGain(uploadFitFileData.elevationGain);
    }
  }, [uploadFitFileSuccess, uploadFitFileData]);

  return (
    <TableRowWithHighlight
      isHighlighted={highlightedId === run.id}
      index={index}
      ref={runRef}
      onDoubleClick={() => setIsEditing(true)}
    >
      <TableCell>
        {!isEditing ?
          <Typography
            variant="body2"
            sx={{ width: 'fit-content', cursor: 'pointer', ":hover": { textDecoration: 'underline' } }}
            onClick={() => navigate("/calendar", { state: { routedDate: run.date } })}>
            {date.format("DD.MM.YYYY hh:mm A")}
          </Typography>
          :
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={date}
              onChange={(newValue) => setDate(newValue ?? dayjs())}
              enableAccessibleFieldDOMStructure={false}
              format="DD.MM.YYYY hh:mm A"
              slotProps={{
                textField: {
                  size: "small",
                  variant: "standard",
                  placeholder: "Date",
                }
              }}
              sx={{ minWidth: 100 }}
            />
          </LocalizationProvider>
        }
      </TableCell>

      <TableCell>
        {!isEditing ?
          <SearchTextHighlight text={description} searchText={searchText.trim()} />
          :
          <TextField
            variant="standard"
            placeholder="Description"
            value={description}
            sx={{ width: "100%" }}
            onChange={(e) => setDescription(e.target.value)}
          />
        }
      </TableCell>

      <TableCell>
        {!isEditing ? `${distance.toFixed(2)} km` :
          <TextField
            variant="standard"
            placeholder="Distance"
            value={distance}
            onChange={(e) => {
              const newDistance = parseFloat(e.target.value);
              setDistance(isNaN(newDistance) ? 0 : newDistance);
            }}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">km</InputAdornment>,
              }
            }}
          />
        }
      </TableCell>

      <TableCell>
        {!isEditing ? `${Math.floor(duration / 60).toString().padStart(2, '0')}:${(duration % 60).toFixed(0).padStart(2, '0')}` :
          <TextField
            variant="standard"
            placeholder="Duration"
            value={duration}
            onChange={(e) => {
              const newDuration = parseFloat(e.target.value);
              setDuration(isNaN(newDuration) ? 0 : newDuration);
            }}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">sec ({Math.floor(duration / 60).toString().padStart(2, '0')}:{(duration % 60).toFixed(0).padStart(2, '0')})</InputAdornment>,
              }
            }}
          />
        }
      </TableCell>

      <TableCell sx={{ textWrap: "nowrap" }}>
        {Math.floor(pace / 60).toString().padStart(2, '0')}:{(pace % 60).toFixed(0).padStart(2, '0')} / km
      </TableCell>

      <TableCell>
        {!isEditing ? `${elevationGain.toFixed(0)} m` :
          <TextField
            variant="standard"
            placeholder="Elevation Gain"
            value={elevationGain}
            onChange={(e) => {
              const newElevationGain = parseFloat(e.target.value);
              setElevationGain(isNaN(newElevationGain) ? 0 : newElevationGain);
            }}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">m</InputAdornment>,
              }
            }}
          />
        }
      </TableCell>

      <TableCell>
        {!isEditing ?
          <IconButton
            size="small"
            disabled={!stravaUrl.trim()}
            onClick={() => window.open(run.stravaUrl, "_blank")}
          >
            <Link fontSize="small" />
          </IconButton>
          :
          <TextField
            variant="standard"
            placeholder="Strava URL"
            value={stravaUrl}
            sx={{ width: "100%" }}
            onChange={(e) => setStravaUrl(e.target.value)}
          />
        }
      </TableCell>

      {!isEditing ? (
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setIsEditing(true)}
          >
            <Edit fontSize="small" />
          </IconButton>
        </TableCell>
      ) : (
        <TableCell sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            color="success"
            loading={createLoading || editLoading}
            onClick={save}>
            <Save fontSize="small" />
          </IconButton>

          <input
            type="file"
            accept=".fit"
            style={{ display: "none" }}
            id="fit-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const formData = new FormData();
              formData.append('file', file);
              uploadFitFile({ formData });
            }}
          />
          <label htmlFor="fit-upload">
            <IconButton
              size="small"
              loading={uploadFitFileLoading}
              onClick={() => document.getElementById("fit-upload")?.click()}
            >
              <Upload fontSize="small" />
            </IconButton>
          </label>

          {!isAddingRun && (
            <ConfirmDeleteDialog
              itemName={`gym run on ${date.format("DD.MM.YYYY")}`}
              deleteFn={() => deleteRun({ id: run.id })}
            >
              <IconButton
                size="small"
                color="error"
                loading={deleteLoading}
              >
                <Delete fontSize="small" />
              </IconButton>
            </ConfirmDeleteDialog>
          )}

          <IconButton size="small" onClick={() => {
            if (!isAddingRun) {
              setDate(dayjs(run.date));
              setDescription(run.description);
              setDistance(run.distance);
              setDuration(run.duration);
              setStravaUrl(run.stravaUrl);
              setElevationGain(run.elevationGain);
              setIsEditing(false);
            } else if (setIsAddingRun) {
              setIsAddingRun(false);
            }
          }}>
            <Clear fontSize="small" />
          </IconButton>
        </TableCell>
      )}
    </TableRowWithHighlight>
  )
}

const highlightAnimation = ({ theme, index }: { theme: DefaultTheme, index: number }) => keyframes`
  0% {
    background-color: ${theme.palette.warning.dark};
  }
  100% {
    background-color: ${index % 2 === 0 ? theme.palette.background.default : theme.palette.primary.light};
  }
`;

const TableRowWithHighlight = styled(TableRow) <{ isHighlighted: boolean, index: number }>`
  background-color: ${({ theme, index }) => index % 2 === 0 ? theme.palette.background.default : theme.palette.primary.light};
  animation-name: ${({ isHighlighted }) => (isHighlighted ? highlightAnimation : 'none')};
  animation-duration: 3s;

  &:hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }
`;
