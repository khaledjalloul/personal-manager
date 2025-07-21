import { Fragment, useEffect, useState } from "react";
import { DiaryEntry } from "../types";
import { Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { Clear, Edit, Save } from "@mui/icons-material";
import dayjs from "dayjs";
import { useCreateDiaryEntry, useEditDiaryEntry } from "../api";

export const DiaryGridRow = ({ entry }: { entry: DiaryEntry }) => {

  const { palette } = useTheme();

  const { mutate: createEntry, isPending: createLoading, isSuccess: createSuccess } = useCreateDiaryEntry();
  const { mutate: editEntry, isPending: editLoading, isSuccess: editSuccess } = useEditDiaryEntry();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(entry.content);
  const [workContent, setWorkContent] = useState(entry.workContent);

  useEffect(() => {
    if (createSuccess || editSuccess) setIsEditing(false);
  }, [createSuccess, editSuccess]);

  return (
    <Fragment>
      <Grid size={{ xs: 2 }} sx={{ display: 'flex' }}>
        <Box sx={{
          flexGrow: 1,
          borderRadius: '8px',
          backgroundColor: 'primary.light',
          p: 1,
          pl: 2,
          mr: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Typography variant="body1" >
            {dayjs(entry.date).format("DD.MM.YYYY")}
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
                color="success"
                loading={createLoading || editLoading}
                onClick={() => {
                  if (entry.id < 0)
                    createEntry({
                      date: entry.date,
                      content,
                      workContent,
                    })
                  else
                    editEntry({
                      id: entry.id,
                      date: entry.date,
                      content,
                      workContent
                    })
                }}
              >
                <Save />
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

      <Grid size={{ xs: 7 }} sx={{ display: 'flex' }}>
        <Box sx={{
          flexGrow: 1,
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: '8px',
          backgroundColor: 'primary.light',
          p: !isEditing ? 1 : 0,
          pr: !isEditing ? 2 : 1,
          borderRight: `solid 1px ${palette.action.hover}`
        }}>
          {!isEditing ? (
            <Typography variant="body1">
              {content}
            </Typography>
          ) : (
            <textarea
              value={content}
              rows={10}
              style={{
                width: 'calc(100% - 16px)',
                minHeight: 'calc(100% - 16px)',
                resize: 'none',
                padding: '8px',
                outline: 'none',
                border: 'none',
                backgroundColor: palette.primary.light,
                color: palette.text.primary,
                borderTopLeftRadius: '8px',
                borderBottomLeftRadius: '8px',
              }}
              onChange={(e) => setContent(e.target.value)}
            />
          )}
        </Box>
      </Grid>

      <Grid size={{ xs: 3 }} sx={{ display: 'flex', overflow: 'hidden' }}>
        <Box sx={{
          flexGrow: 1,
          borderTopRightRadius: '8px',
          borderBottomRightRadius: '8px',
          backgroundColor: 'primary.light',
          p: !isEditing ? 1 : 0,
          pl: !isEditing ? 2 : 1,
        }}>
          {!isEditing ? (
            <Typography variant="body1">
              {workContent}
            </Typography>
          ) : (
            <textarea
              value={workContent}
              style={{
                width: 'calc(100% - 16px)',
                height: 'calc(100% - 16px)',
                resize: 'none',
                padding: '8px',
                outline: 'none',
                border: 'none',
                backgroundColor: palette.primary.light,
                color: palette.text.primary,
                borderTopRightRadius: '8px',
                borderBottomRightRadius: '8px'
              }}
              onChange={(e) => setWorkContent(e.target.value)}
            />
          )}
        </Box>
      </Grid>

    </Fragment >
  )
}