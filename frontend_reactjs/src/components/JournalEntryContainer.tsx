import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { JournalEntry } from "../types";
import { Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { Clear, Delete, Edit, Save } from "@mui/icons-material";
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
      });
    else if (entry.section)
      createEntry({
        sectionId: entry.section.id,
        date: date.toDate(),
        content: content.trim(),
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
          {!isEditing ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1 }}>
              <Typography sx={{ fontSize: { xs: 14, lg: 16 } }}>
                {dayjs(entry.date).format("DD.MM.YYYY")}
              </Typography>

              <IconButton
                onClick={() => setIsEditing(true)}>
                <Edit fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={date}
                  onChange={(newValue) => setDate(newValue ?? dayjs(new Date()))}
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

      <Grid size={{ xs: 12, md: 10 }} sx={{ display: 'flex' }}>
        <Box sx={{
          flexGrow: 1,
          borderRadius: '8px',
          backgroundColor: 'primary.light',
          p: 2,
        }}>
          {!isEditing ? (
            <Typography>
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

      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={`journal entry of date: ${dayjs(entry.date).format("DD.MM.YYYY")}`}
        deleteFn={() => deleteEntry({ id: entry.id })}
      />
    </Grid>
  )
}