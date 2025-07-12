import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Group } from "../../types";
import { GroupCard, GroupModal } from "../../components";
import styled from "styled-components";
import { useContext, useState } from "react";
import { Add, Clear } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGroups } from "../../api";
import { UserContext } from "../../utils";

const maxUsersOptions = ["Any", 2, 3, 4, 5];

export const Home = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

  const [maxUsers, setMaxUsers] = useState(maxUsersOptions[0]);
  const [searchText, setSearchText] = useState("");
  const [modalItem, setModalItem] = useState<Group>();

  const { data: groups } = useGroups({
    maxUsers: maxUsers !== "Any" ? maxUsers : undefined,
    searchText: searchText.trim(),
  });

  return (
    <Wrapper>
      <SectionTitle>
        <Typography variant="h6">Groups</Typography>
        <IconButton onClick={() => navigate("/create")}>
          <Add color="success" />
        </IconButton>
        <TextField
          select
          value={maxUsers}
          label={"Maximum Users"}
          sx={{ ml: "auto", minWidth: 125 }}
          onChange={(item) => setMaxUsers(item.target.value)}
        >
          {maxUsersOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          sx={{ minWidth: "25vw" }}
          label="Search for Group"
          placeholder="Group name, location, subject, etc."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            endAdornment: searchText.length > 0 && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setSearchText("")}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </SectionTitle>

      {groups && groups.length > 0 && (
        <Grid container spacing={2}>
          {groups.map((group, index) => (
            <Grid item key={index} xs={12} md={6} lg={4} display={"flex"}>
              <GroupCard
                group={group}
                setModalItem={setModalItem}
                userId={userData?.userId}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {groups && groups.length === 0 && (
        <Typography textAlign={"center"} mt={10}>
          There are no current groups that match your search.
        </Typography>
      )}

      <GroupModal group={modalItem} setGroup={setModalItem} />
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  flex-grow: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  transition-duration: 0.1s;
`;
