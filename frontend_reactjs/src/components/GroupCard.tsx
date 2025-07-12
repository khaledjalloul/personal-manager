import { Box, Typography } from "@mui/material";
import { Group } from "../types";
import { AccessTime, Person, Place } from "@mui/icons-material";
import styled from "styled-components";
import { Dispatch, SetStateAction } from "react";

export const GroupCard = ({
  userId,
  group,
  setModalItem,
}: {
  userId?: number;
  group: Group;
  setModalItem: Dispatch<SetStateAction<Group | undefined>>;
}) => {
  return (
    <Wrapper onClick={() => setModalItem(group)} flexGrow={1}>
      <Column flexGrow={1}>
        <Row style={{ gap: "4px" }}>
          <Typography>{group.name}</Typography>
          <Typography variant="caption">({group.subject})</Typography>
        </Row>
        <Typography variant="caption" mt={-1}>
          Created by: {group.admin.name.split(" ")[0]}{" "}
          {group.admin.id === userId && "(You)"}
        </Typography>
        <Typography variant="body2">
          {group.notes?.substring(0, 120)}
          {group.notes && group.notes.length > 120 && "..."}
        </Typography>
      </Column>
      <Column alignItems={"flex-end"}>
        <Row>
          <Typography variant="caption" noWrap>
            {group.joinsGroups.length} / {group.maxUsers ?? "Any"}
          </Typography>
          <Person fontSize="small" />
        </Row>
        <Row>
          <Typography variant="caption" noWrap>
            {group.location}
          </Typography>
          <Place fontSize="small" />
        </Row>
        <Row>
          <Typography variant="caption" noWrap>
            {group.time.toDateString()}
          </Typography>
          <AccessTime fontSize="small" />
        </Row>
      </Column>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  padding: 24px;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  display: flex;
  flex-direction: row;
  gap: 8px;
  border-radius: 8px;
  transition-duration: 0.1s;
  cursor: pointer;

  &:hover {
    transition-duration: 0.3s;
    background-color: ${({ theme }) => theme.palette.secondary.dark};
    transform: translateY(-4px) translateX(4px);
  }
`;

const Column = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;
