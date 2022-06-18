import sqlite3 from "sqlite3";
import logger from "./logger.service";

let db: sqlite3.Database;

async function connect() {
  return new Promise<void>((resolve, reject) => {
    db = new sqlite3.Database("./database/database.db", (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

async function close() {
  return new Promise<void>((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

export async function run(command: string): Promise<void> {
  try {
    await connect();
    await runCommand(command);
    await close();
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message, [err]);
    }
  }
}

async function runCommand(command: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    db.run(command, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

export async function query(command: string): Promise<any> {
  try {
    await connect();
    const rows = await queryCommand(command);
    await close();
    return rows;
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message, [err]);
    }
    return [];
  }
}

async function queryCommand(command: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    db.all(command, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}
