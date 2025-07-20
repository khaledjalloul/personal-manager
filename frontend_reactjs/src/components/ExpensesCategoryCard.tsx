import { Box, Grid, IconButton, TextField, Typography } from "@mui/material"
import { ExpensesCategory } from "../types"
import { Clear, Delete, Edit, Save, Send } from "@mui/icons-material"
import { useCreateExpensesCategory, useDeleteExpensesCategory, useEditExpensesCategory, useEditUser } from "../api"
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

  const { mutate: createCategory, isPending: createLoading } = useCreateExpensesCategory();
  const { mutate: editCategory, isPending: editLoading } = useEditExpensesCategory();
  const { mutate: deleteCategory, isPending: deleteLoading } = useDeleteExpensesCategory();
  const { mutate: editFundKeywords, isPending: editFundKeywordsLoading } = useEditUser();

  const [isEditing, setIsEditing] = useState(isAddingCategory);
  const [name, setName] = useState(category.name);
  const [keyword, setKeyword] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  return (
    <Fragment>
      <Grid
        size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {!isEditing ? (
            <Typography
              variant="body1"
              sx={{
                mt: category.id === -999 ? 1 : 0
              }}
            >
              {category.name}
            </Typography>
          ) : (
            <TextField
              size="small"
              variant="standard"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {category.id !== -999 && !isEditing && (
            <IconButton
              size="small"
              sx={{ ml: 'auto' }}
              onClick={() => setIsEditing(true)}
            >
              <Edit />
            </IconButton>
          )}

          {category.id !== -999 && !isEditing && (
            <IconButton
              size="small"
              color="error"
              loading={deleteLoading}
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
              loading={createLoading || editLoading}
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
                    color: "blue", // TODO: remove
                    keywords: []
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
            {category.keywords?.map((keyword) => (
              <Box key={keyword} sx={{
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
                <Typography variant="body2">{keyword}</Typography>
                <IconButton
                  size="small"
                  loading={editLoading || editFundKeywordsLoading}
                  onClick={() => {
                    if (category.id !== -999)
                      editCategory({
                        id: category.id,
                        keywords: category.keywords.filter(k => k !== keyword)
                      });
                    else
                      editFundKeywords({
                        fundKeywords: category.keywords.filter(k => k !== keyword)
                      });
                  }}
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
                    loading={editLoading || editFundKeywordsLoading}
                    onClick={() => {
                      if (category.id !== -999)
                        editCategory({
                          id: category.id,
                          keywords: [...category.keywords, keyword]
                        })
                      else
                        editFundKeywords({
                          fundKeywords: [...category.keywords, keyword]
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