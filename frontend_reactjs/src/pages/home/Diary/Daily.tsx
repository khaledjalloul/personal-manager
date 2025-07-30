import { Box, Typography, } from "@mui/material";
import { useMemo } from "react";
import { useDailyDiaryEntries } from "../../../api";
import { DiaryEntryContainer } from "../../../components";
import dayjs, { Dayjs } from 'dayjs';
import { DiaryEntry, DiaryEntryType } from "../../../types";
import { useOutletContext } from "react-router-dom";

export const DailyDiary = () => {

  const { searchText, selectedDate } = useOutletContext<{ searchText: string, selectedDate: Dayjs }>();

  const { data: diaryEntries } = useDailyDiaryEntries({
    year: selectedDate.year(),
    month: selectedDate.month(),
    searchText: searchText.trim(),
  });

  const displayedEntries: DiaryEntry[] | undefined = useMemo(() => {
    if (searchText.trim())
      return diaryEntries;

    const lastDayOfMonth = new Date(selectedDate.year(), selectedDate.month() + 1, 0);
    const listOfDays = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1);

    return listOfDays.map((day) => {
      const date = dayjs(new Date(selectedDate.year(), selectedDate.month(), day, 12));

      const existingEntry = diaryEntries?.find(entry => dayjs(entry.date).isSame(date, 'day'));
      if (existingEntry)
        return existingEntry;

      return {
        id: -1 * day, // negative ID to avoid conflicts with real entries
        date: date.toDate(),
        content: "",
        workContent: "",
        type: DiaryEntryType.Daily
      }
    });
  }, [selectedDate, searchText.trim(), JSON.stringify(diaryEntries)])

  return (
    <Box sx={{
      overflowY: 'auto',
      p: '32px',
      pr: '24px', // Adjusting for scrollbar
      pt: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 3, md: 1 }
    }}>
      {displayedEntries?.length === 0 && (
        <Typography align="center" mt={7}>No diary entries.</Typography>
      )}
      {displayedEntries?.map((entry) => (
        <DiaryEntryContainer key={entry.id} entry={entry} searchText={searchText} />
      ))}
    </Box>
  );
};
