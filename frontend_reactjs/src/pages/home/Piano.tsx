import {
    Box,
    Button,
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
import { useMemo, useState } from "react";
import { Settings, Insights, Clear } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { usePianoPieces } from "../../api";
import { PianoPieceTableRow } from "../../components";

type SummaryEntry = {
    [month: string]: {
        [category: string]: number;
        total: number;
    };
}

export const Piano = () => {
    const navigate = useNavigate();
    //   const { userData } = useContext(UserContext);

    //   const [maxUsers, setMaxUsers] = useState(maxUsersOptions[0]);
    const [searchText, setSearchText] = useState("");

    const { data: pianoPieces } = usePianoPieces({
        // searchText: searchText.trim(),
    });
    //   const [modalItem, setModalItem] = useState<Group>();

    //   const { data: expensesCategories } = useExpenseCategories();
    //   const { data: expenses } = useExpenses({
    //     type: "all",
    //     tags: [],
    //     searchText: searchText.trim(),
    //   });
    // const { data: expenses } = useExpenses({
    //   // maxUsers: maxUsers !== "Any" ? maxUsers : undefined,
    //   searchText: searchText.trim(),
    // });

    //   const summary = useMemo(() => {
    //     const categoryNames = expensesCategories?.map(c => c.name) || [];

    //     return expenses?.reduce<SummaryEntry>((acc, expense) => {
    //       const month = `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}`;

    //       // Init month if not there
    //       if (!acc[month]) {
    //         acc[month] = { total: 0 };
    //         for (const category of categoryNames) {
    //           acc[month][category] = 0;
    //         }
    //       }

    //       // Add expense to correct category
    //       if (categoryNames.includes(expense.category.name)) {
    //         acc[month][expense.category.name] += expense.amount;
    //         acc[month].total += expense.amount;
    //       }

    //       return acc;
    //     }, {}) ?? {};
    //   }, [JSON.stringify(expenses), JSON.stringify(expensesCategories)]);

    return (
        <Wrapper>
            <Header>
                {/* <Typography variant="h6">Groups</Typography> */}
                {/* <IconButton onClick={() => navigate("/create")}>
                      <Add color="success" />
                    </IconButton> */}
                {/* <Button
                    variant="contained"
                    onClick={location.pathname === "/expenses" ? undefined : () => navigate("/expenses")}
                    color="secondary"
                    startIcon={<Insights />}
                >
                    Statistics
                </Button>
                <Button
                    variant="contained"
                    onClick={location.pathname === "/expenses/daily" ? undefined : () => navigate("/expenses/daily")}
                    color="secondary"
                    startIcon={<ViewList />}
                >
                    Daily
                </Button>
                <Button
                    variant="contained"
                    onClick={location.pathname === "/expenses/monthly" ? undefined : () => navigate("/expenses/monthly")}
                    color="secondary"
                    startIcon={<Today />}
                >
                    Monthly
                </Button>
                <Button
                    variant="contained"
                    onClick={location.pathname === "/expenses/manage" ? undefined : () => navigate("/expenses/manage")}
                    color="secondary"
                    startIcon={<Settings />}
                >
                    Manage
                </Button> */}
                {/* <TextField
                      select
                      value={maxUsers}
                      label={"Maximum Users"}
                      sx={{ ml: "auto", minWidth: 125 }}
                      onChange={(item) => setMaxUsers(item.target.value)}
                    >
                      {maxUsersOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField> */}
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
