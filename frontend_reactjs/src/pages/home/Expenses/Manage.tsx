import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import {
  useExpensesCategories,
  useExpenses,
  useFunds,
  useUploadAutoExpenses,
  useDeleteAutoExpenses,
  useCurrentUser
} from "../../../api";
import { ConfirmDeleteDialog, ExpensesCategoryCard, ExpenseTableRow, FundTableRow } from "../../../components";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { Expense, ExpensesCategory, ExpenseType, Fund } from "../../../types";
import { useOutletContext } from "react-router-dom";

const fundsCategory: ExpensesCategory = {
  id: -999,
  name: "Funds",
  color: "",
  keywords: []
}

const emptyFund: Fund = {
  id: -1,
  date: new Date(),
  source: "",
  amount: 0,
  type: ExpenseType.Manual
}

const emptyCategory: ExpensesCategory = {
  id: -1,
  name: "",
  color: "",
  keywords: []
}

const emptyExpense: Expense = {
  id: -1,
  date: new Date(),
  category: emptyCategory,
  description: "",
  vendor: "",
  type: ExpenseType.Manual,
  amount: 0,
  tags: [],
}

export const ManageExpenses = () => {
  const { searchText } = useOutletContext<{ searchText: string }>();

  const { data: user } = useCurrentUser();
  const fundKeywords = user?.fundKeywords || [];
  const { data: autoExpenses } = useExpenses({
    type: ExpenseType.Auto,
    searchText: "",
    filterCategoryIds: [-1] // all
  });
  const { data: manualExpenses } = useExpenses({
    type: ExpenseType.Manual,
    searchText: searchText.trim(),
    filterCategoryIds: [-1] // all
  });
  const { data: autoFunds } = useFunds({
    type: ExpenseType.Auto,
    searchText: "",
  });
  const { data: manualFunds } = useFunds({
    type: ExpenseType.Manual,
    searchText: searchText.trim(),
  });
  const { data: categories } = useExpensesCategories();
  const { mutate: uploadAutoExpenses, isPending: uploadAutoExpensesLoading } = useUploadAutoExpenses();
  const { mutate: deleteAutoExpenses, isPending: deleteAutoExpensesLoading } = useDeleteAutoExpenses();

  const [isAddingFund, setIsAddingFund] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  return (
    <Wrapper>
      <Grid container spacing={2}>
        <FundGridItem size={{ xs: 12, lg: 5 }} sx={{ maxHeight: '60vh' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">Manual Funds ({manualFunds?.length})</Typography>

            <IconButton size="small" onClick={() => setIsAddingFund(true)}>
              <Add />
            </IconButton>
          </Box>

          <TableContainer component={Paper}>
            <Table
              size="small"
              stickyHeader
              sx={{
                '& th': {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText"
                }
              }}
            >
              <TableHead>
                <TableRow >
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textWrap: "nowrap" }}>Amount (CHF)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isAddingFund && (
                  <FundTableRow
                    key={emptyFund.id}
                    fund={{ ...emptyFund, date: new Date() }}
                    index={emptyFund.id}
                    isAddingFund={isAddingFund}
                    setIsAddingFund={setIsAddingFund}
                    editable />
                )}
                {manualFunds?.map((fund, index) => (
                  <FundTableRow
                    key={fund.id}
                    fund={fund}
                    index={index}
                    editable />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </FundGridItem>

        <ManualExpensesGridItem size={{ xs: 12, lg: 7 }} sx={{ maxHeight: '60vh' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">Manual Expenses ({manualExpenses?.length})</Typography>

            <IconButton size="small" onClick={() => setIsAddingExpense(true)}>
              <Add />
            </IconButton>
          </Box>

          <TableContainer component={Paper}>
            <Table
              size="small"
              stickyHeader
              sx={{
                '& th': {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText"
                }
              }}
            >
              <TableHead>
                <TableRow >
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Vendor</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textWrap: "nowrap" }}>Amount (CHF)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isAddingExpense && (
                  <ExpenseTableRow
                    key={emptyExpense.id}
                    expense={{
                      ...emptyExpense,
                      category: categories ? categories[0] : emptyCategory,
                      date: new Date()
                    }}
                    index={emptyExpense.id}
                    isAddingExpense={isAddingExpense}
                    setIsAddingExpense={setIsAddingExpense}
                    editable />
                )}
                {manualExpenses?.map((expense, index) => (
                  <ExpenseTableRow
                    key={expense.id}
                    expense={expense}
                    index={index}
                    editable />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ManualExpensesGridItem>
      </Grid>

      <Typography variant="h6" mt={2}>Import Bank Data</Typography>

      <CSVFileUploadWrapper>

        <Typography>
          Imported Funds: {autoFunds?.length}
        </Typography>

        <Typography>
          Imported Expenses: {autoExpenses?.length}
        </Typography>

        <Typography >
          Imported & Uncategorized Expenses: {autoExpenses?.filter(exp => !exp.category).length}
        </Typography>

        <input
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          id="csv-upload"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const formData = new FormData();
            formData.append('file', file);
            uploadAutoExpenses({ formData });
          }}
        />
        <label htmlFor="csv-upload">
          <Button
            variant="contained"
            component="span"
            loading={uploadAutoExpensesLoading}
            sx={{ mt: '16px' }}
          >
            Upload CSV
          </Button>
        </label>

        <Button
          variant="outlined"
          color="error"
          loading={deleteAutoExpensesLoading}
          onClick={() => setConfirmDeleteOpen(true)}
          sx={{ mt: '16px' }}
        >
          Delete Automated Expenses & Funds
        </Button>
      </CSVFileUploadWrapper>

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, mt: 2 }}>
        <Typography variant="h6">Manage Categories</Typography>
        <IconButton size="small" onClick={() => setIsAddingCategory(true)}>
          <Add />
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        {isAddingCategory && (
          <ExpensesCategoryCard
            key={emptyCategory.id}
            category={emptyCategory}
            isAddingCategory={isAddingCategory}
            setIsAddingCategory={setIsAddingCategory}
          />
        )}
        <ExpensesCategoryCard
          key={fundsCategory.id}
          category={{ ...fundsCategory, keywords: fundKeywords }}
          isAddingCategory={isAddingCategory}
          setIsAddingCategory={setIsAddingCategory}
        />
        {categories?.map((category) => (
          <ExpensesCategoryCard
            key={category.id}
            category={category}
            isAddingCategory={isAddingCategory}
            setIsAddingCategory={setIsAddingCategory}
          />
        ))}
      </Grid>

      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={"all imported expenses and funds"}
        deleteFn={() => deleteAutoExpenses()}
      />

    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto; // Idk why but needed to prevent extra scroll
  gap: 16px;
  padding: 32px;
  padding-top: 0;
`;

const FundGridItem = styled(Grid)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ManualExpensesGridItem = styled(Grid)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CSVFileUploadWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: solid 1px gray;
  border-radius: 8px;
  padding: 32px;
`;
