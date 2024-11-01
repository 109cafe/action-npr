import type { ReadableWritablePair } from "node:stream/web";
import { Pack, ReadEntry, Unpack } from "tar";
import { toReadableStream, toWriteableStream } from "./stream";
export type GetTransformer = (entry: ReadEntry) => ReadableWritablePair | undefined | null;

export type TarOptions = ConstructorParameters<typeof Pack>[0];

export function TarTransformStream(
  getTransformer?: GetTransformer,
  options?: { pack?: TarOptions; unpack?: TarOptions }
): ReadableWritablePair {
  const pack = new Pack(options?.pack);
  const extract = new Unpack({
    ...options?.unpack,
    onReadEntry(entry) {
      if (options?.unpack?.onReadEntry) {
        options.unpack.onReadEntry(entry);
      }
      try {
        const transformer = getTransformer?.(entry);
        if (transformer) {
          const readable = toReadableStream(entry).pipeThrough(transformer);

          const _entry = new ReadEntry(entry.header);
          pack.add(_entry);

          readable
            .pipeTo(toWriteableStream(_entry as unknown as NodeJS.WritableStream))
            .then(null, (e) => {
              r.writable.abort(e);
            });
        } else {
          pack.add(entry);
        }
      } catch (e) {
        r.writable.abort(e);
        throw e;
      }
    },
  });
  extract.once("finish", () => {
    pack.end();
  });

  const r = {
    readable: toReadableStream(pack),
    writable: toWriteableStream(extract),
  };
  return r;
}
