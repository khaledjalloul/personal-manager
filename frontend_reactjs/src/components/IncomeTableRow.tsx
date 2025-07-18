import {
	IconButton,
	InputAdornment,
	TableCell,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { Income } from "../types";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Clear, Delete, Edit, Save } from "@mui/icons-material";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCreateIncome, useDeleteIncome, useEditIncome } from "../api";
import { ConfirmDeleteDialog } from "./modals";


export const IncomeTableRow = ({
	income,
	index,
	editable = false, // Non-editable also means the component is used in the Details page, so it includes extra table cells
	isAddingIncome,
	setIsAddingIncome,
}: {
	income: Income;
	index: number;
	editable?: boolean;
	isAddingIncome?: boolean;
	setIsAddingIncome?: Dispatch<SetStateAction<boolean>>;
}) => {

	const { mutate: createIncome } = useCreateIncome();
	const { mutate: editIncome } = useEditIncome();
	const { mutate: deleteIncome } = useDeleteIncome();

	const [isEditing, setIsEditing] = useState(isAddingIncome);
	const [date, setDate] = useState(dayjs(income.date));
	const [source, setSource] = useState(income.source);
	const [amount, setAmount] = useState(income.amount);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

	const resetFields = () => {
		setDate(dayjs(income.date));
		setSource(income.source);
		setAmount(income.amount);
	}

	return (
		<Fragment>
			<TableRow
				sx={{
					backgroundColor: index % 2 === 0 ? "white" : "secondary.main",
					":hover": editable ? { backgroundColor: "secondary.dark" } : {}
				}}
			>
				<TableCell>
					{!isEditing ? date.format("DD.MM.YYYY") :
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								value={date}
								onChange={(newValue) => setDate(newValue ?? dayjs(new Date()))}
								enableAccessibleFieldDOMStructure={false}
								format="DD.MM.YYYY"
								slotProps={{
									textField: {
										size: "small",
										variant: "standard",
										placeholder: "Date",
									}
								}}
							/>
						</LocalizationProvider>
					}
				</TableCell>

				{!editable && (
					<TableCell>
						<Typography color="success" variant="body2">Income</Typography>
					</TableCell>
				)}

				<TableCell width={"40%"}>
					{!isEditing ? source :
						<TextField
							variant="standard"
							placeholder="Source"
							value={source}
							onChange={(e) => setSource(e.target.value)}
							sx={{ width: "100%" }}
						/>
					}
				</TableCell>

				{!editable && <TableCell />}

				<TableCell>
					{!isEditing ? amount.toFixed(2) :
						<TextField
							variant="standard"
							placeholder="Amount"
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

							<IconButton
								size="small"
								color="error"
								onClick={() => setConfirmDeleteOpen(true)}
							>
								<Delete />
							</IconButton>
						</TableCell>
					) : (
						<TableCell sx={{ display: 'flex', gap: 1 }}>
							<IconButton
								size="small"
								color="success"
								onClick={() => {
									if (income.id !== -1) {
										editIncome({
											id: income.id,
											date: date.toDate(),
											source,
											amount,
										});
										setIsEditing(false);
									} else if (setIsAddingIncome) {
										createIncome({
											date: date.toDate(),
											source,
											amount,
										});
										setIsAddingIncome(false);
									}
								}}>
								<Save />
							</IconButton>

							<IconButton size="small" onClick={() => {
								if (income.id !== -1) {
									resetFields();
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
			<ConfirmDeleteDialog
				isOpen={confirmDeleteOpen}
				setIsOpen={setConfirmDeleteOpen}
				itemName={`income: ${income.source}`}
				deleteFn={() => deleteIncome({ id: income.id })} />
		</Fragment>
	)
}
