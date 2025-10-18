import { Box, Button, IconButton, InputAdornment, TextField, Typography, } from "@mui/material";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ArrowLeft, ArrowRight, Clear } from "@mui/icons-material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCalendarEntries } from "../../api";
import { Calendar as CalendarComponent } from "../../components";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../utils";

export const Calendar = () => {

  const { state } = useLocation();
  const { userData, setUserData } = useContext(UserContext);

  const { routedDate } = state as { routedDate?: Date } || { routedDate: undefined };

  const [selectedDate, setSelectedDateOg] = useState<Dayjs>(dayjs(routedDate ?? userData?.lastSelectedCalendarDate).startOf('week').add(1, 'day'));
  const setSelectedDate = (date: Dayjs) => setSelectedDateOg(date.subtract(1, 'day').startOf('week').add(1, 'day'));
  const [searchText, setSearchText] = useState<string>("");
  const [searchIndex, setSearchIndex] = useState<number>(0);

  const { data: calendarEntries } = useCalendarEntries({
    date: selectedDate.toDate(),
    // Only consider search text with 3 or more characters to avoid rapid frontend update and freezing
    searchText: searchText.trim().length >= 3 ? searchText.trim() : "",
  });

  const isSearchMode = searchText.trim().length >= 3;

  useEffect(() => {
    if (isSearchMode && calendarEntries) {
      setSearchIndex(0);
      if (calendarEntries.length > 0) {
        const firstDate = dayjs(calendarEntries[0].startDate);
        setSelectedDate(firstDate);
      }
    }
  }, [JSON.stringify(calendarEntries), isSearchMode]);

  useEffect(() => {
    if (userData)
      setUserData({
        ...userData,
        lastSelectedCalendarDate: selectedDate.toDate(),
      });
  }, [selectedDate]);

  return (
    <Wrapper>
      <Header
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 1 }
        }}
      >
        <Typography variant="h5" sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}>
          Calendar
        </Typography>

        {!isSearchMode ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => setSelectedDate(selectedDate.subtract(1, 'week'))}
            >
              <ArrowLeft />
            </IconButton>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue ?? dayjs())}
                enableAccessibleFieldDOMStructure={false}
                format={"MMMM DD, YYYY"}
                slotProps={{
                  textField: {
                    size: "small",
                    placeholder: "Date",
                  }
                }}
                sx={{ flexGrow: 1 }}
              />
            </LocalizationProvider>

            <IconButton
              onClick={() => setSelectedDate(selectedDate.add(1, 'week'))}
            >
              <ArrowRight />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              disabled={!calendarEntries || calendarEntries.length === 0}
              onClick={() => {
                if (!calendarEntries) return;
                const newIndex = searchIndex === 0 ? calendarEntries.length - 1 : searchIndex - 1;
                setSearchIndex(newIndex);
                setSelectedDate(dayjs(calendarEntries[newIndex].startDate));
              }}
            >
              <ArrowLeft />
            </IconButton>

            <Typography>
              {calendarEntries && calendarEntries.length > 0 ? searchIndex + 1 : 0} / {calendarEntries?.length} search entries
            </Typography>

            <IconButton
              disabled={!calendarEntries || calendarEntries.length === 0}
              onClick={() => {
                if (!calendarEntries) return;
                const newIndex = searchIndex === calendarEntries.length - 1 ? 0 : searchIndex + 1;
                setSearchIndex(newIndex);
                setSelectedDate(dayjs(calendarEntries[newIndex].startDate));
              }}
            >
              <ArrowRight />
            </IconButton>
          </Box>
        )}

        <Button
          variant="contained"
          sx={{
            ml: { xs: 0, sm: 'auto', lg: 0 },
            width: { xs: 'auto', sm: 105 },
            textWrap: 'nowrap',
          }}
          disabled={dayjs().subtract(1, 'day').isSame(selectedDate, 'week')}
          onClick={() => setSelectedDate(dayjs())}
        >
          This Week
        </Button>

        <TextField
          sx={{
            ml: { xs: 0, lg: "auto" },
            minWidth: { xs: 0, lg: "35vw" },
          }}
          label="Search calendar"
          placeholder="Title, description, location"
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

      <CalendarComponent
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        searchText={searchText}
        searchIndex={searchIndex} />

    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  height: 100%;
  box-sizing: border-box;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
`;

const Header = styled(Box)`
  display: flex;
`;
