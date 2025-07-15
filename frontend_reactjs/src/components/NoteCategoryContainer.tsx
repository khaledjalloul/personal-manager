import { Dispatch, SetStateAction, useState } from "react";
import { Note, NoteCategory } from "../types";
import { useNotes } from "../api";
import { Box, Typography } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export const NoteCategoryContainer = (
  { category,
    selectedNote,
    setSelectedNote
  }: {
    category: NoteCategory,
    selectedNote: Note | undefined,
    setSelectedNote: Dispatch<SetStateAction<Note | undefined>>
  }) => {

  const [isOpen, setIsOpen] = useState(true);

  const { data: notes } = useNotes({
    categoryId: category.id,
  });

  return (
    <Box>
      <Box
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          pl: 1,
          pr: 1,
          pt: 0.5,
          pb: 0.5,
          cursor: 'pointer',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          ":hover": { backgroundColor: "secondary.main" },
        }}
      >
        <Typography variant="body1" key={category.id}>
          {category.name}
        </Typography>

        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </Box>

      {isOpen && (
        <Box>
          {notes?.map((note) => (
            <Box
              key={note.id}
              onClick={() => setSelectedNote(note)}
              sx={{
                pl: 2,
                pr: 1,
                pt: 0.5,
                pb: 0.5,
                cursor: 'pointer',
                borderRadius: '8px',
                backgroundColor: selectedNote?.id === note.id ? "secondary.dark" : "background.main",
                ":hover": selectedNote?.id !== note.id ? { backgroundColor: "secondary.main" } : {},
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