import express from "express";
import * as mysql from "../service/database-mysql";
import * as sqlite from "../service/database-sqlite";

const appDatabase= express();
// eslint-disable-next-line new-cap
const router = express.Router();

router.get("/sqlite", async (req, res) => {
  // Modify, add or delete
  await sqlite.run("INSERT INTO ...");
  // Select
  const usersName = await sqlite.query("SELECT name FROM User");
  res.json(usersName);
});

router.get("/mysql", async (req, res) => {
  mysql.execute("INSERT INTO...");
  const usersName = await mysql.execute("SELECT name FROM ...");
  res.json(usersName);
});

appDatabase.use("/database", router);

export {appDatabase};
