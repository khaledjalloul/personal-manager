import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import styled, { createGlobalStyle } from "styled-components";
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import momentPlugin from '@fullcalendar/moment';
import { useCalendarEntries } from "../api"
import { ManageCalendarEntryModal } from ".";
import { CalendarEntry } from "../types";
import { useNavigate } from "react-router-dom";

const emptyEntry: CalendarEntry = {
  id: -1,
  title: "",
  description: "",
  location: "",
  startDate: new Date(),
  endDate: new Date()
};

export const Calendar = ({
  selectedDate,
  setSelectedDate,
  searchText,
  searchIndex,
  isHomePage = false,
}: {
  selectedDate: Dayjs,
  setSelectedDate: (date: Dayjs) => void,
  searchText: string,
  searchIndex: number,
  isHomePage?: boolean,
}) => {

  const theme = useTheme();
  const isBreakpointSm = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

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
    if (calendarRef.current)
      calendarRef.current.getApi().gotoDate(selectedDate.toDate());
  }, [selectedDate]);

  return (
    <Wrapper isBreakpointSm={isBreakpointSm}>

      <GlobalCalendarStyle />

      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin, momentPlugin]}
        headerToolbar={false}
        allDaySlot={false}
        slotLabelFormat={"h A"}
        eventTimeFormat={"h:mm A"}
        initialView={isHomePage ? "today" : "week"}
        firstDay={1}
        views={{
          today: {
            type: "timeGrid",
            duration: { days: 1 }
          },
          week: {
            type: "timeGrid",
            duration: { days: 7 }
          }
        }}
        dayHeaderContent={({ date }) => (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column-reverse', sm: 'row' },
              alignItems: 'center',
              gap: { xs: 0.5, md: 1 },
              pb: { xs: 0.5, sm: 0 },
              cursor: isHomePage ? 'default' : 'pointer'
            }}
            onClick={isHomePage ? undefined : () => {
              navigate("/diary", { state: { routedDate: date } });
              setSelectedDate(dayjs(date));
            }}
          >
            {!isHomePage && dayjs().isSame(date, 'day') && (
              <Box sx={{
                backgroundColor: "primary.main",
                width: 8,
                height: 8,
                borderRadius: 1,
              }} />
            )}
            <Typography variant="body2">
              {dayjs(date).format(isBreakpointSm && !isHomePage ?
                "dd DD.MM" :
                "dddd, MMMM DD")}
            </Typography>
          </Box>
        )}
        slotMinTime={{ hours: 6 }}
        height={isBreakpointSm ? "auto" : "100%"}
        // firstDay={1}
        nowIndicator
        expandRows
        snapDuration={{ minutes: 15 }}
        editable={isHomePage ? false : true}
        selectable={isHomePage ? false : true}
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

      {modalEntry && (
        <ManageCalendarEntryModal
          isOpen={Boolean(modalEntry)}
          setIsOpen={() => setModalEntry(undefined)}
          entry={modalEntry || emptyEntry}
        />
      )}

    </Wrapper>
  )
}


const Wrapper = styled(Box) <{ isBreakpointSm: boolean }>`
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