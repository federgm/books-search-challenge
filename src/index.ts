import bootstrap from "./bootstrap";

assertEnvironmentVariables(process.env);

bootstrap().catch((e: Error) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

function assertEnvironmentVariables(env: NodeJS.Dict<string>): asserts env is NodeJS.ProcessEnv {
  const required = [
    "API_SERVER_HOST",
    "API_SERVER_PORT",
    "API_ROUTE_PREFIX",
    "DATABASE_HOST",
    "DATABASE_PORT",
    "DATABASE_NAME",
    "DATABASE_USERNAME",
    "DATABASE_PASSWORD",
  ];

  for (const name of required) {
    requiredEnvVar(env, name);
  }
}

function requiredEnvVar(env: NodeJS.Dict<string>, name: string) {
  if (env[name] === undefined) {
    throw Error(`The environment variable ${name} is required`);
  }
}
