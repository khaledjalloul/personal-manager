import { Dispatch, SetStateAction, useState } from "react";
import { Note, NoteCategory } from "../types";
import { useCreateNote, useNotes } from "../api";
import { Box, IconButton, Typography } from "@mui/material";
import { Add, ExpandLess, ExpandMore } from "@mui/icons-material";

export const NoteCategoryContainer = ({
  category,
  searchText,
  selectedNote,
  setSelectedNote
}: {
  category: NoteCategory,
  searchText: string,
  selectedNote: Note | undefined,
  setSelectedNote: Dispatch<SetStateAction<Note | undefined>>
}) => {

  const [isOpen, setIsOpen] = useState(true);

  const { data: notes } = useNotes({
    categoryId: category.id,
    searchText: searchText.trim(),
  });
  const { mutate: createNote, isPending: createNoteLoading } = useCreateNote();

  const hidden = category.id === -1 &&
    !searchText.trim() && notes?.length === 0;

  return (
    <Box display={hidden ? "none" : "block"}>
      <Box
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          pl: 1,
          pr: 1,
          pt: category.id !== -1 ? 0.5 : 1.2,
          pb: category.id !== -1 ? 0.5 : 1.2,
          cursor: 'pointer',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          ":hover": { backgroundColor: "action.hover" },
        }}
      >
        <Typography variant="body1" key={category.id}>
          {category.name} ({notes?.length})
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          {category.id !== -1 && (
            <IconButton
              size="small"
              loading={createNoteLoading}
              onClick={(e) => {
                e.stopPropagation();
                const newDate = new Date();
                createNote({
                  categoryId: category.id,
                  dateCreated: newDate,
                  dateModified: newDate,
                  title: "New Note",
                  content: "",
                  tags: []
                })
              }}>
              <Add fontSize="small" />
            </IconButton>
          )}

          {isOpen ?
            <ExpandLess sx={{ color: "text.primary" }} fontSize="small" /> :
            <ExpandMore sx={{ color: "text.primary" }} fontSize="small" />}
        </Box>
      </Box>

      {isOpen && (
        <Box>
          {notes?.map((note) => (
            <Box
              key={note.id}
              onClick={() => setSelectedNote(note)}
              sx={{
                pl: 3,
                pr: 1,
                pt: 0.5,
                pb: 0.5,
                cursor: 'pointer',
                backgroundColor: selectedNote?.id === note.id ? "primary.light" : "background.default",
                ":hover": selectedNote?.id !== note.id ? { backgroundColor: "action.hover" } : {},
              }}
            >
              <Typography variant="body1">{note.title}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}