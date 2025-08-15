import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
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
  const [disabled, setDisabled] = useState<boolean>(false);
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
      title: `${entry.title} - ${entry.description}`,
    })) ?? [];
  }, [calendarEntries]);

  const calendarRef = useRef<FullCalendar>(null);

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
              format={"DD.MM.YYYY"}
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
          Today
        </Button>

        <TextField
          sx={{
            ml: { xs: 0, lg: "auto" },
            minWidth: { xs: 0, lg: "35vw" },
          }}
          label="Search calendar"
          placeholder="TODO"
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

      <CalendarWrapper>
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          headerToolbar={false}
          allDaySlot={false}
          slotLabelFormat={{ hour: 'numeric', minute: '2-digit', hourCycle: 'h24' }}
          slotMinTime={{ hours: 6 }}
          height="100%"
          firstDay={1}
          nowIndicator
          expandRows
          snapDuration={{ minutes: 15 }}
          editable={!disabled}
          selectable={!disabled}
          selectMirror={!disabled}
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

const CalendarWrapper = styled(Box)`
height: 100%;

 & * {
  font-family: ${({ theme }) => theme.typography.fontFamily};
 }

 & .fc-timegrid-slot{
  color: ${({ theme }) => theme.palette.text.primary};
 }

 & .fc-scrollgrid-section-header{
  color: ${({ theme }) => theme.palette.text.primary};
 }
`;

const GlobalCalendarStyle = createGlobalStyle`
:root {
  --fc-small-font-size: ${({ theme }) => theme.typography.body2.fontSize};
  --fc-border-color: ${({ theme }) => theme.palette.grey[700]};

  --fc-event-bg-color: ${({ theme }) => theme.palette.primary.main};
  --fc-page-bg-color: ${({ theme }) => theme.palette.grey[500]}; // Event border
  --fc-event-text-color: ${({ theme }) => theme.palette.primary.contrastText};

  --fc-today-bg-color: ${({ theme }) => theme.palette.primary.light};
  /* --fc-now-indicator-color: ${({ theme }) => theme.palette.primary.main}; */
  --fc-now-indicator-color: orange;
}
`