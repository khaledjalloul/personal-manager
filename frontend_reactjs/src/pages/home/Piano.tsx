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
} from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import { Clear } from "@mui/icons-material";
import { usePianoPieces } from "../../api";
import { PianoPieceTableRow } from "../../components";


export const Piano = () => {

  const [searchText, setSearchText] = useState("");

  const { data: pianoPieces } = usePianoPieces({});

  return (
    <Wrapper>
      <Header>
        <TextField
          sx={{
            minWidth: "35vw", ml: "auto",
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

      <TableContainer component={Paper} sx={{ maxHeight: '75vh' }}>
        <Table size="small" stickyHeader sx={{ '& th': { backgroundColor: "primary.light" } }}>
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
            {pianoPieces?.map((piece, index) => (
              <PianoPieceTableRow key={index} pianoPiece={piece} index={index} editable />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
