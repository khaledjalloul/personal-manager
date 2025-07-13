import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useContext } from "react";
import styled from "styled-components";
import { AccessTime, Clear, Flag, Person, Place } from "@mui/icons-material";
import { UserContext } from "../../utils";

// export const GroupModal = ({
//   group,
//   setGroup,
// }: {
//   group: Group | undefined;
//   setGroup: Dispatch<SetStateAction<Group | undefined>>;
// }) => {
//   const { userData } = useContext(UserContext);

//   return (
//     <Modal open={Boolean(group)} onClose={() => setGroup(undefined)}>
//       <Wrapper>
//         <Column
//           flexGrow={1}
//           gap={2}
//           sx={{
//             width: {
//               xs: "80vw",
//               md: "70vw",
//               lg: "50vw",
//             },
//           }}
//         >
//           <Box
//             display={"flex"}
//             sx={{
//               gap: {
//                 xs: 2,
//                 md: 10,
//               },
//               flexDirection: {
//                 xs: "column",
//                 md: "row",
//               },
//               alignItems: {
//                 xs: "flex-start",
//                 md: "center",
//               },
//             }}
//           >
//             <Column gap={2}>
//               <Column>
//                 <Typography variant="caption">Group Name</Typography>
//                 <Typography>{group?.name}</Typography>
//               </Column>

//               <Column>
//                 <Typography variant="caption">Location</Typography>
//                 <Row gap={1}>
//                   <Place sx={{ fontSize: "16px" }} />
//                   <Typography noWrap>{group?.location}</Typography>
//                 </Row>
//               </Column>
//             </Column>

//             <Column gap={2}>
//               <Column>
//                 <Typography variant="caption">Admin</Typography>
//                 <Typography>
//                   {group?.admin.name}
//                   {group?.admin.id === userData?.userId && " (You)"}
//                 </Typography>
//               </Column>

//               <Column>
//                 <Typography variant="caption">Date and Time</Typography>
//                 <Row gap={1}>
//                   <AccessTime sx={{ fontSize: "16px" }} />
//                   <Typography noWrap>{group?.time.toDateString()}</Typography>
//                 </Row>
//               </Column>
//             </Column>

//             <Column
//               sx={{
//                 alignSelf: {
//                   xs: "flex-start",
//                   md: "flex-end",
//                 },
//               }}
//             >
//               <Typography variant="caption">Number of Users</Typography>
//               <Row gap={1}>
//                 <Person sx={{ fontSize: "16px" }} />
//                 <Typography noWrap>
//                   {group?.joinsGroups.length} / {group?.maxUsers ?? "Any"}
//                 </Typography>
//               </Row>
//             </Column>

//             <Box
//               sx={{
//                 position: "absolute",
//                 top: "16px",
//                 right: "16px",
//                 display: "flex",
//                 gap: "8px",
//               }}
//             >
//               <IconButton>
//                 <Flag color="error" />
//               </IconButton>
//               <IconButton onClick={() => setGroup(undefined)}>
//                 <Clear />
//               </IconButton>
//             </Box>
//           </Box>

//           <Column>
//             <Typography variant="caption">Subject</Typography>
//             <Typography>{group?.subject}</Typography>
//           </Column>

//           <Column>
//             <Typography variant="caption">Notes</Typography>
//             <Typography>{group?.notes}</Typography>
//           </Column>

//           <Button variant="contained">Join</Button>
//         </Column>
//       </Wrapper>
//     </Modal>
//   );
// };

const Wrapper = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-color: ${({ theme }) => theme.palette.background.default};
  padding: 24px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  outline: none;
`;

const Column = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const Row = styled(Box)`
  display: flex;
  align-items: center;
`;
