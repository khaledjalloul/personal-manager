import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import styled from "styled-components";
import {
  useExpensesCategories,
  useExpenses,
  useFunds,
  useUploadAutoExpenses,
  useDeleteAutoExpenses,
  useCurrentUser
} from "../../../api";
import { ConfirmDeleteDialog, ExpensesCategoryCard } from "../../../components";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { ExpensesCategory, ExpenseType } from "../../../types";
import { useOutletContext } from "react-router-dom";

const fundsCategory: ExpensesCategory = {
  id: -999,
  name: "Funds",
  color: "",
  keywords: []
}

const emptyCategory: ExpensesCategory = {
  id: -1,
  name: "",
  color: "",
  keywords: []
}

export const ManageAutoExpenses = () => {
  const { searchText } = useOutletContext<{ searchText: string }>();

  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const { data: user } = useCurrentUser();
  const { data: categories } = useExpensesCategories();
  const { data: autoExpenses } = useExpenses({
    types: [ExpenseType.Bank_Auto],
    searchText: "",
    filterCategoryIds: [-1] // all
  });
  const { data: autoFunds } = useFunds({
    types: [ExpenseType.Bank_Auto],
    searchText: "",
  });

  const { mutate: uploadAutoExpenses, isPending: uploadAutoExpensesLoading } = useUploadAutoExpenses();
  const { mutate: deleteAutoExpenses, isPending: deleteAutoExpensesLoading } = useDeleteAutoExpenses();

  const fundKeywords = user?.fundKeywords || [];

  return (
    <Wrapper>
      <Typography variant="h6" mt={2}>Import Bank Data</Typography>

      <CSVFileUploadWrapper>

        <Typography sx={{ textAlign: 'center' }}>
          Imported Funds: {autoFunds?.length}
        </Typography>

        <Typography sx={{ textAlign: 'center' }}>
          Imported Expenses: {autoExpenses?.length}
        </Typography>

        <Typography sx={{ textAlign: 'center' }}>
          Imported & Uncategorized Expenses: {autoExpenses?.filter(exp => !exp.category).length}
        </Typography>

        <input
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          id="csv-upload"
          multiple
          onChange={(e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
              formData.append('files', files[i]);
            }
            uploadAutoExpenses({ formData });
          }}
        />
        <label htmlFor="csv-upload">
          <Button
            variant="contained"
            component="span"
            loading={uploadAutoExpensesLoading}
            sx={{ mt: '16px', textTransform: 'none' }}
          >
            Upload CSV File(s)
          </Button>
        </label>

        <ConfirmDeleteDialog
          itemName={"all imported expenses and funds"}
          deleteFn={() => deleteAutoExpenses()}
        >
          <Button
            variant="outlined"
            color="error"
            loading={deleteAutoExpensesLoading}
            sx={{ mt: '16px' }}
          >
            Delete Automated Expenses & Funds
          </Button>
        </ConfirmDeleteDialog>
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
            searchText={searchText}
            isAddingCategory={isAddingCategory}
            setIsAddingCategory={setIsAddingCategory}
          />
        )}
        <ExpensesCategoryCard
          key={fundsCategory.id}
          category={{ ...fundsCategory, keywords: fundKeywords }}
          searchText={searchText}
        />
        {categories?.map((category) => (
          <ExpensesCategoryCard
            key={category.id}
            category={category}
            searchText={searchText}
          />
        ))}
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  padding-top: 0;
`;

const CSVFileUploadWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: ${({ theme }) => `solid 1px ${theme.palette.grey[700]}`};
  border-radius: 8px;
  padding: 32px;
`;
