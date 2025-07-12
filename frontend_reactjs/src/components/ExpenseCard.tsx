import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { Expense } from "../types";
import { Clear, Delete, Edit, Save } from "@mui/icons-material";
import { useState } from "react";
import { useExpenseCategories } from "../api";

export const ExpenseCardHeader = () => {
  return (
    <Wrapper sx={{ backgroundColor: "primary.light", mr: 2 }}>
      <Typography variant="body1" sx={{ width: "10%" }}>
        Date
      </Typography>
      <Typography variant="body1" sx={{ width: "10%" }}>
        Category
      </Typography>
      <Typography variant="body1" sx={{ flexGrow: 1 }}>
        Description
      </Typography>
      <Typography variant="body1" sx={{ width: "10%" }}>
        Vendor
      </Typography>
      <Typography variant="body1" sx={{ width: "10%" }}>
        Amount
      </Typography>
    </Wrapper>
  );
}

export const ExpenseCard = ({ expense, index, editable = false }: {
  expense: Expense;
  index: number;
  editable?: boolean;
}) => {
  const { data: expensesCategories } = useExpenseCategories();
  const [isEditing, setIsEditing] = useState(false);

  const [date, setDate] = useState(expense.date);
  const [category, setCategory] = useState(expense.category);
  const [description, setDescription] = useState(expense.description);
  const [vendor, setVendor] = useState(expense.vendor);
  const [amount, setAmount] = useState(expense.amount);

  if (!isEditing)
    return (
      <Wrapper
        sx={{
          backgroundColor: index % 2 == 0 ? "secondary.main" : "white",
          cursor: editable ? "pointer" : "default",
          ":hover": editable ? {
            backgroundColor: "secondary.dark",
          } : {}
        }}
        onClick={editable ? () => setIsEditing(true) : undefined}>
        <Typography variant="body2" sx={{ minWidth: "10%" }}>
          {date.toLocaleDateString("en-US")}
        </Typography>
        <Typography variant="body2" sx={{ minWidth: "10%" }}>
          {category.name}
        </Typography>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {description}
        </Typography>
        <Typography variant="body2" sx={{ minWidth: "10%" }}>
          {vendor}
        </Typography>
        <Typography variant="body2" sx={{ minWidth: "10%" }}>
          {amount.toFixed(2)} CHF
        </Typography>
      </Wrapper>
    )
  else return (
    <Wrapper sx={{
      backgroundColor: index % 2 == 0 ? "secondary.main" : "white",
    }}>
      <TextField
        variant="standard"
        value={date.toLocaleDateString("en-US")}
        onChange={(e) => {
          const newDate = new Date(e.target.value);
          setDate(isNaN(newDate.getTime()) ? date : newDate);
        }}
        sx={{ minWidth: "10%" }}
      />
      <Select
        variant="standard"
        value={category.id}

        onChange={(e) => setCategory(expensesCategories?.find(cat => cat.id === e.target.value) ?? category)}
        sx={{ minWidth: "10%" }}
      >
        {expensesCategories?.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name}
          </MenuItem>
        ))}
      </Select>
      {/* <TextField
        variant="standard"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        sx={{ minWidth: "10%" }}
      /> */}
      <TextField
        variant="standard"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ flexGrow: 1 }}
      />
      <TextField
        variant="standard"
        value={vendor}
        onChange={(e) => setVendor(e.target.value)}
        sx={{ minWidth: "10%" }}
      />
      <TextField
        variant="standard"
        value={amount.toFixed(2)}
        onChange={(e) => {
          const newAmount = parseFloat(e.target.value);
          setAmount(isNaN(newAmount) ? amount : newAmount);
        }}
        sx={{ minWidth: "10%" }}
        InputProps={{
          endAdornment: <InputAdornment position="end">CHF</InputAdornment>,
        }}
      />
      <IconButton>
        <Save color="success" />
      </IconButton>
      <IconButton>
        <Delete color="error" />
      </IconButton>
      <IconButton onClick={() => {
        setDate(expense.date);
        setCategory(expense.category);
        setDescription(expense.description);
        setVendor(expense.vendor);
        setAmount(expense.amount);
        setIsEditing(false)
      }}>
        <Clear />
      </IconButton>
    </Wrapper>
  )
}

export const ExpenseTableRow = ({ expense, index, editable = false }: {
  expense: Expense;
  index: number;
  editable?: boolean;
}) => {
  const { data: expensesCategories } = useExpenseCategories();

  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState(expense.date);
  const [category, setCategory] = useState(expense.category);
  const [description, setDescription] = useState(expense.description);
  const [vendor, setVendor] = useState(expense.vendor);
  const [amount, setAmount] = useState(expense.amount);

  if (!isEditing)
    return (
      <TableRow
        sx={{
          backgroundColor: index % 2 === 0 ? "white" : "secondary.main",
          ":hover": editable ? { backgroundColor: "secondary.dark" } : {}
        }}

      >
        <TableCell >
          {expense.date.toLocaleDateString()}
        </TableCell>
        <TableCell >{expense.category.name}</TableCell>
        <TableCell width={"40%"}>{expense.description}</TableCell>
        <TableCell >{expense.vendor}</TableCell>
        <TableCell>{expense.amount.toFixed(2)}</TableCell>
        {editable && <TableCell
          sx={{ display: 'flex', gap: 1 }}
        >
          <IconButton size="small"
            onClick={() => setIsEditing(true)}
          >
            <Edit />
          </IconButton>

          <IconButton size="small">
            <Delete color="error" />
          </IconButton>
        </TableCell>}
      </TableRow>
    )
  else return (
    <TableRow
      key={index}
      sx={{
        backgroundColor: index % 2 === 0 ? "white" : "secondary.main",
        ":hover": { backgroundColor: "secondary.dark" }
      }}
    // onClick={() => navigate(`/expenses/${expense.id}`)}
    >
      <TableCell >
        <TextField
          variant="standard"
          value={date.toLocaleDateString("en-US")}
          onChange={(e) => {
            const newDate = new Date(e.target.value);
            setDate(isNaN(newDate.getTime()) ? date : newDate);
          }}
        />
      </TableCell>
      <TableCell >
        <Select
          variant="standard"
          value={category.id}

          onChange={(e) => setCategory(expensesCategories?.find(cat => cat.id === e.target.value) ?? category)}
        >
          {expensesCategories?.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </TableCell>
      <TableCell width={"40%"}>
        <TextField
          variant="standard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ width: "100%" }}
        />
      </TableCell>
      <TableCell>
        <TextField
          variant="standard"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
        />
      </TableCell>
      <TableCell>
        <TextField
          variant="standard"
          value={amount.toFixed(2)}
          onChange={(e) => {
            const newAmount = parseFloat(e.target.value);
            setAmount(isNaN(newAmount) ? amount : newAmount);
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">CHF</InputAdornment>,
          }}
        />
      </TableCell>

      <TableCell sx={{ display: 'flex', gap: 1 }}>
        <IconButton size="small">
          <Save color="success" />
        </IconButton>

        <IconButton size="small" onClick={() => {
          setDate(expense.date);
          setCategory(expense.category);
          setDescription(expense.description);
          setVendor(expense.vendor);
          setAmount(expense.amount);
          setIsEditing(false)
        }}>
          <Clear />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  gap: 16px;
`;