/// <reference types="node" />
import { Buffer as Buffer$1 } from 'buffer';
import { EventEmitter } from 'node:events';
import { StringDecoder } from 'node:string_decoder';
import realZlib from 'zlib';
import { Stats as Stats$1 } from 'node:fs';
import { Stats } from 'fs';
import { EventEmitter as EventEmitter$1 } from 'events';

/**
 * Same as StringDecoder, but exposing the `lastNeed` flag on the type
 */
type SD = StringDecoder & {
    lastNeed: boolean;
};

declare const EOF: unique symbol;
declare const MAYBE_EMIT_END: unique symbol;
declare const EMITTED_END: unique symbol;
declare const EMITTING_END: unique symbol;
declare const EMITTED_ERROR: unique symbol;
declare const CLOSED: unique symbol;
declare const READ$1: unique symbol;
declare const FLUSH: unique symbol;
declare const FLUSHCHUNK: unique symbol;
declare const ENCODING: unique symbol;
declare const DECODER: unique symbol;
declare const FLOWING: unique symbol;
declare const PAUSED: unique symbol;
declare const RESUME: unique symbol;
declare const BUFFER$1: unique symbol;
declare const PIPES: unique symbol;
declare const BUFFERLENGTH: unique symbol;
declare const BUFFERPUSH: unique symbol;
declare const BUFFERSHIFT: unique symbol;
declare const OBJECTMODE: unique symbol;
declare const DESTROYED: unique symbol;
declare const ERROR: unique symbol;
declare const EMITDATA: unique symbol;
declare const EMITEND: unique symbol;
declare const EMITEND2: unique symbol;
declare const ASYNC: unique symbol;
declare const ABORT: unique symbol;
declare const ABORTED$1: unique symbol;
declare const SIGNAL: unique symbol;
declare const DATALISTENERS: unique symbol;
declare const DISCARDED: unique symbol;
/**
 * Options that may be passed to stream.pipe()
 */
interface PipeOptions {
    /**
     * end the destination stream when the source stream ends
     */
    end?: boolean;
    /**
     * proxy errors from the source stream to the destination stream
     */
    proxyErrors?: boolean;
}
/**
 * Internal class representing a pipe to a destination stream.
 *
 * @internal
 */
declare class Pipe<T extends unknown> {
    src: Minipass<T>;
    dest: Minipass<any, T>;
    opts: PipeOptions;
    ondrain: () => any;
    constructor(src: Minipass<T>, dest: Minipass.Writable, opts: PipeOptions);
    unpipe(): void;
    proxyErrors(_er: any): void;
    end(): void;
}
declare namespace Minipass {
    /**
     * Encoding used to create a stream that outputs strings rather than
     * Buffer objects.
     */
    export type Encoding = BufferEncoding | 'buffer' | null;
    /**
     * Any stream that Minipass can pipe into
     */
    export type Writable = Minipass<any, any, any> | NodeJS.WriteStream | (NodeJS.WriteStream & {
        fd: number;
    }) | (EventEmitter & {
        end(): any;
        write(chunk: any, ...args: any[]): any;
    });
    /**
     * Any stream that can be read from
     */
    export type Readable = Minipass<any, any, any> | NodeJS.ReadStream | (NodeJS.ReadStream & {
        fd: number;
    }) | (EventEmitter & {
        pause(): any;
        resume(): any;
        pipe(...destArgs: any[]): any;
    });
    /**
     * Utility type that can be iterated sync or async
     */
    export type DualIterable<T> = Iterable<T> & AsyncIterable<T>;
    type EventArguments = Record<string | symbol, unknown[]>;
    /**
     * The listing of events that a Minipass class can emit.
     * Extend this when extending the Minipass class, and pass as
     * the third template argument.  The key is the name of the event,
     * and the value is the argument list.
     *
     * Any undeclared events will still be allowed, but the handler will get
     * arguments as `unknown[]`.
     */
    export interface Events<RType extends any = Buffer> extends EventArguments {
        readable: [];
        data: [chunk: RType];
        error: [er: unknown];
        abort: [reason: unknown];
        drain: [];
        resume: [];
        end: [];
        finish: [];
        prefinish: [];
        close: [];
        [DESTROYED]: [er?: unknown];
        [ERROR]: [er: unknown];
    }
    /**
     * String or buffer-like data that can be joined and sliced
     */
    export type ContiguousData = Buffer | ArrayBufferLike | ArrayBufferView | string;
    export type BufferOrString = Buffer | string;
    /**
     * Options passed to the Minipass constructor.
     */
    export type SharedOptions = {
        /**
         * Defer all data emission and other events until the end of the
         * current tick, similar to Node core streams
         */
        async?: boolean;
        /**
         * A signal which will abort the stream
         */
        signal?: AbortSignal;
        /**
         * Output string encoding. Set to `null` or `'buffer'` (or omit) to
         * emit Buffer objects rather than strings.
         *
         * Conflicts with `objectMode`
         */
        encoding?: BufferEncoding | null | 'buffer';
        /**
         * Output data exactly as it was written, supporting non-buffer/string
         * data (such as arbitrary objects, falsey values, etc.)
         *
         * Conflicts with `encoding`
         */
        objectMode?: boolean;
    };
    /**
     * Options for a string encoded output
     */
    export type EncodingOptions = SharedOptions & {
        encoding: BufferEncoding;
        objectMode?: false;
    };
    /**
     * Options for contiguous data buffer output
     */
    export type BufferOptions = SharedOptions & {
        encoding?: null | 'buffer';
        objectMode?: false;
    };
    /**
     * Options for objectMode arbitrary output
     */
    export type ObjectModeOptions = SharedOptions & {
        objectMode: true;
        encoding?: null;
    };
    /**
     * Utility type to determine allowed options based on read type
     */
    export type Options<T> = ObjectModeOptions | (T extends string ? EncodingOptions : T extends Buffer ? BufferOptions : SharedOptions);
    export {  };
}
/**
 * Main export, the Minipass class
 *
 * `RType` is the type of data emitted, defaults to Buffer
 *
 * `WType` is the type of data to be written, if RType is buffer or string,
 * then any {@link Minipass.ContiguousData} is allowed.
 *
 * `Events` is the set of event handler signatures that this object
 * will emit, see {@link Minipass.Events}
 */
declare class Minipass<RType extends unknown = Buffer, WType extends unknown = RType extends Minipass.BufferOrString ? Minipass.ContiguousData : RType, Events extends Minipass.Events<RType> = Minipass.Events<RType>> extends EventEmitter implements Minipass.DualIterable<RType> {
    [FLOWING]: boolean;
    [PAUSED]: boolean;
    [PIPES]: Pipe<RType>[];
    [BUFFER$1]: RType[];
    [OBJECTMODE]: boolean;
    [ENCODING]: BufferEncoding | null;
    [ASYNC]: boolean;
    [DECODER]: SD | null;
    [EOF]: boolean;
    [EMITTED_END]: boolean;
    [EMITTING_END]: boolean;
    [CLOSED]: boolean;
    [EMITTED_ERROR]: unknown;
    [BUFFERLENGTH]: number;
    [DESTROYED]: boolean;
    [SIGNAL]?: AbortSignal;
    [ABORTED$1]: boolean;
    [DATALISTENERS]: number;
    [DISCARDED]: boolean;
    /**
     * true if the stream can be written
     */
    writable: boolean;
    /**
     * true if the stream can be read
     */
    readable: boolean;
    /**
     * If `RType` is Buffer, then options do not need to be provided.
     * Otherwise, an options object must be provided to specify either
     * {@link Minipass.SharedOptions.objectMode} or
     * {@link Minipass.SharedOptions.encoding}, as appropriate.
     */
    constructor(...args: [Minipass.ObjectModeOptions] | (RType extends Buffer ? [] | [Minipass.Options<RType>] : [Minipass.Options<RType>]));
    /**
     * The amount of data stored in the buffer waiting to be read.
     *
     * For Buffer strings, this will be the total byte length.
     * For string encoding streams, this will be the string character length,
     * according to JavaScript's `string.length` logic.
     * For objectMode streams, this is a count of the items waiting to be
     * emitted.
     */
    get bufferLength(): number;
    /**
     * The `BufferEncoding` currently in use, or `null`
     */
    get encoding(): BufferEncoding | null;
    /**
     * @deprecated - This is a read only property
     */
    set encoding(_enc: BufferEncoding | null);
    /**
     * @deprecated - Encoding may only be set at instantiation time
     */
    setEncoding(_enc: Minipass.Encoding): void;
    /**
     * True if this is an objectMode stream
     */
    get objectMode(): boolean;
    /**
     * @deprecated - This is a read-only property
     */
    set objectMode(_om: boolean);
    /**
     * true if this is an async stream
     */
    get ['async'](): boolean;
    /**
     * Set to true to make this stream async.
     *
     * Once set, it cannot be unset, as this would potentially cause incorrect
     * behavior.  Ie, a sync stream can be made async, but an async stream
     * cannot be safely made sync.
     */
    set ['async'](a: boolean);
    [ABORT](): void;
    /**
     * True if the stream has been aborted.
     */
    get aborted(): boolean;
    /**
     * No-op setter. Stream aborted status is set via the AbortSignal provided
     * in the constructor options.
     */
    set aborted(_: boolean);
    /**
     * Write data into the stream
     *
     * If the chunk written is a string, and encoding is not specified, then
     * `utf8` will be assumed. If the stream encoding matches the encoding of
     * a written string, and the state of the string decoder allows it, then
     * the string will be passed through to either the output or the internal
     * buffer without any processing. Otherwise, it will be turned into a
     * Buffer object for processing into the desired encoding.
     *
     * If provided, `cb` function is called immediately before return for
     * sync streams, or on next tick for async streams, because for this
     * base class, a chunk is considered "processed" once it is accepted
     * and either emitted or buffered. That is, the callback does not indicate
     * that the chunk has been eventually emitted, though of course child
     * classes can override this function to do whatever processing is required
     * and call `super.write(...)` only once processing is completed.
     */
    write(chunk: WType, cb?: () => void): boolean;
    write(chunk: WType, encoding?: Minipass.Encoding, cb?: () => void): boolean;
    /**
     * Low-level explicit read method.
     *
     * In objectMode, the argument is ignored, and one item is returned if
     * available.
     *
     * `n` is the number of bytes (or in the case of encoding streams,
     * characters) to consume. If `n` is not provided, then the entire buffer
     * is returned, or `null` is returned if no data is available.
     *
     * If `n` is greater that the amount of data in the internal buffer,
     * then `null` is returned.
     */
    read(n?: number | null): RType | null;
    [READ$1](n: number | null, chunk: RType): RType;
    /**
     * End the stream, optionally providing a final write.
     *
     * See {@link Minipass#write} for argument descriptions
     */
    end(cb?: () => void): this;
    end(chunk: WType, cb?: () => void): this;
    end(chunk: WType, encoding?: Minipass.Encoding, cb?: () => void): this;
    [RESUME](): void;
    /**
     * Resume the stream if it is currently in a paused state
     *
     * If called when there are no pipe destinations or `data` event listeners,
     * this will place the stream in a "discarded" state, where all data will
     * be thrown away. The discarded state is removed if a pipe destination or
     * data handler is added, if pause() is called, or if any synchronous or
     * asynchronous iteration is started.
     */
    resume(): void;
    /**
     * Pause the stream
     */
    pause(): void;
    /**
     * true if the stream has been forcibly destroyed
     */
    get destroyed(): boolean;
    /**
     * true if the stream is currently in a flowing state, meaning that
     * any writes will be immediately emitted.
     */
    get flowing(): boolean;
    /**
     * true if the stream is currently in a paused state
     */
    get paused(): boolean;
    [BUFFERPUSH](chunk: RType): void;
    [BUFFERSHIFT](): RType;
    [FLUSH](noDrain?: boolean): void;
    [FLUSHCHUNK](chunk: RType): boolean;
    /**
     * Pipe all data emitted by this stream into the destination provided.
     *
     * Triggers the flow of data.
     */
    pipe<W extends Minipass.Writable>(dest: W, opts?: PipeOptions): W;
    /**
     * Fully unhook a piped destination stream.
     *
     * If the destination stream was the only consumer of this stream (ie,
     * there are no other piped destinations or `'data'` event listeners)
     * then the flow of data will stop until there is another consumer or
     * {@link Minipass#resume} is explicitly called.
     */
    unpipe<W extends Minipass.Writable>(dest: W): void;
    /**
     * Alias for {@link Minipass#on}
     */
    addListener<Event extends keyof Events>(ev: Event, handler: (...args: Events[Event]) => any): this;
    /**
     * Mostly identical to `EventEmitter.on`, with the following
     * behavior differences to prevent data loss and unnecessary hangs:
     *
     * - Adding a 'data' event handler will trigger the flow of data
     *
     * - Adding a 'readable' event handler when there is data waiting to be read
     *   will cause 'readable' to be emitted immediately.
     *
     * - Adding an 'endish' event handler ('end', 'finish', etc.) which has
     *   already passed will cause the event to be emitted immediately and all
     *   handlers removed.
     *
     * - Adding an 'error' event handler after an error has been emitted will
     *   cause the event to be re-emitted immediately with the error previously
     *   raised.
     */
    on<Event extends keyof Events>(ev: Event, handler: (...args: Events[Event]) => any): this;
    /**
     * Alias for {@link Minipass#off}
     */
    removeListener<Event extends keyof Events>(ev: Event, handler: (...args: Events[Event]) => any): this;
    /**
     * Mostly identical to `EventEmitter.off`
     *
     * If a 'data' event handler is removed, and it was the last consumer
     * (ie, there are no pipe destinations or other 'data' event listeners),
     * then the flow of data will stop until there is another consumer or
     * {@link Minipass#resume} is explicitly called.
     */
    off<Event extends keyof Events>(ev: Event, handler: (...args: Events[Event]) => any): this;
    /**
     * Mostly identical to `EventEmitter.removeAllListeners`
     *
     * If all 'data' event handlers are removed, and they were the last consumer
     * (ie, there are no pipe destinations), then the flow of data will stop
     * until there is another consumer or {@link Minipass#resume} is explicitly
     * called.
     */
    removeAllListeners<Event extends keyof Events>(ev?: Event): this;
    /**
     * true if the 'end' event has been emitted
     */
    get emittedEnd(): boolean;
    [MAYBE_EMIT_END](): void;
    /**
     * Mostly identical to `EventEmitter.emit`, with the following
     * behavior differences to prevent data loss and unnecessary hangs:
     *
     * If the stream has been destroyed, and the event is something other
     * than 'close' or 'error', then `false` is returned and no handlers
     * are called.
     *
     * If the event is 'end', and has already been emitted, then the event
     * is ignored. If the stream is in a paused or non-flowing state, then
     * the event will be deferred until data flow resumes. If the stream is
     * async, then handlers will be called on the next tick rather than
     * immediately.
     *
     * If the event is 'close', and 'end' has not yet been emitted, then
     * the event will be deferred until after 'end' is emitted.
     *
     * If the event is 'error', and an AbortSignal was provided for the stream,
     * and there are no listeners, then the event is ignored, matching the
     * behavior of node core streams in the presense of an AbortSignal.
     *
     * If the event is 'finish' or 'prefinish', then all listeners will be
     * removed after emitting the event, to prevent double-firing.
     */
    emit<Event extends keyof Events>(ev: Event, ...args: Events[Event]): boolean;
    [EMITDATA](data: RType): boolean;
    [EMITEND](): boolean;
    [EMITEND2](): boolean;
    /**
     * Return a Promise that resolves to an array of all emitted data once
     * the stream ends.
     */
    collect(): Promise<RType[] & {
        dataLength: number;
    }>;
    /**
     * Return a Promise that resolves to the concatenation of all emitted data
     * once the stream ends.
     *
     * Not allowed on objectMode streams.
     */
    concat(): Promise<RType>;
    /**
     * Return a void Promise that resolves once the stream ends.
     */
    promise(): Promise<void>;
    /**
     * Asynchronous `for await of` iteration.
     *
     * This will continue emitting all chunks until the stream terminates.
     */
    [Symbol.asyncIterator](): AsyncGenerator<RType, void, void>;
    /**
     * Synchronous `for of` iteration.
     *
     * The iteration will terminate when the internal buffer runs out, even
     * if the stream has not yet terminated.
     */
    [Symbol.iterator](): Generator<RType, void, void>;
    /**
     * Destroy a stream, preventing it from being used for any further purpose.
     *
     * If the stream has a `close()` method, then it will be called on
     * destruction.
     *
     * After destruction, any attempt to write data, read data, or emit most
     * events will be ignored.
     *
     * If an error argument is provided, then it will be emitted in an
     * 'error' event.
     */
    destroy(er?: unknown): this;
    /**
     * Alias for {@link isStream}
     *
     * Former export location, maintained for backwards compatibility.
     *
     * @deprecated
     */
    static get isStream(): (s: any) => s is NodeJS.WriteStream | NodeJS.ReadStream | Minipass<any, any, any> | (NodeJS.ReadStream & {
        fd: number;
    }) | (EventEmitter & {
        pause(): any;
        resume(): any;
        pipe(...destArgs: any[]): any;
    }) | (NodeJS.WriteStream & {
        fd: number;
    }) | (EventEmitter & {
        end(): any;
        write(chunk: any, ...args: any[]): any;
    });
}

declare const _superWrite: unique symbol;
declare const _flushFlag: unique symbol;
type ChunkWithFlushFlag = Minipass.ContiguousData & {
    [_flushFlag]?: number;
};
type ZlibBaseOptions = Minipass.Options<Minipass.ContiguousData> & {
    flush?: number;
    finishFlush?: number;
    fullFlushFlag?: number;
};
type ZlibMode = 'Gzip' | 'Gunzip' | 'Deflate' | 'Inflate' | 'DeflateRaw' | 'InflateRaw' | 'Unzip';
type ZlibHandle = realZlib.Gzip | realZlib.Gunzip | realZlib.Deflate | realZlib.Inflate | realZlib.DeflateRaw | realZlib.InflateRaw;
type BrotliMode = 'BrotliCompress' | 'BrotliDecompress';
declare abstract class ZlibBase extends Minipass<Buffer$1, ChunkWithFlushFlag> {
    #private;
    get sawError(): boolean;
    get handle(): ZlibHandle | undefined;
    get flushFlag(): number;
    constructor(opts: ZlibBaseOptions, mode: ZlibMode | BrotliMode);
    close(): void;
    reset(): any;
    flush(flushFlag?: number): void;
    end(cb?: () => void): this;
    end(chunk: ChunkWithFlushFlag, cb?: () => void): this;
    end(chunk: ChunkWithFlushFlag, encoding?: Minipass.Encoding, cb?: () => void): this;
    get ended(): boolean;
    [_superWrite](data: Buffer$1 & {
        [_flushFlag]?: number;
    }): boolean;
    write(chunk: ChunkWithFlushFlag, cb?: () => void): boolean;
    write(chunk: ChunkWithFlushFlag, encoding?: Minipass.Encoding, cb?: () => void): boolean;
}
type ZlibOptions = ZlibBaseOptions & {
    level?: number;
    strategy?: number;
};
declare class Zlib extends ZlibBase {
    #private;
    constructor(opts: ZlibOptions, mode: ZlibMode);
    params(level: number, strategy: number): void;
}
type GzipOptions = ZlibOptions & {
    portable?: boolean;
};
declare class Gzip extends Zlib {
    #private;
    constructor(opts: GzipOptions);
    [_superWrite](data: Buffer$1 & {
        [_flushFlag]?: number;
    }): boolean;
}
declare class Unzip extends Zlib {
    constructor(opts: ZlibOptions);
}
declare class Brotli extends ZlibBase {
    constructor(opts: ZlibOptions, mode: BrotliMode);
}
declare class BrotliCompress extends Brotli {
    constructor(opts: ZlibOptions);
}
declare class BrotliDecompress extends Brotli {
    constructor(opts: ZlibOptions);
}

declare const isCode: (c: string) => c is EntryTypeCode;
declare const isName: (c: string) => c is EntryTypeName;
type EntryTypeCode = '0' | '' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | 'g' | 'x' | 'A' | 'D' | 'I' | 'K' | 'L' | 'M' | 'N' | 'S' | 'V' | 'X';
type EntryTypeName = 'File' | 'OldFile' | 'Link' | 'SymbolicLink' | 'CharacterDevice' | 'BlockDevice' | 'Directory' | 'FIFO' | 'ContiguousFile' | 'GlobalExtendedHeader' | 'ExtendedHeader' | 'SolarisACL' | 'GNUDumpDir' | 'Inode' | 'NextFileHasLongLinkpath' | 'NextFileHasLongPath' | 'ContinuationFile' | 'OldGnuLongPath' | 'SparseFile' | 'TapeVolumeHeader' | 'OldExtendedHeader' | 'Unsupported';
declare const name: Map<EntryTypeCode, EntryTypeName>;
declare const code: Map<EntryTypeName, EntryTypeCode>;

type types_d_EntryTypeCode = EntryTypeCode;
type types_d_EntryTypeName = EntryTypeName;
declare const types_d_code: typeof code;
declare const types_d_isCode: typeof isCode;
declare const types_d_isName: typeof isName;
declare const types_d_name: typeof name;
declare namespace types_d {
  export { type types_d_EntryTypeCode as EntryTypeCode, type types_d_EntryTypeName as EntryTypeName, types_d_code as code, types_d_isCode as isCode, types_d_isName as isName, types_d_name as name };
}

type HeaderData = {
    path?: string;
    mode?: number;
    uid?: number;
    gid?: number;
    size?: number;
    cksum?: number;
    type?: EntryTypeName | 'Unsupported';
    linkpath?: string;
    uname?: string;
    gname?: string;
    devmaj?: number;
    devmin?: number;
    atime?: Date;
    ctime?: Date;
    mtime?: Date;
    charset?: string;
    comment?: string;
    dev?: number;
    ino?: number;
    nlink?: number;
};
declare class Header implements HeaderData {
    #private;
    cksumValid: boolean;
    needPax: boolean;
    nullBlock: boolean;
    block?: Buffer;
    path?: string;
    mode?: number;
    uid?: number;
    gid?: number;
    size?: number;
    cksum?: number;
    linkpath?: string;
    uname?: string;
    gname?: string;
    devmaj: number;
    devmin: number;
    atime?: Date;
    ctime?: Date;
    mtime?: Date;
    charset?: string;
    comment?: string;
    constructor(data?: Buffer | HeaderData, off?: number, ex?: HeaderData, gex?: HeaderData);
    decode(buf: Buffer, off: number, ex?: HeaderData, gex?: HeaderData): void;
    encode(buf?: Buffer, off?: number): boolean;
    get type(): EntryTypeName;
    get typeKey(): EntryTypeCode | 'Unsupported';
    set type(type: EntryTypeCode | EntryTypeName | 'Unsupported');
}

declare class Pax implements HeaderData {
    atime?: Date;
    mtime?: Date;
    ctime?: Date;
    charset?: string;
    comment?: string;
    gid?: number;
    uid?: number;
    gname?: string;
    uname?: string;
    linkpath?: string;
    dev?: number;
    ino?: number;
    nlink?: number;
    path?: string;
    size?: number;
    mode?: number;
    global: boolean;
    constructor(obj: HeaderData, global?: boolean);
    encode(): Buffer;
    encodeBody(): string;
    encodeField(field: keyof Pax): string;
    static parse(str: string, ex?: HeaderData, g?: boolean): Pax;
}

declare class ReadEntry extends Minipass<Buffer, Buffer> {
    #private;
    extended?: Pax;
    globalExtended?: Pax;
    header: Header;
    startBlockSize: number;
    blockRemain: number;
    remain: number;
    type: EntryTypeName;
    meta: boolean;
    ignore: boolean;
    path: string;
    mode?: number;
    uid?: number;
    gid?: number;
    uname?: string;
    gname?: string;
    size: number;
    mtime?: Date;
    atime?: Date;
    ctime?: Date;
    linkpath?: string;
    dev?: number;
    ino?: number;
    nlink?: number;
    invalid: boolean;
    absolute?: string;
    unsupported: boolean;
    constructor(header: Header, ex?: Pax, gex?: Pax);
    write(data: Buffer): boolean;
}

/** has a warn method */
type Warner = {
    warn(code: string, message: string | Error, data: any): void;
    file?: string;
    cwd?: string;
    strict?: boolean;
    emit(event: 'warn', code: string, message: string, data?: WarnData): void;
    emit(event: 'error', error: TarError): void;
};
type WarnEvent<T = Buffer> = Minipass.Events<T> & {
    warn: [code: string, message: string, data: WarnData];
};
type WarnData = {
    file?: string;
    cwd?: string;
    code?: string;
    tarCode?: string;
    recoverable?: boolean;
    [k: string]: any;
};
type TarError = Error & WarnData;

declare const PROCESS$1: unique symbol;
declare const FILE$1: unique symbol;
declare const DIRECTORY$1: unique symbol;
declare const SYMLINK$1: unique symbol;
declare const HARDLINK$1: unique symbol;
declare const HEADER: unique symbol;
declare const READ: unique symbol;
declare const LSTAT: unique symbol;
declare const ONLSTAT: unique symbol;
declare const ONREAD: unique symbol;
declare const ONREADLINK: unique symbol;
declare const OPENFILE: unique symbol;
declare const ONOPENFILE: unique symbol;
declare const CLOSE: unique symbol;
declare const MODE: unique symbol;
declare const AWAITDRAIN: unique symbol;
declare const ONDRAIN$1: unique symbol;
declare const PREFIX: unique symbol;
declare class WriteEntry extends Minipass<Buffer, Minipass.ContiguousData, WarnEvent> implements Warner {
    #private;
    path: string;
    portable: boolean;
    myuid: number;
    myuser: string;
    maxReadSize: number;
    linkCache: Exclude<TarOptions['linkCache'], undefined>;
    statCache: Exclude<TarOptions['statCache'], undefined>;
    preservePaths: boolean;
    cwd: string;
    strict: boolean;
    mtime?: Date;
    noPax: boolean;
    noMtime: boolean;
    prefix?: string;
    fd?: number;
    blockLen: number;
    blockRemain: number;
    buf?: Buffer;
    pos: number;
    remain: number;
    length: number;
    offset: number;
    win32: boolean;
    absolute: string;
    header?: Header;
    type?: EntryTypeName | 'Unsupported';
    linkpath?: string;
    stat?: Stats;
    onWriteEntry?: (entry: WriteEntry) => any;
    constructor(p: string, opt_?: TarOptionsWithAliases);
    warn(code: string, message: string | Error, data?: WarnData): void;
    emit(ev: keyof WarnEvent, ...data: any[]): boolean;
    [LSTAT](): void;
    [ONLSTAT](stat: Stats): void;
    [PROCESS$1](): void | this;
    [MODE](mode: number): number;
    [PREFIX](path: string): string;
    [HEADER](): void;
    [DIRECTORY$1](): void;
    [SYMLINK$1](): void;
    [ONREADLINK](linkpath: string): void;
    [HARDLINK$1](linkpath: string): void;
    [FILE$1](): void | this;
    [OPENFILE](): void;
    [ONOPENFILE](fd: number): void;
    [READ](): void;
    [CLOSE](cb?: (er?: null | Error | NodeJS.ErrnoException) => any): void;
    [ONREAD](bytesRead: number): void;
    [AWAITDRAIN](cb: () => any): void;
    write(buffer: Buffer | string, cb?: () => void): boolean;
    write(str: Buffer | string, encoding?: BufferEncoding | null, cb?: () => void): boolean;
    [ONDRAIN$1](): void;
}
declare class WriteEntrySync extends WriteEntry implements Warner {
    sync: true;
    [LSTAT](): void;
    [SYMLINK$1](): void;
    [OPENFILE](): void;
    [READ](): void;
    [AWAITDRAIN](cb: () => any): void;
    [CLOSE](cb?: (er?: null | Error | NodeJS.ErrnoException) => any): void;
}
declare class WriteEntryTar extends Minipass<Buffer, Buffer | string, WarnEvent> implements Warner {
    blockLen: number;
    blockRemain: number;
    buf: number;
    pos: number;
    remain: number;
    length: number;
    preservePaths: boolean;
    portable: boolean;
    strict: boolean;
    noPax: boolean;
    noMtime: boolean;
    readEntry: ReadEntry;
    type: EntryTypeName;
    prefix?: string;
    path: string;
    mode?: number;
    uid?: number;
    gid?: number;
    uname?: string;
    gname?: string;
    header?: Header;
    mtime?: Date;
    atime?: Date;
    ctime?: Date;
    linkpath?: string;
    size: number;
    onWriteEntry?: (entry: WriteEntry) => any;
    warn(code: string, message: string | Error, data?: WarnData): void;
    constructor(readEntry: ReadEntry, opt_?: TarOptionsWithAliases);
    [PREFIX](path: string): string;
    [MODE](mode: number): number;
    write(buffer: Buffer | string, cb?: () => void): boolean;
    write(str: Buffer | string, encoding?: BufferEncoding | null, cb?: () => void): boolean;
    end(cb?: () => void): this;
    end(chunk: Buffer | string, cb?: () => void): this;
    end(chunk: Buffer | string, encoding?: BufferEncoding, cb?: () => void): this;
}

/**
 * The options that can be provided to tar commands.
 *
 * Note that some of these are only relevant for certain commands, since
 * they are specific to reading or writing.
 *
 * Aliases are provided in the {@link TarOptionsWithAliases} type.
 */
interface TarOptions {
    /**
     * Perform all I/O operations synchronously. If the stream is ended
     * immediately, then it will be processed entirely synchronously.
     */
    sync?: boolean;
    /**
     * The tar file to be read and/or written. When this is set, a stream
     * is not returned. Asynchronous commands will return a promise indicating
     * when the operation is completed, and synchronous commands will return
     * immediately.
     */
    file?: string;
    /**
     * Treat warnings as crash-worthy errors. Defaults false.
     */
    strict?: boolean;
    /**
     * The effective current working directory for this tar command
     */
    cwd?: string;
    /**
     * When creating a tar archive, this can be used to compress it as well.
     * Set to `true` to use the default gzip options, or customize them as
     * needed.
     *
     * When reading, if this is unset, then the compression status will be
     * inferred from the archive data. This is generally best, unless you are
     * sure of the compression settings in use to create the archive, and want to
     * fail if the archive doesn't match expectations.
     */
    gzip?: boolean | GzipOptions;
    /**
     * When creating archives, preserve absolute and `..` paths in the archive,
     * rather than sanitizing them under the cwd.
     *
     * When extracting, allow absolute paths, paths containing `..`, and
     * extracting through symbolic links. By default, the root `/` is stripped
     * from absolute paths (eg, turning `/x/y/z` into `x/y/z`), paths containing
     * `..` are not extracted, and any file whose location would be modified by a
     * symbolic link is not extracted.
     *
     * **WARNING** This is almost always unsafe, and must NEVER be used on
     * archives from untrusted sources, such as user input, and every entry must
     * be validated to ensure it is safe to write. Even if the input is not
     * malicious, mistakes can cause a lot of damage!
     */
    preservePaths?: boolean;
    /**
     * When extracting, do not set the `mtime` value for extracted entries to
     * match the `mtime` in the archive.
     *
     * When creating archives, do not store the `mtime` value in the entry. Note
     * that this prevents properly using other mtime-based features (such as
     * `tar.update` or the `newer` option) with the resulting archive.
     */
    noMtime?: boolean;
    /**
     * Set to `true` or an object with settings for `zlib.BrotliCompress()` to
     * create a brotli-compressed archive
     *
     * When extracting, this will cause the archive to be treated as a
     * brotli-compressed file if set to `true` or a ZlibOptions object.
     *
     * If set `false`, then brotli options will not be used.
     *
     * If both this and the `gzip` option are left `undefined`, then tar will
     * attempt to infer the brotli compression status, but can only do so based
     * on the filename. If the filename ends in `.tbr` or `.tar.br`, and the
     * first 512 bytes are not a valid tar header, then brotli decompression
     * will be attempted.
     */
    brotli?: boolean | ZlibOptions;
    /**
     * A function that is called with `(path, stat)` when creating an archive, or
     * `(path, entry)` when extracting. Return true to process the file/entry, or
     * false to exclude it.
     */
    filter?: (path: string, entry: Stats$1 | ReadEntry) => boolean;
    /**
     * A function that gets called for any warning encountered.
     *
     * Note: if `strict` is set, then the warning will throw, and this method
     * will not be called.
     */
    onwarn?: (code: string, message: string, data: WarnData) => any;
    /**
     * When extracting, unlink files before creating them. Without this option,
     * tar overwrites existing files, which preserves existing hardlinks. With
     * this option, existing hardlinks will be broken, as will any symlink that
     * would affect the location of an extracted file.
     */
    unlink?: boolean;
    /**
     * When extracting, strip the specified number of path portions from the
     * entry path. For example, with `{strip: 2}`, the entry `a/b/c/d` would be
     * extracted to `{cwd}/c/d`.
     *
     * Any entry whose entire path is stripped will be excluded.
     */
    strip?: number;
    /**
     * When extracting, keep the existing file on disk if it's newer than the
     * file in the archive.
     */
    newer?: boolean;
    /**
     * When extracting, do not overwrite existing files at all.
     */
    keep?: boolean;
    /**
     * When extracting, set the `uid` and `gid` of extracted entries to the `uid`
     * and `gid` fields in the archive. Defaults to true when run as root, and
     * false otherwise.
     *
     * If false, then files and directories will be set with the owner and group
     * of the user running the process. This is similar to `-p` in `tar(1)`, but
     * ACLs and other system-specific data is never unpacked in this
     * implementation, and modes are set by default already.
     */
    preserveOwner?: boolean;
    /**
     * The maximum depth of subfolders to extract into. This defaults to 1024.
     * Anything deeper than the limit will raise a warning and skip the entry.
     * Set to `Infinity` to remove the limitation.
     */
    maxDepth?: number;
    /**
     * When extracting, force all created files and directories, and all
     * implicitly created directories, to be owned by the specified user id,
     * regardless of the `uid` field in the archive.
     *
     * Cannot be used along with `preserveOwner`. Requires also setting the `gid`
     * option.
     */
    uid?: number;
    /**
     * When extracting, force all created files and directories, and all
     * implicitly created directories, to be owned by the specified group id,
     * regardless of the `gid` field in the archive.
     *
     * Cannot be used along with `preserveOwner`. Requires also setting the `uid`
     * option.
     */
    gid?: number;
    /**
     * When extracting, provide a function that takes an `entry` object, and
     * returns a stream, or any falsey value. If a stream is provided, then that
     * stream's data will be written instead of the contents of the archive
     * entry. If a falsey value is provided, then the entry is written to disk as
     * normal.
     *
     * To exclude items from extraction, use the `filter` option.
     *
     * Note that using an asynchronous stream type with the `transform` option
     * will cause undefined behavior in synchronous extractions.
     * [MiniPass](http://npm.im/minipass)-based streams are designed for this use
     * case.
     */
    transform?: (entry: ReadEntry) => any;
    /**
     * Call `chmod()` to ensure that extracted files match the entry's mode
     * field. Without this field set, all mode fields in archive entries are a
     * best effort attempt only.
     *
     * Setting this necessitates a call to the deprecated `process.umask()`
     * method to determine the default umask value, unless a `processUmask`
     * config is provided as well.
     *
     * If not set, tar will attempt to create file system entries with whatever
     * mode is provided, and let the implicit process `umask` apply normally, but
     * if a file already exists to be written to, then its existing mode will not
     * be modified.
     *
     * When setting `chmod: true`, it is highly recommend to set the
     * {@link TarOptions#processUmask} option as well, to avoid the call to the
     * deprecated (and thread-unsafe) `process.umask()` method.
     */
    chmod?: boolean;
    /**
     * When setting the {@link TarOptions#chmod} option to `true`, you may
     * provide a value here to avoid having to call the deprecated and
     * thread-unsafe `process.umask()` method.
     *
     * This has no effect with `chmod` is not set to true, as mode values are not
     * set explicitly anyway. If `chmod` is set to `true`, and a value is not
     * provided here, then `process.umask()` must be called, which will result in
     * deprecation warnings.
     *
     * The most common values for this are `0o22` (resulting in directories
     * created with mode `0o755` and files with `0o644` by default) and `0o2`
     * (resulting in directores created with mode `0o775` and files `0o664`, so
     * they are group-writable).
     */
    processUmask?: number;
    /**
     * When parsing/listing archives, `entry` streams are by default resumed
     * (set into "flowing" mode) immediately after the call to `onReadEntry()`.
     * Set `noResume: true` to suppress this behavior.
     *
     * Note that when this is set, the stream will never complete until the
     * data is consumed somehow.
     *
     * Set automatically in extract operations, since the entry is piped to
     * a file system entry right away. Only relevant when parsing.
     */
    noResume?: boolean;
    /**
     * When creating, updating, or replacing within archives, this method will
     * be called with each WriteEntry that is created.
     */
    onWriteEntry?: (entry: WriteEntry) => any;
    /**
     * When extracting or listing archives, this method will be called with
     * each entry that is not excluded by a `filter`.
     *
     * Important when listing archives synchronously from a file, because there
     * is otherwise no way to interact with the data!
     */
    onReadEntry?: (entry: ReadEntry) => any;
    /**
     * Pack the targets of symbolic links rather than the link itself.
     */
    follow?: boolean;
    /**
     * When creating archives, omit any metadata that is system-specific:
     * `ctime`, `atime`, `uid`, `gid`, `uname`, `gname`, `dev`, `ino`, and
     * `nlink`. Note that `mtime` is still included, because this is necessary
     * for other time-based operations such as `tar.update`. Additionally, `mode`
     * is set to a "reasonable default" for mose unix systems, based on an
     * effective `umask` of `0o22`.
     *
     * This also defaults the `portable` option in the gzip configs when creating
     * a compressed archive, in order to produce deterministic archives that are
     * not operating-system specific.
     */
    portable?: boolean;
    /**
     * When creating archives, do not recursively archive the contents of
     * directories. By default, archiving a directory archives all of its
     * contents as well.
     */
    noDirRecurse?: boolean;
    /**
     * Suppress Pax extended headers when creating archives. Note that this means
     * long paths and linkpaths will be truncated, and large or negative numeric
     * values may be interpreted incorrectly.
     */
    noPax?: boolean;
    /**
     * Set to a `Date` object to force a specific `mtime` value for everything
     * written to an archive.
     *
     * This is useful when creating archives that are intended to be
     * deterministic based on their contents, irrespective of the file's last
     * modification time.
     *
     * Overridden by `noMtime`.
     */
    mtime?: Date;
    /**
     * A path portion to prefix onto the entries added to an archive.
     */
    prefix?: string;
    /**
     * The mode to set on any created file archive, defaults to 0o666
     * masked by the process umask, often resulting in 0o644.
     *
     * This does *not* affect the mode fields of individual entries, or the
     * mode status of extracted entries on the filesystem.
     */
    mode?: number;
    /**
     * A cache of mtime values, to avoid having to stat the same file repeatedly.
     *
     * @internal
     */
    mtimeCache?: Map<string, Date>;
    /**
     * maximum buffer size for `fs.read()` operations.
     *
     * @internal
     */
    maxReadSize?: number;
    /**
     * Filter modes of entries being unpacked, like `process.umask()`
     *
     * @internal
     */
    umask?: number;
    /**
     * Default mode for directories. Used for all implicitly created directories,
     * and any directories in the archive that do not have a mode field.
     *
     * @internal
     */
    dmode?: number;
    /**
     * default mode for files
     *
     * @internal
     */
    fmode?: number;
    /**
     * Map that tracks which directories already exist, for extraction
     *
     * @internal
     */
    dirCache?: Map<string, boolean>;
    /**
     * maximum supported size of meta entries. Defaults to 1MB
     *
     * @internal
     */
    maxMetaEntrySize?: number;
    /**
     * A Map object containing the device and inode value for any file whose
     * `nlink` value is greater than 1, to identify hard links when creating
     * archives.
     *
     * @internal
     */
    linkCache?: Map<LinkCacheKey, string>;
    /**
     * A map object containing the results of `fs.readdir()` calls.
     *
     * @internal
     */
    readdirCache?: Map<string, string[]>;
    /**
     * A cache of all `lstat` results, for use in creating archives.
     *
     * @internal
     */
    statCache?: Map<string, Stats$1>;
    /**
     * Number of concurrent jobs to run when creating archives.
     *
     * Defaults to 4.
     *
     * @internal
     */
    jobs?: number;
    /**
     * Automatically set to true on Windows systems.
     *
     * When extracting, causes behavior where filenames containing `<|>?:`
     * characters are converted to windows-compatible escape sequences in the
     * created filesystem entries.
     *
     * When packing, causes behavior where paths replace `\` with `/`, and
     * filenames containing the windows-compatible escaped forms of `<|>?:` are
     * converted to actual `<|>?:` characters in the archive.
     *
     * @internal
     */
    win32?: boolean;
    /**
     * For `WriteEntry` objects, the absolute path to the entry on the
     * filesystem. By default, this is `resolve(cwd, entry.path)`, but it can be
     * overridden explicitly.
     *
     * @internal
     */
    absolute?: string;
    /**
     * Used with Parser stream interface, to attach and take over when the
     * stream is completely parsed. If this is set, then the prefinish,
     * finish, and end events will not fire, and are the responsibility of
     * the ondone method to emit properly.
     *
     * @internal
     */
    ondone?: () => void;
    /**
     * Mostly for testing, but potentially useful in some cases.
     * Forcibly trigger a chown on every entry, no matter what.
     */
    forceChown?: boolean;
    /**
     * ambiguous deprecated name for {@link onReadEntry}
     *
     * @deprecated
     */
    onentry?: (entry: ReadEntry) => any;
}
type TarOptionsSync = TarOptions & {
    sync: true;
};
type TarOptionsAsync = TarOptions & {
    sync?: false;
};
type TarOptionsFile = TarOptions & {
    file: string;
};
type TarOptionsNoFile = TarOptions & {
    file?: undefined;
};
type TarOptionsSyncFile = TarOptionsSync & TarOptionsFile;
type TarOptionsAsyncFile = TarOptionsAsync & TarOptionsFile;
type TarOptionsSyncNoFile = TarOptionsSync & TarOptionsNoFile;
type TarOptionsAsyncNoFile = TarOptionsAsync & TarOptionsNoFile;
type LinkCacheKey = `${number}:${number}`;
interface TarOptionsWithAliases extends TarOptions {
    /**
     * The effective current working directory for this tar command
     */
    C?: TarOptions['cwd'];
    /**
     * The tar file to be read and/or written. When this is set, a stream
     * is not returned. Asynchronous commands will return a promise indicating
     * when the operation is completed, and synchronous commands will return
     * immediately.
     */
    f?: TarOptions['file'];
    /**
     * When creating a tar archive, this can be used to compress it as well.
     * Set to `true` to use the default gzip options, or customize them as
     * needed.
     *
     * When reading, if this is unset, then the compression status will be
     * inferred from the archive data. This is generally best, unless you are
     * sure of the compression settings in use to create the archive, and want to
     * fail if the archive doesn't match expectations.
     */
    z?: TarOptions['gzip'];
    /**
     * When creating archives, preserve absolute and `..` paths in the archive,
     * rather than sanitizing them under the cwd.
     *
     * When extracting, allow absolute paths, paths containing `..`, and
     * extracting through symbolic links. By default, the root `/` is stripped
     * from absolute paths (eg, turning `/x/y/z` into `x/y/z`), paths containing
     * `..` are not extracted, and any file whose location would be modified by a
     * symbolic link is not extracted.
     *
     * **WARNING** This is almost always unsafe, and must NEVER be used on
     * archives from untrusted sources, such as user input, and every entry must
     * be validated to ensure it is safe to write. Even if the input is not
     * malicious, mistakes can cause a lot of damage!
     */
    P?: TarOptions['preservePaths'];
    /**
     * When extracting, unlink files before creating them. Without this option,
     * tar overwrites existing files, which preserves existing hardlinks. With
     * this option, existing hardlinks will be broken, as will any symlink that
     * would affect the location of an extracted file.
     */
    U?: TarOptions['unlink'];
    /**
     * When extracting, strip the specified number of path portions from the
     * entry path. For example, with `{strip: 2}`, the entry `a/b/c/d` would be
     * extracted to `{cwd}/c/d`.
     */
    'strip-components'?: TarOptions['strip'];
    /**
     * When extracting, strip the specified number of path portions from the
     * entry path. For example, with `{strip: 2}`, the entry `a/b/c/d` would be
     * extracted to `{cwd}/c/d`.
     */
    stripComponents?: TarOptions['strip'];
    /**
     * When extracting, keep the existing file on disk if it's newer than the
     * file in the archive.
     */
    'keep-newer'?: TarOptions['newer'];
    /**
     * When extracting, keep the existing file on disk if it's newer than the
     * file in the archive.
     */
    keepNewer?: TarOptions['newer'];
    /**
     * When extracting, keep the existing file on disk if it's newer than the
     * file in the archive.
     */
    'keep-newer-files'?: TarOptions['newer'];
    /**
     * When extracting, keep the existing file on disk if it's newer than the
     * file in the archive.
     */
    keepNewerFiles?: TarOptions['newer'];
    /**
     * When extracting, do not overwrite existing files at all.
     */
    k?: TarOptions['keep'];
    /**
     * When extracting, do not overwrite existing files at all.
     */
    'keep-existing'?: TarOptions['keep'];
    /**
     * When extracting, do not overwrite existing files at all.
     */
    keepExisting?: TarOptions['keep'];
    /**
     * When extracting, do not set the `mtime` value for extracted entries to
     * match the `mtime` in the archive.
     *
     * When creating archives, do not store the `mtime` value in the entry. Note
     * that this prevents properly using other mtime-based features (such as
     * `tar.update` or the `newer` option) with the resulting archive.
     */
    m?: TarOptions['noMtime'];
    /**
     * When extracting, do not set the `mtime` value for extracted entries to
     * match the `mtime` in the archive.
     *
     * When creating archives, do not store the `mtime` value in the entry. Note
     * that this prevents properly using other mtime-based features (such as
     * `tar.update` or the `newer` option) with the resulting archive.
     */
    'no-mtime'?: TarOptions['noMtime'];
    /**
     * When extracting, set the `uid` and `gid` of extracted entries to the `uid`
     * and `gid` fields in the archive. Defaults to true when run as root, and
     * false otherwise.
     *
     * If false, then files and directories will be set with the owner and group
     * of the user running the process. This is similar to `-p` in `tar(1)`, but
     * ACLs and other system-specific data is never unpacked in this
     * implementation, and modes are set by default already.
     */
    p?: TarOptions['preserveOwner'];
    /**
     * Pack the targets of symbolic links rather than the link itself.
     */
    L?: TarOptions['follow'];
    /**
     * Pack the targets of symbolic links rather than the link itself.
     */
    h?: TarOptions['follow'];
    /**
     * Deprecated option. Set explicitly false to set `chmod: true`. Ignored
     * if {@link TarOptions#chmod} is set to any boolean value.
     *
     * @deprecated
     */
    noChmod?: boolean;
}
type TarOptionsWithAliasesSync = TarOptionsWithAliases & {
    sync: true;
};
type TarOptionsWithAliasesAsync = TarOptionsWithAliases & {
    sync?: false;
};
type TarOptionsWithAliasesFile = (TarOptionsWithAliases & {
    file: string;
}) | (TarOptionsWithAliases & {
    f: string;
});
type TarOptionsWithAliasesSyncFile = TarOptionsWithAliasesSync & TarOptionsWithAliasesFile;
type TarOptionsWithAliasesAsyncFile = TarOptionsWithAliasesAsync & TarOptionsWithAliasesFile;
type TarOptionsWithAliasesNoFile = TarOptionsWithAliases & {
    f?: undefined;
    file?: undefined;
};
type TarOptionsWithAliasesSyncNoFile = TarOptionsWithAliasesSync & TarOptionsWithAliasesNoFile;
type TarOptionsWithAliasesAsyncNoFile = TarOptionsWithAliasesAsync & TarOptionsWithAliasesNoFile;

type CB = (er?: Error) => any;
type TarCommand<AsyncClass, SyncClass extends {
    sync: true;
}> = {
    (): AsyncClass;
    (opt: TarOptionsWithAliasesAsyncNoFile): AsyncClass;
    (entries: string[]): AsyncClass;
    (opt: TarOptionsWithAliasesAsyncNoFile, entries: string[]): AsyncClass;
} & {
    (opt: TarOptionsWithAliasesSyncNoFile): SyncClass;
    (opt: TarOptionsWithAliasesSyncNoFile, entries: string[]): SyncClass;
} & {
    (opt: TarOptionsWithAliasesAsyncFile): Promise<void>;
    (opt: TarOptionsWithAliasesAsyncFile, entries: string[]): Promise<void>;
    (opt: TarOptionsWithAliasesAsyncFile, cb: CB): Promise<void>;
    (opt: TarOptionsWithAliasesAsyncFile, entries: string[], cb: CB): Promise<void>;
} & {
    (opt: TarOptionsWithAliasesSyncFile): void;
    (opt: TarOptionsWithAliasesSyncFile, entries: string[]): void;
} & {
    (opt: TarOptionsWithAliasesSync): typeof opt extends (TarOptionsWithAliasesFile) ? void : typeof opt extends TarOptionsWithAliasesNoFile ? SyncClass : void | SyncClass;
    (opt: TarOptionsWithAliasesSync, entries: string[]): typeof opt extends TarOptionsWithAliasesFile ? void : typeof opt extends TarOptionsWithAliasesNoFile ? SyncClass : void | SyncClass;
} & {
    (opt: TarOptionsWithAliasesAsync): typeof opt extends (TarOptionsWithAliasesFile) ? Promise<void> : typeof opt extends TarOptionsWithAliasesNoFile ? AsyncClass : Promise<void> | AsyncClass;
    (opt: TarOptionsWithAliasesAsync, entries: string[]): typeof opt extends TarOptionsWithAliasesFile ? Promise<void> : typeof opt extends TarOptionsWithAliasesNoFile ? AsyncClass : Promise<void> | AsyncClass;
    (opt: TarOptionsWithAliasesAsync, cb: CB): Promise<void>;
    (opt: TarOptionsWithAliasesAsync, entries: string[], cb: CB): typeof opt extends TarOptionsWithAliasesFile ? Promise<void> : typeof opt extends TarOptionsWithAliasesNoFile ? never : Promise<void>;
} & {
    (opt: TarOptionsWithAliasesFile): Promise<void> | void;
    (opt: TarOptionsWithAliasesFile, entries: string[]): typeof opt extends TarOptionsWithAliasesSync ? void : typeof opt extends TarOptionsWithAliasesAsync ? Promise<void> : Promise<void> | void;
    (opt: TarOptionsWithAliasesFile, cb: CB): Promise<void>;
    (opt: TarOptionsWithAliasesFile, entries: string[], cb: CB): typeof opt extends TarOptionsWithAliasesSync ? never : typeof opt extends TarOptionsWithAliasesAsync ? Promise<void> : Promise<void>;
} & {
    (opt: TarOptionsWithAliasesNoFile): typeof opt extends (TarOptionsWithAliasesSync) ? SyncClass : typeof opt extends TarOptionsWithAliasesAsync ? AsyncClass : SyncClass | AsyncClass;
    (opt: TarOptionsWithAliasesNoFile, entries: string[]): typeof opt extends TarOptionsWithAliasesSync ? SyncClass : typeof opt extends TarOptionsWithAliasesAsync ? AsyncClass : SyncClass | AsyncClass;
} & {
    (opt: TarOptionsWithAliases): typeof opt extends (TarOptionsWithAliasesFile) ? typeof opt extends TarOptionsWithAliasesSync ? void : typeof opt extends TarOptionsWithAliasesAsync ? Promise<void> : void | Promise<void> : typeof opt extends TarOptionsWithAliasesNoFile ? typeof opt extends TarOptionsWithAliasesSync ? SyncClass : typeof opt extends TarOptionsWithAliasesAsync ? AsyncClass : SyncClass | AsyncClass : typeof opt extends TarOptionsWithAliasesSync ? SyncClass | void : typeof opt extends TarOptionsWithAliasesAsync ? AsyncClass | Promise<void> : SyncClass | void | AsyncClass | Promise<void>;
} & {
    syncFile: (opt: TarOptionsSyncFile, entries: string[]) => void;
    asyncFile: (opt: TarOptionsAsyncFile, entries: string[], cb?: CB) => Promise<void>;
    syncNoFile: (opt: TarOptionsSyncNoFile, entries: string[]) => SyncClass;
    asyncNoFile: (opt: TarOptionsAsyncNoFile, entries: string[]) => AsyncClass;
    validate?: (opt: TarOptions, entries?: string[]) => void;
};

declare class Yallist<T = unknown> {
    tail?: Node<T>;
    head?: Node<T>;
    length: number;
    static create<T = unknown>(list?: Iterable<T>): Yallist<T>;
    constructor(list?: Iterable<T>);
    [Symbol.iterator](): Generator<T, void, unknown>;
    removeNode(node: Node<T>): Node<T> | undefined;
    unshiftNode(node: Node<T>): void;
    pushNode(node: Node<T>): void;
    push(...args: T[]): number;
    unshift(...args: T[]): number;
    pop(): T | undefined;
    shift(): T | undefined;
    forEach(fn: (value: T, i: number, list: Yallist<T>) => any, thisp?: any): void;
    forEachReverse(fn: (value: T, i: number, list: Yallist<T>) => any, thisp?: any): void;
    get(n: number): T | undefined;
    getReverse(n: number): T | undefined;
    map<R = any>(fn: (value: T, list: Yallist<T>) => R, thisp?: any): Yallist<R>;
    mapReverse<R = any>(fn: (value: T, list: Yallist<T>) => R, thisp?: any): Yallist<R>;
    reduce(fn: (left: T, right: T, i: number) => T): T;
    reduce<R = any>(fn: (acc: R, next: T, i: number) => R, initial: R): R;
    reduceReverse(fn: (left: T, right: T, i: number) => T): T;
    reduceReverse<R = any>(fn: (acc: R, next: T, i: number) => R, initial: R): R;
    toArray(): any[];
    toArrayReverse(): any[];
    slice(from?: number, to?: number): Yallist<unknown>;
    sliceReverse(from?: number, to?: number): Yallist<unknown>;
    splice(start: number, deleteCount?: number, ...nodes: T[]): T[];
    reverse(): this;
}
declare class Node<T = unknown> {
    list?: Yallist<T>;
    next?: Node<T>;
    prev?: Node<T>;
    value: T;
    constructor(value: T, prev?: Node<T> | undefined, next?: Node<T> | undefined, list?: Yallist<T> | undefined);
}

declare class PackJob {
    path: string;
    absolute: string;
    entry?: WriteEntry | WriteEntryTar;
    stat?: Stats;
    readdir?: string[];
    pending: boolean;
    ignore: boolean;
    piped: boolean;
    constructor(path: string, absolute: string);
}

declare const ONSTAT: unique symbol;
declare const ENDED$2: unique symbol;
declare const QUEUE$1: unique symbol;
declare const CURRENT: unique symbol;
declare const PROCESS: unique symbol;
declare const PROCESSING: unique symbol;
declare const PROCESSJOB: unique symbol;
declare const JOBS: unique symbol;
declare const JOBDONE: unique symbol;
declare const ADDFSENTRY: unique symbol;
declare const ADDTARENTRY: unique symbol;
declare const STAT: unique symbol;
declare const READDIR: unique symbol;
declare const ONREADDIR: unique symbol;
declare const PIPE: unique symbol;
declare const ENTRY: unique symbol;
declare const ENTRYOPT: unique symbol;
declare const WRITEENTRYCLASS: unique symbol;
declare const WRITE: unique symbol;
declare const ONDRAIN: unique symbol;

declare class Pack extends Minipass<Buffer, ReadEntry | string, WarnEvent<Buffer>> implements Warner {
    opt: TarOptions;
    cwd: string;
    maxReadSize?: number;
    preservePaths: boolean;
    strict: boolean;
    noPax: boolean;
    prefix: string;
    linkCache: Exclude<TarOptions['linkCache'], undefined>;
    statCache: Exclude<TarOptions['statCache'], undefined>;
    file: string;
    portable: boolean;
    zip?: BrotliCompress | Gzip;
    readdirCache: Exclude<TarOptions['readdirCache'], undefined>;
    noDirRecurse: boolean;
    follow: boolean;
    noMtime: boolean;
    mtime?: Date;
    filter: Exclude<TarOptions['filter'], undefined>;
    jobs: number;
    [WRITEENTRYCLASS]: typeof WriteEntry | typeof WriteEntrySync;
    onWriteEntry?: (entry: WriteEntry) => void;
    [QUEUE$1]: Yallist<PackJob>;
    [JOBS]: number;
    [PROCESSING]: boolean;
    [ENDED$2]: boolean;
    constructor(opt?: TarOptions);
    [WRITE](chunk: Buffer): boolean;
    add(path: string | ReadEntry): this;
    end(cb?: () => void): this;
    end(path: string | ReadEntry, cb?: () => void): this;
    end(path: string | ReadEntry, encoding?: Minipass.Encoding, cb?: () => void): this;
    write(path: string | ReadEntry): boolean;
    [ADDTARENTRY](p: ReadEntry): void;
    [ADDFSENTRY](p: string): void;
    [STAT](job: PackJob): void;
    [ONSTAT](job: PackJob, stat: Stats): void;
    [READDIR](job: PackJob): void;
    [ONREADDIR](job: PackJob, entries: string[]): void;
    [PROCESS](): void;
    get [CURRENT](): PackJob | undefined;
    [JOBDONE](_job: PackJob): void;
    [PROCESSJOB](job: PackJob): void;
    [ENTRYOPT](job: PackJob): TarOptions;
    [ENTRY](job: PackJob): WriteEntry | undefined;
    [ONDRAIN](): void;
    [PIPE](job: PackJob): void;
    pause(): void;
    warn(code: string, message: string | Error, data?: WarnData): void;
}
declare class PackSync extends Pack {
    sync: true;
    constructor(opt: TarOptions);
    pause(): void;
    resume(): void;
    [STAT](job: PackJob): void;
    [READDIR](job: PackJob): void;
    [PIPE](job: PackJob): void;
}

declare const create: TarCommand<Pack, PackSync>;

declare class CwdError extends Error {
    path: string;
    code: string;
    syscall: 'chdir';
    constructor(path: string, code: string);
    get name(): string;
}

declare class SymlinkError extends Error {
    path: string;
    symlink: string;
    syscall: 'symlink';
    code: 'TAR_SYMLINK_ERROR';
    constructor(symlink: string, path: string);
    get name(): string;
}

type MkdirError = NodeJS.ErrnoException | CwdError | SymlinkError;

declare const STATE: unique symbol;
declare const WRITEENTRY: unique symbol;
declare const READENTRY: unique symbol;
declare const NEXTENTRY: unique symbol;
declare const PROCESSENTRY: unique symbol;
declare const EX: unique symbol;
declare const GEX: unique symbol;
declare const META: unique symbol;
declare const EMITMETA: unique symbol;
declare const BUFFER: unique symbol;
declare const QUEUE: unique symbol;
declare const ENDED$1: unique symbol;
declare const EMITTEDEND: unique symbol;
declare const EMIT: unique symbol;
declare const UNZIP: unique symbol;
declare const CONSUMECHUNK: unique symbol;
declare const CONSUMECHUNKSUB: unique symbol;
declare const CONSUMEBODY: unique symbol;
declare const CONSUMEMETA: unique symbol;
declare const CONSUMEHEADER: unique symbol;
declare const CONSUMING: unique symbol;
declare const BUFFERCONCAT: unique symbol;
declare const MAYBEEND: unique symbol;
declare const WRITING: unique symbol;
declare const ABORTED: unique symbol;
declare const SAW_VALID_ENTRY: unique symbol;
declare const SAW_NULL_BLOCK: unique symbol;
declare const SAW_EOF: unique symbol;
declare const CLOSESTREAM: unique symbol;
type State = 'begin' | 'header' | 'ignore' | 'meta' | 'body';
declare class Parser extends EventEmitter$1 implements Warner {
    file: string;
    strict: boolean;
    maxMetaEntrySize: number;
    filter: Exclude<TarOptions['filter'], undefined>;
    brotli?: TarOptions['brotli'];
    writable: true;
    readable: false;
    [QUEUE]: Yallist<ReadEntry | [string | symbol, any, any]>;
    [BUFFER]?: Buffer;
    [READENTRY]?: ReadEntry;
    [WRITEENTRY]?: ReadEntry;
    [STATE]: State;
    [META]: string;
    [EX]?: Pax;
    [GEX]?: Pax;
    [ENDED$1]: boolean;
    [UNZIP]?: false | Unzip | BrotliDecompress;
    [ABORTED]: boolean;
    [SAW_VALID_ENTRY]?: boolean;
    [SAW_NULL_BLOCK]: boolean;
    [SAW_EOF]: boolean;
    [WRITING]: boolean;
    [CONSUMING]: boolean;
    [EMITTEDEND]: boolean;
    constructor(opt?: TarOptions);
    warn(code: string, message: string | Error, data?: WarnData): void;
    [CONSUMEHEADER](chunk: Buffer, position: number): void;
    [CLOSESTREAM](): void;
    [PROCESSENTRY](entry?: ReadEntry | [string | symbol, any, any]): boolean;
    [NEXTENTRY](): void;
    [CONSUMEBODY](chunk: Buffer, position: number): number;
    [CONSUMEMETA](chunk: Buffer, position: number): number;
    [EMIT](ev: string | symbol, data?: any, extra?: any): void;
    [EMITMETA](entry: ReadEntry): void;
    abort(error: Error): void;
    write(buffer: Uint8Array | string, cb?: (err?: Error | null) => void): boolean;
    write(str: string, encoding?: BufferEncoding, cb?: (err?: Error | null) => void): boolean;
    [BUFFERCONCAT](c: Buffer): void;
    [MAYBEEND](): void;
    [CONSUMECHUNK](chunk?: Buffer): void;
    [CONSUMECHUNKSUB](chunk: Buffer): void;
    end(cb?: () => void): this;
    end(data: string | Buffer, cb?: () => void): this;
    end(str: string, encoding?: BufferEncoding, cb?: () => void): this;
}

type Handler = (clear: () => void) => void;
declare class PathReservations {
    #private;
    reserve(paths: string[], fn: Handler): boolean;
    check(fn: Handler): boolean;
}

declare const ONENTRY: unique symbol;
declare const CHECKFS: unique symbol;
declare const CHECKFS2: unique symbol;
declare const PRUNECACHE: unique symbol;
declare const ISREUSABLE: unique symbol;
declare const MAKEFS: unique symbol;
declare const FILE: unique symbol;
declare const DIRECTORY: unique symbol;
declare const LINK: unique symbol;
declare const SYMLINK: unique symbol;
declare const HARDLINK: unique symbol;
declare const UNSUPPORTED: unique symbol;
declare const CHECKPATH: unique symbol;
declare const MKDIR: unique symbol;
declare const ONERROR: unique symbol;
declare const PENDING: unique symbol;
declare const PEND: unique symbol;
declare const UNPEND: unique symbol;
declare const ENDED: unique symbol;
declare const MAYBECLOSE: unique symbol;
declare const SKIP: unique symbol;
declare const DOCHOWN: unique symbol;
declare const UID: unique symbol;
declare const GID: unique symbol;
declare const CHECKED_CWD: unique symbol;
declare class Unpack extends Parser {
    [ENDED]: boolean;
    [CHECKED_CWD]: boolean;
    [PENDING]: number;
    reservations: PathReservations;
    transform?: TarOptions['transform'];
    writable: true;
    readable: false;
    dirCache: Exclude<TarOptions['dirCache'], undefined>;
    uid?: number;
    gid?: number;
    setOwner: boolean;
    preserveOwner: boolean;
    processGid?: number;
    processUid?: number;
    maxDepth: number;
    forceChown: boolean;
    win32: boolean;
    newer: boolean;
    keep: boolean;
    noMtime: boolean;
    preservePaths: boolean;
    unlink: boolean;
    cwd: string;
    strip: number;
    processUmask: number;
    umask: number;
    dmode: number;
    fmode: number;
    chmod: boolean;
    constructor(opt?: TarOptions);
    warn(code: string, msg: string | Error, data?: WarnData): void;
    [MAYBECLOSE](): void;
    [CHECKPATH](entry: ReadEntry): boolean;
    [ONENTRY](entry: ReadEntry): void;
    [ONERROR](er: Error, entry: ReadEntry): void;
    [MKDIR](dir: string, mode: number, cb: (er?: null | MkdirError, made?: string) => void): void;
    [DOCHOWN](entry: ReadEntry): boolean;
    [UID](entry: ReadEntry): number | undefined;
    [GID](entry: ReadEntry): number | undefined;
    [FILE](entry: ReadEntry, fullyDone: () => void): void;
    [DIRECTORY](entry: ReadEntry, fullyDone: () => void): void;
    [UNSUPPORTED](entry: ReadEntry): void;
    [SYMLINK](entry: ReadEntry, done: () => void): void;
    [HARDLINK](entry: ReadEntry, done: () => void): void;
    [PEND](): void;
    [UNPEND](): void;
    [SKIP](entry: ReadEntry): void;
    [ISREUSABLE](entry: ReadEntry, st: Stats$1): boolean;
    [CHECKFS](entry: ReadEntry): void;
    [PRUNECACHE](entry: ReadEntry): void;
    [CHECKFS2](entry: ReadEntry, fullyDone: (er?: Error) => void): void;
    [MAKEFS](er: null | undefined | Error, entry: ReadEntry, done: () => void): void;
    [LINK](entry: ReadEntry, linkpath: string, link: 'link' | 'symlink', done: () => void): void;
}
declare class UnpackSync extends Unpack {
    sync: true;
    [MAKEFS](er: null | Error | undefined, entry: ReadEntry): void;
    [CHECKFS](entry: ReadEntry): void;
    [FILE](entry: ReadEntry, done: () => void): void;
    [DIRECTORY](entry: ReadEntry, done: () => void): void;
    [MKDIR](dir: string, mode: number): unknown;
    [LINK](entry: ReadEntry, linkpath: string, link: 'link' | 'symlink', done: () => void): void;
}

declare const extract: TarCommand<Unpack, UnpackSync>;

declare const filesFilter: (opt: TarOptions, files: string[]) => void;
declare const list: TarCommand<Parser, Parser & {
    sync: true;
}>;

declare const replace: TarCommand<never, never>;

declare const update: TarCommand<never, never>;

export { Header, type HeaderData, Pack, PackJob, PackSync, Parser, Pax, ReadEntry, type State, type TarOptionsWithAliases, type TarOptionsWithAliasesAsync, type TarOptionsWithAliasesAsyncFile, type TarOptionsWithAliasesAsyncNoFile, type TarOptionsWithAliasesFile, type TarOptionsWithAliasesSync, type TarOptionsWithAliasesSyncFile, type TarOptionsWithAliasesSyncNoFile, Unpack, UnpackSync, WriteEntry, WriteEntrySync, WriteEntryTar, create as c, create, extract, filesFilter, list, replace as r, replace, list as t, types_d as types, update as u, update, extract as x };
