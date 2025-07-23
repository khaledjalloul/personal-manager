import {
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Expense } from "../types";
import { Clear, Delete, Edit, Save } from "@mui/icons-material";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { useCreateExpense, useDeleteExpense, useEditExpense, useExpensesCategories } from "../api";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ConfirmDeleteDialog } from "./modals";
import { useCtrlS } from "../utils";


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

  const { mutate: createExpense, isPending: createLoading, isSuccess: createSuccess } = useCreateExpense();
  const { mutate: editExpense, isPending: editLoading, isSuccess: editSuccess } = useEditExpense();
  const { mutate: deleteExpense, isPending: deleteLoading } = useDeleteExpense();

  const [isEditing, setIsEditing] = useState(isAddingExpense);
  const [date, setDate] = useState(dayjs(expense.date));
  const [category, setCategory] = useState(expense.category);
  const [description, setDescription] = useState(expense.description);
  const [vendor, setVendor] = useState(expense.vendor);
  const [amount, setAmount] = useState(expense.amount);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const save = () => {
    if (!isEditing || !description.trim()) return;
    if (expense.id !== -1)
      editExpense({
        id: expense.id,
        date: date.toDate(),
        categoryId: category?.id,
        description: description.trim(),
        vendor: vendor.trim(),
        amount,
      });
    else if (setIsAddingExpense)
      createExpense({
        date: date.toDate(),
        categoryId: category?.id,
        description: description.trim(),
        vendor: vendor.trim(),
        amount,
        tags: [],
        type: 'manual'
      });
  };

  useCtrlS(save);

  // Handle case where category is deleted to update the displayed state
  useEffect(() => {
    setCategory(expense.category);
  }, [expense.category?.id]);

  useEffect(() => {
    if (createSuccess && setIsAddingExpense) setIsAddingExpense(false);
  }, [createSuccess]);

  useEffect(() => {
    if (editSuccess) setIsEditing(false);
  }, [editSuccess]);

  return (
    <Fragment>
      <TableRow
        sx={{
          backgroundColor: index % 2 === 0 ? "background.default" : "primary.light",
          ":hover": editable ? { backgroundColor: "action.hover" } : {}
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
          {!isEditing ? (
            category?.name ?? (
              <Typography color={!editable ? 'gray' : 'text.primary'} variant="body2">
                <em>Uncategorized</em>
              </Typography>
            )
          ) :
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
          {!isEditing ? (
            !editable ?
              (amount >= 0 ? `-${Math.abs(amount).toFixed(2)}` : `+${Math.abs(amount).toFixed(2)}`) :
              amount.toFixed(2)
          ) :
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
            <TableCell>
              <IconButton
                size="small"
                onClick={() => setIsEditing(true)}
              >
                <Edit />
              </IconButton>
            </TableCell>
          ) : (
            <TableCell sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                color="success"
                loading={createLoading || editLoading}
                disabled={!description.trim()}
                onClick={save}>
                <Save />
              </IconButton>

              {expense.id !== -1 && (
                <IconButton
                  size="small"
                  color="error"
                  loading={deleteLoading}
                  onClick={() => setConfirmDeleteOpen(true)}
                >
                  <Delete />
                </IconButton>
              )}

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
