export function trim(token: string) {
  if (token === undefined || token === null) {
    throw new Error("token should not be undefined");
  }

  return token.replace(/^\W+/, "").replace(/\W+$/, "");
}
