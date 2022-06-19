import * as mariadb from "mysql2/promise";

let database: mariadb.Pool;

export async function initialize() {
  database = mariadb.createPool({
    host: process.env.MARIADB_HOST,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0,
    dateStrings: ["DATE"],
  });
}

export async function execute(sql: string, values?: any[] | { [param: string]: any }): Promise<any | any[]> {
  if (database !== undefined) {
    const result = await database.execute(sql, values);
    return result[0];
  }
}
