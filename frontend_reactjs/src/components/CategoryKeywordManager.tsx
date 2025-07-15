import { Box, Grid, IconButton, TextField, Typography } from "@mui/material"
import { ExpensesCategory } from "../types"
import { Clear, Send } from "@mui/icons-material"
import { useExpensesCategoryKeywords } from "../api"

export const CategoryKeywordManager = ({ category }: { category: ExpensesCategory }) => {

  const { data: keywords } = useExpensesCategoryKeywords({
    categoryId: category.id
  })

  return (
    <Grid
      size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
      <Typography variant="body1">{category.name}</Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        border: 'solid 1px gray',
        borderRadius: 1,
        padding: 1,
        gap: 2
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'start',
          gap: 1
        }}>
          {keywords?.map((keyword) => (
            <Box key={keyword.id} sx={{
              pl: 1.5,
              pr: 0.5,
              pt: 0.5,
              pb: 0.5,
              borderRadius: 1,
              backgroundColor: 'secondary.light',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 0.5
            }}>
              <Typography variant="body2">{keyword.keyword}</Typography>
              <IconButton size="small">
                <Clear />
              </IconButton>
            </Box>
          ))}
        </Box>
        <TextField
          size="small"
          variant="standard"
          placeholder="Add keyword"
          slotProps={{
            input: {
              endAdornment: (
                <IconButton size="small">
                  <Send />
                </IconButton>

              )
            }
          }}
        />
      </Box>
    </Grid>
  )
}