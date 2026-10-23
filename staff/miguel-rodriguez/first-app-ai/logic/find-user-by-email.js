import { findByEmail } from '../queries/users.js';

export function findUserByEmail(email) {
  email = email.trim().toLowerCase();
  const parts = email.split('@');
  if (email.length > 64 || parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error('Email is invalid');
  }

  let user;
  try {
    user = findByEmail(email);
  } catch {
    throw new Error('Could not find the user');
  }

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
