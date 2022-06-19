import * as database from "../service/database-mysql";
import logger from "../service/logger.service";

export interface User {
  id?: number,
  name: string,
  email: string,
  password: string
}

export async function getUser(email: string): Promise<User> {
  const userFromDatabase = (await database.execute("SELECT * FROM v_USER where USE_EMAIL = ?", [email]))[0];

  const user: User = {
    id: userFromDatabase.USE_ID,
    name: userFromDatabase.USE_NAME,
    email: userFromDatabase.USE_EMAIL,
    password: userFromDatabase.USE_PASSWORD,
  };

  return user;
}

export async function addUser(user: User): Promise<boolean> {
  try {
    await database.execute("CALL sp_poidsAffaire_add(?,?,?);",
      [
        user.name,
        user.email,
        user.password,
      ]);
    return true;
  } catch (error) {
    logger.error("Error creating user", {databaseAction: "ADD", error: error});
    return false;
  }
}

export async function updateUser(user: User): Promise<boolean> {
  try {
    await database.execute("CALL sp_poidsAffaire_update(?,?,?,?);",
      [
        user.id,
        user.name,
        user.email,
        user.password,
      ]);
    return true;
  } catch (error) {
    logger.error("Error update user", {databaseAction: "UPDATE", error: error});
    return false;
  }
}

export async function deleteUser(idUser: number): Promise<boolean> {
  try {
    await database.execute("CALL sp_poidsAffaire_delete(?);", [idUser]);
    return true;
  } catch (error) {
    logger.error("Error deleting user", {databaseAction: "DELETE", error: error});
    return false;
  }
}
