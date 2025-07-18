import {
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { Expense } from "../types";
import { Clear, Delete, Edit, Save } from "@mui/icons-material";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { useCreateExpense, useDeleteExpense, useEditExpense, useExpensesCategories } from "../api";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ConfirmDeleteDialog } from "./modals";


export const ExpenseTableRow = ({
  expense,
  index,
  editable = false,
  isAddingExpense,
  setIsAddingExpense,
}: {
  expense: Expense;
  index: number;
  editable?: boolean;
  isAddingExpense?: boolean;
  setIsAddingExpense?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data: expensesCategories } = useExpensesCategories();

  const { mutate: createExpense } = useCreateExpense();
  const { mutate: editExpense } = useEditExpense();
  const { mutate: deleteExpense } = useDeleteExpense();

  const [isEditing, setIsEditing] = useState(isAddingExpense);
  const [date, setDate] = useState(dayjs(expense.date));
  const [category, setCategory] = useState(expense.category);
  const [description, setDescription] = useState(expense.description);
  const [vendor, setVendor] = useState(expense.vendor);
  const [amount, setAmount] = useState(expense.amount);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Handle case where category is deleted to update the displayed state
  useEffect(() => {
    setCategory(expense.category);
  }, [expense.category?.id]);

  return (
    <Fragment>
      <TableRow
        sx={{
          backgroundColor: index % 2 === 0 ? "white" : "secondary.main",
          ":hover": editable ? { backgroundColor: "secondary.dark" } : {}
        }}
      >
        <TableCell>
          {!isEditing ? date.format("DD.MM.YYYY") :
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={date}
                onChange={(newValue) => setDate(newValue ?? dayjs(new Date()))}
                enableAccessibleFieldDOMStructure={false}
                format="DD.MM.YYYY"
                slotProps={{
                  textField: {
                    size: "small",
                    variant: "standard",
                    placeholder: "Date",
                  }
                }}
              />
            </LocalizationProvider>
          }
        </TableCell>

        <TableCell>
          {!isEditing ? category?.name ?? (<em>Uncategorized</em>) :
            <Select
              variant="standard"
              value={category?.id ?? "uncategorized"}
              sx={{ width: "100%" }}
              onChange={(e) => setCategory(expensesCategories?.find(cat => cat.id === e.target.value) ?? category)}
            >
              {!category && (
                <MenuItem value="uncategorized" disabled>
                  <em>Uncategorized</em>
                </MenuItem>
              )}
              {expensesCategories?.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          }
        </TableCell>

        <TableCell width={"35%"}>
          {!isEditing ? description :
            <TextField
              variant="standard"
              placeholder="Description"
              value={description}
              sx={{ width: "100%" }}
              onChange={(e) => setDescription(e.target.value)}
            />
          }
        </TableCell>

        <TableCell>
          {!isEditing ? vendor :
            <TextField
              variant="standard"
              placeholder="Vendor"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
            />
          }
        </TableCell>

        <TableCell>
          {!isEditing ? amount.toFixed(2) :
            <TextField
              variant="standard"
              placeholder="Amount"
              value={amount.toFixed(2)}
              onChange={(e) => {
                const newAmount = parseFloat(e.target.value);
                setAmount(isNaN(newAmount) ? amount : newAmount);
              }}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">CHF</InputAdornment>,
                }
              }}
            />
          }
        </TableCell>

        {editable && (
          !isEditing ? (
            <TableCell sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => setIsEditing(true)}
              >
                <Edit />
              </IconButton>

              <IconButton
                size="small"
                color="error"
                onClick={() => setConfirmDeleteOpen(true)}
              >
                <Delete />
              </IconButton>
            </TableCell>
          ) : (
            <TableCell sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                color="success"
                onClick={() => {
                  if (expense.id !== -1) {
                    editExpense({
                      id: expense.id,
                      date: date.toDate(),
                      categoryId: category?.id,
                      description,
                      vendor,
                      amount,
                    });
                    setIsEditing(false);
                  } else if (setIsAddingExpense) {
                    createExpense({
                      date: date.toDate(),
                      categoryId: category?.id,
                      description,
                      vendor,
                      amount,
                      tags: [],
                      type: 'manual'
                    });
                    setIsAddingExpense(false);
                  }
                }}>
                <Save />
              </IconButton>

              <IconButton size="small" onClick={() => {
                if (expense.id !== -1) {
                  setDate(dayjs(expense.date));
                  setCategory(expense.category);
                  setDescription(expense.description);
                  setVendor(expense.vendor);
                  setAmount(expense.amount);
                  setIsEditing(false);
                } else if (setIsAddingExpense) {
                  setIsAddingExpense(false);
                }
              }}>
                <Clear />
              </IconButton>
            </TableCell>
          )
        )}
      </TableRow>
      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={`expense: ${description}`}
        deleteFn={() => deleteExpense({ id: expense.id })}
      />
    </Fragment>
  )
}
