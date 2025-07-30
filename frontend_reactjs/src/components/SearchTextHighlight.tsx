import { Box, Palette } from "@mui/material";
import { Fragment } from "react/jsx-runtime";

const BACKGROUND_COLOR_OVERRIDE = ''; // yellow
const TEXT_COLOR_OVERRIDE = ''; // black

// For JSX elements, place inside any typography or text element
export const SearchTextHighlight = ({
  text,
  searchText
}: {
  text: string;
  searchText: string
}) => {

  if (!searchText) return <Fragment>{text}</Fragment>;

  const escapedSearchText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedSearchText})`, 'gi');

  const parts = text.split(regex);

  return (
    <Fragment>
      {parts.map((part, index) => regex.test(part) ? (
        <Box
          key={index}
          component="span"
          sx={{
            backgroundColor: BACKGROUND_COLOR_OVERRIDE || 'primary.main',
            color: TEXT_COLOR_OVERRIDE || 'primary.contrastText',
          }}
        >
          {part}
        </Box>
      ) : (
        <Box key={index} component="span">
          {part}
        </Box>
      )
      )}
    </Fragment>
  );
};

// For pure text usage, without JSX
export const addSearchTextHighlight = (text: string, searchText: string, palette: Palette) => {
  if (!searchText) return text;

  const escapedSearchText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedSearchText})`, 'gi');

  const parts = text.split(regex);

  return parts.map((part) => !regex.test(part) ? part : (
    `<span style="background-color: ${BACKGROUND_COLOR_OVERRIDE || palette.primary.main}; color: ${TEXT_COLOR_OVERRIDE || palette.primary.contrastText};">${part}</span>`
  )).join('');
};