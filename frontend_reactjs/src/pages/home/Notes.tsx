import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
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
import { useDeleteNote, useEditNote, useNoteCategories } from "../../api";
import { ManageNoteCategoriesModal, NoteCategoryContainer } from "../../components";
import { Note } from "../../types";
import MarkdownPreview from '@uiw/react-markdown-preview';
import dayjs from "dayjs";


export const Notes = () => {

  const { palette } = useTheme();

  const { data: noteCategories } = useNoteCategories({});
  const { mutate: editNote } = useEditNote();
  const { mutate: deleteNote } = useDeleteNote();

  const [searchText, setSearchText] = useState("");
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [editorEnabled, setEditorEnabled] = useState(true);
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const [selectedNoteTitle, setSelectedNoteTitle] = useState("");
  const [selectedNoteContent, setSelectedNoteContent] = useState("");

  useEffect(() => {
    if (selectedNote) {
      setSelectedNoteTitle(selectedNote.title);
      setSelectedNoteContent(selectedNote.content);
    } else {
      setSelectedNoteTitle("");
      setSelectedNoteContent("");
    }
  }, [JSON.stringify(selectedNote)]);

  return (
    <Wrapper>
      <Header>
        <Typography variant="h5">
          Notes
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
          placeholder="Title, content, tags"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
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
            {noteCategories?.map((category) => (
              <NoteCategoryContainer
                key={category.id}
                category={category}
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

              <IconButton
                sx={{ ml: 'auto' }}
                color="success"
                disabled={!selectedNote}
                onClick={() => {
                  if (selectedNote) {
                    editNote({
                      id: selectedNote.id,
                      title: selectedNoteTitle,
                      content: selectedNoteContent,
                      dateModified: new Date(),
                      categoryId: selectedNote.category.id, // TODO: Allow changing category
                    })
                  }
                }}
              >
                <Save />
              </IconButton>

              <IconButton
                color="error"
                disabled={!selectedNote}
                onClick={() => {
                  if (selectedNote) {
                    deleteNote({ id: selectedNote.id })
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
