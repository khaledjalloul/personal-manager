import {
	Box,
	Button,
	IconButton,
	InputAdornment,
	TableCell,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import styled from "styled-components";
import { Expense, Income } from "../types";
import { useState } from "react";
import { Clear, Delete, Edit, Save } from "@mui/icons-material";

export const IncomeCardHeader = () => {
	return (
		<Wrapper sx={{ backgroundColor: "primary.light", mr: 2 }}>
			<Typography variant="body1" sx={{ width: "10%" }}>
				Date
			</Typography>
			<Typography variant="body1" sx={{ flexGrow: 1 }}>
				Source
			</Typography>
			<Typography variant="body1" sx={{ width: "10%" }}>
				Amount
			</Typography>
		</Wrapper>
	);
}

export const IncomeCard = ({ income, index, editable = false }: {
	income: Income;
	index: number;
	editable?: boolean;
}) => {

	const [isEditing, setIsEditing] = useState(false);

	const [date, setDate] = useState(income.date);
	const [source, setSource] = useState(income.source);
	const [amount, setAmount] = useState(income.amount);

	if (!isEditing)
		return (
			<Wrapper
				sx={{
					backgroundColor: index % 2 == 0 ? "secondary.main" : "white",
					cursor: editable ? "pointer" : "default",
					":hover": editable ? {
						backgroundColor: "secondary.dark",
					} : {}
				}}
				onClick={editable ? () => setIsEditing(true) : undefined}>
				<Typography variant="body2" sx={{ minWidth: "10%" }}>
					{date.toLocaleDateString("en-US")}
				</Typography>
				<Typography variant="body2" sx={{ flexGrow: 1 }}>
					{source}
				</Typography>
				<Typography variant="body2" sx={{ minWidth: "10%" }}>
					{amount.toFixed(2)} CHF
				</Typography>
			</Wrapper>
		);
	else return (
		<Wrapper sx={{
			backgroundColor: index % 2 == 0 ? "secondary.main" : "secondary.dark",
		}}>
			<TextField
				variant="standard"
				value={date.toLocaleDateString("en-US")}
				onChange={(e) => {
					const newDate = new Date(e.target.value);
					setDate(isNaN(newDate.getTime()) ? date : newDate);
				}}
				sx={{ minWidth: "10%" }}
			/>
			<TextField
				variant="standard"
				value={source}
				onChange={(e) => setSource(e.target.value)}
				sx={{ flexGrow: 1 }}
			/>
			<TextField
				variant="standard"
				value={amount.toFixed(2)}
				onChange={(e) => {
					const newAmount = parseFloat(e.target.value);
					setAmount(isNaN(newAmount) ? amount : newAmount);
				}}
				sx={{ minWidth: "10%" }}
				InputProps={{
					endAdornment: <InputAdornment position="end">CHF</InputAdornment>,
				}}
			/>
			<IconButton>
				<Save color="success" />
			</IconButton>
			<IconButton>
				<Delete color="error" />
			</IconButton>
			<IconButton onClick={() => {
				setDate(income.date);
				setSource(income.source);
				setAmount(income.amount);
				setIsEditing(false)
			}}>
				<Clear />
			</IconButton>
		</Wrapper>
	)
}


export const IncomeTableRow = ({ income, index, editable = false }: {
	income: Income;
	index: number;
	editable?: boolean;
}) => {

	const [isEditing, setIsEditing] = useState(false);
	const [date, setDate] = useState(income.date);
	const [source, setSource] = useState(income.source);
	const [amount, setAmount] = useState(income.amount);

	if (!isEditing)
		return (
			<TableRow
				sx={{
					backgroundColor: index % 2 === 0 ? "white" : "secondary.main",
					":hover": editable ? { backgroundColor: "secondary.dark" } : {}
				}}

			>
				<TableCell >
					{income.date.toLocaleDateString()}
				</TableCell>
				<TableCell width={"40%"}>{income.source}</TableCell>
				<TableCell>{income.amount.toFixed(2)}</TableCell>
				{editable && <TableCell
					sx={{ display: 'flex', gap: 1 }}
				>
					<IconButton size="small"
						onClick={() => setIsEditing(true)}
					>
						<Edit />
					</IconButton>

					<IconButton size="small">
						<Delete color="error" />
					</IconButton>
				</TableCell>}
			</TableRow>
		)
	else return (
		<TableRow
			key={index}
			sx={{
				backgroundColor: index % 2 === 0 ? "white" : "secondary.main",
				":hover": { backgroundColor: "secondary.dark" }
			}}
		// onClick={() => navigate(`/expenses/${expense.id}`)}
		>
			<TableCell >
				<TextField
					variant="standard"
					value={date.toLocaleDateString("en-US")}
					onChange={(e) => {
						const newDate = new Date(e.target.value);
						setDate(isNaN(newDate.getTime()) ? date : newDate);
					}}
				/>
			</TableCell>
			<TableCell width={"40%"}>
				<TextField
					variant="standard"
					value={source}
					onChange={(e) => setSource(e.target.value)}
					sx={{ width: "100%" }}
				/>
			</TableCell>
			<TableCell>
				<TextField
					variant="standard"
					value={amount.toFixed(2)}
					onChange={(e) => {
						const newAmount = parseFloat(e.target.value);
						setAmount(isNaN(newAmount) ? amount : newAmount);
					}}
					InputProps={{
						endAdornment: <InputAdornment position="end">CHF</InputAdornment>,
					}}
				/>
			</TableCell>

			<TableCell sx={{ display: 'flex', gap: 1 }}>
				<IconButton size="small">
					<Save color="success" />
				</IconButton>

				<IconButton size="small" onClick={() => {
					setDate(income.date);
					setSource(income.source);
					setAmount(income.amount);
					setIsEditing(false)
				}}>
					<Clear />
				</IconButton>
			</TableCell>
		</TableRow>
	)
}


const Wrapper = styled(Box)`
display: flex;
flex-direction: row;
padding-left: 16px;
padding-right: 16px;
padding-top: 8px;
padding-bottom: 8px;
gap: 16px;
`;