import { Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import { Clear, DirectionsRun, FitnessCenter, Landscape, Pool, SportsVolleyball } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../utils";

const SportTypeButton = ({
  name,
  path,
  icon,
}: {
  name: string;
  path: string;
  icon: React.ReactNode;
}) => {
  const { userData, setUserData } = useContext(UserContext);

  const location = useLocation();
  const navigate = useNavigate();
  const isSelected = location.pathname.includes(path);

  return <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.25,
      border: 'solid 1px',
      borderColor: isSelected ? 'transparent' : 'grey.500',
      backgroundColor: isSelected ? 'primary.main' : 'transparent',
      color: 'text.primary',
      borderRadius: 10,
      px: 2,
      py: 0.75,
      transitionDuration: '0.1s',
      cursor: isSelected ? 'default' : 'pointer',
      ":hover": {
        backgroundColor: isSelected ? 'primary.main' : 'primary.dark',
      },
    }}
    onClick={!isSelected && userData ? () => {
      setUserData({ ...userData, sportsLastSelectedPath: path })
      navigate(path)
    } : undefined}
  >
    {icon}
    <Typography sx={{ fontSize: '16px' }}>{name}</Typography>
  </Box>
};

export const SportsWrapper = () => {
  const { userData } = useContext(UserContext);

  const location = useLocation();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");

  const searchLabel = location.pathname.includes("hikes") ? "hikes" :
    location.pathname.includes("gym") ? "gym" :
      location.pathname.includes("volleyball") ? "volleyball games" :
        location.pathname.includes("swimming") ? "swims" :
          location.pathname.includes("running") ? "runs" : "";
  const searchPlaceholder = location.pathname.includes("gym") ? "Exercise types, notes, session notes" : "Description";

  useEffect(() => {
    if (userData?.sportsLastSelectedPath) {
      navigate(userData.sportsLastSelectedPath);
    }
  }, [userData?.sportsLastSelectedPath]);


  return (
    <Wrapper sx={{ height: { xs: 'auto', sm: '100%' } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: { xs: 'start', md: 'space-between' },
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 4,
          padding: '0 32px 0 32px'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5">
            Sports
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'start', md: 'center' } }}>
          <SportTypeButton name="Hikes" path="hikes" icon={<Landscape />} />
          <SportTypeButton name="Gym" path="gym" icon={<FitnessCenter />} />
          <SportTypeButton name="Volleyball" path="volleyball" icon={<SportsVolleyball />} />
          <SportTypeButton name="Swimming" path="swimming" icon={<Pool />} />
          <SportTypeButton name="Running" path="running" icon={<DirectionsRun />} />
        </Box>

        <TextField
          sx={{
            minWidth: { xs: 0, md: "35vw" },
          }}
          label={`Search ${searchLabel}`}
          placeholder={searchPlaceholder}
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

      <Outlet context={{ searchText }} />

    </Wrapper>
  );
}

const Wrapper = styled(Box)`
  box-sizing: border-box;
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: ${({ theme }) => theme.palette.background.default};
`;
