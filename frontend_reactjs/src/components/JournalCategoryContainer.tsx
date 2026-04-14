import { Box, Checkbox, Typography, } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { CheckBox, ExpandLess, ExpandMore, } from "@mui/icons-material";
import { useJournalSections } from "../api";
import { JournalCategory, JournalSection } from "../types";

export const JournalCategoryContainer = ({
  category,
  searchText,
  selectedSections,
  setSelectedSections
}: {
  category: JournalCategory;
  searchText: string;
  selectedSections: JournalSection[];
  setSelectedSections: Dispatch<SetStateAction<JournalSection[]>>;
}) => {

  const totalEntryCount = category.sections?.reduce((acc, section) => acc + section.entries.length, 0) || 0;

  const [isOpen, setIsOpen] = useState(true);

  const { data: sections } = useJournalSections({ categoryId: category.id, searchText: searchText.trim() });

  return (
    <Box>
      <Box
        onClick={(e) => {
          if (sections) {
            if (!selectedSections.some(s => sections.some(sec => sec.id === s.id))) {
              const newSelected = [...selectedSections];
              sections.forEach(section => {
                if (!newSelected.some(s => s.id === section.id))
                  newSelected.push(section);
              });
              setSelectedSections(newSelected);
            } else {
              setSelectedSections(prev => prev.filter(s => !sections.some(sec => sec.id === s.id)));
            }
          }
        }}
        sx={{
          p: 1,
          pl: 1.5,
          cursor: 'pointer',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: "background.default",
          ":hover": { backgroundColor: "action.hover" },
        }}
      >
        <Checkbox
          size="small"
          sx={{ p: 0, mr: 1 }}
          checked={selectedSections.some(s => sections?.some(sec => sec.id === s.id))}
          checkedIcon={<CheckBox htmlColor={category.color} />}
        />

        <Typography variant="body1">{category.name}{" "}({totalEntryCount})</Typography>

        {isOpen ?
          <ExpandLess
            sx={{ color: "text.primary", ml: "auto", ":hover": { mb: 0.5 } }} fontSize="small"
            onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
          /> :
          <ExpandMore
            sx={{ color: "text.primary", ml: "auto", ":hover": { mt: 0.5 } }} fontSize="small"
            onClick={(e) => { e.stopPropagation(); setIsOpen(true) }}
          />
        }
      </Box>

      {isOpen && (
        <Box>
          {sections?.map((section) => (
            <Box
              key={section.id}
              sx={{
                pl: 3,
                pr: 1,
                pt: 0.5,
                pb: 0.5,
                cursor: 'pointer',
                display: 'flex',
                gap: 1,
                backgroundColor: "background.default",
                ":hover": { backgroundColor: "action.hover" },
              }}
              onClick={(e) => setSelectedSections(prev => !selectedSections.some(s => s.id === section.id) ? [...prev, section] : prev.filter(s => s.id !== section.id))}
            >
              <Checkbox
                size="small"
                sx={{ p: 0, pr: 0.5 }}
                checked={selectedSections.some(s => s.id === section.id)}
                checkedIcon={<CheckBox htmlColor={section.category.color} />}
              />
              <Typography>{section.name}{" "}({section._count?.entries})</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}