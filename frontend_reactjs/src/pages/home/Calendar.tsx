import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import styled, { createGlobalStyle } from "styled-components";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ArrowLeft, ArrowRight, Clear } from "@mui/icons-material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import momentPlugin from '@fullcalendar/moment';
import { useCalendarEntries } from "../../api";
import { ManageCalendarEntryModal } from "../../components";
import { CalendarEntry } from "../../types";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../utils";


const emptyEntry: CalendarEntry = {
  id: -1,
  title: "",
  description: "",
  location: "",
  startDate: new Date(),
  endDate: new Date()
};

export const Calendar = () => {

  const theme = useTheme();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { userData, setUserData } = useContext(UserContext);
  const isBreakpointSm = useMediaQuery(theme.breakpoints.down("sm"));

  const { routedDate } = state as { routedDate?: Date } || { routedDate: undefined };

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(routedDate ?? userData?.lastSelectedCalendarDate));
  const [searchText, setSearchText] = useState<string>("");
  const [searchIndex, setSearchIndex] = useState<number>(0);
  const [modalEntry, setModalEntry] = useState<CalendarEntry>();

  const { data: calendarEntries } = useCalendarEntries({
    date: selectedDate.toDate(),
    // Only consider search text with 3 or more characters to avoid rapid frontend update and freezing
    searchText: searchText.trim().length >= 3 ? searchText.trim() : "",
  });

  const calendarRef = useRef<FullCalendar>(null);
  const isSearchMode = searchText.trim().length >= 3;

  const events = useMemo((): EventInput[] => {
    return calendarEntries?.map((entry, index) => ({
      id: entry.id.toString(),
      start: entry.startDate,
      end: entry.endDate,
      title: `${entry.title}${entry.description ? ` - ${entry.description}` : ''}${entry.location ? ` (${entry.location})` : ''}`,
      color: isSearchMode && index === searchIndex ? theme.palette.warning.dark : ""
    })) ?? [];
  }, [calendarEntries, isSearchMode]);

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
    if (calendarRef.current)
      calendarRef.current.getApi().gotoDate(selectedDate.toDate());

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
                format={"dddd, MMMM DD, YYYY"}
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
          disabled={dayjs().isSame(selectedDate, 'day')}
          onClick={() => setSelectedDate(dayjs())}
        >
          Today
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

      <GlobalCalendarStyle />

      <CalendarWrapper isBreakpointSm={isBreakpointSm}>
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin, momentPlugin]}
          headerToolbar={false}
          allDaySlot={false}
          slotLabelFormat={"h A"}
          eventTimeFormat={"h:mm A"}
          dayHeaderContent={({ date }) => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                alignItems: 'center',
                gap: { xs: 0.5, md: 1 },
                pb: { xs: 0.5, sm: 0 },
                cursor: 'pointer'
              }}
              onClick={() => {
                navigate("/diary", { state: { routedDate: date } });
                setSelectedDate(dayjs(date));
              }}
            >
              {selectedDate.isSame(date, 'day') && (
                <Box sx={{
                  backgroundColor: "primary.main",
                  width: 8,
                  height: 8,
                  borderRadius: 1,
                }} />
              )}
              <Typography variant="body2">
                {dayjs(date).format(isBreakpointSm ?
                  "dd DD.MM" :
                  "dddd, MMMM DD")}
              </Typography>
            </Box>
          )}
          slotMinTime={{ hours: 6 }}
          height={isBreakpointSm ? "auto" : "100%"}
          firstDay={1}
          nowIndicator
          expandRows
          snapDuration={{ minutes: 15 }}
          editable
          selectable
          selectMirror
          events={events}
          select={(newEvent) => {
            setModalEntry({
              ...emptyEntry,
              startDate: newEvent.start,
              endDate: newEvent.end
            })
          }}
          eventChange={({ event }) => {
            const entry = calendarEntries?.find(e => e.id === parseInt(event.id));
            if (entry && event.start && event.end)
              setModalEntry({ ...entry, startDate: event.start, endDate: event.end });
          }}
          eventClick={({ event }) => {
            const entry = calendarEntries?.find(e => e.id === parseInt(event.id));
            if (entry)
              setModalEntry(entry);
          }}
        />
      </CalendarWrapper>

      {modalEntry && (
        <ManageCalendarEntryModal
          isOpen={Boolean(modalEntry)}
          setIsOpen={() => setModalEntry(undefined)}
          entry={modalEntry || emptyEntry}
        />
      )}

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

const CalendarWrapper = styled(Box) <{ isBreakpointSm: boolean }>`
  height: ${({ isBreakpointSm }) => isBreakpointSm ? "auto" : "100%"};

 & * {
  font-family: ${({ theme }) => theme.typography.fontFamily};
 }

  & .fc-scrollgrid-section-sticky > * {
  background: transparent;
 }

 & .fc-timegrid-slot{
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
 }

 & .fc-scrollgrid-section-header{
  color: ${({ theme }) => theme.palette.text.primary};
 }
`;

const GlobalCalendarStyle = createGlobalStyle`
:root {
  --fc-small-font-size: ${({ theme }) => theme.typography.body2.fontSize};
  --fc-border-color: ${({ theme }) => theme.palette.grey[800]};

  --fc-event-bg-color: ${({ theme }) => theme.palette.primary.dark};
  --fc-page-bg-color: ${({ theme }) => theme.palette.grey[700]}; // Event border
  --fc-event-text-color: ${({ theme }) => theme.palette.primary.contrastText};

  --fc-today-bg-color: ${({ theme }) => theme.palette.primary.light};
  --fc-now-indicator-color: ${({ theme }) => theme.palette.warning.main};
}
`