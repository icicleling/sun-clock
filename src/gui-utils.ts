class ColorGUIHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: { [k: string]: any } = {};
  prop = "";
  constructor(object: object, prop: string) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

export { ColorGUIHelper };
