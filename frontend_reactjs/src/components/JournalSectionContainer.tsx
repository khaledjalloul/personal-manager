import { Box, IconButton, TextField, Typography } from "@mui/material"
import { JournalEntry, JournalSection } from "../types";
import { useCreateJournalEntry, useDeleteJournalSection, useEditJournalSection, useJournalEntries } from "../api";
import { JournalEntryContainer } from "./JournalEntryContainer";
import { Add, Clear, Delete, Edit, Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useCtrlS } from "../utils";
import { ConfirmDeleteDialog } from "./modals";

const emptyEntry: JournalEntry = {
  id: -1,
  date: new Date(),
  content: "",
  section: {
    id: -1,
    name: "",
    category: {
      id: -1,
      name: "",
    }
  }
};

export const JournalSectionContainer = ({
  section,
  searchText
}: {
  section: JournalSection
  searchText: string
}) => {

  const [isEditingSection, setIsEditingSection] = useState(false);
  const [sectionName, setSectionName] = useState(section.name);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { data: entries } = useJournalEntries({
    sectionId: section.id,
    searchText: searchText.trim()
  });

  const { mutate: editSection, isPending: editSectionLoading, isSuccess: editSectionSuccess } = useEditJournalSection();
  const { mutate: deleteSection, isPending: deleteSectionLoading } = useDeleteJournalSection();

  const save = () => {
    if (!sectionName.trim()) return;

    editSection({
      id: section.id,
      name: sectionName.trim()
    });
  };

  useCtrlS(save);

  useEffect(() => {
    if (editSectionSuccess) setIsEditingSection(false);
  }, [editSectionSuccess]);

  return (
    <Box>
      {!isEditingSection ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="subtitle1">{section.name} ({entries?.length})</Typography>

          <IconButton
            size="small"
            sx={{ ml: 2 }}
            onClick={() => setIsEditingSection(true)}
          >
            {/* TODO: make all buttons properly small */}
            <Edit />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => setIsAddingEntry(true)}
          >
            <Add />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <TextField
            label="Section Name"
            variant="standard"
            value={sectionName || ""}
            onChange={(e) => setSectionName(e.target.value)} />

          <IconButton
            size="small"
            color="success"
            loading={editSectionLoading}
            disabled={!sectionName.trim()}
            onClick={save}
          >
            <Save />
          </IconButton>

          <IconButton
            size="small"
            color="error"
            loading={deleteSectionLoading}
            onClick={() => setConfirmDeleteOpen(true)}
          >
            <Delete />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => {
              setSectionName(section.name);
              setIsEditingSection(false);
            }}
          >
            <Clear />
          </IconButton>
        </Box>
      )}

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 3, md: 1 }
      }}>
        {isAddingEntry && (
          <JournalEntryContainer
            entry={{ ...emptyEntry, section }}
            isAddingEntry={isAddingEntry}
            setIsAddingEntry={setIsAddingEntry}
          />
        )}
        {entries?.map(entry => (
          <JournalEntryContainer
            key={entry.id}
            entry={entry}
            isAddingEntry={isAddingEntry}
            setIsAddingEntry={setIsAddingEntry}
          />
        ))}
      </Box>

      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={`journal section: ${section.name}`}
        deleteFn={() => deleteSection({ id: section.id })}
      />

    </Box>
  )
};