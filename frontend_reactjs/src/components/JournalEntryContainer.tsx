import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { JournalEntry } from "../types";
import { Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { Add, Clear, Delete, Edit, Save } from "@mui/icons-material";
import dayjs from "dayjs";
import { useCreateJournalEntry, useDeleteJournalEntry, useEditJournalEntry } from "../api";
import { useCtrlS } from "../utils";
import { ConfirmDeleteDialog } from "./modals";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SearchTextHighlight } from "./SearchTextHighlight";

export const JournalEntryContainer = ({
  entry,
  searchText,
  isAddingEntry,
  setIsAddingEntry
}: {
  entry: JournalEntry
  searchText: string
  isAddingEntry: boolean
  setIsAddingEntry: Dispatch<SetStateAction<boolean>>;
}) => {

  const { palette } = useTheme();

  const [isEditing, setIsEditing] = useState(isAddingEntry);
  const [date, setDate] = useState(dayjs(entry.date));
  const [content, setContent] = useState(entry.content);
  const [subEntries, setSubEntries] = useState(entry.subEntries.map(se => se.content));
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { mutate: createEntry, isPending: createLoading, isSuccess: createSuccess } = useCreateJournalEntry();
  const { mutate: editEntry, isPending: editLoading, isSuccess: editSuccess } = useEditJournalEntry();
  const { mutate: deleteEntry, isPending: deleteLoading } = useDeleteJournalEntry();

  const save = () => {
    if (!isEditing || !content.trim()) return;

    if (!isAddingEntry)
      editEntry({
        id: entry.id,
        date: date.toDate(),
        content: content.trim(),
        subEntries: subEntries.map(se => se.trim())
      });
    else if (entry.section)
      createEntry({
        sectionId: entry.section.id,
        date: date.toDate(),
        content: content.trim(),
        subEntries: subEntries.map(se => se.trim())
      });
  };

  useCtrlS(save);

  useEffect(() => {
    if (createSuccess) setIsAddingEntry(false);
  }, [createSuccess]);

  useEffect(() => {
    if (editSuccess) setIsEditing(false);
  }, [editSuccess]);

  return (
    <Grid container onDoubleClick={() => setIsEditing(true)}>
      <Grid size={{ xs: 12, lg: 2 }} sx={{ display: 'flex' }}>
        <Box sx={{
          flexGrow: 1,
          borderRadius: '8px',
          backgroundColor: 'primary.light',
          p: 1,
          pl: 2,
          mr: { xs: 0, lg: 1 },
          mb: { xs: 1, lg: 0 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: `solid 1px ${palette.grey[700]}`
        }}>
          {!isEditing ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1 }}>
              <Typography variant="body2">
                {dayjs(entry.date).format("DD.MM.YYYY")}
              </Typography>

              <IconButton
                onClick={() => setIsEditing(true)}>
                <Edit fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
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

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => setSubEntries([...subEntries, ""])}
                >
                  <Add fontSize="small" />
                </IconButton>

                <IconButton
                  color="success"
                  loading={createLoading || editLoading}
                  disabled={!content.trim()}
                  onClick={save}
                >
                  <Save fontSize="small" />
                </IconButton>

                {!isAddingEntry && (
                  <IconButton
                    color="error"
                    loading={deleteLoading}
                    onClick={() => setConfirmDeleteOpen(true)}>
                    <Delete fontSize="small" />
                  </IconButton>
                )}

                <IconButton
                  onClick={() => {
                    if (!isAddingEntry) {
                      setDate(dayjs(entry.date));
                      setContent(entry.content);
                      setSubEntries(entry.subEntries.map(se => se.content));
                      setIsEditing(false);
                    } else {
                      setIsAddingEntry(false);
                    }
                  }}>
                  <Clear fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      </Grid>

      <Grid size={{ xs: 12, lg: 10 }} sx={{ display: 'flex' }}>
        <Box sx={{
          flexGrow: 1,
          borderRadius: '8px',
          backgroundColor: 'primary.light',
          p: 1,
          border: `solid 1px ${palette.grey[700]}`
        }}>
          {!isEditing ? (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              <SearchTextHighlight text={content} searchText={searchText.trim()} />
            </Typography>
          ) : (
            <textarea
              value={content}
              rows={10}
              placeholder="Content"
              style={{
                width: '100%',
                minHeight: '100%',
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

      <Grid size={2} sx={{ display: { xs: 'none', lg: subEntries.length ? 'flex' : 'none' } }} />

      <Grid size={{ xs: 12, lg: 10 }} sx={{ display: subEntries.length ? 'flex' : 'none' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            flexGrow: 1,
            mt: 1,
            ml: 1
          }}>
          {subEntries.map((subEntry, index) => (
            <Box
              key={index}
              sx={{
                flexGrow: 1,
                borderRadius: '8px',
                backgroundColor: 'primary.light',
                p: 1,
                border: `solid 1px ${palette.grey[700]}`,
                position: 'relative'
              }}>
              {!isEditing ? (
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  <SearchTextHighlight text={subEntry} searchText={searchText.trim()} />
                </Typography>
              ) : (
                <textarea
                  value={subEntry}
                  rows={10}
                  placeholder="Sub-Entry"
                  style={{
                    width: '100%',
                    minHeight: '100%',
                    outline: 'none',
                    border: 'none',
                    backgroundColor: palette.primary.light,
                    color: palette.text.primary,
                    borderTopLeftRadius: '8px',
                    borderBottomLeftRadius: '8px',
                  }}
                  onChange={(e) => setSubEntries(subEntries.map((se, i) => i === index ? e.target.value : se))}
                />
              )}

              {isEditing && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: { xs: 0, sm: '8px', lg: 0 },
                    bottom: { xs: 0, sm: 'auto', lg: 0 },
                    left: { xs: '-38px', sm: 'auto', lg: '-48px' },
                    right: { xs: 'auto', sm: '16px', lg: 'auto' },
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                  <IconButton
                    color="error"
                    onClick={() => setSubEntries(subEntries.filter((_, i) => i !== index))}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Grid>

      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={`journal entry of date: ${dayjs(entry.date).format("DD.MM.YYYY")}`}
        deleteFn={() => deleteEntry({ id: entry.id })}
      />
    </Grid>
  )
}