import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Clear } from "@mui/icons-material";
import { useDiaryEntries } from "../../api";
import { DiaryGridRow } from "../../components";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { DiaryEntry } from "../../types";

export const Diary = () => {

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(new Date()));
  const [searchText, setSearchText] = useState("");

  const { data: diaryEntries } = useDiaryEntries({
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
      }
    });
  }, [selectedDate, searchText.trim(), JSON.stringify(diaryEntries)])

  return (
    <Wrapper>
      <Header>
        <IconButton
          disabled={Boolean(searchText.trim())}
          onClick={() => setSelectedDate(selectedDate.subtract(1, 'month'))}
        >
          <ArrowLeft />
        </IconButton>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Month"
            views={["year", "month"]}
            openTo="month"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue ?? dayjs(new Date()))}
            enableAccessibleFieldDOMStructure={false}
            format="MMMM YYYY"
            disabled={Boolean(searchText.trim())}
            slotProps={{
              textField: {
                size: "small",
                placeholder: "Date",
              }
            }}
          />
        </LocalizationProvider>

        <IconButton
          disabled={Boolean(searchText.trim())}
          onClick={() => setSelectedDate(selectedDate.add(1, 'month'))}
        >
          <ArrowRight />
        </IconButton>

        <Button
          variant="contained"
          sx={{ ml: 1 }}
          onClick={() => setSelectedDate(dayjs(new Date()))}
          disabled={Boolean(searchText.trim()) || dayjs(new Date()).isSame(selectedDate, 'month')}
        >
          This Month
        </Button>

        <Button
          variant="outlined"
        >
          Monthly Summary
        </Button>

        <TextField
          sx={{
            ml: 'auto',
            minWidth: "35vw",
          }}
          label="Search diary entries"
          placeholder="Content, work content"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          slotProps={{
            input: {
              endAdornment: searchText.length > 0 && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setSearchText("")}
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }
          }}
        />
      </Header>

      <Box sx={{ overflowY: 'auto', p: '32px', pt: 0 }}>
        {displayedEntries?.length === 0 && (
          <Typography align="center" mt={7}>No diary entries.</Typography>
        )}
        <Grid container rowSpacing={1} flexGrow={1}>
          {displayedEntries?.map((entry) => (
            <DiaryGridRow key={entry.id} entry={entry} isSearching={Boolean(searchText.trim())} />
          ))}
        </Grid>
      </Box>

    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  height: 100%;
  box-sizing: border-box;
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 32px 0 32px;
`;
