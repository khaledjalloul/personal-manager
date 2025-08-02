import { Box, Typography } from "@mui/material";
import styled from "styled-components";

export const ExpensesStatisticsCard = ({
  title,
  value,
  color
}: {
  title: string,
  value?: number,
  color: string
}) => {
  return (
    <Wrapper sx={{ backgroundColor: color }}>
      <Typography variant="h6" color="white">
        {title}
      </Typography>
      <Typography variant="h3" color="white" sx={{ fontSize: { xs: 40, sm: 48 } }}>
        {value?.toFixed(2) || "0.00"} CHF
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