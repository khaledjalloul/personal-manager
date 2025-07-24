import { Box, Grid, IconButton, TextField, Typography } from "@mui/material"
import { ExpensesCategory } from "../types"
import { Clear, Delete, Edit, Save, Send } from "@mui/icons-material"
import { useCreateExpensesCategory, useDeleteExpensesCategory, useEditExpensesCategory, useEditUser } from "../api"
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react"
import { ConfirmDeleteDialog } from "./modals"
import { SketchPicker } from 'react-color';
import { useCtrlS, useKeybinding } from "../utils"

export const ExpensesCategoryCard = ({
  category,
  isAddingCategory,
  setIsAddingCategory
}: {
  category: ExpensesCategory,
  isAddingCategory: boolean,
  setIsAddingCategory: Dispatch<SetStateAction<boolean>>

}) => {

  const { mutate: createCategory, isPending: createLoading, isSuccess: createSuccess } = useCreateExpensesCategory();
  const { mutate: editCategory, isPending: editLoading, isSuccess: editSuccess } = useEditExpensesCategory();
  const { mutate: deleteCategory, isPending: deleteLoading } = useDeleteExpensesCategory();
  const { mutate: editFundKeywords, isPending: editFundKeywordsLoading } = useEditUser();

  const [isEditing, setIsEditing] = useState(isAddingCategory);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color);
  const [keyword, setKeyword] = useState("");

  const save = () => {
    if (!isEditing || !name.trim()) return;
    if (category.id !== -1)
      editCategory({
        id: category.id,
        name: name.trim(),
        color
      })
    else
      createCategory({
        name: name.trim(),
        color,
        keywords: []
      })
  };

  useCtrlS(save);

  const addKeyword = () => {
    if (!keyword.trim()) return;
    if (category.id !== -999)
      editCategory({
        id: category.id,
        keywords: [...category.keywords, keyword.trim()]
      })
    else
      editFundKeywords({
        fundKeywords: [...category.keywords, keyword.trim()]
      })
    setKeyword("")
  };

  useKeybinding("Enter", addKeyword, false);

  useEffect(() => {
    if (createSuccess) setIsAddingCategory(false);
  }, [createSuccess]);

  useEffect(() => {
    if (editSuccess) setIsEditing(false);
  }, [editSuccess]);

  return (
    <Fragment>
      <Grid
        size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          position: 'relative',
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {!isEditing ? (
            <Typography
              variant="body1"
              sx={{
                mt: category.id === -999 ? 1 : 0
              }}
            >
              {category.name} ({category.keywords.length})
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

          {category.id !== -999 && (
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: color,
                ml: 1.5,
                cursor: isEditing ? 'pointer' : 'default',
                border: '1px solid gray'
              }}
              onClick={isEditing ? () => setColorPickerOpen(true) : undefined}
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

          {isEditing && (
            <IconButton
              size="small"
              sx={{ ml: 'auto' }}
              color="success"
              disabled={!name.trim()}
              loading={createLoading || editLoading}
              onClick={save}>
              <Save />
            </IconButton>
          )}

          {category.id !== -999 && category.id !== -1 && isEditing && (
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
                    disabled={!keyword.trim() || category.id === -1}
                    loading={editLoading || editFundKeywordsLoading}
                    onClick={addKeyword}>
                    <Send />
                  </IconButton>
                )
              }
            }}
          />
        </Box>

        <Box
          sx={{
            display: colorPickerOpen ? 'block' : 'none',
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1
          }}
          onClick={() => setColorPickerOpen(false)}
        />

        <Box
          sx={{
            display: colorPickerOpen ? 'block' : 'none',
            position: "absolute",
            backgroundColor: "pink",
            zIndex: 2
          }}>
          <SketchPicker
            color={color}
            onChange={(color) => setColor(color.hex)}
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