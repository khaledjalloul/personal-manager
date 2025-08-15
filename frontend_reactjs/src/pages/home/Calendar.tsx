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
import { useEffect, useMemo, useRef, useState } from "react";
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


const emptyEntry: CalendarEntry = {
  id: -1,
  title: "",
  description: "",
  location: "",
  startDate: new Date(),
  endDate: new Date()
};

export const Calendar = () => {

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [searchText, setSearchText] = useState<string>("");
  const [modalEntry, setModalEntry] = useState<CalendarEntry>();

  const { data: calendarEntries } = useCalendarEntries({
    date: selectedDate.toDate(),
    searchText: searchText.trim()
  });

  const events = useMemo((): EventInput[] => {
    return calendarEntries?.map(entry => ({
      id: entry.id.toString(),
      start: entry.startDate,
      end: entry.endDate,
      title: `${entry.title}${entry.description ? ` - ${entry.description}` : ''}${entry.location ? ` (${entry.location})` : ''}`,
    })) ?? [];
  }, [calendarEntries]);

  const calendarRef = useRef<FullCalendar>(null);

  const theme = useTheme();
  const isBreakpointSm = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(selectedDate.toDate());
    }
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

        <Button
          variant="contained"
          sx={{
            ml: { xs: 0, sm: 'auto', lg: 0 },
            width: { xs: 'auto', sm: 105 },
            textWrap: 'nowrap',
          }}
          disabled={dayjs().isSame(selectedDate, 'week')}
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

      <GlobalCalendarStyle />

      <CalendarWrapper isBreakpointSm={isBreakpointSm}>
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin, momentPlugin]}
          headerToolbar={false}
          allDaySlot={false}
          slotLabelFormat={"h A"}
          eventTimeFormat={"h:mm A"}
          dayHeaderFormat={isBreakpointSm ?
            "dd DD.MM" :
            "dddd, MMMM DD"
          }
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