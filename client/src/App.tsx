import { io, Socket } from "socket.io-client";
import { useState, useEffect } from "react";
import { randUser } from "@ngneat/falso";

function get_random_color() {
  let colors = ["red", "green", "blue", "yellow"];
  let random_number = Math.floor(Math.random() * colors.length);
  return colors[random_number];
}

export function App() {
  const [socket, set_socket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    set_socket(socket);
    socket.on("online_multiplayer_room_joined", (arg) => {
      console.log("Someone joied the room", arg);
    });
    return () => {
      socket.close();
    };
  }, []);

  function handle_start_searching() {
    if (socket) {
      const random_user = {
        name: randUser().username,
        color: get_random_color(),
      };
      socket.emit("online_multiplayer_searching", random_user);
    }
  }

  return (
    <div>
      {socket ? (
        <div>
          <h1>Chain reaction</h1>
          <button onClick={handle_start_searching}>Online Multiplayer</button>
        </div>
      ) : null}
    </div>
  );
}
