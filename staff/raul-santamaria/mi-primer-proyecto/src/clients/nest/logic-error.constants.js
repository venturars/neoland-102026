export const NAME_IS_EMPTY = "Name is empty";
export const EMAIL_IS_INVALID = "Email is invalid";
export const EMAIL_IS_ALREADY_USED = "Email is already used";
export const USER_ID_IS_NOT_VALID = "User id is not valid";
export const NO_USER_EXISTS_WITH_THAT_ID = "No user exists with that id";
export const COULD_NOT_CREATE_THE_USER = "Could not create the user";
export const COULD_NOT_LIST_THE_USERS = "Could not list the users";
export const COULD_NOT_FIND_THE_USER = "Could not find the user";
export const COULD_NOT_UPDATE_THE_USER = "Could not update the user";
export const COULD_NOT_DELETE_THE_USER = "Could not delete the user";

export const MESSAGE_STATUS = {
  [NAME_IS_EMPTY]: 400,
  [EMAIL_IS_INVALID]: 400,
  [USER_ID_IS_NOT_VALID]: 400,
  [EMAIL_IS_ALREADY_USED]: 409,
  [NO_USER_EXISTS_WITH_THAT_ID]: 404,
  [COULD_NOT_CREATE_THE_USER]: 500,
  [COULD_NOT_LIST_THE_USERS]: 500,
  [COULD_NOT_FIND_THE_USER]: 500,
  [COULD_NOT_UPDATE_THE_USER]: 500,
  [COULD_NOT_DELETE_THE_USER]: 500,
};

export const FALLBACK_BY_HANDLER = {
  create: COULD_NOT_CREATE_THE_USER,
  findAll: COULD_NOT_LIST_THE_USERS,
  findOne: COULD_NOT_FIND_THE_USER,
  update: COULD_NOT_UPDATE_THE_USER,
  remove: COULD_NOT_DELETE_THE_USER,
};
