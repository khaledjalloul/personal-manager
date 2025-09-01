import { Box, IconButton, TextField, Typography } from "@mui/material"
import { JournalEntry, JournalSection } from "../types";
import { useDeleteJournalSection, useEditJournalSection, useJournalEntries } from "../api";
import { JournalEntryContainer } from "./JournalEntryContainer";
import { Add, Clear, Delete, Edit, ExpandLess, ExpandMore, Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useCtrlS } from "../utils";
import { ConfirmDeleteDialog } from "./modals";
import { SearchTextHighlight } from "./SearchTextHighlight";

const emptyEntry: JournalEntry = {
  id: -1,
  date: new Date(),
  content: "",
  subEntries: [],
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
  searchText,
  allSectionsCollapsed
}: {
  section: JournalSection
  searchText: string
  allSectionsCollapsed: boolean
}) => {

  const [isEditingSection, setIsEditingSection] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
    if (!isEditingSection || !sectionName.trim()) return;

    editSection({
      id: section.id,
      name: sectionName.trim()
    });
  };

  useCtrlS(save);

  useEffect(() => {
    if (editSectionSuccess) setIsEditingSection(false);
  }, [editSectionSuccess]);

  useEffect(() => {
    setIsCollapsed(allSectionsCollapsed);
  }, [allSectionsCollapsed]);

  return (
    <Box>
      {!isEditingSection ? (
        <Box
          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
          onDoubleClick={section.id !== -1 ? () => setIsEditingSection(true) : undefined}
        >
          <Typography variant="subtitle1">
            <SearchTextHighlight text={section.name} searchText={searchText.trim()} />
            {" "}({entries?.length || 0})
          </Typography>

          {section.id !== -1 && (
            <IconButton
              sx={{ ml: 2 }}
              onClick={() => setIsEditingSection(true)}
            >
              <Edit fontSize="small" />
            </IconButton>
          )}

          {section.id !== -1 && (
            <IconButton
              onClick={() => setIsAddingEntry(true)}
            >
              <Add fontSize="small" />
            </IconButton>
          )}

          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ExpandMore fontSize="small" /> : <ExpandLess fontSize="small" />}
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TextField
            label="Section Name"
            variant="standard"
            value={sectionName || ""}
            onChange={(e) => setSectionName(e.target.value)} />

          <IconButton
            sx={{ ml: 1 }}
            color="success"
            loading={editSectionLoading}
            disabled={!sectionName.trim()}
            onClick={save}
          >
            <Save fontSize="small" />
          </IconButton>

          <IconButton
            color="error"
            loading={deleteSectionLoading}
            onClick={() => setConfirmDeleteOpen(true)}
          >
            <Delete fontSize="small" />
          </IconButton>

          <IconButton
            onClick={() => {
              setSectionName(section.name);
              setIsEditingSection(false);
            }}
          >
            <Clear fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Box sx={{
        display: isCollapsed ? 'none' : 'flex',
        flexDirection: 'column',
        gap: { xs: 3, lg: 1 }
      }}>
        {isAddingEntry && (
          <JournalEntryContainer
            entry={{ ...emptyEntry, section }}
            searchText={searchText}
            isAddingEntry={isAddingEntry}
            setIsAddingEntry={setIsAddingEntry}
          />
        )}
        {entries?.map(entry => (
          <JournalEntryContainer
            key={entry.id}
            entry={entry}
            searchText={searchText}
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