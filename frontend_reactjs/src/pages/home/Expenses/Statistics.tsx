import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import { Settings, Insights, Clear } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useExpenses } from "../../../api";

export const ExpensesStatistics = () => {
  const navigate = useNavigate();
  //   const { userData } = useContext(UserContext);

  //   const [maxUsers, setMaxUsers] = useState(maxUsersOptions[0]);
  const [searchText, setSearchText] = useState("");
  //   const [modalItem, setModalItem] = useState<Group>();

  // const { data: expenses } = useExpenses({
  //   // maxUsers: maxUsers !== "Any" ? maxUsers : undefined,
  //   searchText: searchText.trim(),
  // });

  return (
    <Wrapper>
     
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  flex-grow: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ExpensesScrollWrapper = styled(Box)`
  overflow-y: scroll;
  flex-grow: 0;
  max-height: 75vh;
  margin-top: -16px;
`;

const ExpenseCard = styled(Box)`
  display: flex;
  flex-direction: row;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  gap: 16px;
`;