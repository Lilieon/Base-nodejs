import express from "express";
import * as authService from "../service/authentification.service";

const appUser = express();
// eslint-disable-next-line new-cap
const router = express.Router();

router.get("/test", authService.isAuthenticate, (req, res) => {
  res.status(200).json("OK");
});

router.post("/login", async (req, res) => {
  // Compte de test : email: "test" - password: "test"
  const {email, password} = req.body.user;
  const connectionInformation = await authService.login(email, password);
  if (connectionInformation.status == 0) {
    return res.status(200).json(connectionInformation);
  } else {
    return res.sendStatus(403);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const {name, email, password} = req.body.user;
    await authService.signUp(email, password, name);
    return res.status(200).end();
  } catch (err) {
    return res.status(500).end();
  }
});

// router.post("/refreshToken", async (req, res) => {
//   const refreshToken = req.body.refreshToken;
//   console.log(refreshToken);


//   const connectionInformation = await authService.refreshToken(refreshToken);
//   console.log(connectionInformation);


//   if (connectionInformation.status == 0) {
//     return res.status(200).json(connectionInformation);
//   } else if (connectionInformation.status == 1) {
//     return res.sendStatus(401);
//   } else {
//     return res.sendStatus(403);
//   }
// });

// router.post("/logout", (req, res) => {
//   const {token} = req.body;
//   refreshTokens = refreshTokens.filter((token) => t !== token);

//   res.send("Logout successful");
// });

appUser.use("/user", router);

export {appUser};
