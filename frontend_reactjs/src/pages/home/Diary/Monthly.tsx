import { Box, Grid, Typography, } from "@mui/material";
import { useMemo } from "react";
import { useMonthlyDiaryEntries } from "../../../api";
import { DiaryGridRow } from "../../../components";
import dayjs, { Dayjs } from 'dayjs';
import { DiaryEntry, DiaryEntryType } from "../../../types";
import { useOutletContext } from "react-router-dom";

export const MonthlyDiary = () => {

  const { selectedDate } = useOutletContext<{ selectedDate: Dayjs }>();

  const { data: monthlyDiary } = useMonthlyDiaryEntries({
    year: selectedDate.year(),
  });

  const displayedEntries: DiaryEntry[] | undefined = useMemo(() => (
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
  ), [selectedDate, JSON.stringify(monthlyDiary)])

  return (
    <Box sx={{ overflowY: 'auto', p: '32px', pt: 0 }}>
      {displayedEntries?.length === 0 && (
        <Typography align="center" mt={7}>No monthly diary entries.</Typography>
      )}
      <Grid container rowSpacing={1} flexGrow={1}>
        {displayedEntries?.map((entry) => (
          <DiaryGridRow key={entry.id} entry={entry} isSearching={false} />
        ))}
      </Grid>
    </Box>
  );
};
