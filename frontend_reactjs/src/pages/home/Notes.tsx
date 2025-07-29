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
import { useContext, useEffect, useRef, useState } from "react";
import {
  Clear,
  CreateNewFolder,
  Delete,
  Edit,
  EditOff,
  Save
} from "@mui/icons-material";
import { useDeleteNote, useEditNote, useNoteCategories, useNotes } from "../../api";
import { ConfirmDeleteDialog, ManageNoteCategoriesModal, NoteCategoryContainer } from "../../components";
import { Note, NoteCategory } from "../../types";
import MarkdownPreview from '@uiw/react-markdown-preview';
import dayjs from "dayjs";
import { useCtrlS, useKeybinding, UserContext } from "../../utils";


export const Notes = () => {

  const { palette } = useTheme();
  const { userData, setUserData } = useContext(UserContext);

  const [searchText, setSearchText] = useState("");
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [editorEnabled, setEditorEnabled] = useState(false);
  const [editorScrollValue, setEditorScrollValue] = useState(0);
  const [previewScrollValue, setPreviewScrollValue] = useState(0);
  const [selectedNote, setSelectedNote] = useState<Note>();
  const [selectedNoteTitle, setSelectedNoteTitle] = useState("");
  const [selectedNoteCategory, setSelectedNoteCategory] = useState<NoteCategory>();
  const [selectedNoteContent, setSelectedNoteContent] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { data: notes } = useNotes({ searchText: searchText.trim() })
  const { data: noteCategories } = useNoteCategories({ searchText: searchText.trim() });

  const { mutate: editNote, isPending: editNoteLoading } = useEditNote();
  const { mutate: deleteNote, isPending: deleteNoteLoading, isSuccess: deleteSuccess } = useDeleteNote();

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const save = () => {
    if (!selectedNote || isCategoriesModalOpen || !selectedNoteTitle.trim()) return;
    editNote({
      id: selectedNote.id,
      title: selectedNoteTitle.trim(),
      content: selectedNoteContent,
      dateModified: new Date(),
      categoryId: selectedNoteCategory?.id,
    });
  };

  useEffect(() => {
    if (selectedNote) {
      setSelectedNoteTitle(selectedNote.title);
      setSelectedNoteCategory(selectedNote.category);
      setSelectedNoteContent(selectedNote.content);
      if (userData)
        setUserData({ ...userData, lastOpenedNoteId: selectedNote.id });
    } else {
      setSelectedNoteTitle("");
      setSelectedNoteCategory(undefined);
      setSelectedNoteContent("");
    }

    setEditorScrollValue(0);
    setPreviewScrollValue(0);
    if (editorRef.current)
      editorRef.current.scrollTop = 0;
    if (previewRef.current)
      previewRef.current.scrollTop = 0;
  }, [selectedNote?.id]);

  useCtrlS(save);
  useKeybinding("e", () => setEditorEnabled(!editorEnabled));
  useKeybinding("d", () => {
    if (selectedNote)
      setConfirmDeleteOpen(true);
  });

  useEffect(() => {
    if (editorEnabled && editorRef.current)
      editorRef.current.scrollTop = editorScrollValue;

    if (!editorEnabled && previewRef.current)
      previewRef.current.scrollTop = previewScrollValue;
  }, [editorEnabled]);

  useEffect(() => {
    if (notes && userData && userData.lastOpenedNoteId) {
      const lastOpenNote = notes.find(note => note.id === userData.lastOpenedNoteId);
      if (lastOpenNote)
        setSelectedNote(lastOpenNote);
    }
  }, [JSON.stringify(notes)]);

  useEffect(() => {
    if (deleteSuccess && selectedNote)
      setSelectedNote(undefined);
  }, [deleteSuccess]);

  return (
    <Wrapper>
      <Header
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 1 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography variant="h5">
            Notes ({notes?.length || 0})
          </Typography>

          <IconButton
            sx={{ ml: "auto" }}
            onClick={() => setEditorEnabled(!editorEnabled)}
          >
            {editorEnabled ? <EditOff /> : <Edit />}
          </IconButton>
        </Box>

        <TextField
          sx={{
            ml: { xs: 0, sm: 1 },
            minWidth: { xs: 0, sm: "35vw" },
          }}
          label="Search notes"
          placeholder="Category, title, content"
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

      <Grid
        container
        spacing={{ xs: 4, sm: 2 }}
        sx={{
          height: 'calc(100% - 80px)',
          p: '32px',
          pt: 0
        }}
      >
        <Grid size={{ xs: 12, sm: 3, lg: 2 }} sx={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.6 }}>
            <Typography variant="h6" mr={1}>
              Categories
            </Typography>
            <IconButton size="small" onClick={() => setIsCategoriesModalOpen(true)}>
              <CreateNewFolder />
            </IconButton>
          </Box>

          <Box sx={{
            flexGrow: 1,
            borderRadius: '8px',
            border: `solid 1px ${palette.text.primary}`,
            overflowY: 'auto',
          }}>
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

        <Grid
          size={{ xs: 12, sm: 9, lg: 10 }}
          sx={{ display: 'flex', flexDirection: 'column', minHeight: '50vh', height: '100%' }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            mb: { xs: 3, sm: 1 },
            gap: { xs: 2, sm: 1 }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6">
                {editorEnabled ? "Editor" : "Preview"}:
              </Typography>

              <IconButton
                sx={{ ml: 'auto', display: { xs: 'flex', sm: 'none' } }}
                color="success"
                disabled={!selectedNote || !selectedNoteTitle.trim()}
                loading={editNoteLoading}
                onClick={save}
              >
                <Save />
              </IconButton>

              <IconButton
                sx={{ display: { xs: 'flex', sm: 'none' } }}
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

            <TextField
              variant="standard"
              size="small"
              placeholder="Note Title"
              sx={{ flexGrow: 1 }}
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
              sx={{ ml: 'auto', display: { xs: 'none', sm: 'flex' } }}
              color="success"
              disabled={!selectedNote || !selectedNoteTitle.trim()}
              loading={editNoteLoading}
              onClick={save}
            >
              <Save />
            </IconButton>

            <IconButton
              sx={{ display: { xs: 'none', sm: 'flex' } }}
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

          {editorEnabled ? (
            <Box sx={{
              flexGrow: 1,
              borderRadius: '8px',
              border: `solid 1px ${palette.text.primary}`,
              display: 'flex',
              flexDirection: 'column',
            }}>
              {selectedNote && (
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, m: 2 }}>
                  <Typography variant="body2" color="gray">
                    Created: {dayjs(selectedNote.dateCreated).format('MMMM DD YYYY HH:mm:ss')}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    Last Modified: {dayjs(selectedNote.dateModified).format('MMMM DD YYYY HH:mm:ss')}
                  </Typography>
                </Box>
              )}

              <Box sx={{ flexGrow: 1 }}>
                <NoteEditor
                  ref={editorRef}
                  value={selectedNoteContent}
                  onChange={(e) => setSelectedNoteContent(e.target.value)}
                  disabled={!selectedNote}
                  onScroll={(e) => setEditorScrollValue(e.currentTarget.scrollTop)}
                  style={{
                    backgroundColor: palette.background.default,
                    color: palette.text.primary,
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Box
              ref={previewRef}
              sx={{
                flexGrow: 1,
                borderRadius: '8px',
                border: `solid 1px ${palette.text.primary}`,
                overflowY: 'auto',
              }}
              onScroll={(test) => setPreviewScrollValue(test.currentTarget.scrollTop)}
            >
              <MarkdownPreview
                source={selectedNoteContent}
                style={{
                  borderRadius: '8px',
                  backgroundColor: palette.background.default,
                  color: palette.text.primary,
                  padding: '16px',
                }}
              />
            </Box>
          )}
        </Grid>
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
          if (selectedNote)
            deleteNote({ id: selectedNote.id });
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  height: 100%;
  box-sizing: border-box;
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
`;

const Header = styled(Box)`
  display: flex;
  padding: 0 32px 0 32px;
`;

const NoteEditor = styled.textarea`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  resize: none;
  padding: 16px;
  padding-top: 0;
  margin: 0;
  outline: none;
  border: none;
  border-radius: 8px;
`;
