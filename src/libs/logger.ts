import pino from "pino";

const prod = process.env.NODE_ENV === "production";
const baseOptions = {
  name: "",
  level: process.env.LOG_LEVEL ?? "info",
  redact: [],
};

const devOptions = {
  ...baseOptions,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
};

const pinoConfig = prod ? baseOptions : devOptions;

export { pinoConfig };

const pinoLogger = pino(pinoConfig);

export default pinoLogger;
