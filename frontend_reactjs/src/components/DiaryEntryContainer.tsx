import { useEffect, useState } from "react";
import { DiaryEntry, DiaryEntryType } from "../types";
import { Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { Clear, Edit, Save } from "@mui/icons-material";
import dayjs from "dayjs";
import { useCreateDiaryEntry, useEditDiaryEntry } from "../api";
import { useCtrlS } from "../utils";
import { SearchTextHighlight } from "./SearchTextHighlight";

export const DiaryEntryContainer = ({
  entry,
  searchText,
}: {
  entry: DiaryEntry
  searchText: string
}) => {

  const { palette } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(entry.content);
  const [workContent, setWorkContent] = useState(entry.workContent);

  const { mutate: createEntry, isPending: createLoading, isSuccess: createSuccess } = useCreateDiaryEntry();
  const { mutate: editEntry, isPending: editLoading, isSuccess: editSuccess } = useEditDiaryEntry(entry.type);

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
    <Grid container onDoubleClick={() => setIsEditing(true)}>
      <Grid size={{ xs: 12, md: 2, xl: 1.5 }} sx={{ display: 'flex' }}>
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
          border: `solid 1px ${palette.grey[700]}`
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'row', md: 'column' },
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: { xs: 1, md: 0 }
          }}
          >
            <Typography sx={{ fontSize: { xs: 14, lg: 16 } }}>
              {dayjs(entry.date).format(
                isDaily ?
                  (searchText ? "DD.MM.YYYY" : "dddd") :
                  "MMMM"
              )}
            </Typography>
            {isDaily && !searchText && (
              <Typography variant="h5">
                {dayjs(entry.date).format("DD")}
              </Typography>
            )}
            {!isDaily && searchText && (
              <Typography variant="body2">
                {dayjs(entry.date).format("YYYY")}
              </Typography>
            )}

          </Box>

          {!isEditing ? (
            <IconButton
              onClick={() => setIsEditing(true)}>
              <Edit fontSize="small" />
            </IconButton>
          ) : (
            <Box>
              <IconButton
                size="small"
                color="success"
                loading={createLoading || editLoading}
                onClick={save}
                sx={{ mr: { xs: 3, md: 0 } }}
              >
                <Save fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={() => {
                  setContent(entry.content);
                  setWorkContent(entry.workContent);
                  setIsEditing(false)
                }}>
                <Clear fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: ((isEditing || workContent.trim()) ? 7 : 10), xl: ((isEditing || workContent.trim()) ? 7.5 : 10.5) }} sx={{ display: 'flex' }}>
        <Box sx={{
          flexGrow: 1,
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: { xs: (isEditing || workContent.trim()) ? 0 : '8px', md: '8px' },
          borderTopRightRadius: { xs: '8px', md: (isEditing || workContent.trim()) ? 0 : '8px' },
          borderBottomRightRadius: (isEditing || workContent.trim()) ? 0 : '8px',
          backgroundColor: 'primary.light',
          p: 2,
          border: `solid 1px ${palette.grey[700]}`,
          borderRight: { xs: `solid 1px ${palette.grey[700]}`, md: (isEditing || workContent.trim()) ? 'none' : `solid 1px ${palette.grey[700]}` },
          borderBottom: { xs: (isEditing || workContent.trim()) ? 'none' : `solid 1px ${palette.grey[700]}`, md: `solid 1px ${palette.grey[700]}` },
        }}>
          {!isEditing ? (
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              <SearchTextHighlight text={content} searchText={searchText} />
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

      <Grid
        size={{ xs: 12, md: 3 }}
        sx={{
          display: (isEditing || workContent.trim()) ? 'flex' : 'none',
          overflow: 'hidden'
        }}
      >
        <Box sx={{
          flexGrow: 1,
          borderTopRightRadius: { xs: 0, md: '8px' },
          borderBottomRightRadius: '8px',
          borderBottomLeftRadius: { xs: '8px', md: 0 },
          backgroundColor: 'primary.light',
          p: 2,
          border: `solid 1px ${palette.grey[700]}`,
        }}>
          {!isEditing ? (
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              <SearchTextHighlight text={workContent} searchText={searchText} />
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