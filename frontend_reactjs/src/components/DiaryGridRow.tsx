import { useEffect, useState } from "react";
import { DiaryEntry, DiaryEntryType } from "../types";
import { Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { Clear, Edit, Save } from "@mui/icons-material";
import dayjs from "dayjs";
import { useCreateDiaryEntry, useEditDiaryEntry } from "../api";
import { useCtrlS } from "../utils";

export const DiaryGridRow = ({
  entry,
  isSearching
}: {
  entry: DiaryEntry
  isSearching: boolean
}) => {

  const { palette } = useTheme();

  const { mutate: createEntry, isPending: createLoading, isSuccess: createSuccess } = useCreateDiaryEntry();
  const { mutate: editEntry, isPending: editLoading, isSuccess: editSuccess } = useEditDiaryEntry();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(entry.content);
  const [workContent, setWorkContent] = useState(entry.workContent);

  const isDaily = entry.type === DiaryEntryType.Daily;

  const save = () => {
    if (!isEditing) return;

    if (entry.id < 0)
      createEntry({
        date: entry.date,
        content: content.trim(),
        workContent: workContent.trim(),
        type: entry.type,
      })
    else
      editEntry({
        id: entry.id,
        date: entry.date,
        content: content.trim(),
        workContent: workContent.trim(),
      })
  };

  useCtrlS(save);

  useEffect(() => {
    if (createSuccess || editSuccess) setIsEditing(false);
  }, [createSuccess, editSuccess]);

  return (
    <Grid container>
      <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex' }}>
        <Box sx={{
          flexGrow: 1,
          borderRadius: '8px',
          backgroundColor: 'primary.light',
          p: 1,
          pl: 2,
          mr: { xs: 0, md: 1 },
          mb: { xs: 1, md: 0 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Typography variant="body1">
            {dayjs(entry.date).format(
              isDaily ?
                (isSearching ? "DD.MM.YYYY" : "DD dddd") :
                "MMMM"
            )}
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
                onClick={save}
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

      <Grid size={{ xs: 12, md: 7 }} sx={{ display: 'flex' }}>
        <Box sx={{
          flexGrow: 1,
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: { xs: 0, md: '8px' },
          borderTopRightRadius: { xs: '8px', md: 0 },
          backgroundColor: 'primary.light',
          p: 2,
          borderRight: { xs: 'none', md: `solid 1px ${palette.action.hover}` },
          borderBottom: { xs: `solid 1px ${palette.action.hover}`, md: 'none' }
        }}>
          {!isEditing ? (
            <Typography variant="body1">
              {content}
            </Typography>
          ) : (
            <textarea
              value={content}
              rows={10}
              placeholder="Content"
              style={{
                width: '100%',
                minHeight: '100%',
                resize: 'none',
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

      <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', overflow: 'hidden' }}>
        <Box sx={{
          flexGrow: 1,
          borderTopRightRadius: { xs: 0, md: '8px' },
          borderBottomRightRadius: '8px',
          borderBottomLeftRadius: { xs: '8px', md: 0 },
          backgroundColor: 'primary.light',
          p: 2,
        }}>
          {!isEditing ? (
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {workContent}
            </Typography>
          ) : (
            <textarea
              value={workContent}
              placeholder="Work / Projects"
              style={{
                width: '100%',
                height: '100%',
                resize: 'none',
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
    </Grid>
  )
}