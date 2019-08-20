import * as fs from "fs";

export interface StemmingVocab {
  input: string;
  output: string;
}

/**
 * Files here retrieved from https://snowballstem.org/algorithms/english/stemmer.html
 */
export function getVocab(): StemmingVocab[] {
  const vocabFile = fs.readFileSync(`${__dirname}/vocab.txt`).toString();
  const outputFile = fs.readFileSync(`${__dirname}/output.txt`).toString();

  const vocabLines = vocabFile.split("\n");
  const outputLines = outputFile.split("\n");
  return vocabLines.map((v, index) => {
    const outputLine = outputLines[index];
    return {
      input: v.replace("\r", ""),
      output: outputLine.replace("\r", ""),
    };
  });
}
