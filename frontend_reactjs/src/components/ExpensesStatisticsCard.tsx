import { Box, Typography } from "@mui/material";
import styled from "styled-components";

export const ExpensesStatisticsCard = ({
  title,
  value,
  color
}: {
  title: string,
  value: string,
  color: string
}) => {
  return (
    <Wrapper sx={{ backgroundColor: color }}>
      <Typography variant="h6" color="white">
        {title}
      </Typography>
      <Typography variant="h3" color="white">
        {value}
      </Typography>
    </Wrapper>
  )
};

const Wrapper = styled(Box)`
  border-radius: 8px;
  padding: 32px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`; 