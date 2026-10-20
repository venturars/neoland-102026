export function findUserById(input) {
  const id = input.id;

  if (typeof id !== "number") {
    throw new Error("Id is invalid");
  }

  return {
    id,
  };
}
