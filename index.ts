import "dotenv/config";
import {app} from "./src/app";
import logger from "./src/service/logger.service";

/**
 * Démarre le serveur Express.
 */
const server = app.listen(process.env.PORT, () => {
  logger.info("Serveur Web démarré sur le port %d en mode %s",
    process.env.PORT,
    process.env.NODE_ENV,
  );
});

export default server;
