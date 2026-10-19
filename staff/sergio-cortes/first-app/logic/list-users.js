import { listUsers as listUsersFromDb } from "../queries/user-list.js";
import { toUserDto } from "./user-dto.js";

export function listUsers() {
  return listUsersFromDb().map(toUserDto);
}
