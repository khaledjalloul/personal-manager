import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Clear, Preview, Edit, EditOff, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNoteCategories } from "../../api";
import { NoteCategoryContainer } from "../../components";
import { Note } from "../../types";
import MarkdownPreview from '@uiw/react-markdown-preview';


export const Notes = () => {

  const { palette } = useTheme();

  const { data: noteCategories } = useNoteCategories({});

  const [searchText, setSearchText] = useState("");
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

  console.log(noteContent)
  return (
    <Wrapper>
      <Header>
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
          label="Search for piano piece"
          placeholder="Name, origin, composer, status"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            endAdornment: searchText.length > 0 && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setSearchText("")}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Header>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Box sx={{ minWidth: '200px', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>
            Notes
          </Typography>

          <Box sx={{ flexGrow: 1, borderRadius: '8px', border: `solid 1px ${palette.text.primary}` }}>
            {noteCategories?.map((category, index) => (
              <NoteCategoryContainer
                key={index}
                category={category}
                selectedNote={selectedNote}
                setSelectedNote={setSelectedNote}
              />
            ))}
          </Box>
        </Box>

        {selectedNote && editorEnabled && (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              {selectedNote.title}
            </Typography>

            <Box sx={{ flexGrow: 1, borderRadius: '8px', border: `solid 1px ${palette.text.primary}` }}>
              <NoteEditor
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </Box>

          </Box>
        )}

        {selectedNote && previewEnabled && (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
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

          </Box>
        )}
      </Box>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  flex-grow: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NoteEditor = styled.textarea`
  width: calc(100% - 32px);
  height: calc(100% - 32px);
  resize: none;
  padding: 16px;
  margin: 0;
  outline: none;
  border: none;
  border-radius: 8px;
`;
