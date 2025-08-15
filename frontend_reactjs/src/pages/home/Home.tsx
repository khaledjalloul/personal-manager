import { Box, Grid, IconButton, MenuItem, Select, TextField, Typography, useTheme } from "@mui/material";
import styled from "styled-components";
import { ExpensesStatisticsCard, ToDoTaskContainer } from "../../components";
import {
  useCreateDiaryEntry,
  useCreateNote,
  useDailyDiaryEntries,
  useEditDiaryEntry,
  useExpensesStatistics,
  useNoteCategories,
  useToDoTasks
} from "../../api";
import { ChevronRight, Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { DiaryEntry, DiaryEntryType, NoteCategory } from "../../types";
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
};

const DiaryContainer = () => {

  const { palette } = useTheme();

  const [diaryContent, setDiaryContent] = useState("");
  const [diaryWorkContent, setDiaryWorkContent] = useState("");

  const { data: diaryEntries } = useDailyDiaryEntries({
    year: today.year(),
    month: today.month(),
    searchText: ""
  });

  const { mutate: createDiaryEntry, isPending: createDiaryLoading } = useCreateDiaryEntry();
  const { mutate: editDiaryEntry, isPending: editDiaryLoading } = useEditDiaryEntry(DiaryEntryType.Daily);

  const todaysDiaryEntry = useMemo(() => {
    const empty: DiaryEntry = {
      id: -1,
      date: today.toDate(),
      content: "",
      workContent: "",
      type: DiaryEntryType.Daily
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
        type: DiaryEntryType.Daily,
      })
    else
      editDiaryEntry({
        id: todaysDiaryEntry.id,
        date: todaysDiaryEntry.date,
        content: diaryContent.trim(),
        workContent: diaryWorkContent.trim(),
      })
  };

  useCtrlS(saveDiary);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <NavigationTitle title="Diary" link="/diary" />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Today: {today.format('dddd, MMMM DD')}</Typography>
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
        border: `solid 1px ${palette.grey[700]}`,
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

      <Typography mt={2}>Work / Projects</Typography>

      <Box sx={{
        flex: 0.5,
        borderRadius: '8px',
        backgroundColor: 'primary.light',
        border: `solid 1px ${palette.grey[700]}`,
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

    </Box>
  );
}

const NewNoteContainer = () => {

  const navigate = useNavigate();
  const { palette } = useTheme();

  const [selectedNoteCategory, setSelectedNoteCategory] = useState<NoteCategory>();
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const { data: noteCategories } = useNoteCategories({ searchText: "" });

  const { mutate: createNote, isPending: createNoteLoading, isSuccess: createNoteSuccess, data: createNoteData } = useCreateNote();

  const saveNote = () => {
    if (!noteTitle.trim() || !noteContent.trim() || !selectedNoteCategory) return;
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

  useCtrlS(saveNote);

  useEffect(() => {
    if (noteCategories) setSelectedNoteCategory(noteCategories[0]);
  }, [JSON.stringify(noteCategories)]);

  useEffect(() => {
    if (createNoteSuccess) {
      setNoteTitle("");
      setNoteContent("");
      setSelectedNoteCategory(noteCategories?.[0]);
      navigate('/notes', { state: { routedNoteId: createNoteData.id } });
    }
  }, [createNoteSuccess]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <NavigationTitle title="Notes" link="/notes" />

      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        alignItems: { xs: 'stretch', lg: 'center' },
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ whiteSpace: 'nowrap' }}>New Note:</Typography>
          <IconButton
            size="small"
            sx={{
              display: { xs: 'block', lg: 'none' },
              color: 'success.main',
              ml: 'auto'
            }}
            loading={createNoteLoading}
            disabled={!noteTitle.trim() || !noteContent.trim() || !selectedNoteCategory}
            onClick={saveNote}
          >
            <Save />
          </IconButton>
        </Box>

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
            sx={{
              minWidth: { xs: 0, lg: 150 },
              ml: { xs: 0, lg: 2 },
            }}
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
          sx={{
            display: { xs: 'none', lg: 'block' },
            color: 'success.main',
            ml: 'auto'
          }}
          loading={createNoteLoading}
          disabled={!noteTitle.trim() || !noteContent.trim() || !selectedNoteCategory}
          onClick={saveNote}
        >
          <Save />
        </IconButton>
      </Box>

      <Box sx={{
        flexGrow: 1,
        borderRadius: '8px',
        border: `solid 1px ${palette.grey[700]}`,
        backgroundColor: 'primary.light',
        mt: { xs: 1, lg: 0 }
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
            borderRadius: '8px'
          }}
          onChange={(e) => setNoteContent(e.target.value)}
        />
      </Box>
    </Box>
  );
}

var today = dayjs()
today = dayjs(new Date(today.year(), today.month(), today.date(), 12));

export const Home = () => {

  const { data: expensesStatistics } = useExpensesStatistics();
  const { data: toDoTasks } = useToDoTasks({
    isArchived: false,
    searchText: "",
  });

  return (
    <Wrapper>
      <Grid
        container
        spacing={{ xs: 6, lg: 4 }}
        sx={{ flexGrow: 1, height: { xs: 'auto', xl: '100%' } }}
      >
        <Grid
          size={{ xs: 12, lg: 8 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 6, lg: 4 },
            height: { xs: 'auto', xl: '100%' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <NavigationTitle title="Expenses" link="/expenses" />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                <ExpensesStatisticsCard
                  title="Total Spent This Month"
                  value={expensesStatistics?.totalExpensesThisMonth}
                  color="primary.dark"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                <ExpensesStatisticsCard
                  title="Average Expenses Per Month"
                  value={expensesStatistics?.monthlyAverageExpenses}
                  color="warning.dark"
                />
              </Grid>
            </Grid>
          </Box>

          <Grid
            container
            spacing={{ xs: 6, lg: 4 }}
            sx={{ flexGrow: 1, overflowY: { xs: 'unset', xl: 'hidden' } }}>
            <Grid
              size={{ xs: 12, xl: 6 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                height: { xs: 'auto', xl: '100%' },
              }}>
              <NavigationTitle title="To Do" link="/todo" />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  mt: 1,
                  overflowY: 'auto',
                }}
              >
                {toDoTasks?.length === 0 && (
                  <Typography align="center" mt={3} mb={3}>No tasks.</Typography>
                )}
                {toDoTasks?.map((task) => (
                  <ToDoTaskContainer
                    key={task.id}
                    task={task}
                    searchText=""
                    isAddingTask={false}
                    setIsAddingTask={() => { }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid
              size={{ xs: 12, xl: 6 }}
              sx={{ display: { xs: 'none', lg: 'flex' } }}>
              <NewNoteContainer />
            </Grid>

            <Grid
              size={12}
              sx={{ display: { xs: 'flex', lg: 'none' } }}>
              <DiaryContainer />
            </Grid>
          </Grid>
        </Grid>

        <Grid
          size={4}
          sx={{ display: { xs: 'none', lg: 'flex' } }}>
          <DiaryContainer />
        </Grid>

        <Grid
          size={12}
          sx={{ display: { xs: 'flex', lg: 'none' } }}>
          <NewNoteContainer />
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
