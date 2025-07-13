import { Box, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import { Hike } from "../types";
import { AccessTime, Edit, MoreTime, PermMedia, Straighten, Today, TrendingDown, TrendingUp, Place, Save, Delete, Clear } from "@mui/icons-material";
import { useState } from "react";

export const HikeCard = ({ hike }: { hike: Hike }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState(hike.date);
  const [description, setDescription] = useState(hike.description);
  const [distance, setDistance] = useState(hike.distance);
  const [ascent, setAscent] = useState(hike.ascent);
  const [descent, setDescent] = useState(hike.descent);
  const [duration, setDuration] = useState(hike.duration);
  const [durationWithBreaks, setDurationWithBreaks] = useState(hike.durationWithBreaks);

  const durationHours = Math.floor(hike.duration);
  const durationMinutes = Math.round((hike.duration - durationHours) * 60);

  const durationWithBreaksHours = Math.floor(hike.durationWithBreaks);
  const durationWithBreaksMinutes = Math.round((hike.durationWithBreaks - durationWithBreaksHours) * 60);

  return (
    <Wrapper>
      <CoverImage src={hike.coverImage} />
      <ContentBox sx={{ backgroundColor: "secondary.main" }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" color="text.primary" sx={{ mr: 1 }}>
            {hike.description}
          </Typography>

          {!isEditing && (
            <IconButton sx={{ ml: 'auto' }} onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>
          )}

          {isEditing && (
            <IconButton sx={{ ml: 'auto', }}>
              <Save color="success" />
            </IconButton>
          )}

          {isEditing && (
            <IconButton>
              <Delete color="error" />
            </IconButton>
          )}

          {isEditing && (
            <IconButton onClick={() => setIsEditing(false)}>
              <Clear />
            </IconButton>
          )}

          <IconButton disabled>
            <PermMedia />
          </IconButton>

          <IconButton onClick={() => window.open(hike.googleMapsUrl, '_blank')}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="mapGradient" x1="0" y1="0.5" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4285f4" />
                  <stop offset="33%" stopColor="#34a853" />
                  <stop offset="66%" stopColor="#fbbc05" />
                  <stop offset="100%" stopColor="#ea4335" />
                </linearGradient>
              </defs>
              <Place sx={{ fill: "url(#mapGradient)" }} />
            </svg>
          </IconButton>
        </Box>

        <Grid container spacing={1} sx={{ marginTop: 1 }}>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Today />
            {!isEditing ? (
              <Typography variant="body1">
                {hike.date.toLocaleDateString("en-US")}
              </Typography>
            ) : (
              <TextField
                variant="standard"
                value={date.toLocaleDateString("en-US")}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  setDate(isNaN(newDate.getTime()) ? date : newDate);
                }}
              />
            )}
          </Grid>

          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Straighten />
            {!isEditing ? (
              <Typography variant="body1">
                {hike.distance} km
              </Typography>
            ) : (
              <TextField
                variant="standard"
                value={distance.toFixed(2)}
                onChange={(e) => {
                  const newDistance = parseFloat(e.target.value);
                  setDistance(isNaN(newDistance) ? distance : newDistance);
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">km</InputAdornment>,
                }}
              />
            )}
          </Grid>

          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp />
            {!isEditing ? (
              <Typography variant="body1">
                {hike.ascent} m
              </Typography>
            ) : (
              <TextField
                variant="standard"
                value={ascent.toFixed(2)}
                onChange={(e) => {
                  const newAscent = parseFloat(e.target.value);
                  setAscent(isNaN(newAscent) ? ascent : newAscent);
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">m</InputAdornment>,
                }}
              />
            )}
          </Grid>

          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingDown />
            {!isEditing ? (
              <Typography variant="body1">
                {hike.descent} m
              </Typography>
            ) : (
              <TextField
                variant="standard"
                value={descent.toFixed(2)}
                onChange={(e) => {
                  const newDescent = parseFloat(e.target.value);
                  setDescent(isNaN(newDescent) ? descent : newDescent);
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">m</InputAdornment>,
                }}
              />
            )}
          </Grid>

          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime />
            {!isEditing ? (
              <Typography variant="body1">
                {durationHours} h {durationMinutes} m
              </Typography>
            ) : (
              <TextField
                variant="standard"
                value={duration.toFixed(2)}
                onChange={(e) => {
                  const newDuration = parseFloat(e.target.value);
                  setDuration(isNaN(newDuration) ? duration : newDuration);
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">h</InputAdornment>,
                }}
              />
            )}
          </Grid>

          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MoreTime />
            {!isEditing ? (
              <Typography variant="body1">
                {durationWithBreaksHours} h {durationWithBreaksMinutes} m
              </Typography>
            ) : (
              <TextField
                variant="standard"
                value={durationWithBreaks.toFixed(2)}
                onChange={(e) => {
                  const newDurationWithBreaks = parseFloat(e.target.value);
                  setDurationWithBreaks(isNaN(newDurationWithBreaks) ? durationWithBreaks : newDurationWithBreaks);
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">h</InputAdornment>,
                }}
              />
            )}
          </Grid>
        </Grid>
      </ContentBox>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
    display: flex;
    flex-direction: column;
`;

const CoverImage = styled.img`
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    width: 100%;
`;

const ContentBox = styled(Box)`
    padding: 24px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;