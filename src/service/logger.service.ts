/**
 * Methode de log des infos et erreurs de l'application
 *
 * @packageDocumentation
 */
import winston from "winston";
import "winston-daily-rotate-file";

/**
 * Si NODE_ENV === "production"
 *
 * Enregistrement des log dans deux fichiers:
 * - Erreur: Contient les erreurs du serveurs
 * - Info: Contient les erreurs et les infos du serveurs
 *
 * Si NODE_ENV !== "production"
 *
 * Affiche les log dans la console
 *
 * @remarks
 * Maximum 30 fichiers de 20mo par type de fichier
 *
 * @module Logger
 *
 */

const timezone = () => {
  return new Date().toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
  });
};

const format = winston.format.combine(
  winston.format.splat(),
  winston.format.metadata({fillExcept: ["timestamp", "service", "level", "message"]}),
  winston.format.timestamp({format: timezone}),
  winston.format.printf(({level, message, timestamp, metadata}) => {
    let log = "[" + level.toUpperCase() + "][" + timestamp + "]: " + message;
    if (metadata !== null && Object.keys(metadata).length > 0) {
      log += " [Metadata : " + JSON.stringify(metadata) + "]";
    }
    return log;
  }),
);

const logger = winston.createLogger();

if (process.env.NODE_ENV === "production") {
  logger
    .add(
      new winston.transports.DailyRotateFile({
        filename: "serveur-info-%DATE%.log",
        dirname: "./logs",
        level: "info",
        maxSize: "20m",
        maxFiles: 30,
        format: format,
      }),
    )
    .add(
      new winston.transports.DailyRotateFile({
        filename: "serveur-error-%DATE%.log",
        dirname: "./logs",
        level: "error",
        maxSize: "20m",
        maxFiles: 30,
        format: format,
      }),
    );
} else {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(format, winston.format.colorize({all: true})),
    }),
  );
}

export default logger;
