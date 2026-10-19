function isUniqueEmailConflict(error) {
  if (error?.code === "SQLITE_CONSTRAINT_UNIQUE") {
    return true;
  }

  const message = error?.message ?? "";
  return (
    message.includes("UNIQUE constraint failed") && message.includes("email")
  );
}

export function rethrowUniqueEmailConflict(run) {
  try {
    return run();
  } catch (error) {
    if (isUniqueEmailConflict(error)) {
      const conflict = new Error("Unique email constraint violated");
      conflict.code = "SQLITE_UNIQUE_EMAIL";
      throw conflict;
    }

    throw error;
  }
}
