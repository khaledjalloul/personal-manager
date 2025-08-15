import {
	IconButton,
	InputAdornment,
	TableCell,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { ExpenseType, Fund } from "../types";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { Clear, Delete, Edit, Save } from "@mui/icons-material";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCreateFund, useDeleteFund, useEditFund } from "../api";
import { ConfirmDeleteDialog } from "./modals";
import { useCtrlS } from "../utils";
import { SearchTextHighlight } from "./SearchTextHighlight";


export const FundTableRow = ({
	fund,
	index,
	editable = false, // Non-editable also means the component is used in the Details page, so it includes extra table cells
	searchText,
	isAddingFund,
	setIsAddingFund,
}: {
	fund: Fund;
	index: number;
	searchText: string;
	editable?: boolean;
	isAddingFund?: boolean;
	setIsAddingFund?: Dispatch<SetStateAction<boolean>>;
}) => {

	const [isEditing, setIsEditing] = useState(isAddingFund);
	const [date, setDate] = useState(dayjs(fund.date));
	const [source, setSource] = useState(fund.source);
	const [amount, setAmount] = useState(fund.amount);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

	const { mutate: createFund, isPending: createLoading, isSuccess: createSuccess } = useCreateFund();
	const { mutate: editFund, isPending: editLoading, isSuccess: editSuccess } = useEditFund();
	const { mutate: deleteFund, isPending: deleteLoading } = useDeleteFund();

	const save = () => {
		if (!isEditing || !source.trim()) return;
		if (!isAddingFund)
			editFund({
				id: fund.id,
				date: date.toDate(),
				source: source.trim(),
				amount,
			});
		else if (setIsAddingFund)
			createFund({
				date: date.toDate(),
				source: source.trim(),
				amount,
				type: ExpenseType.Manual
			});
	};

	useCtrlS(save);

	useEffect(() => {
		if (createSuccess && setIsAddingFund) setIsAddingFund(false);
	}, [createSuccess]);

	useEffect(() => {
		if (editSuccess) setIsEditing(false);
	}, [editSuccess]);

	return (
		<Fragment>
			<TableRow
				sx={{
					backgroundColor: index % 2 === 0 ? "background.default" : "primary.light",
					":hover": editable ? { backgroundColor: "action.hover" } : {}
				}}
				onDoubleClick={editable ? () => setIsEditing(true) : undefined}
			>
				<TableCell>
					{!isEditing ? date.format("DD.MM.YYYY") :
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								value={date}
								onChange={(newValue) => setDate(newValue ?? dayjs())}
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
						<Typography variant="body2">Funds</Typography>
					</TableCell>
				)}

				<TableCell width={"40%"}>
					{!isEditing ? <SearchTextHighlight text={source} searchText={searchText.trim()} /> :
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
					{!isEditing ?
						<Typography variant="body2" sx={{
							color: editable ? "text.primary" : (
								amount >= 0 ? "success.main" : "error.main"
							)
						}}>
							{!editable ?
								(amount >= 0 ? `+${Math.abs(amount).toFixed(2)}` : `-${Math.abs(amount).toFixed(2)}`) :
								amount.toFixed(2)
							}
						</Typography> :
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
						<TableCell>
							<IconButton size="small"
								onClick={() => setIsEditing(true)}
							>
								<Edit fontSize="small" />
							</IconButton>
						</TableCell>
					) : (
						<TableCell sx={{ display: 'flex', gap: 1 }}>
							<IconButton
								size="small"
								color="success"
								loading={createLoading || editLoading}
								disabled={!source.trim()}
								onClick={save}>
								<Save fontSize="small" />
							</IconButton>

							{!isAddingFund && (
								<IconButton
									size="small"
									color="error"
									loading={deleteLoading}
									onClick={() => setConfirmDeleteOpen(true)}
								>
									<Delete fontSize="small" />
								</IconButton>
							)}

							<IconButton size="small" onClick={() => {
								if (!isAddingFund) {
									setDate(dayjs(fund.date));
									setSource(fund.source);
									setAmount(fund.amount);
									setIsEditing(false)
								} else if (setIsAddingFund) {
									setIsAddingFund(false);
								}
							}}>
								<Clear fontSize="small" />
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
