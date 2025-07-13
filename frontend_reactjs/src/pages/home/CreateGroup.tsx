import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { Person, Place, AccessTime } from "@mui/icons-material";
import { useState } from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const maxUsersOptions = ["Any", 2, 3, 4, 5];

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

// export const CreateGroup = () => {
//   const { mutate: createGroup, isPending: createLoading } = useCreateGroup();

//   const [maxUsers, setMaxUsers] = useState(maxUsersOptions[0]);
//   const [time, setTime] = useState(tomorrow);

//   const handleSubmit = (event: any) => {
//     event.preventDefault();

//     const data = new FormData(event.currentTarget);
//     createGroup({
//       name: data.get("group-name") as string,
//       subject: data.get("subject") as string,
//       location: data.get("location") as string,
//       maxUsers: maxUsers === "Any" ? undefined : (maxUsers as number),
//       time,
//       notes: data.get("notes") as string,
//     });
//   };

//   return (
//     <Wrapper>
//       <Content
//         component={"form"}
//         onSubmit={handleSubmit}
//         sx={{
//           width: {
//             xs: "100%",
//             sm: "75%",
//             md: "66%",
//             lg: "50%",
//           },
//         }}
//       >
//         <Typography variant="h6" textAlign={"center"}>
//           Create a Group
//         </Typography>
//         <Typography variant="body2" textAlign={"center"}>
//           Fill out the following details to create a new group. You can specify
//           your preferences or leave it open for anyone to join.
//         </Typography>
//         <TextField
//           required
//           autoComplete="off"
//           name="group-name"
//           label="Group Name"
//           placeholder="Group 37"
//         />
//         <TextField
//           required
//           autoComplete="off"
//           name="subject"
//           label="Subject"
//           placeholder="Course Name / Department / Anyone Welcome"
//         />
//         <Row>
//           <TextField
//             required
//             autoComplete="off"
//             fullWidth
//             name="location"
//             label="Location"
//             placeholder="Building Name / Anywhere"
//           />
//           <StyledPlace />
//         </Row>
//         <Row>
//           <TextField
//             required
//             fullWidth
//             select
//             value={maxUsers}
//             label={"Maximum Users"}
//             onChange={(item) => setMaxUsers(item.target.value)}
//           >
//             {maxUsersOptions.map((option, index) => (
//               <MenuItem key={index} value={option}>
//                 {option}
//               </MenuItem>
//             ))}
//           </TextField>
//           <StyledPlace as={Person} />
//         </Row>

//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <Row>
//             <DateTimePicker
//               label="Date & Time"
//               value={dayjs(time)}
//               onChange={(newTime) => {
//                 if (newTime) setTime(newTime.toDate());
//               }}
//               slotProps={{
//                 textField: {
//                   required: true,
//                   fullWidth: true,
//                 },
//               }}
//             />
//             <StyledPlace as={AccessTime} />
//           </Row>
//         </LocalizationProvider>

//         <TextField
//           autoComplete="off"
//           name="notes"
//           label="Notes"
//           multiline
//           rows={6}
//         />

//         <Button
//           type="submit"
//           variant="contained"
//           disabled={createLoading}
//           startIcon={createLoading && <CircularProgress size={18} />}
//         >
//           Create
//         </Button>
//       </Content>
//     </Wrapper>
//   );
// };

const Wrapper = styled(Box)`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled(Box)`
  padding: 32px;
  padding-left: 60px;
  padding-right: 60px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Row = styled(Box)`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledPlace = styled(Place)`
  position: absolute;
  left: -40px;
  font-size: 26px;
`;
