export const defaultStopWords: { [key: string]: boolean } = {
  "": true,
  a: true,
  able: true,
  about: true,
  across: true,
  after: true,
  all: true,
  almost: true,
  also: true,
  am: true,
  among: true,
  an: true,
  and: true,
  any: true,
  are: true,
  as: true,
  at: true,
  be: true,
  because: true,
  been: true,
  but: true,
  by: true,
  can: true,
  cannot: true,
  could: true,
  dear: true,
  did: true,
  do: true,
  does: true,
  either: true,
  else: true,
  ever: true,
  every: true,
  for: true,
  from: true,
  get: true,
  got: true,
  had: true,
  has: true,
  have: true,
  he: true,
  her: true,
  hers: true,
  him: true,
  his: true,
  how: true,
  however: true,
  i: true,
  if: true,
  in: true,
  into: true,
  is: true,
  it: true,
  its: true,
  just: true,
  least: true,
  let: true,
  like: true,
  likely: true,
  may: true,
  me: true,
  might: true,
  most: true,
  must: true,
  my: true,
  neither: true,
  no: true,
  nor: true,
  not: true,
  of: true,
  off: true,
  often: true,
  on: true,
  only: true,
  or: true,
  other: true,
  our: true,
  own: true,
  rather: true,
  said: true,
  say: true,
  says: true,
  she: true,
  should: true,
  since: true,
  so: true,
  some: true,
  than: true,
  that: true,
  the: true,
  their: true,
  them: true,
  then: true,
  there: true,
  these: true,
  they: true,
  this: true,
  tis: true,
  to: true,
  too: true,
  twas: true,
  us: true,
  wants: true,
  was: true,
  we: true,
  were: true,
  what: true,
  when: true,
  where: true,
  which: true,
  while: true,
  who: true,
  whom: true,
  why: true,
  will: true,
  with: true,
  would: true,
  yet: true,
  you: true,
  your: true
};

let stopWords = defaultStopWords;

export function setStopWords(words: { [key: string]: boolean }) {
  stopWords = words;
}

export function resetStopWords() {
  stopWords = defaultStopWords;
}

export function getStopWords() {
  return stopWords;
}

export function clearStopWords() {
  stopWords = {};
}

export function addStopWords(words: string[]) {
  if (!words) {
    return;
  }

  for (const word of words) {
    stopWords[word] = true;
  }
}

export function stopWordFilter(token: string): string | undefined {
  if (token && stopWords[token] !== true) {
    return token;
  }
  return undefined;
}