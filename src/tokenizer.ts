import { toString } from "./utils";

export const defaultSeperator = /[\s\-]+/;

let separator = defaultSeperator;

export function setSeparator(sep: RegExp) {
  separator = sep;
}

export function resetSeparator() {
  separator = defaultSeperator;
}

export function getSeparator() {
  return separator;
}

export function tokenize(str: any | any[]): string[] {
  if (str === undefined || str === null) {
    return [];
  }

  if (Array.isArray(str)) {
    return str
      .filter(token => token !== undefined && token !== null)
      .map(token => tokenizeSingle(toString(token)))
      .flat();
  } else {
    return tokenizeSingle(str);
  }
}

function tokenizeSingle(str: string): string[] {
  if (str === undefined || str === null) {
    return [];
  }
  return str
    .toString()
    .trim()
    .toLowerCase()
    .split(separator);
}
