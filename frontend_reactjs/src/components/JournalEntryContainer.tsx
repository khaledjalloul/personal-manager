import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { JournalEntry } from "../types";
import { Box, Grid, IconButton, MenuItem, Select, Typography, useTheme } from "@mui/material";
import { Add, Clear, Delete, Edit, Save } from "@mui/icons-material";
import dayjs from "dayjs";
import { useCreateJournalEntry, useDeleteJournalEntry, useEditJournalEntry, useJournalSections } from "../api";
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
  const [sections, setSections] = useState(entry.sections);
  const [content, setContent] = useState(entry.content);
  const [subEntries, setSubEntries] = useState(entry.subEntries);

  const { data: allSections } = useJournalSections({ searchText: "" });

  const { mutate: createEntry, isPending: createLoading, isSuccess: createSuccess } = useCreateJournalEntry();
  const { mutate: editEntry, isPending: editLoading, isSuccess: editSuccess } = useEditJournalEntry();
  const { mutate: deleteEntry, isPending: deleteLoading } = useDeleteJournalEntry();

  const save = () => {
    if (!isEditing || !content.trim() || sections.length === 0) return;

    if (!isAddingEntry)
      editEntry({
        id: entry.id,
        sectionIds: sections.map(s => s.id),
        sectionIdsToRemove: entry.sections.map(s => s.id).filter(id => !sections.some(s => s.id === id)),
        date: date.toDate(),
        content: content.trim(),
        subEntries: subEntries.map((se) => ({ ...se, content: se.content.trim() }))
      });
    else if (sections.length)
      createEntry({
        sectionIds: sections.map(s => s.id),
        date: date.toDate(),
        content: content.trim(),
        subEntries: subEntries.map(se => ({ ...se, content: se.content.trim() }))
      });
  };

  useCtrlS(save);

  useEffect(() => {
    if (createSuccess) setIsAddingEntry(false);
  }, [createSuccess]);

  useEffect(() => {
    if (editSuccess) setIsEditing(false);
  }, [editSuccess]);

  useEffect(() => {
    setSubEntries(entry.subEntries);
  }, [entry.subEntries]);

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
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1 }}>
                <Typography variant="body2">
                  {dayjs(entry.date).format("DD.MM.YYYY")}
                </Typography>

                <IconButton
                  onClick={() => setIsEditing(true)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                mt: 0.5,
                mb: 0.5
              }}>
                {sections.map((section) => (
                  <Box key={section.id} sx={{
                    border: 'solid 1px transparent',
                    backgroundColor: `${allSections?.find(s => s.id === section.id)?.category.color}60`,
                    borderRadius: '32px',
                    p: 0.25,
                    pr: 1,
                    pl: 1
                  }}>
                    <Typography variant="caption">{allSections?.find(s => s.id === section.id)?.category.name}: {allSections?.find(s => s.id === section.id)?.name}</Typography>
                  </Box>
                ))}
              </Box>
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

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignSelf: 'stretch' }}>
                {sections.map((section) => (
                  <Box key={section.id} sx={{
                    border: 'solid 1px transparent',
                    backgroundColor: `${allSections?.find(s => s.id === section.id)?.category.color}60`,
                    borderRadius: '32px',
                    p: 0.25,
                    pr: 0.25,
                    pl: 1
                  }}>
                    <Typography variant="caption">{allSections?.find(s => s.id === section.id)?.category.name}: {allSections?.find(s => s.id === section.id)?.name}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => setSections(sections.filter(s => s.id !== section.id))}
                    >
                      <Clear sx={{ fontSize: '16px' }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              <Select
                variant="outlined"
                size="small"
                value={-1}
                sx={{ width: "100%" }}
                onChange={(e) => {
                  if (sections.some(s => s.id === e.target.value)) return;
                  const newSection = allSections?.find(s => s.id === e.target.value);
                  if (newSection) setSections([...sections, newSection]);
                }}
              >
                {allSections?.filter(s => !sections.some(sec => sec.id === s.id)).map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.category.name}: {section.name}
                  </MenuItem>
                ))}
              </Select>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => setSubEntries([
                    ...subEntries,
                    { id: Date.now(), entryId: entry.id, date: new Date(), content: "" }
                  ])}
                >
                  <Add fontSize="small" />
                </IconButton>

                <IconButton
                  color="success"
                  loading={createLoading || editLoading}
                  disabled={!content.trim() || sections.length === 0}
                  onClick={save}
                >
                  <Save fontSize="small" />
                </IconButton>

                {!isAddingEntry && (
                  <ConfirmDeleteDialog
                    itemName={`journal entry of date: ${dayjs(entry.date).format("DD.MM.YYYY")}`}
                    deleteFn={() => deleteEntry({ id: entry.id })}
                  >
                    <IconButton
                      color="error"
                      loading={deleteLoading}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </ConfirmDeleteDialog>
                )}

                <IconButton
                  onClick={() => {
                    if (!isAddingEntry) {
                      setSections(entry.sections);
                      setDate(dayjs(entry.date));
                      setContent(entry.content);
                      setSubEntries(entry.subEntries);
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

      {subEntries.map((subEntry, index) => (
        <Fragment key={index}>
          <Grid
            size={{ xs: 12, lg: 2 }}
            sx={{
              display: subEntries.length ? 'flex' : 'none',
              justifyContent: { xs: 'center', lg: 'end' },
              alignItems: 'start'
            }}
          >
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              borderRadius: '8px',
              backgroundColor: 'primary.light',
              p: 1,
              pl: isEditing ? 2 : 1,
              mt: { xs: 2, lg: 1 },
              mr: { xs: 0, lg: 1 },
              mb: { xs: 1, lg: 0 },
              border: `solid 1px ${palette.grey[700]}`,
            }}>
              {!isEditing ? (
                <Typography variant="body2">
                  {dayjs(subEntry.date).format("DD.MM.YYYY")}
                </Typography>
              ) : (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dayjs(subEntry.date)}
                    onChange={(newValue) => setSubEntries(subEntries.map((se, i) => ({ ...se, date: i === index ? (newValue ?? dayjs()).toDate() : se.date })))}
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
              )}

              {isEditing && (
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => setSubEntries(subEntries.filter((_, i) => i !== index))}>
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, lg: 10 }} sx={{ display: subEntries.length ? 'flex' : 'none' }}>
            <Box
              sx={{
                flexGrow: 1,
                borderRadius: '8px',
                backgroundColor: 'primary.light',
                mt: { xs: 0, lg: 1 },
                p: 1,
                border: `solid 1px ${palette.grey[700]}`,
              }}>
              {!isEditing ? (
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  <SearchTextHighlight text={subEntry.content} searchText={searchText.trim()} />
                </Typography>
              ) : (
                <textarea
                  value={subEntry.content}
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
                  onChange={(e) => setSubEntries(subEntries.map((se, i) => ({ ...se, content: i === index ? e.target.value : se.content })))}
                />
              )}
            </Box>
          </Grid>
        </Fragment>
      ))}
    </Grid>
  )
}