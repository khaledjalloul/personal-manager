import { Box, Button, IconButton, InputAdornment, TextField, Typography, useTheme, } from "@mui/material";
import styled from "styled-components";
import { useContext, useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ArrowLeft, ArrowRight, Clear } from "@mui/icons-material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCalendarEntries, useGymSessions, useHikes, useRuns } from "../../api";
import { Calendar as CalendarComponent } from "../../components";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../utils";
import { EventInput } from "@fullcalendar/core";

export const Calendar = () => {

  const { state } = useLocation();
  const { userData, setUserData } = useContext(UserContext);

  const { routedDate } = state as { routedDate?: Date } || { routedDate: undefined };

  const [selectedDate, setSelectedDateOg] = useState<Dayjs>(dayjs(routedDate ?? userData?.calendarLastSelectedDate).subtract(1, 'day').startOf('week').add(1, 'day'));
  const setSelectedDate = (date: Dayjs) => setSelectedDateOg(date.subtract(1, 'day').startOf('week').add(1, 'day'));
  const [searchText, setSearchText] = useState<string>("");
  const [searchIndex, setSearchIndex] = useState<number>(0);

  const trimmedSearchText = searchText.trim().length >= 3 ? searchText.trim() : "";
  const isSearchMode = trimmedSearchText.length > 0;

  const { data: calendarEntries } = useCalendarEntries({
    date: selectedDate.toDate(),
    // Only consider search text with 3 or more characters to avoid rapid frontend update and freezing
    searchText: trimmedSearchText,
  });
  const { data: hikes } = useHikes({
    searchText: trimmedSearchText.toLowerCase().replaceAll("hike", "")
  });
  const { data: gymSessions } = useGymSessions({
    searchText: trimmedSearchText.toLowerCase().replaceAll("gym", "")
  });
  const { data: runs } = useRuns({
    searchText: trimmedSearchText.toLowerCase().replaceAll("run", ""),
    orderBy: "date",
    orderDirection: "asc"
  });

  const events = useMemo((): EventInput[] => {
    var events: EventInput[] = [];
    events = events.concat(calendarEntries?.map((entry) => ({
      id: `calendar-${entry.id}`,
      start: entry.startDate,
      end: entry.endDate,
      title: `${entry.title}${entry.description ? ` - ${entry.description}` : ''}${entry.location ? ` (${entry.location})` : ''}`,
      color: "",
      entry,
    })) ?? []);
    events = events.concat(hikes?.map((hike) => ({
      id: `hike-${hike.id}`,
      start: hike.date,
      end: dayjs(hike.date).add(hike.elapsedTime, 'seconds').toDate(),
      title: `Hike${hike.description ? ` - ${hike.description}` : ''}`,
      color: "",
    })) ?? []);
    events = events.concat(gymSessions?.map((session) => ({
      id: `gym-${session.id}`,
      start: session.date,
      end: dayjs(session.date).add(1, 'hour').toDate(),
      title: `Gym${session.note ? ` - ${session.note}` : ''}${session.location ? ` (${session.location})` : ''}`,
      color: "",
    })) ?? []);
    events = events.concat(runs?.map((run) => ({
      id: `run-${run.id}`,
      start: run.date,
      end: dayjs(run.date).add(Math.max(run.elapsedTime, 60 * 60), 'seconds').toDate(),
      title: `Run${run.description ? ` - ${run.description}` : ''}`,
      color: "",
    })) ?? []);
    events.sort((a, b) => {
      if (a.start && b.start) {
        return dayjs(a.start.toString()).diff(dayjs(b.start.toString()));
      } else {
        return 0;
      }
    });
    return events;
  }, [calendarEntries, hikes, gymSessions, runs, isSearchMode]);

  useEffect(() => {
    if (isSearchMode && events) {
      setSearchIndex(0);
      if (events.length > 0) {
        const firstDate = dayjs(events[0].start?.toString());
        setSelectedDate(firstDate);
      }
    }
  }, [JSON.stringify(events), isSearchMode]);

  useEffect(() => {
    if (userData)
      setUserData({
        ...userData,
        calendarLastSelectedDate: selectedDate.toDate(),
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
              disabled={!events || events.length === 0}
              onClick={() => {
                if (!events) return;
                const newIndex = searchIndex === 0 ? events.length - 1 : searchIndex - 1;
                setSearchIndex(newIndex);
                setSelectedDate(dayjs(events[newIndex].start?.toString()));
              }}
            >
              <ArrowLeft />
            </IconButton>

            <Typography>
              {events && events.length > 0 ? searchIndex + 1 : 0} / {events?.length} search entries
            </Typography>

            <IconButton
              disabled={!events || events.length === 0}
              onClick={() => {
                if (!events) return;
                const newIndex = searchIndex === events.length - 1 ? 0 : searchIndex + 1;
                setSearchIndex(newIndex);
                setSelectedDate(dayjs(events[newIndex].start?.toString()));
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
        events={events}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        trimmedSearchText={trimmedSearchText}
        routedDate={routedDate}
        searchIndex={searchIndex}
      />

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
