import { Typography } from "@mui/material";

type TotalProps = {
  total: number;
  afterComa: number;
};

export default function Total(props: TotalProps) {
  return (
    <Typography variant="h3">
      Total: <br />
      {props.total.toFixed(props.afterComa)} <br />
      BTC
    </Typography>
  );
}
