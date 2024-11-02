import { Header, ReadEntry } from "tar";

const Minipass = Object.getPrototypeOf(ReadEntry);

export class UnknownSizeReadEntry extends ReadEntry {
  constructor(...args: ConstructorParameters<typeof ReadEntry>) {
    const [header, ...rest] = args;
    console.log(123, { ...header });
    const h = new Header({
      ...header,
      type: header.type,
      size: undefined,
      cksum: undefined,
    });
    super(h, ...rest);
  }
  write(data: Buffer): boolean {
    console.log(data);
    this.size += data.byteLength;
    this.header.size = this.size;
    return Minipass.prototype.write.call(this, data);
  }
}
