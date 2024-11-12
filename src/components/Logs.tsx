import { Box, styled, Typography } from "@mui/material";
import { ForwardedRef, forwardRef } from "react";

type LogsProps = {
  entries: string[];
};

const LogsContainer = styled(Box)({
  maxHeight: "500px",
  overflowY: "auto",
});

export const Logs = forwardRef(
  (props: LogsProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4">Transactions:</Typography>

        <LogsContainer ref={ref}>
          {props.entries.map((entry) => (
            <Typography sx={{ whiteSpace: "nowrap" }} key={entry}>
              {entry}
            </Typography>
          ))}
        </LogsContainer>
      </Box>
    );
  }
);

export default Logs;
