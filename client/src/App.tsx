import { io } from "socket.io-client";
import { useEffect } from "react";

export function App() {
  useEffect(() => {
    const socket = io("http://localhost:3000");
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>Chain reaction</h1>
      <button>Start game</button>
    </div>
  );
}
