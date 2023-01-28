import { OnlineMultiplayerUser } from "./OnlineMultiplayerUser";

export class OnlineMultiplayerRoom {
  id: string;
  users: OnlineMultiplayerUser[];

  constructor(id: string, users: OnlineMultiplayerUser[] = []) {
    this.id = id;
    this.users = users;
  }
}
