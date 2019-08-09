import { toString } from "./utils";

export const defaultSeperator = /[\s-]+/;

let separator = defaultSeperator;

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

export function setSeparator(sep: RegExp): void {
  separator = sep;
}

export function resetSeparator(): void {
  separator = defaultSeperator;
}

export function getSeparator(): RegExp {
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
