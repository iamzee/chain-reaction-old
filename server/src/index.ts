import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { OnlineMultiplayerUser } from "./classes/OnlineMultiplayerUser";
import { OnlineMultiplayer } from "./classes/OnlineMultiplayer";
import { v4 as uuidv4 } from "uuid";
import { OnlineMultiplayerRoom } from "./classes/OnlineMultiplayerRoom";

const app = express();
app.use(cors());
app.use(express.static(path.resolve(__dirname, "..", "..", "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "..", "..", "client", "dist", "index.html")
  );
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const online_multiplayer = new OnlineMultiplayer();

io.on("connection", async (socket) => {
  socket.on("online_multiplayer_searching", (arg) => {
    const new_user = new OnlineMultiplayerUser(socket.id, arg.name, arg.color);

    console.log("new_user", new_user);

    // check if there is a room for this user
    for (let room of online_multiplayer.rooms) {
      if (room.users.length < 4) {
        // that means there is space for other users
        let can_enter_room = true;
        for (let user of room.users) {
          if (user.color === new_user.color) {
            can_enter_room = false;
            break;
          }
        }

        if (can_enter_room) {
          console.log("found a match in room");
          room.users.push(new_user);
          socket.join(room.id);
          io.to(room.id).emit("online_multiplayer_room_joined", room);
          return;
        }
      }
    }

    // no rooms found
    // check waiting room for a match
    for (let user of online_multiplayer.waiting_room.users) {
      if (user.color !== new_user.color) {
        console.log("found a match in waiting list");
        // we found a match - create a new room
        let new_room = new OnlineMultiplayerRoom(uuidv4(), [user, new_user]);
        // put this room in online_multiplayer
        online_multiplayer.rooms.push(new_room);
        // remove that user from waiting room
        online_multiplayer.waiting_room.users =
          online_multiplayer.waiting_room.users.filter((u) => u.id !== user.id);
        // join these two users to the room
        socket.join(new_room.id);
        io.sockets.sockets.get(user.id)?.join(new_room.id);
        // send signal to both users
        io.to(new_room.id).emit("online_multiplayer_room_joined", new_room);
        return;
      }
    }

    console.log("did not found match");
    // we did not find any match -> neither in room, not in waiting list
    online_multiplayer.waiting_room.users.push(new_user);
  });
});

io.of("/").adapter.on("join-room", (room, id) => {
  console.log(`socket ${id} has joined room ${room}`);
});

httpServer.listen(3000, () => {
  console.log("Listening on port 3000");
});
