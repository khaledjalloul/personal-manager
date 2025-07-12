import { Box, Grid, IconButton, Typography } from "@mui/material";
import styled from "styled-components";
import { Hike } from "../types";
import { AccessTime, Edit, MoreTime, PermMedia, Straighten, Today, TrendingDown, TrendingUp, Place } from "@mui/icons-material";

export const HikeCard = ({ hike }: { hike: Hike }) => {

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
          <IconButton
            sx={{ ml: 'auto' }}
            onClick={() => window.open(hike.googleMapsUrl, '_blank')}
          >
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
          <IconButton>
            <PermMedia />
          </IconButton>
          <IconButton>
            <Edit />
          </IconButton>
        </Box>
        <Grid container spacing={1} sx={{ marginTop: 1 }}>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Today />
            <Typography variant="body1">
              {hike.date.toLocaleDateString("en-US")}
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Straighten />
            <Typography variant="body1">
              {hike.distance} km
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp />
            <Typography variant="body1">
              {hike.ascent} m
            </Typography>
          </Grid>

          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingDown />
            <Typography variant="body1">
              {hike.descent} m
            </Typography>
          </Grid>

          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime />
            <Typography variant="body1">
              {durationHours} h {durationMinutes} m
            </Typography>
          </Grid>

          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MoreTime />
            <Typography variant="body1">
              {durationWithBreaksHours} h {durationWithBreaksMinutes} m
            </Typography>
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