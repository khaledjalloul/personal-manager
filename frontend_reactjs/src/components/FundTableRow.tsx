import {
	IconButton,
	InputAdornment,
	TableCell,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { Fund } from "../types";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Clear, Delete, Edit, Save } from "@mui/icons-material";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCreateFund, useDeleteFund, useEditFund } from "../api";
import { ConfirmDeleteDialog } from "./modals";


export const FundTableRow = ({
	fund,
	index,
	editable = false, // Non-editable also means the component is used in the Details page, so it includes extra table cells
	isAddingFund,
	setIsAddingFund,
}: {
	fund: Fund;
	index: number;
	editable?: boolean;
	isAddingFund?: boolean;
	setIsAddingFund?: Dispatch<SetStateAction<boolean>>;
}) => {

	const { mutate: createFund, isPending: createLoading } = useCreateFund();
	const { mutate: editFund, isPending: editLoading } = useEditFund();
	const { mutate: deleteFund, isPending: deleteLoading } = useDeleteFund();

	const [isEditing, setIsEditing] = useState(isAddingFund);
	const [date, setDate] = useState(dayjs(fund.date));
	const [source, setSource] = useState(fund.source);
	const [amount, setAmount] = useState(fund.amount);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

	const resetFields = () => {
		setDate(dayjs(fund.date));
		setSource(fund.source);
		setAmount(fund.amount);
	}

	return (
		<Fragment>
			<TableRow
				sx={{
					backgroundColor: index % 2 === 0 ? "background.default" : "primary.light",
					":hover": editable ? { backgroundColor: "action.hover" } : {}
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
						<Typography color="success" variant="body2">Fund</Typography>
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
								loading={deleteLoading}
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
								loading={createLoading || editLoading}
								disabled={!source.trim()}
								onClick={() => {
									if (fund.id !== -1) {
										editFund({
											id: fund.id,
											date: date.toDate(),
											source: source.trim(),
											amount,
										});
										setIsEditing(false);
									} else if (setIsAddingFund) {
										createFund({
											date: date.toDate(),
											source: source.trim(),
											amount,
											type: "manual"
										});
										setIsAddingFund(false);
									}
								}}>
								<Save />
							</IconButton>

							<IconButton size="small" onClick={() => {
								if (fund.id !== -1) {
									resetFields();
									setIsEditing(false)
								} else if (setIsAddingFund) {
									setIsAddingFund(false);
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
				itemName={`fund: ${fund.source}`}
				deleteFn={() => deleteFund({ id: fund.id })} />
		</Fragment>
	)
}
