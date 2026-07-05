import { Box, Typography, useTheme, } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import { useDailyDiaryEntries } from "../../../api";
import { DiaryEntryContainer } from "../../../components";
import dayjs, { Dayjs } from 'dayjs';
import { DiaryEntry, DiaryEntryType } from "../../../types";
import { useOutletContext } from "react-router-dom";

export const DailyDiary = () => {
  const { palette } = useTheme();

  const { searchText, selectedDate, routedDate, sortOrder } = useOutletContext<{
    searchText: string,
    selectedDate: Dayjs,
    routedDate?: Date,
    sortOrder: "asc" | "desc"
  }>();

  const isSearchMode = searchText.length >= 3;

  const { data: diaryEntries, isFetched } = useDailyDiaryEntries({
    year: selectedDate.year(),
    month: selectedDate.month(),
    // Only consider search text with 3 or more characters to avoid rapid frontend update and freezing
    // Encoded search text to allow special characters
    // Intentionally untrimmed to search for words with spaces
    searchText: isSearchMode ? encodeURIComponent(searchText) : "",
    sortOrder
  });

  const displayedEntries: DiaryEntry[] | undefined = useMemo(() => {
    if (isSearchMode)
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
  }, [selectedDate, isSearchMode, JSON.stringify(diaryEntries)])

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isFetched && isSearchMode)
      containerRef.current?.scrollTo({ top: 0 });
  }, [isFetched, isSearchMode]);

  return (
    <Box
      ref={containerRef}
      sx={{
        overflowY: { xs: 'unset', sm: 'auto' },
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
      {displayedEntries?.map((entry, index) => (
        <Box>
          <hr style={{
            display: entry.date.getDay() === 1 && index !== 0 && !isSearchMode ? "block" : "none",
            marginBottom: '16px',
            borderWidth: 0,
            height: '1px',
            backgroundColor: palette.grey[400],
          }} />

          <DiaryEntryContainer
            key={entry.id}
            entry={entry}
            searchText={searchText}
            selectedDate={selectedDate}
            routedDate={routedDate}
            dataFetched={isFetched}
          />
        </Box>
      ))}
    </Box>
  );
};
