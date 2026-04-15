import { Box, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";


export const Volleyball = () => {
  const { searchText } = useOutletContext<{ searchText: string }>();

  return (
    <Box sx={{ overflowY: 'auto', p: '32px', pt: 0 }}>
      {true && (
        <Typography align="center" mt={7}>No volleyball games.</Typography>
      )}
    </Box>
  )
};