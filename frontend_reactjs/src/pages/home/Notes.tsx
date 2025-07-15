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
import { useNoteCategories } from "../../api";
import { ManageNoteCategoriesModal, NoteCategoryContainer } from "../../components";
import { Note } from "../../types";
import MarkdownPreview from '@uiw/react-markdown-preview';
import dayjs from "dayjs";


export const Notes = () => {

  const { palette } = useTheme();

  const { data: noteCategories } = useNoteCategories({});

  const [searchText, setSearchText] = useState("");
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const [editorEnabled, setEditorEnabled] = useState(true);
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [noteContent, setNoteContent] = useState("");

  useEffect(() => {
    if (selectedNote) {
      setNoteContent(selectedNote.content);
    } else {
      setNoteContent("");
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
        <Grid size={{ xs: 12, md: 2 }} sx={{ minWidth: '200px', display: 'flex', flexDirection: 'column' }}>
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
            size={{ xs: 12, md: previewEnabled ? 5 : 10 }}
            sx={{ display: 'flex', flexDirection: 'column', minHeight: '50vh' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
              <Typography variant="h6">
                Editor:
              </Typography>

              <TextField
                value={selectedNote?.title || ""}
                variant="standard"
                size="small"
                disabled={!selectedNote}
              />

              <IconButton sx={{ ml: 'auto' }}>
                <Save color="success" />
              </IconButton>

              <IconButton>
                <Delete color="error" />
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
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  disabled={!selectedNote}
                />
              </Box>
            </Box>
          </Grid>
        )}

        {previewEnabled && (
          <Grid
            size={{ xs: 12, md: editorEnabled ? 5 : 10 }}
            sx={{ display: 'flex', flexDirection: 'column', minHeight: '50vh' }}
          >
            <Typography variant="h6" mb={1.6}>
              Markdown Preview
            </Typography>

            <MarkdownPreview
              source={noteContent}
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
