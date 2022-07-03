const isProductionEnvironment = (): boolean => {
  return process.env.ENV === "prod";
};

export default isProductionEnvironment;
