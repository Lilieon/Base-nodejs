import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import * as database from "./database-sqlite";
import {randomBytes} from "crypto";
import * as cacheManager from "./cacheManager.service";
import logger from "./logger.service";

const accessTokenExpiration = process.env.NODE_ENV === "production" ? "10m" : "24h";
const refresfTokenExpiration = "24h";

export async function signUp(email: string, password: string, name: string): Promise<any> {
  const salt = randomBytes(32);
  const passwordHashed = await argon2.hash(password, {salt});

  await database.run("INSERT INTO User (name, email, password) VALUES ('" + name + "','" +
      email + "','" + passwordHashed + "');");

  const userExist = await database.query("Select count(*) from User Where name = '" +
    name + "' AND email = '" + email + "'");

  if (userExist === 0) {
    throw new Error("Problem during creation of user");
  }

  return {
    user: {
      email: email,
      name: name,
    },
  };
}

/**
   *
   * @param email User email
   * @param password user password
   * @returns {Promise<any>} Possible status:
   * - 0 : Connection success
   * - 1 : Email not found
   * - 2 : Incorrect password
   * - 3 : Problem during jwt generation : Signature undefined
   */
export async function login(email: string, password: string): Promise<any> {
  const userRecord = (await database.query("SELECT name,email,password FROM User WHERE email = '" + email + "'"))[0];

  if (!userRecord) {
    return {status: 1, token: null};
  } else {
    const correctPassword = await argon2.verify(userRecord.password, password);
    if (!correctPassword) {
      return {status: 2, token: null};
    }
  }

  let status = 0;
  let token = null;

  try {
    token = generateJWT(userRecord);
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
    status = 3;
  }

  return {
    status: status,
    token: token,
  };
}

function generateJWT(user: any) {
  const data = {
    name: user.name,
    email: user.email,
  };

  if (process.env.JWT_AccesTokenSecret === undefined) {
    throw new Error("The secret access token used to signed jwt isn't defined");
  } else if (process.env.JWT_RefreshTokenSecret === undefined) {
    throw new Error("The secret refresh token used to signed jwt isn't defined");
  }

  const accessToken = jwt.sign({data}, process.env.JWT_AccesTokenSecret, {expiresIn: accessTokenExpiration});
  const refreshToken = jwt.sign({data}, process.env.JWT_RefreshTokenSecret, {expiresIn: refresfTokenExpiration});

  cacheManager.addValueInList("refreshToken", refreshToken);

  return {
    access: accessToken,
    refresh: refreshToken,
  };
}

export async function refreshToken(refreshToken: string): Promise<any> {
  if (!refreshToken) {
    return {status: 1, token: null};
  }

  if (!cacheManager.isMemberOfList("refreshToken", refreshToken)) {
    return {status: 2, token: null};
  }

  if (process.env.JWT_RefreshTokenSecret === undefined) {
    throw new Error("The secret refresh token used to signed jwt isn't defined");
  }

  let user;
  try {
    user = jwt.verify(refreshToken, process.env.JWT_RefreshTokenSecret);
  } catch (err) {
    return {status: 3, token: null};
  }

  console.log(user);

  const data = {
    name: "aa", // user.name,
    email: "bb", // user.email,
  };

  if (process.env.JWT_AccesTokenSecret === undefined) {
    throw new Error("The secret access token used to signed jwt isn't defined");
  }

  const accessToken = jwt.sign(data, process.env.JWT_AccesTokenSecret, {expiresIn: accessTokenExpiration});
  return {status: 0, token: accessToken};
}

export async function logout(accessToken: string, refreshToken: string) {
  await cacheManager.removeMemberOfList("refreshToken", refreshToken);
  await cacheManager.addValueInList("invalidateAccessToken", accessToken);
}

export const isAuthenticate = (req: any, res: any, next: any) => {
  if (process.env.JWT_AccesTokenSecret === undefined) {
    logger.error("Unable to authentified user, the signature used to signed jwt isn't defined",
      {function: "isAuthenticate", env_variable_name: "JWT_AccesTokenSecret"});
    return res.sendStatus(500);
  }

  const secretKey = process.env.JWT_AccesTokenSecret;
  const authHeader = req.headers.authorization;

  if (authHeader && req.headers.authorization.split(" ")[0] === "Bearer") {
    const token = authHeader.split(" ")[1];

    let userData;
    try {
      userData = jwt.verify(token, secretKey);
    } catch (err) {
      return res.sendStatus(403);
    }

    req.userData = userData;
    next();
  } else {
    res.sendStatus(401);
  }
};
