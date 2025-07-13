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

  return (
    <TableRow
      sx={{
        backgroundColor: index % 2 === 0 ? "white" : "secondary.main",
        ":hover": editable ? { backgroundColor: "secondary.dark" } : {}
      }}

    >
      <TableCell>
        {!isEditing ? expense.date.toLocaleDateString() :
          <TextField
            variant="standard"
            value={date.toLocaleDateString("en-US")}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              setDate(isNaN(newDate.getTime()) ? date : newDate);
            }}
          />
        }
      </TableCell>

      <TableCell>
        {!isEditing ? expense.category.name :
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
        }
      </TableCell>

      <TableCell width={"40%"}>
        {!isEditing ? expense.description :
          <TextField
            variant="standard"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ width: "100%" }}
          />
        }
      </TableCell>

      <TableCell>
        {!isEditing ? expense.vendor :
          <TextField
            variant="standard"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
          />
        }
      </TableCell>

      <TableCell>
        {!isEditing ? expense.amount.toFixed(2) :
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
        }
      </TableCell>

      {editable && (
        !isEditing ? (
          <TableCell sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>

            <IconButton size="small">
              <Delete color="error" />
            </IconButton>
          </TableCell>
        ) : (
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
        )
      )}
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