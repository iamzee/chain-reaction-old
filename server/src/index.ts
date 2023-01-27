import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path, { resolve } from "path";

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

io.on("connection", async (socket) => {
  console.log("User joined...");
  const sockets = await io.fetchSockets();
  console.log(sockets.length);
});

httpServer.listen(3000, () => {
  console.log("Listening on port 3000");
});
