import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Clear, Today, ViewList } from "@mui/icons-material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const DiaryWrapper = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(new Date()));
  const [searchText, setSearchText] = useState("");

  const isDaily = location.pathname === "/diary";

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              disabled={Boolean(searchText.trim())}
              onClick={() => setSelectedDate(
                isDaily ? selectedDate.subtract(1, 'month') : selectedDate.subtract(1, 'year')
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
                onChange={(newValue) => setSelectedDate(newValue ?? dayjs(new Date()))}
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
                isDaily ? selectedDate.add(1, 'month') : selectedDate.add(1, 'year')
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
            onClick={() => setSelectedDate(dayjs(new Date()))}
            disabled={Boolean(searchText.trim()) || dayjs(new Date()).isSame(selectedDate, 'month')}
          >
            This {isDaily ? "Month" : "Year"}
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
`;
