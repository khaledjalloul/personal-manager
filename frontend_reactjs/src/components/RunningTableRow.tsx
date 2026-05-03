import {
  IconButton,
  InputAdornment,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { Run } from "../types";
import { Clear, Delete, Edit, Save, Upload } from "@mui/icons-material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useCreateRun, useDeleteRun, useEditRun, useUploadRunFitFile } from "../api";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ConfirmDeleteDialog } from "./modals";
import { useCtrlS } from "../utils";
import { SearchTextHighlight } from "./SearchTextHighlight";

export const RunningTableRow = ({
  run,
  index,
  searchText,
  isAddingRun,
  setIsAddingRun,
}: {
  run: Run;
  index: number;
  searchText: string;
  isAddingRun?: boolean;
  setIsAddingRun?: Dispatch<SetStateAction<boolean>>;
}) => {

  const [isEditing, setIsEditing] = useState(isAddingRun ?? false);
  const [date, setDate] = useState(dayjs(run.date));
  const [description, setDescription] = useState(run.description);
  const [distance, setDistance] = useState(run.distance);
  const [duration, setDuration] = useState(run.duration);
  const [elevationGain, setElevationGain] = useState(run.elevationGain);

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
        elevationGain
      });
    else if (setIsAddingRun)
      createRun({
        date: date.toDate(),
        description: description.trim(),
        distance,
        duration,
        elevationGain
      });
  };

  useCtrlS(save);

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
    <TableRow
      sx={{
        backgroundColor: index % 2 === 0 ? "background.default" : "primary.light",
        ":hover": { backgroundColor: "action.hover" }
      }}
      onDoubleClick={() => setIsEditing(true)}
    >
      <TableCell>
        {!isEditing ? date.format("dddd, MMMM D, YYYY | hh:mm A") :
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={date}
              onChange={(newValue) => setDate(newValue ?? dayjs())}
              enableAccessibleFieldDOMStructure={false}
              format="DD.MM.YYYY | hh:mm A"
              slotProps={{
                textField: {
                  size: "small",
                  variant: "standard",
                  placeholder: "Date",
                }
              }}
              sx={{ minWidth: 130 }}
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

      <TableCell>{Math.floor(pace / 60).toString().padStart(2, '0')}:{(pace % 60).toFixed(0).padStart(2, '0')} / km</TableCell>

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
    </TableRow>
  )
}
