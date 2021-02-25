export interface Root {
  [key: string]: any;
  docs: { [key: string]: DocInfo };
  /**
   * @asType integer
   */
  df: number;
}

export interface SerializedData {
  root: Root;
}

export interface DocInfo {
  tf: number;
}

export interface TokenInfo extends DocInfo {
  ref: string;
}

/**
 * elasticlunr.InvertedIndex is used for efficiently storing and
 * lookup of documents that contain a given token.
 */
export class InvertedIndex {
  private _root: Root = {
    docs: {},
    df: 0,
  };

  static load(serializedData: SerializedData): InvertedIndex {
    const index = new InvertedIndex();
    index._root = serializedData.root;
    return index;
  }

  get root(): Root {
    return this._root;
  }

  /**
   * Adds a {token: tokenInfo} pair to the inverted index.
   * If the token already exists, it updates the tokenInfo.
   *
   * tokenInfo format: { ref: 1, tf: 2}
   * tokenInfor should contains the document's ref and the tf(token frequency) of that token in
   * the document.
   *
   * By default this function starts at the root of the current inverted index, however
   * it can start at any node of the inverted index if required.
   *
   * @param {String} token
   * @param {Object} tokenInfo format: { ref: 1, tf: 2}
   * @param {Object} root An optional node at which to start looking for the
   * correct place to enter the doc, by default the root of this elasticlunr.InvertedIndex
   * is used.
   */
  addToken(token: string, tokenInfo: TokenInfo): void {
    let root = this._root;
    let index = 0;

    while (index <= token.length - 1) {
      const key = token[index];

      if (!Object.keys(root).includes(key)) {
        root[key] = { docs: {}, df: 0 };
      }
      index += 1;
      root = root[key];
    }

    const docRef = tokenInfo.ref;
    if (!root.docs[docRef]) {
      // if this doc does not exist, then add this doc
      root.docs[docRef] = { tf: tokenInfo.tf };
      root.df += 1;
    } else {
      // if this doc already exists, then update tokenInfo
      root.docs[docRef] = { tf: tokenInfo.tf };
    }
  }

  /**
   * Checks whether a token is in this elasticlunr.InvertedIndex.
   *
   * @param {String} token The token to be checked
   * @return {Boolean}
   */
  hasToken(token: string): boolean {
    if (!token) return false;

    let node = this._root;

    for (const char of token) {
      if (!node[char]) {
        return false;
      }
      node = node[char];
    }

    return true;
  }

  /**
   * Retrieve a node from the inverted index for a given token.
   * If token not found in this InvertedIndex, return null.
   *
   * @param {String} token The token to get the node for.
   * @return {any}
   */
  getNode(token: string): any {
    if (!token) return;

    let node = this._root;

    for (const char of token) {
      if (!node[char]) {
        return;
      }
      node = node[char];
    }

    return node;
  }

  /**
   * Retrieve the documents of a given token.
   * If token not found, return {}.
   *
   * @param {String} token The token to get the documents for.
   * @return {any}
   */
  getDocs(token: string): any {
    const node = this.getNode(token);
    if (!node) {
      return {};
    }

    return node.docs;
  }

  /**
   * Retrieve term frequency of given token in given docRef.
   * If token or docRef not found, return 0.
   *
   * @param {String} token The token to get the documents for.
   * @param {String} docRef
   * @return {Integer}
   */
  getTermFrequency(token: string, docRef: string): number {
    const node = this.getNode(token);

    if (!node) {
      return 0;
    }

    if (!Object.keys(node.docs).includes(docRef)) {
      return 0;
    }

    return node.docs[docRef].tf;
  }

  /**
   * Retrieve the document frequency of given token.
   * If token not found, return 0.
   *
   *
   * @param {String} token The token to get the documents for.
   * @return {Object}
   */
  getDocFrequency(token: string): number {
    const node = this.getNode(token);

    if (!node) {
      return 0;
    }

    return node.df;
  }

  removeToken(token: string, ref: string): void {
    if (!token) {
      return;
    }

    const node = this.getNode(token);

    if (!node) {
      return;
    }

    if (Object.keys(node.docs).includes(ref)) {
      delete node.docs[ref];
      node.df -= 1;
    }
  }

  /**
   * Find all the possible suffixes of given token using tokens currently in the inverted index.
   * If token not found, return empty Array.
   *
   * @param {String} token The token to expand.
   * @return {Array<string>}
   */
  expandToken(token: string, memo?: string[], tokenRoot?: Root): string[] {
    if (!token) {
      return [];
    }

    const root = tokenRoot || this.getNode(token);
    if (!root) {
      return memo || [];
    }

    const _memo = memo || [];
    if (root.df > 0) {
      _memo.push(token);
    }

    for (const key of Object.keys(root)) {
      if (key === "docs") {
        continue;
      }
      if (key === "df") {
        continue;
      }
      this.expandToken(token + key, _memo, root[key]);
    }

    return _memo;
  }

  toJSON(): { root: Root } {
    return {
      root: this._root,
    };
  }
}
