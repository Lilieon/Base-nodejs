"use strict";

import cors from "cors";
import express from "express";
import {appUser} from "./route/user";
import {appDatabase} from "./route/database";

const app = express();


app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json({limit: "10mb"}));

app.use("/api", appUser);
app.use("/api", appDatabase);

export {app};
