import { Dispatch, SetStateAction, useState } from "react";
import { Note, NoteCategory } from "../types";
import { useNotes } from "../api";
import { Box, Typography } from "@mui/material";

export const NoteCategoryContainer = (
  { category,
    selectedNote,
    setSelectedNote
  }: {
    category: NoteCategory,
    selectedNote: Note | undefined,
    setSelectedNote: Dispatch<SetStateAction<Note | undefined>>
  }) => {

  const [isOpen, setIsOpen] = useState(false);

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
          ":hover": { backgroundColor: "secondary.dark" },
        }}
      >
        <Typography variant="body1" key={category.id}>
          {category.name}
        </Typography>
      </Box>

      {isOpen && (
        <Box>
          {notes?.map((note, index) => (
            <Box
              key={index}
              onClick={() => setSelectedNote(note)}
              sx={{
                pl: 2,
                pr: 1,
                pt: 0.5,
                pb: 0.5,
                cursor: 'pointer',
                backgroundColor: selectedNote?.id === note.id ? "secondary.main" : "background.main",
                ":hover": selectedNote?.id !== note.id ? { backgroundColor: "secondary.dark" } : {},
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