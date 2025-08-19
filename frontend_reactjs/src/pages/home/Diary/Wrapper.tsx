import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Clear, Today, ViewList } from "@mui/icons-material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDailyDiaryEntries, useMonthlyDiaryEntries } from "../../../api";
import { UserContext } from "../../../utils";

export const DiaryWrapper = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);

  const { routedDate } = location.state as { routedDate?: Date } || { routedDate: undefined };

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(routedDate ?? userData?.lastSelectedDiaryDate));
  const [searchText, setSearchText] = useState("");

  const { data: dailyEntries } = useDailyDiaryEntries({
    year: selectedDate.year(),
    month: selectedDate.month(),
    searchText: encodeURIComponent(searchText),
  });
  const { data: monthlyDiary } = useMonthlyDiaryEntries({
    year: selectedDate.year(),
    searchText: searchText.trim(),
  });

  const isDaily = location.pathname === "/diary";

  useEffect(() => {
    if (userData)
      setUserData({
        ...userData,
        lastSelectedDiaryDate: selectedDate.toDate(),
      });
  }, [selectedDate]);

  return (
    <Wrapper>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: { xs: 'stretch', lg: 'center' },
          gap: 2,
          padding: "0 32px 0 32px"
        }}
      >

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 1 },
          flexGrow: 1,
        }}
        >
          <Typography variant="h5" sx={{ whiteSpace: 'nowrap', mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}>
            Diary {searchText ? `(${isDaily ? dailyEntries?.length : monthlyDiary?.entries.length || 0})` : ""}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              disabled={Boolean(searchText.trim())}
              onClick={() => setSelectedDate(
                isDaily ? selectedDate.date(1).subtract(1, 'month') : selectedDate.month(1).date(1).subtract(1, 'year')
              )}
            >
              <ArrowLeft />
            </IconButton>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={isDaily ? "Month" : "Year"}
                views={isDaily ? ["year", "month"] : ["year"]}
                openTo={isDaily ? "month" : "year"}
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue ?? dayjs())}
                enableAccessibleFieldDOMStructure={false}
                format={isDaily ? "MMMM YYYY" : "YYYY"}
                disabled={Boolean(searchText.trim())}
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
              disabled={Boolean(searchText.trim())}
              onClick={() => setSelectedDate(
                isDaily ? selectedDate.date(1).add(1, 'month') : selectedDate.month(1).date(1).add(1, 'year')
              )}
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
            onClick={() => setSelectedDate(dayjs())}
            disabled={Boolean(searchText.trim()) || dayjs().isSame(selectedDate, 'day')}
          >
            {isDaily ? "Today" : "This Year"}
          </Button>

          <Button
            variant="outlined"
            startIcon={isDaily ? <Today /> : <ViewList />}
            sx={{ whiteSpace: 'nowrap' }}
            onClick={() => navigate(isDaily ? "/diary/monthly" : "/diary")}
          >
            {isDaily ? "Monthly Summary" : "Daily Entries"}
          </Button>
        </Box>

        <TextField
          sx={{
            ml: { xs: 0, lg: "auto" },
            minWidth: { xs: 0, lg: "35vw" },
          }}
          label="Search diary"
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
      </Box>

      <Outlet context={{ searchText, selectedDate }} />

    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  height: 100%;
  box-sizing: border-box;
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
`;
