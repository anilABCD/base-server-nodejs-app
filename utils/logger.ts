import isProductionEnvironment from "./isProductionEnvironment";

const logger = require("logger").createLogger(
  isProductionEnvironment()
    ? `${__dirname}/../logs/production.log`
    : `${__dirname}/../logs/development.log`
);

export default logger;
