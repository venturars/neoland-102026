// Keep only the current selection in memory. Reloading the page starts again
// at the list; saved changes live in SQLite, not in this object.
export const STATE = {
  selectedUser: null,
  isBusy: false,
};
