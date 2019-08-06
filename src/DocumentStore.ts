export interface SerializedData {
  docInfo: any;
  save: boolean;
  docs: any;
  length: number;
}

export class DocumentStore {
  private _save: boolean = true;
  private _docs: { [key: string]: Object | null } = {};
  private _docInfo: any = {};
  private _length: number = 0;

  get isDocStored() {
    return this._save;
  }

  get length() {
    return this._length;
  }

  get docInfo() {
    return this._docInfo;
  }

  public static load(serializedData: SerializedData): DocumentStore {
    const store = new DocumentStore(serializedData.save);
    store._docInfo = serializedData.docInfo;
    store._docs = serializedData.docs;
    store._length = serializedData.length;
    return store;
  }

  constructor(save?: boolean) {
    if (save !== undefined) {
      this._save = save;
    }
  }

  /**
   * Stores the given doc in the document store against the given id.
   * If docRef already exist, then update doc.
   *
   * Document is store by original JSON format, then you could use original document to generate search snippets.
   *
   * @param {String} docRef The key used to store the JSON format doc.
   * @param {Object} doc The JSON format doc.
   */
  addDoc(docRef: string, doc: Object) {
    if (!this.hasDoc(docRef)) {
      this._length++;
    }

    if (this._save === true) {
      this._docs[docRef] = clone(doc);
    } else {
      this._docs[docRef] = null;
    }
  }

  getDoc(docRef: string): Object | null {
    if (!this.hasDoc(docRef)) {
      return null;
    }

    return this._docs[docRef];
  }

  hasDoc(docRef: string): boolean {
    return Object.keys(this._docs).includes(docRef);
  }

  removeDoc(docRef: string): void {
    if (!this.hasDoc(docRef)) {
      return;
    }

    delete this._docs[docRef];
    delete this._docInfo[docRef];
    this._length--;
  }

  /**
   * Add field length of a document's field tokens from pipeline results.
   * The field length of a document is used to do field length normalization even without the original JSON document stored.
   *
   * @param {String} docRef document's id or reference
   * @param {String} fieldName field name
   * @param {Integer} length field length
   */
  addFieldLength(docRef: string, fieldName: string, length: number) {
    if (!this._validateArg(docRef) || !this.hasDoc(docRef)) {
      return;
    }

    if (!this._docInfo[docRef]) {
      this._docInfo[docRef] = {};
    }

    this._docInfo[docRef][fieldName] = length;
  }

  /**
   * get field length of a document by docRef
   *
   * @param {String} docRef document id or reference
   * @param {String} fieldName field name
   * @return {Integer} field length
   */
  updateFieldLength(docRef: string, fieldName: string, length: number) {
    if (!this._validateArg(docRef) || !this.hasDoc(docRef)) {
      return;
    }

    this.addFieldLength(docRef, fieldName, length);
  }

  getFieldLength(docRef: string, fieldName: string) {
    if (!this._validateArg(docRef) || !this.hasDoc(docRef)) {
      return 0;
    }

    if (!Object.keys(this._docInfo[docRef]).includes(fieldName)) {
      return 0;
    }

    return this._docInfo[docRef][fieldName];
  }

  /**
   * Returns a JSON representation of the document store used for serialisation.
   *
   * @return {SerializedData} JSON format
   */
  toJSON(): SerializedData {
    return {
      docs: this._docs,
      docInfo: this._docInfo,
      length: this._length,
      save: this._save
    };
  }

  private _validateArg(arg: string) {
    if (arg === null || arg === undefined) {
      return false;
    }
    return true;
  }
}

function clone(obj: Object): Object {
  if (!obj || typeof obj !== "object") return obj;
  const target = {};
  Object.assign(target, obj);
  return target;
}