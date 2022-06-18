import {createClient, RedisClientType} from "redis";
import logger from "./logger.service";

let client:RedisClientType;

export async function initialize() {
  client = createClient();
  try {
    await client.connect();
  } catch (err) {
    logger.error("Redis", err);
  }
}

export async function addValueInList(listName: string, value: any) {
  await client.lPush(listName, value);
}

export async function isMemberOfList(listName: string, value: any) {
  const listValues = await client.lRange(listName, 0, -1);
  return listValues.includes(value);
}

export async function removeMemberOfList(listName: string, value: any) {
  await client.lRem(listName, 0, value);
}
