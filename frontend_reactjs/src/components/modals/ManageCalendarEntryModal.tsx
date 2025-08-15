import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { useCreateCalendarEntry, useDeleteCalendarEntry, useEditCalendarEntry } from "../../api";
import { CalendarEntry } from "../../types";
import { useCtrlS, useKeybinding } from "../../utils";
import {
  Clear,
  Delete,
  Description,
  DriveFileRenameOutline,
  KeyboardDoubleArrowRight,
  LocationPin,
  Repeat,
  Save,
  Schedule,
  Today,
} from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileTimePicker } from "@mui/x-date-pickers";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

export const ManageCalendarEntryModal = ({
  isOpen,
  setIsOpen,
  entry
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  entry: CalendarEntry
}) => {

  const isNew = entry.id === -1;

  const [title, setTitle] = useState(entry.title);
  const [description, setDescription] = useState(entry.description);
  const [location, setLocation] = useState(entry.location);
  const [startDate, setStartDate] = useState(dayjs(entry.startDate));
  const [endDate, setEndDate] = useState(dayjs(entry.endDate));
  const [repeatUntilDate, setRepeatUntilDate] = useState<Dayjs>();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { mutate: createEntry, isPending: createLoading, isSuccess: createSuccess } = useCreateCalendarEntry();
  const { mutate: editEntry, isPending: editLoading, isSuccess: editSuccess } = useEditCalendarEntry();
  const { mutate: deleteEntry, isPending: deleteLoading, isSuccess: deleteSuccess } = useDeleteCalendarEntry();

  const save = () => {
    if (!title.trim() || !startDate || !endDate) return;

    if (isNew)
      createEntry({
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        repeatUntilDate: repeatUntilDate?.toDate()
      });
    else
      editEntry({
        id: entry.id,
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        startDate: startDate.toDate(),
        endDate: endDate.toDate()
      });
  };

  useCtrlS(save);
  useKeybinding("d", () => {
    setConfirmDeleteOpen(true);
  });

  useEffect(() => {
    if (repeatUntilDate)
      setRepeatUntilDate(oldDate => oldDate?.hour(endDate.hour()).minute(endDate.minute()).second(endDate.second()));
  }, [endDate]);

  useEffect(() => {
    if (createSuccess || editSuccess || deleteSuccess) setIsOpen(false);
  }, [createSuccess, editSuccess, deleteSuccess, setIsOpen]);

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <Wrapper>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">{isNew ? "Add" : "Edit"} Calendar Entry</Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <DriveFileRenameOutline sx={{ color: 'text.primary' }} />
              <TextField
                variant="standard"
                value={title}
                placeholder="Title"
                sx={{ width: '100%' }}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Description sx={{ color: 'text.primary' }} />
              <TextField
                variant="standard"
                value={description}
                placeholder="Description (Optional)"
                sx={{ width: '100%' }}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LocationPin sx={{ color: 'text.primary' }} />
              <TextField
                variant="standard"
                value={location}
                placeholder="Location (Optional)"
                sx={{ width: '100%' }}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Today sx={{ color: 'text.primary' }} />
              <DatePicker
                value={startDate}
                onChange={(newValue) => {
                  setStartDate((newValue ?? dayjs()).hour(startDate.hour()).minute(startDate.minute()).second(startDate.second()));
                  setEndDate((newValue ?? dayjs()).hour(endDate.hour()).minute(endDate.minute()).second(endDate.second()));
                }}
                enableAccessibleFieldDOMStructure={false}
                format={"dddd, MMMM DD, YYYY"}
                slotProps={{
                  textField: {
                    size: "small",
                    variant: "standard",
                    placeholder: "Date",
                  }
                }}
                sx={{ flexGrow: 1 }}
              />
            </Box>

            <Box sx={{
              display: "flex",
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: "center",
              gap: 2
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Schedule sx={{ color: 'text.primary' }} />
                <MobileTimePicker
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue ?? dayjs())}
                  slotProps={{
                    textField: {
                      size: "small",
                      variant: "standard",
                      placeholder: "Start Time",
                    }
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <KeyboardDoubleArrowRight
                  sx={{ color: "text.primary" }}
                  fontSize="small" />
                <MobileTimePicker
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue ?? dayjs())}
                  slotProps={{
                    textField: {
                      size: "small",
                      variant: "standard",
                      placeholder: "End Time",
                    }
                  }}
                />
              </Box>
            </Box>

            {isNew && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Repeat sx={{ color: 'text.primary' }} />
                <DatePicker
                  value={repeatUntilDate ?? null}
                  onChange={(newValue) =>
                    setRepeatUntilDate((newValue ?? dayjs()).hour(endDate.hour()).minute(endDate.minute()).second(endDate.second()))}
                  enableAccessibleFieldDOMStructure={false}
                  format={"dddd, MMMM DD, YYYY"}
                  slotProps={{
                    textField: {
                      size: "small",
                      variant: "standard",
                      placeholder: "Repeat Weekly Until",
                    }
                  }}
                  sx={{ flexGrow: 1 }}
                />
                <IconButton size="small" onClick={() => setRepeatUntilDate(undefined)} sx={{ ml: -2 }}>
                  <Clear fontSize="small" />
                </IconButton>
              </Box>
            )}


            <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center', gap: 2 }}>
              <IconButton
                color="success"
                loading={createLoading || editLoading}
                disabled={!title.trim() || !startDate || !endDate}
                onClick={save}
              >
                <Save />
              </IconButton>

              {!isNew && (
                <IconButton
                  color="error"
                  loading={deleteLoading}
                  onClick={() => setConfirmDeleteOpen(true)}
                >
                  <Delete />
                </IconButton>
              )}

              <IconButton
                onClick={() => setIsOpen(false)}
              >
                <Clear />
              </IconButton>
            </Box>
          </Box>
        </LocalizationProvider>

        <ConfirmDeleteDialog
          isOpen={confirmDeleteOpen}
          setIsOpen={setConfirmDeleteOpen}
          deleteFn={() => deleteEntry({ id: entry.id })}
          itemName={`calendary entry: ${entry.title}`}
        />

      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-color: ${({ theme }) => theme.palette.background.default};
  padding: 24px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  outline: none;
`;


