export const defaultSeperator = /[\s-]+/;

let separator = defaultSeperator;
interface ToStringable {
  toString(): string;
}

type PossibleTokens =
  | string
  | number
  | Date
  | boolean
  | ToStringable
  | null
  | undefined;

function tokenizeSingle(str: PossibleTokens): string[] {
  if (str === undefined || str === null) {
    return [];
  }
  return str.toString().trim().toLowerCase().split(separator);
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

export function tokenize(str: PossibleTokens | PossibleTokens[]): string[] {
  if (str === undefined || str === null) {
    return [];
  }

  if (Array.isArray(str)) {
    return str
      .filter((token) => token !== undefined && token !== null)
      .map((token) => tokenizeSingle(token?.toString()))
      .flat();
  } else {
    return tokenizeSingle(str);
  }
}
