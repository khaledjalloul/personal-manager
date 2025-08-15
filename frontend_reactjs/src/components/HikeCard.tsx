import { Box, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import { Hike } from "../types";
import {
  AccessTime,
  Edit,
  MoreTime,
  Straighten,
  Today,
  TrendingDown,
  TrendingUp,
  Place,
  Save,
  Delete,
  Clear,
  AddPhotoAlternate
} from "@mui/icons-material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCreateHike, useDeleteHike, useEditHike } from "../api";
import { ConfirmDeleteDialog } from "./modals";
import { useCtrlS } from "../utils";
import { SearchTextHighlight } from "./SearchTextHighlight";

const GoogleMapsIcon = ({ disabled = false }: { disabled?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="mapGradient" x1="0" y1="0.5" x2="1" y2="1">
        <stop offset="0%" stopColor="#4285f4" />
        <stop offset="33%" stopColor="#34a853" />
        <stop offset="66%" stopColor="#fbbc05" />
        <stop offset="100%" stopColor="#ea4335" />
      </linearGradient>
    </defs>
    <Place sx={!disabled ? { fill: "url(#mapGradient)" } : {}} />
  </svg>
)

export const HikeCard = ({
  hike,
  searchText,
  isAddingHike,
  setIsAddingHike
}: {
  hike: Hike,
  searchText: string,
  isAddingHike: boolean,
  setIsAddingHike: Dispatch<SetStateAction<boolean>>
}) => {

  const [isEditing, setIsEditing] = useState(isAddingHike);
  const [date, setDate] = useState(dayjs(hike.date));
  const [description, setDescription] = useState(hike.description);
  const [distance, setDistance] = useState(hike.distance);
  const [ascent, setAscent] = useState(hike.ascent);
  const [descent, setDescent] = useState(hike.descent);
  const [duration, setDuration] = useState(hike.duration);
  const [durationWithBreaks, setDurationWithBreaks] = useState(hike.durationWithBreaks);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(hike.googleMapsUrl);
  const [coverImage, setCoverImage] = useState(hike.coverImage); // TODO: Add image upload
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { mutate: createHike, isPending: createLoading, isSuccess: createSuccess } = useCreateHike();
  const { mutate: editHike, isPending: editLoading, isSuccess: editSuccess } = useEditHike();
  const { mutate: deleteHike, isPending: deleteLoading } = useDeleteHike();

  const durationHours = Math.floor(hike.duration);
  const durationMinutes = Math.round((hike.duration - durationHours) * 60);

  const durationWithBreaksHours = Math.floor(hike.durationWithBreaks);
  const durationWithBreaksMinutes = Math.round((hike.durationWithBreaks - durationWithBreaksHours) * 60);

  const save = () => {
    if (!isEditing || !description.trim()) return;
    if (!isAddingHike)
      editHike({
        id: hike.id,
        date: date.toDate(),
        description: description.trim(),
        distance,
        ascent,
        descent,
        duration,
        durationWithBreaks,
        googleMapsUrl: googleMapsUrl.trim(),
        coverImage: coverImage?.trim()
      });
    else
      createHike({
        date: date.toDate(),
        description: description.trim(),
        distance,
        ascent,
        descent,
        duration,
        durationWithBreaks,
        googleMapsUrl: googleMapsUrl.trim(),
        coverImage: coverImage?.trim(),
        images: []
      });
  };

  useCtrlS(save);

  useEffect(() => {
    if (createSuccess) setIsAddingHike(false);
  }, [createSuccess]);

  useEffect(() => {
    if (editSuccess) setIsEditing(false);
  }, [editSuccess]);

  return (
    <Wrapper
      sx={{ backgroundColor: 'primary.light' }}
      onDoubleClick={() => setIsEditing(true)}
    >
      <Box sx={{ width: '100%', aspectRatio: '16/9', position: 'relative' }} >
        {coverImage && (
          <CoverImage src={coverImage} />
        )}
        {isEditing && (
          <CoverImageEditor>
            <Box sx={{ borderRadius: '100px', backgroundColor: 'primary.light' }}>
              <IconButton>
                <AddPhotoAlternate />
              </IconButton>
            </Box>
          </CoverImageEditor>
        )}
      </Box>

      <ContentBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isEditing ? (
            <Typography variant="h6" color="text.primary" sx={{ mr: 1 }}>
              <SearchTextHighlight text={description} searchText={searchText.trim()} />
            </Typography>
          ) : (
            <TextField
              variant="standard"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          )}

          {!isEditing && (
            <IconButton
              sx={{ ml: 'auto' }}
              onClick={() => setIsEditing(true)}
            >
              <Edit fontSize="small" />
            </IconButton>
          )}

          {isEditing && (
            <IconButton
              color="success"
              sx={{ ml: 'auto', }}
              loading={createLoading || editLoading}
              disabled={!description.trim()}
              onClick={save}
            >
              <Save fontSize="small" />
            </IconButton>
          )}

          {isEditing && !isAddingHike && (
            <IconButton
              color="error"
              loading={deleteLoading}
              onClick={() => setConfirmDeleteOpen(true)}
            >
              <Delete fontSize="small" />
            </IconButton>
          )}

          {isEditing && (
            <IconButton onClick={() => {
              if (!isAddingHike) {
                setDate(dayjs(hike.date));
                setDescription(hike.description);
                setDistance(hike.distance);
                setAscent(hike.ascent);
                setDescent(hike.descent);
                setDuration(hike.duration);
                setDurationWithBreaks(hike.durationWithBreaks);
                setGoogleMapsUrl(hike.googleMapsUrl);
                setIsEditing(false);
              } else {
                setIsAddingHike(false);
              }
            }}>
              <Clear fontSize="small" />
            </IconButton>
          )}

          {/* {!isEditing && (
            <IconButton disabled>
              <PermMedia fontSize="small" />
            </IconButton>
          )} */}

          {!isEditing && (
            <IconButton
              disabled={!googleMapsUrl.trim()}
              onClick={() => window.open(googleMapsUrl, '_blank')}
            >
              <GoogleMapsIcon disabled={!googleMapsUrl.trim()} />
            </IconButton>
          )}
        </Box>

        <Grid container rowSpacing={1} columnSpacing={2}>
          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Today sx={{ color: "text.primary" }} />
            {!isEditing ? (
              <Typography variant="body1">
                {date.format("DD.MM.YYYY")}
              </Typography>
            ) : (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={date}
                  onChange={(newValue) => setDate(newValue ?? dayjs())}
                  enableAccessibleFieldDOMStructure={false}
                  format="DD.MM.YYYY"
                  slotProps={{
                    textField: {
                      size: "small",
                      variant: "standard",
                      placeholder: "Date",
                    }
                  }}
                />
              </LocalizationProvider>
            )}
          </Grid>

          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Straighten sx={{ color: "text.primary" }} />
            {!isEditing ? (
              <Typography variant="body1">
                {distance} km
              </Typography>
            ) : (
              <TextField
                variant="standard"
                placeholder="Distance"
                value={distance.toFixed(2)}
                onChange={(e) => {
                  const newDistance = parseFloat(e.target.value);
                  setDistance(isNaN(newDistance) ? distance : newDistance);
                }}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">km</InputAdornment>,
                  }
                }}
              />
            )}
          </Grid>

          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp sx={{ color: "text.primary" }} />
            {!isEditing ? (
              <Typography variant="body1">
                {ascent} m
              </Typography>
            ) : (
              <TextField
                variant="standard"
                placeholder="Ascent"
                value={ascent.toFixed(2)}
                onChange={(e) => {
                  const newAscent = parseFloat(e.target.value);
                  setAscent(isNaN(newAscent) ? ascent : newAscent);
                }}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                  }
                }}
              />
            )}
          </Grid>

          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingDown sx={{ color: "text.primary" }} />
            {!isEditing ? (
              <Typography variant="body1">
                {descent} m
              </Typography>
            ) : (
              <TextField
                variant="standard"
                placeholder="Descent"
                value={descent.toFixed(2)}
                onChange={(e) => {
                  const newDescent = parseFloat(e.target.value);
                  setDescent(isNaN(newDescent) ? descent : newDescent);
                }}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">m</InputAdornment>,
                  }
                }}
              />
            )}
          </Grid>

          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime sx={{ color: "text.primary" }} />
            {!isEditing ? (
              <Typography variant="body1">
                {durationHours} h {durationMinutes} m
              </Typography>
            ) : (
              <TextField
                variant="standard"
                placeholder="Duration (without breaks)"
                value={duration.toFixed(2)}
                onChange={(e) => {
                  const newDuration = parseFloat(e.target.value);
                  setDuration(isNaN(newDuration) ? duration : newDuration);
                }}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">h</InputAdornment>,
                  }
                }}
              />
            )}
          </Grid>

          <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MoreTime sx={{ color: "text.primary" }} />
            {!isEditing ? (
              <Typography variant="body1">
                {durationWithBreaksHours} h {durationWithBreaksMinutes} m
              </Typography>
            ) : (
              <TextField
                variant="standard"
                placeholder="Duration (with breaks)"
                value={durationWithBreaks.toFixed(2)}
                onChange={(e) => {
                  const newDurationWithBreaks = parseFloat(e.target.value);
                  setDurationWithBreaks(isNaN(newDurationWithBreaks) ? durationWithBreaks : newDurationWithBreaks);
                }}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">h</InputAdornment>,
                  }
                }}
              />
            )}
          </Grid>

          {isEditing && (
            <Grid size={{ xs: 12 }} sx={{ display: 'flex' }}>
              <TextField
                variant="standard"
                placeholder="Google Maps URL"
                value={googleMapsUrl}
                sx={{ flexGrow: 1 }}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start"><GoogleMapsIcon /></InputAdornment>,
                  }
                }}
              />
            </Grid>
          )}
        </Grid>
      </ContentBox>
      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={`hike: ${description}`}
        deleteFn={() => deleteHike({ id: hike.id })}
      />
    </Wrapper >
  )
}

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-radius: 8px;
  border: ${({ theme }) => `solid 1px ${theme.palette.grey[700]}}`};
`;

const CoverImage = styled.img`
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: 100%;
  aspect-ratio: 16/9;
`;

const CoverImageEditor = styled(Box)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #00000077;
  margin-bottom: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentBox = styled(Box)`
  padding: 24px;
  padding-top: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;