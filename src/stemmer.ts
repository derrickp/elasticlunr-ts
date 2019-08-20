/* eslint-disable @typescript-eslint/camelcase */

const firstExceptions: Map<string, string> = new Map([
  /* special changes: */
  ["skis", "ski"],
  ["skies", "sky"],
  ["dying", "die"],
  ["lying", "lie"],
  ["tying", "tie"],

  /* special -LY cases */
  ["idly", "idl"],
  ["gently", "gentl"],
  ["ugly", "ugli"],
  ["early", "earli"],
  ["only", "onli"],
  ["singly", "singl"],

  /* invariant forms */
  ["sky", "sky"],
  ["news", "news"],
  ["howe", "howe"],
  /* not plural */
  ["atlas", "atlas"],
  ["cosmos", "cosmos"],
  ["bias", "bias"],
  ["andes", "andes"],
]);

const exceptionsPost1a: Set<string> = new Set([
  "inning",
  "outing",
  "canning",
  "herring",
  "earring",
  "proceed",
  "exceed",
  "succeed",
]);

const charCodes = {
  apostrophe: 39,
  upperCaseY: 89,
  lowerCaseA: 97,
  lowerCaseB: 98,
  lowerCaseD: 100,
  lowerCaseE: 101,
  lowerCaseF: 102,
  lowerCaseG: 103,
  lowerCaseI: 105,
  lowerCaseM: 109,
  lowerCaseN: 110,
  lowerCaseO: 111,
  lowerCaseP: 112,
  lowerCaseR: 114,
  lowerCaseS: 115,
  lowerCaseT: 116,
  lowerCaseU: 117,
  lowerCaseY: 121,
};

const capitalizeYTest = /([aeiouy])y/g;
const step1aVowelTest = /[aeiouy]./;

const rangesTest = /[^aeiouy]*[aeiouy]+[^aeiouy](\w*)/;

const step1bSuffixesTest = /(ed|edly|ing|ingly)$/;
const step1bTest = /[aeiouy]/;

function capitalizeY(word: string) {
  let innerWord = word.slice();

  if (innerWord.charCodeAt(0) === charCodes.lowerCaseY) {
    innerWord = "Y" + innerWord.slice(1);
  }

  return innerWord.replace(capitalizeYTest, "$1Y");
}

function removeLeadingApostrophe(word: string) {
  if (word.charCodeAt(0) === charCodes.apostrophe) {
    return word.slice(1);
  }

  return word.slice();
}

function removeTrailingApostrophes(word: string): string {
  if (word.charCodeAt(word.length - 1) === charCodes.apostrophe) {
    if (word.endsWith("'s'")) {
      return word.slice(0, -3);
    } else {
      return word.slice(0, -1);
    }
  } else if (word.endsWith("'s")) {
    return word.slice(0, -2);
  }

  return word.slice();
}

function handleSsesSuffixes(word: string): string {
  if (word.endsWith("sses")) {
    return word.slice(0, -4) + "ss";
  } else if (word.endsWith("ied") || word.endsWith("ies")) {
    return word.slice(0, -3) + (word.length > 4 ? "i" : "ie");
  } else if (word.endsWith("us") || word.endsWith("ss")) {
    return word.slice();
  } else if (word.charCodeAt(word.length - 1) === charCodes.lowerCaseS) {
    const preceding = word.slice(0, -1);
    if (step1aVowelTest.test(preceding)) {
      return preceding;
    }
  }

  return word.slice();
}

const endsWithSyllableTest1 = /^[aeiouy][^aeiouy]$/;
const endsWithSyllableTest2 = /.*[^aeiouy][aeiouy][^aeiouywxY]$/;
function endsWithShortSyllable(word: string): boolean {
  if (word.length === 2) {
    return endsWithSyllableTest1.test(word);
  }
  return endsWithSyllableTest2.test(word);
}

function isDoubleEnding(word: string): boolean {
  const endingConsonants = [
    charCodes.lowerCaseB,
    charCodes.lowerCaseD,
    charCodes.lowerCaseF,
    charCodes.lowerCaseG,
    charCodes.lowerCaseM,
    charCodes.lowerCaseN,
    charCodes.lowerCaseP,
    charCodes.lowerCaseR,
    charCodes.lowerCaseT,
  ];
  const lastLetter = word.charCodeAt(word.length - 1);
  const isDoubleEndingLetter = endingConsonants.some(l => l === lastLetter);
  return (
    lastLetter === word.charCodeAt(word.length - 2) && isDoubleEndingLetter
  );
}

function suffixHelper(word: string, r1: number): string {
  if (word.endsWith("at") || word.endsWith("bl") || word.endsWith("iz")) {
    return word + "e";
  }
  if (isDoubleEnding(word)) {
    return word.slice(0, -1);
  }
  // is short word
  if (r1 === word.length && endsWithShortSyllable(word)) {
    return word + "e";
  }
  return word;
}

function handleEdlySuffixes(word: string, r1: number): string {
  if (word.endsWith("eedly")) {
    if (word.length - 5 >= r1) {
      return word.slice(0, -3);
    }
    return word;
  }
  if (word.endsWith("eed")) {
    if (word.length - 3 >= r1) {
      return word.slice(0, -1);
    }
    return word;
  }
  const match = step1bSuffixesTest.exec(word);
  if (match) {
    const preceding = word.slice(0, -match[0].length);
    if (word.length > 1 && step1bTest.test(preceding)) {
      return suffixHelper(preceding, r1);
    }
  }

  return word;
}

function isNonVowel(charCode: number): boolean {
  const vowels = [
    charCodes.lowerCaseA,
    charCodes.lowerCaseE,
    charCodes.lowerCaseI,
    charCodes.lowerCaseO,
    charCodes.lowerCaseU,
    charCodes.lowerCaseY,
  ];
  return (
    charCode < charCodes.lowerCaseA ||
    charCode > charCodes.lowerCaseY ||
    !vowels.some(v => v === charCode)
  );
}

function handleYSuffix(word: string): string {
  if (word.length > 2) {
    let lastLetter = word.charCodeAt(word.length - 1);
    if (
      lastLetter === charCodes.lowerCaseY ||
      lastLetter === charCodes.upperCaseY
    ) {
      let secondLastLetter = word.charCodeAt(word.length - 2);
      // "a|e|i|o|u|y"
      if (isNonVowel(secondLastLetter)) {
        return word.slice(0, -1) + "i";
      }
    }
  }

  return word.slice();
}

function step2Helper(
  word: string,
  r1: number,
  end: string,
  repl: string,
  prev: string[] | null,
): string | null {
  if (word.endsWith(end)) {
    if (word.length - end.length >= r1) {
      const w = word.slice(0, -end.length);
      if (prev === null) {
        return w + repl;
      }
      for (let i = 0; i < prev.length; i++) {
        const p = prev[i];
        if (w.endsWith(p)) {
          return w + repl;
        }
      }
    }
    return word;
  }
  return null;
}

const S2_TRIPLES: Array<[string, string, Array<string> | null]> = [
  ["enci", "ence", null],
  ["anci", "ance", null],
  ["abli", "able", null],
  ["izer", "ize", null],
  ["ator", "ate", null],
  ["alli", "al", null],
  ["bli", "ble", null],
  ["ogi", "og", ["l"]],
  ["li", "", ["c", "d", "e", "g", "h", "k", "m", "n", "r", "t"]],
];

const S2_TRIPLES5 = ([
  ["ization", "ize", null],
  ["ational", "ate", null],
  ["fulness", "ful", null],
  ["ousness", "ous", null],
  ["iveness", "ive", null],
  ["tional", "tion", null],
  ["biliti", "ble", null],
  ["lessli", "less", null],
  ["entli", "ent", null],
  ["ation", "ate", null],
  ["alism", "al", null],
  ["aliti", "al", null],
  ["ousli", "ous", null],
  ["iviti", "ive", null],
  ["fulli", "ful", null],
] as Array<[string, string, Array<string> | null]>).concat(S2_TRIPLES);

function replaceStep2Suffixes(word: string, r1: number): string {
  const triples = word.length > 6 ? S2_TRIPLES5 : S2_TRIPLES;

  for (let i = 0; i < triples.length; i++) {
    const trip = triples[i];
    const attempt = step2Helper(word, r1, trip[0], trip[1], trip[2]);
    if (attempt !== null) {
      return attempt;
    }
  }
  return word;
}

function step3Helper(
  word: string,
  r1: number,
  r2: number,
  end: string,
  repl: string,
  r2_necessary: boolean,
): string | null {
  if (word.endsWith(end)) {
    if (word.length - end.length >= r1) {
      if (!r2_necessary) {
        return word.slice(0, -end.length) + repl;
      } else if (word.length - end.length >= r2) {
        return word.slice(0, -end.length) + repl;
      }
    }
    return word;
  }
  return null;
}

const S3_TRIPLES: Array<{ a: string; b: string; c: boolean }> = [
  { a: "ational", b: "ate", c: false },
  { a: "tional", b: "tion", c: false },
  { a: "alize", b: "al", c: false },
  { a: "icate", b: "ic", c: false },
  { a: "iciti", b: "ic", c: false },
  { a: "ative", b: "", c: true },
  { a: "ical", b: "ic", c: false },
  { a: "ness", b: "", c: false },
  { a: "ful", b: "", c: false },
];

function step3(word: string, r1: number, r2: number): string {
  for (let i = 0; i < S3_TRIPLES.length; i++) {
    const trip = S3_TRIPLES[i];
    const attempt = step3Helper(word, r1, r2, trip.a, trip.b, trip.c);
    if (attempt !== null) {
      return attempt;
    }
  }
  return word;
}

const S4_DELETE_LIST = [
  "al",
  "ance",
  "ence",
  "er",
  "ic",
  "able",
  "ible",
  "ant",
  "ement",
  "ment",
  "ent",
  "ism",
  "ate",
  "iti",
  "ous",
  "ive",
  "ize",
];

function step4(word: string, r2: number): string {
  for (let i = 0; i < S4_DELETE_LIST.length; i++) {
    const end = S4_DELETE_LIST[i];
    if (word.endsWith(end)) {
      if (word.length - end.length >= r2) {
        return word.slice(0, -end.length);
      }
      return word;
    }
  }

  if (word.length - 3 >= r2) {
    const l = word.charCodeAt(word.length - 4);
    if ((l === 115 || l === 116) && word.endsWith("ion")) {
      // s === 115 , t === 116
      return word.slice(0, -3);
    }
  }

  return word;
}

const NORMALIZE_YS_RE = /Y/g;

/**
 * An implementation of the porter2 (snowball stemming algorithm)
 * @param word string The word to stem
 */
export function stem(toStem: string): string {
  if (toStem.length < 3) {
    return toStem;
  }

  let word = removeLeadingApostrophe(toStem);

  if (firstExceptions.has(word)) {
    return firstExceptions.get(word) as string;
  }

  // capitalize Ys
  word = capitalizeY(word);

  let r1: number;
  let match: RegExpExecArray | null;

  if (
    word.length > 4 &&
    (word.startsWith("gener") || word.startsWith("arsen"))
  ) {
    r1 = 5;
  } else if (word.startsWith("commun")) {
    r1 = 6;
  } else {
    match = rangesTest.exec(word);
    r1 = match ? word.length - match[1].length : word.length;
  }

  match = rangesTest.exec(word.slice(r1));
  const r2 = match ? word.length - match[1].length : word.length;

  // step 0
  word = removeTrailingApostrophes(word);
  // step 1a
  word = handleSsesSuffixes(word);

  if (exceptionsPost1a.has(word)) {
    return word;
  }

  // step 1b
  word = handleEdlySuffixes(word, r1);

  // step 1c
  word = handleYSuffix(word);

  word = replaceStep2Suffixes(word, r1);
  word = step3(word, r1, r2);
  word = step4(word, r2);

  // step 5
  let l = word.charCodeAt(word.length - 1);

  if (l === 108) {
    // l = 108
    if (word.length - 1 >= r2 && word.charCodeAt(word.length - 2) === 108) {
      // l === 108
      word = word.slice(0, -1);
    }
  } else if (l === 101) {
    // e = 101
    if (word.length - 1 >= r2) {
      word = word.slice(0, -1);
    } else if (
      word.length - 1 >= r1 &&
      !endsWithShortSyllable(word.slice(0, -1))
    ) {
      word = word.slice(0, -1);
    }
  }

  // normalize Ys
  word = word.replace(NORMALIZE_YS_RE, "y");

  return word;
}

/* eslint-enable @typescript-eslint/camelcase */
