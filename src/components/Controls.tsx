import { Box, Button, styled } from "@mui/material";

type ControlsProps = {
  onStart?: () => void;
  onStop?: () => void;
  onReset?: () => void;
};

const ControlsContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "15px",
});

export default function Controls(props: ControlsProps) {
  return (
    <ControlsContainer>
      <Button onClick={props.onStart}>Start</Button>
      <Button onClick={props.onStop}>Stop</Button>
      <Button onClick={props.onReset}>Reset</Button>
    </ControlsContainer>
  );
}
