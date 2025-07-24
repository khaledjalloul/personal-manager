import { Box, Grid, IconButton, MenuItem, Select, TextField, Typography, useTheme } from "@mui/material";
import styled from "styled-components";
import { ExpensesStatisticsCard } from "../../components";
import { useCreateDiaryEntry, useCreateNote, useDiaryEntries, useEditDiaryEntry, useExpensesStatistics, useNoteCategories } from "../../api";
import { ChevronRight, Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { DiaryEntry } from "../../types";
import { useCtrlS } from "../../utils";

const NavigationTitle = ({
  title,
  link
}: {
  title: string;
  link: string;
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        alignSelf: 'flex-start',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        transitionDuration: '0.2s',
        ":hover": {
          gap: 2,
        }
      }}
      onClick={() => navigate(link)}
    >
      <Typography variant="h5">{title}</Typography>
      <ChevronRight sx={{ color: 'text.primary' }} />
    </Box>
  );
}


var today = dayjs(new Date())
today = dayjs(new Date(today.year(), today.month(), today.date(), 12));

export const Home = () => {

  const navigate = useNavigate();
  const { palette } = useTheme();

  const { data: expensesStatistics } = useExpensesStatistics();
  const { data: noteCategories } = useNoteCategories();
  const { data: diaryEntries } = useDiaryEntries({
    year: today.year(),
    month: today.month(),
    searchText: ""
  });

  const { mutate: createDiaryEntry, isPending: createDiaryLoading } = useCreateDiaryEntry();
  const { mutate: editDiaryEntry, isPending: editDiaryLoading } = useEditDiaryEntry();
  const { mutate: createNote, isPending: createNoteLoading, isSuccess: createNoteSuccess } = useCreateNote();

  const [selectedNoteCategory, setSelectedNoteCategory] = useState(noteCategories?.[0]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [diaryContent, setDiaryContent] = useState("");
  const [diaryWorkContent, setDiaryWorkContent] = useState("");

  const todaysDiaryEntry = useMemo(() => {
    const empty: DiaryEntry = {
      id: -1,
      date: today.toDate(),
      content: "",
      workContent: ""
    };

    if (!diaryEntries) return empty;

    const todaysEntry = diaryEntries.find(e => dayjs(e.date).isSame(today, 'day')) || empty;

    setDiaryContent(todaysEntry.content);
    setDiaryWorkContent(todaysEntry.workContent);

    return todaysEntry;
  }, [JSON.stringify(diaryEntries)]);

  const saveDiary = () => {
    if (!diaryContent.trim() && !diaryWorkContent.trim()) return;
    if (todaysDiaryEntry.id < 0)
      createDiaryEntry({
        date: todaysDiaryEntry.date,
        content: diaryContent.trim(),
        workContent: diaryWorkContent.trim(),
      })
    else
      editDiaryEntry({
        id: todaysDiaryEntry.id,
        date: todaysDiaryEntry.date,
        content: diaryContent.trim(),
        workContent: diaryWorkContent.trim(),
      })
  };

  const saveNote = () => {
    if (!selectedNoteCategory || !noteTitle.trim() || !noteContent.trim()) return;
    const date = new Date();
    createNote({
      title: noteTitle.trim(),
      content: noteContent.trim(),
      dateCreated: date,
      dateModified: date,
      categoryId: selectedNoteCategory?.id,
      tags: []
    });
  };

  useCtrlS(() => { saveDiary(); saveNote() });

  useEffect(() => {
    if (noteCategories) setSelectedNoteCategory(noteCategories[0]);
  }, [JSON.stringify(noteCategories)]);

  useEffect(() => {
    if (createNoteSuccess) {
      setNoteTitle("");
      setNoteContent("");
      setSelectedNoteCategory(noteCategories?.[0]);
      navigate('/notes');
    }
  }, [createNoteSuccess]);

  return (
    <Wrapper>
      <Grid container spacing={4} sx={{ flexGrow: 1 }}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <NavigationTitle title="Expenses" link="/expenses" />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <ExpensesStatisticsCard
                title="Total Spent This Month"
                value={`${expensesStatistics?.totalExpensesThisMonth.toFixed(2)} CHF`}
                color="primary.dark"
              />

              <ExpensesStatisticsCard
                title="Average Expenses Per Month"
                value={`${expensesStatistics?.monthlyAverageExpenses.toFixed(2)} CHF`}
                color="warning.dark"
              />
            </Box>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
            <NavigationTitle title="Notes" link="/notes" />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">Add New Note</Typography>

              <TextField
                variant="standard"
                size="small"
                placeholder="Note Title"
                sx={{ flexGrow: 1 }}
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />

              {selectedNoteCategory && (
                <Select
                  variant="standard"
                  size="small"
                  sx={{ minWidth: 150, ml: 2 }}
                  value={selectedNoteCategory.id}
                  onChange={(e) => setSelectedNoteCategory(noteCategories?.find(cat => cat.id === e.target.value))}
                >
                  {noteCategories?.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              )}

              <IconButton
                sx={{ color: 'success.main', ml: 'auto' }}
                loading={createNoteLoading}
                disabled={!noteContent.trim() || !selectedNoteCategory}
                onClick={saveNote}
              >
                <Save />
              </IconButton>
            </Box>

            <Box sx={{
              flexGrow: 1,
              borderRadius: '8px',
              backgroundColor: 'primary.light',
            }}>
              <textarea
                value={noteContent}
                rows={10}
                placeholder="Note"
                style={{
                  width: 'calc(100% - 32px)',
                  minHeight: 'calc(100% - 32px)',
                  resize: 'none',
                  padding: '16px',
                  outline: 'none',
                  border: 'none',
                  backgroundColor: palette.primary.light,
                  color: palette.text.primary,
                  borderTopLeftRadius: '8px',
                  borderBottomLeftRadius: '8px',
                }}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </Box>

          </Box>
        </Grid>

        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <NavigationTitle title="Diary" link="/diary" />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Today {today.format('DD.MM.YYYY')}</Typography>
            <IconButton
              sx={{ color: 'success.main' }}
              loading={createDiaryLoading || editDiaryLoading}
              disabled={!diaryContent.trim() && !diaryWorkContent.trim()}
              onClick={saveDiary}
            >
              <Save />
            </IconButton>
          </Box>

          <Typography>Content</Typography>

          <Box sx={{
            flex: 1,
            borderRadius: '8px',
            backgroundColor: 'primary.light',
          }}>
            <textarea
              value={diaryContent}
              rows={10}
              placeholder="Content"
              style={{
                width: 'calc(100% - 32px)',
                minHeight: 'calc(100% - 32px)',
                resize: 'none',
                padding: '16px',
                outline: 'none',
                border: 'none',
                backgroundColor: palette.primary.light,
                color: palette.text.primary,
                borderRadius: '8px'
              }}
              onChange={(e) => setDiaryContent(e.target.value)}
            />
          </Box>

          <Typography>Work / Projects</Typography>

          <Box sx={{
            flex: 0.5,
            borderRadius: '8px',
            backgroundColor: 'primary.light',
          }}>
            <textarea
              value={diaryWorkContent}
              rows={5}
              placeholder="Work / Projects"
              style={{
                width: 'calc(100% - 32px)',
                minHeight: 'calc(100% - 32px)',
                resize: 'none',
                padding: '16px',
                outline: 'none',
                border: 'none',
                backgroundColor: palette.primary.light,
                color: palette.text.primary,
                borderRadius: '8px'
              }}
              onChange={(e) => setDiaryWorkContent(e.target.value)}
            />
          </Box>

        </Grid>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  height: 100%;
  box-sizing: border-box;
  padding: 32px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;
