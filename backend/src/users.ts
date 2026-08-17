import type { User } from "./types.js";

export const USERS: Record<string, User> = {
  anna: { id: "anna", name: "Anna Requester", role: "requester" },
  max: { id: "max", name: "Max Approver", role: "approver" },
};

export function getUserById(id: string): User | undefined {
  return USERS[id];
}
