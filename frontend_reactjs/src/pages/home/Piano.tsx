import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import { Add, Clear } from "@mui/icons-material";
import { usePianoPieces } from "../../api";
import { PianoPieceTableRow } from "../../components";
import { PianoPiece, PianoPieceStatus } from "../../types";


const emptyPiece: PianoPiece = {
  id: -1,
  name: "",
  origin: "",
  composer: "",
  status: PianoPieceStatus.Planned,
  sheetMusicUrl: "",
  youtubeUrl: ""
}

export const Piano = () => {

  const [searchText, setSearchText] = useState("");
  const [isAddingPiece, setIsAddingPiece] = useState(false);

  const { data: pianoPieces } = usePianoPieces({
    searchText: searchText.trim(),
  });

  return (
    <Wrapper>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          gap: { xs: 2, md: 0 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5">
            Piano Pieces ({pianoPieces?.length || 0})
          </Typography>
          <IconButton onClick={() => setIsAddingPiece(true)}>
            <Add />
          </IconButton>
        </Box>

        <TextField
          sx={{
            minWidth: { xs: 0, md: "35vw" },
            ml: { xs: 0, md: "auto" },
          }}
          label="Search piano pieces"
          placeholder="Name, origin, composer"
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
      </Box>

      <TableContainer component={Paper}>
        <Table
          size="small"
          stickyHeader
          sx={{
            '& th': {
              backgroundColor: "primary.main",
              color: "primary.contrastText"
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Origin</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Composer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Month Learned</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Links</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isAddingPiece && (
              <PianoPieceTableRow
                key={emptyPiece.id}
                pianoPiece={emptyPiece}
                index={emptyPiece.id}
                isAddingPiece={isAddingPiece}
                setIsAddingPiece={setIsAddingPiece}
              />
            )}
            {pianoPieces?.map((piece, index) => (
              <PianoPieceTableRow
                key={piece.id}
                pianoPiece={piece}
                index={index}
                isAddingPiece={isAddingPiece}
                setIsAddingPiece={setIsAddingPiece}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  height: 100%;
  box-sizing: border-box;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

