import { Box, Grid, IconButton, TextField, Typography } from "@mui/material"
import { ExpensesCategory } from "../types"
import { Clear, Delete, Edit, Save, Send } from "@mui/icons-material"
import { useCreateExpensesCategory, useCreateExpensesCategoryKeyword, useDeleteExpensesCategory, useDeleteExpensesCategoryKeyword, useEditExpensesCategory, useExpensesCategoryKeywords } from "../api"
import { Dispatch, Fragment, SetStateAction, useState } from "react"
import { ConfirmDeleteDialog } from "./modals"

export const ExpensesCategoryCard = ({
  category,
  isAddingCategory,
  setIsAddingCategory
}: {
  category: ExpensesCategory,
  isAddingCategory: boolean,
  setIsAddingCategory: Dispatch<SetStateAction<boolean>>

}) => {

  const { data: keywords } = useExpensesCategoryKeywords({
    categoryId: category.id
  })

  const { mutate: createCategory, isPending: createCategoryLoading } = useCreateExpensesCategory();
  const { mutate: editCategory, isPending: editCategoryLoading } = useEditExpensesCategory();
  const { mutate: deleteCategory, isPending: deleteCategoryLoading } = useDeleteExpensesCategory();
  const { mutate: createKeyword, isPending: createKeywordLoading } = useCreateExpensesCategoryKeyword();
  const { mutate: deleteKeyword, isPending: deleteKeywordLoading } = useDeleteExpensesCategoryKeyword();

  const [isEditing, setIsEditing] = useState(isAddingCategory);
  const [name, setName] = useState(category.name);
  const [keyword, setKeyword] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  return (
    <Fragment>
      <Grid
        size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {!isEditing ? (
            <Typography variant="body1">{category.name}</Typography>
          ) : (
            <TextField
              size="small"
              variant="standard"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {!isEditing && (
            <IconButton
              size="small"
              sx={{ ml: 'auto' }}
              onClick={() => setIsEditing(true)}
            >
              <Edit />
            </IconButton>
          )}

          {!isEditing && (
            <IconButton
              size="small"
              color="error"
              loading={deleteCategoryLoading}
              onClick={() => setConfirmDeleteOpen(true)}
            >
              <Delete />
            </IconButton>
          )}

          {isEditing && (
            <IconButton
              size="small"
              sx={{ ml: 'auto' }}
              color="success"
              loading={createCategoryLoading || editCategoryLoading}
              onClick={() => {
                if (category.id !== -1) {
                  editCategory({
                    id: category.id,
                    name: name.trim()
                  })
                  setIsEditing(false);
                } else {
                  createCategory({
                    name: name.trim(),
                    color: "blue" // TODO: remove
                  })
                  setIsAddingCategory(false);
                }
              }}>
              <Save />
            </IconButton>
          )}

          {isEditing && (
            <IconButton size="small" onClick={() => {
              if (category.id !== -1) {
                setName(category.name);
                setIsEditing(false);
              } else {
                setIsAddingCategory(false);
              }
            }}>
              <Clear />
            </IconButton>
          )}
        </Box>

        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          border: 'solid 1px gray',
          borderRadius: 1,
          padding: 1,
          gap: 2
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'start',
            flexWrap: 'wrap',
            gap: 1
          }}>
            {keywords?.map((keyword) => (
              <Box key={keyword.id} sx={{
                pl: 1.5,
                pr: 0.5,
                pt: 0.5,
                pb: 0.5,
                borderRadius: 1,
                backgroundColor: 'primary.light',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 0.5
              }}>
                <Typography variant="body2">{keyword.keyword}</Typography>
                <IconButton
                  size="small"
                  loading={deleteKeywordLoading}
                  onClick={() => deleteKeyword({ id: keyword.id })}
                >
                  <Clear />
                </IconButton>
              </Box>
            ))}
          </Box>
          <TextField
            size="small"
            variant="standard"
            placeholder="Add keyword"
            sx={{ mt: 'auto' }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            disabled={category.id === -1}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    size="small"
                    color="success"
                    disabled={!keyword || category.id === -1}
                    loading={createKeywordLoading}
                    onClick={() => {
                      createKeyword({
                        categoryId: category.id,
                        keyword
                      })
                      setKeyword("")
                    }}>
                    <Send />
                  </IconButton>
                )
              }
            }}
          />
        </Box>
      </Grid>
      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={`category: ${category.name}`}
        deleteFn={() => deleteCategory({ id: category.id })}
      />
    </Fragment>
  )
}