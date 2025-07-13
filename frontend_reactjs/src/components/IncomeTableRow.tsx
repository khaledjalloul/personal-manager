import {
	IconButton,
	InputAdornment,
	TableCell,
	TableRow,
	TextField,
} from "@mui/material";
import { Income } from "../types";
import { useState } from "react";
import { Clear, Delete, Edit, Save } from "@mui/icons-material";


export const IncomeTableRow = ({ income, index, editable = false }: {
	income: Income;
	index: number;
	editable?: boolean;
}) => {

	const [isEditing, setIsEditing] = useState(false);
	const [date, setDate] = useState(income.date);
	const [source, setSource] = useState(income.source);
	const [amount, setAmount] = useState(income.amount);

	return (
		<TableRow
			sx={{
				backgroundColor: index % 2 === 0 ? "white" : "secondary.main",
				":hover": editable ? { backgroundColor: "secondary.dark" } : {}
			}}
		>
			<TableCell >
				{!isEditing ? date.toLocaleDateString() :
					<TextField
						variant="standard"
						value={date.toLocaleDateString("en-US")}
						onChange={(e) => {
							const newDate = new Date(e.target.value);
							setDate(isNaN(newDate.getTime()) ? date : newDate);
						}}
					/>
				}
			</TableCell>

			<TableCell width={"40%"}>
				{!isEditing ? source :
					<TextField
						variant="standard"
						value={source}
						onChange={(e) => setSource(e.target.value)}
						sx={{ width: "100%" }}
					/>
				}
			</TableCell>

			<TableCell>
				{!isEditing ? amount.toFixed(2) :
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
				}
			</TableCell>

			{editable && (
				!isEditing ? (
					<TableCell
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
					</TableCell>
				) : (
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
				)
			)}
		</TableRow>
	)
}
