import {
	IconButton,
	InputAdornment,
	TableCell,
	TableRow,
	TextField,
} from "@mui/material";
import { Income } from "../types";
import { Dispatch, SetStateAction, useState } from "react";
import { Clear, Delete, Edit, Save } from "@mui/icons-material";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


export const IncomeTableRow = ({ income,
	index,
	editable = false,
	isAddingIncome,
	setIsAddingIncome,
}: {
	income: Income;
	index: number;
	editable?: boolean;
	isAddingIncome?: boolean;
	setIsAddingIncome?: Dispatch<SetStateAction<boolean>>;
}) => {

	const [isEditing, setIsEditing] = useState(isAddingIncome);
	const [date, setDate] = useState(dayjs(income.date));
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
				{!isEditing ? date.format("DD.MM.YYYY") :
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							value={date}
							onChange={(newValue) => setDate(newValue ?? dayjs(new Date()))}
							enableAccessibleFieldDOMStructure={false}
							slots={{
								textField: props => <TextField {...props} size="small"
									value={date.format('DD.MM.YYYY')}
								/>
							}}
						/>
					</LocalizationProvider>
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
						slotProps={{
							input: {
								endAdornment: <InputAdornment position="end">CHF</InputAdornment>,
							}
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
							if (!isAddingIncome) {
								setDate(dayjs(income.date));
								setSource(income.source);
								setAmount(income.amount);
								setIsEditing(false)
							} else if (setIsAddingIncome) {
								setIsAddingIncome(false);
							}
						}}>
							<Clear />
						</IconButton>
					</TableCell>
				)
			)}
		</TableRow>
	)
}
