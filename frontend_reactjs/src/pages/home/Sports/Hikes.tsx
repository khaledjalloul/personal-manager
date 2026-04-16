import { Box, Grid, IconButton, Typography } from "@mui/material";
import { useHikes } from "../../../api";
import { HikeCard } from "../../../components";
import { Add } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Hike } from "../../../types";
import { useOutletContext } from "react-router-dom";

const emptyHike: Hike = {
  id: -1,
  date: new Date(),
  description: "",
  ascent: 0,
  descent: 0,
  distance: 0,
  duration: 0,
  durationWithBreaks: 0,
  coverImage: "",
  googleMapsUrl: "",
  images: []
}

export const Hikes = () => {
  const { searchText } = useOutletContext<{ searchText: string }>();

  const [isAddingHike, setIsAddingHike] = useState(false);

  const { data: hikes } = useHikes({
    searchText: searchText.trim(),
  });

  useEffect(() => {
    if (searchText.trim().length > 0 && isAddingHike)
      setIsAddingHike(false);
  }, [searchText]);

  return (
    <Box sx={{ overflowY: 'auto', p: '32px', pt: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="h5">
          Hikes ({hikes?.length ?? 0})
        </Typography>

        <IconButton onClick={() => setIsAddingHike(true)}>
          <Add />
        </IconButton>
      </Box>

      {!isAddingHike && hikes?.length === 0 && (
        <Typography align="center" mt={7}>No hikes.</Typography>
      )}
      <Grid container spacing={3}>
        {isAddingHike && !searchText.trim() && (
          <Grid
            key={emptyHike.id}
            size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}
            sx={{ display: 'flex' }}
          >
            <HikeCard
              hike={emptyHike}
              searchText={searchText}
              isAddingHike={isAddingHike}
              setIsAddingHike={setIsAddingHike}
            />
          </Grid>
        )}
        {hikes?.map((hike) => (
          <Grid
            key={hike.id}
            size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}
            sx={{ display: 'flex' }}
          >
            <HikeCard
              hike={hike}
              searchText={searchText}
              isAddingHike={isAddingHike}
              setIsAddingHike={setIsAddingHike}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
};