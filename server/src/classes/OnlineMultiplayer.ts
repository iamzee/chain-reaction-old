import { OnlineMultiplayerRoom } from "./OnlineMultiplayerRoom";

export class OnlineMultiplayer {
  rooms: OnlineMultiplayerRoom[];
  waiting_room: OnlineMultiplayerRoom;

  constructor(rooms: OnlineMultiplayerRoom[] = []) {
    this.rooms = rooms;
    this.waiting_room = new OnlineMultiplayerRoom(
      "online_multiplayer_waiting_room"
    );
  }
}
