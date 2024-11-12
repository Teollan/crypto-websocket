import { Box, styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import toBtc from "./util/toBtc";
import Controls from "./components/Controls";
import Total from "./components/Total";
import Logs from "./components/Logs";

const OuterContainer = styled(Box)({
  padding: "30px",
});

const TotalContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "50px",
  width: "300px",
});

const InnerContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  gap: "50px",
});

const WS_URL = "wss://ws.blockchain.info/inv";
const DECIMALS = 5;

function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isRecieving, setIsRecieving] = useState(false);

  const socket = useRef<WebSocket>(null!);
  const logsElement = useRef<HTMLDivElement>(null);

  const sendToSocket = (msg: { [key: string]: string }) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(msg));
    }
  };

  const connectToWebSocket = () => {
    if (!socket.current) {
      const newSocket = new WebSocket(WS_URL);

      newSocket.onopen = () => {
        sendToSocket({
          op: "unconfirmed_sub",
        });
      };

      newSocket.onclose = () => {
        sendToSocket({
          op: "unconfirmed_unsub",
        });
      };

      socket.current = newSocket;
    }
  };

  useEffect(() => {
    connectToWebSocket();
  }, []);

  useEffect(() => {
    if (socket.current) {
      if (isRecieving) {
        socket.current.onmessage = (event) => {
          const data = JSON.parse(event.data);

          const index = data.x.hash;
          const value = toBtc(data.x.out[0].value);

          pushLog(`${value.toFixed(DECIMALS)} BTC -- ${index}`);
          setTotal((prevTotal) => prevTotal + value);
        };
      } else {
        socket.current.onmessage = () => {};
      }
    }
  }, [isRecieving]);

  useEffect(() => {
    if (logsElement.current) {
      logsElement.current.scrollTo(0, logsElement.current.scrollHeight);
    }
  }, [logs]);

  const pushLog = (entry: string) => {
    setLogs((prevLogs) => [...prevLogs, entry]);
  };

  const startRecieving = () => {
    setIsRecieving(true);
    pushLog("Receiving...");
  };

  const pauseRecieving = () => {
    setIsRecieving(false);
    pushLog("Paused receiving.");
  };

  const clearLogs = () => {
    setLogs([]);
    setTotal(0);
  };

  return (
    <OuterContainer>
      <InnerContainer>
        <TotalContainer>
          <Total total={total} afterComa={DECIMALS} />

          <Controls
            onStart={startRecieving}
            onStop={pauseRecieving}
            onReset={clearLogs}
          />
        </TotalContainer>

        <Logs entries={logs} ref={logsElement} />
      </InnerContainer>
    </OuterContainer>
  );
}

export default App;
