import { Fragment, useState } from "react";
import { DiaryEntry } from "../types";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { Clear, Edit, Save } from "@mui/icons-material";

export const DiaryGridRow = ({ entry }: { entry: DiaryEntry }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(entry.content);
  const [workContent, setWorkContent] = useState(entry.workContent);

  return (
    <Fragment>
      <Grid item xs={2} sx={{ display: 'flex' }}>
        <Box sx={{
          flexGrow: 1,
          borderRadius: 1,
          backgroundColor: 'secondary.main',
          p: 1,
          mr: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Typography variant="body1" >
            {entry.date.toLocaleDateString("en-US")}
          </Typography>

          {!isEditing ? (
            <IconButton
              size="small"
              onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>
          ) : (
            <Box>
              <IconButton
                size="small"
              >
                <Save color="success" />
              </IconButton>

              <IconButton
                size="small"
                onClick={() => {
                  setContent(entry.content);
                  setWorkContent(entry.workContent);
                  setIsEditing(false)
                }}>
                <Clear />
              </IconButton>
            </Box>
          )}
        </Box>
      </Grid>

      <Grid item xs={7} sx={{ display: 'flex' }}>
        <Box sx={{
          flexGrow: 1,
          borderTopLeftRadius: 1,
          borderBottomLeftRadius: 1,
          backgroundColor: 'secondary.main',
          p: 1,
          pr: 2,
        }}>
          {!isEditing ? (
            <Typography variant="body1">
              {content}
            </Typography>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}
        </Box>
      </Grid>

      <Grid item xs={3} sx={{ display: 'flex' }}>
        <Box sx={{
          flexGrow: 1,
          borderTopRightRadius: 1,
          borderBottomRightRadius: 1,
          backgroundColor: 'secondary.main',
          p: 1,
          pl: 2,
        }}>
          {!isEditing ? (
            <Typography variant="body1">
              {workContent}
            </Typography>
          ) : (
            <textarea
              value={workContent}
              onChange={(e) => setWorkContent(e.target.value)}
            />
          )}
        </Box>
      </Grid>

    </Fragment >
  )
}