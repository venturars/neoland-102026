export const INSERT =
  "INSERT INTO users (name, email)\nVALUES (:name, :email)\nRETURNING *\n";
