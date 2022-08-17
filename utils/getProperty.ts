function getProperty<T, K extends keyof T>(obj: T, key: K[]) {
  // getProperty
  return `{ 
    ${key.join("\n")}
  }`;
}

export default getProperty;
