import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import styled, { createGlobalStyle } from "styled-components";
import { useContext, useEffect, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import momentPlugin from '@fullcalendar/moment';
import { ManageCalendarEntryModal } from ".";
import { CalendarEntry } from "../types";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../utils";

const emptyEntry: CalendarEntry = {
  id: -1,
  title: "",
  description: "",
  location: "",
  startDate: new Date(),
  endDate: new Date()
};

export const Calendar = ({
  events,
  selectedDate,
  setSelectedDate,
  trimmedSearchText,
  searchIndex,
  routedDate,
  isHomePage = false,
}: {
  events: EventInput[],
  selectedDate: Dayjs,
  setSelectedDate: (date: Dayjs) => void,
  trimmedSearchText: string,
  searchIndex: number,
  routedDate?: Date,
  isHomePage?: boolean,
}) => {

  const theme = useTheme();
  const { userData } = useContext(UserContext);
  const isBreakpointSm = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [modalEntry, setModalEntry] = useState<CalendarEntry>();

  events = events.map((event, index) => !isHomePage && trimmedSearchText.length > 0 && searchIndex === index ? { ...event, color: theme.palette.warning.dark } : event);

  const calendarRef = useRef<FullCalendar>(null);

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
              cursor: isHomePage || !userData?.showPrivateContent ? 'default' : 'pointer'
            }}
            onClick={isHomePage || !userData?.showPrivateContent ? undefined : () => {
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
            {!isHomePage && routedDate && dayjs(routedDate).isSame(date, 'day') && (
              <Box sx={{
                backgroundColor: "warning.main",
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
        nowIndicator
        expandRows
        snapDuration={{ minutes: 15 }}
        editable={isHomePage ? false : true}
        selectable={isHomePage ? false : true}
        selectMirror
        events={events}
        select={isHomePage ? undefined : (newEvent) => {
          setModalEntry({
            ...emptyEntry,
            startDate: newEvent.start,
            endDate: newEvent.end
          })
        }}
        eventChange={isHomePage ? undefined : ({ event, revert }) => {
          if (event.id.startsWith("calendar-")) {
            // @ts-ignore
            const entry: CalendarEntry | undefined = events?.find(e => e.id === event.id)?.entry;
            if (entry && event.start && event.end)
              setModalEntry({ ...entry, startDate: event.start, endDate: event.end });
          }
          revert();
        }}
        eventClick={isHomePage ? undefined : ({ event }) => {
          if (event.id.startsWith("hike-")) {
            navigate("/sports/hiking", { state: { routedHighlightId: parseInt(event.id.replace("hike-", "")) } });
          } else if (event.id.startsWith("gym-"))
            navigate("/sports/gym", { state: { routedHighlightId: parseInt(event.id.replace("gym-", "")) } });
          else if (event.id.startsWith("run-"))
            navigate("/sports/running", { state: { routedHighlightId: parseInt(event.id.replace("run-", "")) } });
          else if (event.id.startsWith("calendar-")) {
            // @ts-ignore
            const entry: CalendarEntry | undefined = events?.find(e => e.id === event.id)?.entry;
            if (entry)
              setModalEntry(entry);
          }
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