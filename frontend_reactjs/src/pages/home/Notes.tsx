import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import styled from "styled-components";
import { useEffect, useState } from "react";
import {
  Clear,
  CreateNewFolder,
  Delete,
  Edit,
  EditOff,
  Save,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import { useDeleteNote, useEditNote, useNoteCategories, useNotes } from "../../api";
import { ConfirmDeleteDialog, ManageNoteCategoriesModal, NoteCategoryContainer } from "../../components";
import { Note, NoteCategory } from "../../types";
import MarkdownPreview from '@uiw/react-markdown-preview';
import dayjs from "dayjs";


export const Notes = () => {

  const { palette } = useTheme();

  const [searchText, setSearchText] = useState("");
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [editorEnabled, setEditorEnabled] = useState(true);
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const [selectedNoteTitle, setSelectedNoteTitle] = useState("");
  const [selectedNoteCategory, setSelectedNoteCategory] = useState<NoteCategory | undefined>();
  const [selectedNoteContent, setSelectedNoteContent] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { data: notes } = useNotes({ searchText: searchText.trim() })
  const { data: noteCategories } = useNoteCategories();
  const { mutate: editNote, isPending: editNoteLoading } = useEditNote();
  const { mutate: deleteNote, isPending: deleteNoteLoading } = useDeleteNote();

  useEffect(() => {
    if (selectedNote) {
      setSelectedNoteTitle(selectedNote.title);
      setSelectedNoteCategory(selectedNote.category);
      setSelectedNoteContent(selectedNote.content);
    } else {
      setSelectedNoteTitle("");
      setSelectedNoteCategory(undefined);
      setSelectedNoteContent("");
    }
  }, [JSON.stringify(selectedNote)]);

  return (
    <Wrapper>
      <Header>
        <Typography variant="h5">
          Notes ({notes?.length || 0})
        </Typography>

        <IconButton
          sx={{ ml: "auto" }}
          onClick={() => setEditorEnabled(!editorEnabled)}
          disabled={editorEnabled && !previewEnabled}>
          {editorEnabled ? <EditOff /> : <Edit />}
        </IconButton>
        <IconButton
          onClick={() => setPreviewEnabled(!previewEnabled)}
          disabled={previewEnabled && !editorEnabled}>
          {previewEnabled ? <VisibilityOff /> : <Visibility />}
        </IconButton>
        <TextField
          sx={{
            ml: 1,
            minWidth: "35vw",
          }}
          label="Search notes"
          placeholder="Title, content"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            if (selectedNote) {
              setSelectedNote(undefined);
            }
          }}
          slotProps={{
            input: {
              endAdornment: searchText.length > 0 && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setSearchText("")}
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }
          }}
        />
      </Header>

      <Grid container spacing={2} flexGrow={1}>
        <Grid size={{ xs: 12, lg: 2 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.6 }}>
            <Typography variant="h6" mr={1}>
              Categories
            </Typography>
            <IconButton size="small" onClick={() => setIsCategoriesModalOpen(true)}>
              <CreateNewFolder />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, borderRadius: '8px', border: `solid 1px ${palette.text.primary}` }}>
            <NoteCategoryContainer
              key={-1}
              category={{
                id: -1,
                name: "Uncategorized",
              }}
              searchText={searchText}
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
            />
            {noteCategories?.map((category) => (
              <NoteCategoryContainer
                key={category.id}
                category={category}
                searchText={searchText}
                selectedNote={selectedNote}
                setSelectedNote={setSelectedNote}
              />
            ))}
          </Box>
        </Grid>

        {editorEnabled && (
          <Grid
            size={{ xs: 12, lg: previewEnabled ? 5 : 10 }}
            sx={{ display: 'flex', flexDirection: 'column', minHeight: '50vh' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
              <Typography variant="h6">
                Editor:
              </Typography>

              <TextField
                variant="standard"
                size="small"
                value={selectedNoteTitle}
                onChange={(e) => setSelectedNoteTitle(e.target.value)}
                disabled={!selectedNote}
              />

              <Select
                variant="standard"
                size="small"
                sx={{ minWidth: 150 }}
                value={selectedNoteCategory?.id ?? -1}
                onChange={(e) => setSelectedNoteCategory(noteCategories?.find(cat => cat.id === e.target.value))}
                disabled={!selectedNote}
              >
                {!selectedNoteCategory && (
                  <MenuItem value={-1} disabled>
                    {selectedNote ? <em>Uncategorized</em> : ""}
                  </MenuItem>
                )}
                {noteCategories?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>

              <IconButton
                sx={{ ml: 'auto' }}
                color="success"
                disabled={!selectedNote}
                loading={editNoteLoading}
                onClick={() => {
                  if (selectedNote) {
                    editNote({
                      id: selectedNote.id,
                      title: selectedNoteTitle.trim(),
                      content: selectedNoteContent,
                      dateModified: new Date(),
                      categoryId: selectedNoteCategory?.id,
                    })
                  }
                }}
              >
                <Save />
              </IconButton>

              <IconButton
                color="error"
                disabled={!selectedNote}
                loading={deleteNoteLoading}
                onClick={() => {
                  if (selectedNote) {
                    setConfirmDeleteOpen(true);
                  }
                }}
              >
                <Delete />
              </IconButton>
            </Box>

            <Box sx={{
              flexGrow: 1,
              borderRadius: '8px',
              border: `solid 1px ${palette.text.primary}`,
              display: 'flex',
              flexDirection: 'column',
            }}>
              {selectedNote && (
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, m: 2, mb: 0 }}>
                  <Typography variant="body2" color="gray">
                    Created: {dayjs(selectedNote.dateCreated).format('MMMM DD YYYY hh:mm:ss')}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    Last Modified: {dayjs(selectedNote.dateModified).format('MMMM DD YYYY hh:mm:ss')}
                  </Typography>
                </Box>
              )}

              <Box sx={{ flexGrow: 1 }}>
                <NoteEditor
                  value={selectedNoteContent}
                  onChange={(e) => setSelectedNoteContent(e.target.value)}
                  disabled={!selectedNote}
                  style={{
                    backgroundColor: palette.background.default,
                    color: palette.text.primary,
                  }}
                />
              </Box>
            </Box>
          </Grid>
        )}

        {previewEnabled && (
          <Grid
            size={{ xs: 12, lg: editorEnabled ? 5 : 10 }}
            sx={{ display: 'flex', flexDirection: 'column', minHeight: '50vh' }}
          >
            <Typography variant="h6" mb={1.6}>
              Markdown Preview
            </Typography>

            <MarkdownPreview
              source={selectedNoteContent}
              style={{
                flexGrow: 1,
                borderRadius: '8px',
                border: `solid 1px ${palette.text.primary}`,
                backgroundColor: palette.background.default,
                color: palette.text.primary,
                padding: '16px',
              }}
            />
          </Grid>
        )}
      </Grid>

      <ManageNoteCategoriesModal
        isOpen={isCategoriesModalOpen}
        setIsOpen={setIsCategoriesModalOpen}
        setSelectedNote={setSelectedNote}
      />

      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={`note: ${selectedNote?.title || "Untitled"}`}
        deleteFn={() => {
          if (selectedNote) {
            deleteNote({ id: selectedNote.id });
            setSelectedNote(undefined);
          }
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  height: 100%;
  box-sizing: border-box;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
`;

const Header = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NoteEditor = styled.textarea`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  resize: none;
  padding: 16px;
  margin: 0;
  outline: none;
  border: none;
  border-radius: 8px;
`;
