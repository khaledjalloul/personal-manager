import { Box, Typography, } from "@mui/material";
import { useMemo } from "react";
import { useMonthlyDiaryEntries } from "../../../api";
import { DiaryEntryContainer } from "../../../components";
import dayjs, { Dayjs } from 'dayjs';
import { DiaryEntry, DiaryEntryType } from "../../../types";
import { useOutletContext } from "react-router-dom";

export const MonthlyDiary = () => {

  const { searchText, selectedDate } = useOutletContext<{ searchText: string, selectedDate: Dayjs }>();

  const { data: monthlyDiary } = useMonthlyDiaryEntries({
    year: selectedDate.year(),
    searchText: searchText.trim(),
  });

  const displayedEntries: DiaryEntry[] | undefined = useMemo(() =>
    searchText.trim() ? monthlyDiary?.entries : (
      monthlyDiary?.months.map((month) => {
        const date = dayjs(month);

        const existingEntry = monthlyDiary?.entries.find(entry => dayjs(entry.date).isSame(date, 'month'));
        if (existingEntry)
          return existingEntry;

        return {
          id: -1 * (date.month() + 1), // negative ID to avoid conflicts with real entries
          date: date.toDate(),
          content: "",
          workContent: "",
          type: DiaryEntryType.Monthly
        }
      })
    ), [selectedDate, searchText.trim(), JSON.stringify(monthlyDiary)])

  return (
    <Box sx={{
      overflowY: { xs: 'unset', sm: 'auto' },
      p: '32px',
      pt: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 3, md: 1 }
    }}>
      {displayedEntries?.length === 0 && (
        <Typography align="center" mt={7}>No monthly diary entries.</Typography>
      )}
      {displayedEntries?.map((entry) => (
        <DiaryEntryContainer key={entry.id} entry={entry} searchText={searchText} />
      ))}
    </Box>
  );
};
