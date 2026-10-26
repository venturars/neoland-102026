import { findByName } from '../queries/users.js';

export function findUserByName(name) {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error('Name is empty');
  }

  let users;
  try {
    users = findByName(trimmedName);
  } catch {
    throw new Error('Could not find the user');
  }

  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
}
