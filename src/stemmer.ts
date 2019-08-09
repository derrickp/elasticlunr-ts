/* eslint-disable @typescript-eslint/camelcase */

const step2list: { [key: string]: string } = {
  ational: "ate",
  tional: "tion",
  enci: "ence",
  anci: "ance",
  izer: "ize",
  bli: "ble",
  alli: "al",
  entli: "ent",
  eli: "e",
  ousli: "ous",
  ization: "ize",
  ation: "ate",
  ator: "ate",
  alism: "al",
  iveness: "ive",
  fulness: "ful",
  ousness: "ous",
  aliti: "al",
  iviti: "ive",
  biliti: "ble",
  logi: "log"
};

const step3list: { [key: string]: string } = {
  icate: "ic",
  ative: "",
  alize: "al",
  iciti: "ic",
  ical: "ic",
  ful: "",
  ness: ""
};
const c = "[^aeiou]"; // consonant
const v = "[aeiouy]"; // vowel
const C = c + "[^aeiouy]*"; // consonant sequence
const V = v + "[aeiou]*"; // vowel sequence
const mgr0 = "^(" + C + ")?" + V + C; // [C]VC... is m>0
const meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$"; // [C]VC[V] is m=1
const mgr1 = "^(" + C + ")?" + V + C + V + C; // [C]VCVC... is m>1
const s_v = "^(" + C + ")?" + v; // vowel in stem

const re_mgr0 = new RegExp(mgr0);
const re_mgr1 = new RegExp(mgr1);
const re_meq1 = new RegExp(meq1);
const re_s_v = new RegExp(s_v);

const re_1a = /^(.+?)(ss|i)es$/;
const re2_1a = /^(.+?)([^s])s$/;
const re_1b = /^(.+?)eed$/;
const re2_1b = /^(.+?)(ed|ing)$/;
const re_1b_2 = /.$/;
const re2_1b_2 = /(at|bl|iz)$/;
const re3_1b_2 = new RegExp("([^aeiouylsz])\\1$");
const re4_1b_2 = new RegExp("^" + C + v + "[^aeiouwxy]$");

const re_1c = /^(.+?[^aeiou])y$/;
const re_2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;

const re_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;

const re_4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
const re2_4 = /^(.+?)(s|t)(ion)$/;

const re_5 = /^(.+?)e$/;
const re_5_1 = /ll$/;
const re3_5 = new RegExp("^" + C + v + "[^aeiouwxy]$");

/*!
 * elasticlunr.stemmer
 * Copyright (C) @YEAR Oliver Nightingale
 * Copyright (C) @YEAR Wei Song
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */
export function porterStem(word: string): string {
  let stem, suffix, firstch, re, re2, re3, re4;

  if (word.length < 3) {
    return word;
  }

  let output = word.slice();

  firstch = output.substr(0, 1);
  if (firstch == "y") {
    output = firstch.toUpperCase() + output.substr(1);
  }

  // Step 1a
  re = re_1a;
  re2 = re2_1a;

  if (re.test(output)) {
    output = output.replace(re, "$1$2");
  } else if (re2.test(output)) {
    output = output.replace(re2, "$1$2");
  }

  // Step 1b
  re = re_1b;
  re2 = re2_1b;
  if (re.test(output)) {
    const fp = re.exec(output) as RegExpExecArray;
    re = re_mgr0;
    if (re.test(fp[1])) {
      re = re_1b_2;
      output = output.replace(re, "");
    }
  } else if (re2.test(output)) {
    const fp = re2.exec(output) as RegExpExecArray;
    stem = fp[1];
    re2 = re_s_v;
    if (re2.test(stem)) {
      output = stem;
      re2 = re2_1b_2;
      re3 = re3_1b_2;
      re4 = re4_1b_2;
      if (re2.test(output)) {
        output = output + "e";
      } else if (re3.test(output)) {
        re = re_1b_2;
        output = output.replace(re, "");
      } else if (re4.test(output)) {
        output = output + "e";
      }
    }
  }

  // Step 1c - replace suffix y or Y by i if preceded by a non-vowel which is not the first letter of the word (so cry -> cri, by -> by, say -> say)
  re = re_1c;
  if (re.test(output)) {
    const fp = re.exec(output) as RegExpExecArray;
    stem = fp[1];
    output = stem + "i";
  }

  // Step 2
  re = re_2;
  if (re.test(output)) {
    const fp = re.exec(output) as RegExpExecArray;
    stem = fp[1];
    suffix = fp[2];
    re = re_mgr0;
    if (re.test(stem)) {
      output = stem + step2list[suffix];
    }
  }

  // Step 3
  re = re_3;
  if (re.test(output)) {
    const fp = re.exec(output) as RegExpExecArray;
    stem = fp[1];
    suffix = fp[2];
    re = re_mgr0;
    if (re.test(stem)) {
      output = stem + step3list[suffix];
    }
  }

  // Step 4
  re = re_4;
  re2 = re2_4;
  if (re.test(output)) {
    const fp = re.exec(output) as RegExpExecArray;
    stem = fp[1];
    re = re_mgr1;
    if (re.test(stem)) {
      output = stem;
    }
  } else if (re2.test(output)) {
    const fp = re2.exec(output) as RegExpExecArray;
    stem = fp[1] + fp[2];
    re2 = re_mgr1;
    if (re2.test(stem)) {
      output = stem;
    }
  }

  // Step 5
  re = re_5;
  if (re.test(output)) {
    const fp = re.exec(output) as RegExpExecArray;
    stem = fp[1];
    re = re_mgr1;
    re2 = re_meq1;
    re3 = re3_5;
    if (re.test(stem) || (re2.test(stem) && !re3.test(stem))) {
      output = stem;
    }
  }

  re = re_5_1;
  re2 = re_mgr1;
  if (re.test(output) && re2.test(output)) {
    re = re_1b_2;
    output = output.replace(re, "");
  }

  // and turn initial Y back to y

  if (firstch == "y") {
    output = firstch.toLowerCase() + output.substr(1);
  }

  return output;
}
/* eslint-enable @typescript-eslint/camelcase */
