import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
var __nccwpck_require__ = {};
(() => {
  __nccwpck_require__.d = (exports, definition) => {
    for (var key in definition) {
      if (
        __nccwpck_require__.o(definition, key) &&
        !__nccwpck_require__.o(exports, key)
      ) {
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: definition[key],
        });
      }
    }
  };
})();
(() => {
  __nccwpck_require__.o = (obj, prop) =>
    Object.prototype.hasOwnProperty.call(obj, prop);
})();
(() => {
  __nccwpck_require__.r = (exports) => {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
  };
})();
if (typeof __nccwpck_require__ !== "undefined")
  __nccwpck_require__.ab =
    new URL(".", import.meta.url).pathname.slice(
      import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0,
      -1,
    ) + "/";
var __webpack_exports__ = {};
__nccwpck_require__.d(__webpack_exports__, {
  h4: () => Header,
  Qi: () => Pack,
  nF: () => PackJob,
  Yg: () => PackSync,
  _b: () => Parser,
  Jd: () => Pax,
  OH: () => ReadEntry,
  To: () => Unpack,
  qE: () => UnpackSync,
  Vi: () => WriteEntry,
  OD: () => WriteEntrySync,
  hq: () => WriteEntryTar,
  c: () => create,
  Ue: () => create,
  Kl: () => extract,
  nw: () => filesFilter,
  pb: () => list,
  r: () => replace,
  gx: () => replace,
  t: () => list,
  V5: () => types_namespaceObject,
  u: () => update,
  Vx: () => update,
  x: () => extract,
});
var types_namespaceObject = {};
__nccwpck_require__.r(types_namespaceObject);
__nccwpck_require__.d(types_namespaceObject, {
  code: () => code,
  isCode: () => isCode,
  isName: () => isName,
  name: () => types_name,
});
const external_events_namespaceObject = __WEBPACK_EXTERNAL_createRequire(
  import.meta.url,
)("events");
const external_fs_namespaceObject = __WEBPACK_EXTERNAL_createRequire(
  import.meta.url,
)("fs");
const external_node_events_namespaceObject = __WEBPACK_EXTERNAL_createRequire(
  import.meta.url,
)("node:events");
const external_node_stream_namespaceObject = __WEBPACK_EXTERNAL_createRequire(
  import.meta.url,
)("node:stream");
const external_node_string_decoder_namespaceObject =
  __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:string_decoder");
const proc =
  typeof process === "object" && process
    ? process
    : { stdout: null, stderr: null };
const isStream = (s) =>
  !!s &&
  typeof s === "object" &&
  (s instanceof Minipass ||
    s instanceof external_node_stream_namespaceObject ||
    isReadable(s) ||
    isWritable(s));
const isReadable = (s) =>
  !!s &&
  typeof s === "object" &&
  s instanceof external_node_events_namespaceObject.EventEmitter &&
  typeof s.pipe === "function" &&
  s.pipe !== external_node_stream_namespaceObject.Writable.prototype.pipe;
const isWritable = (s) =>
  !!s &&
  typeof s === "object" &&
  s instanceof external_node_events_namespaceObject.EventEmitter &&
  typeof s.write === "function" &&
  typeof s.end === "function";
const EOF = Symbol("EOF");
const MAYBE_EMIT_END = Symbol("maybeEmitEnd");
const EMITTED_END = Symbol("emittedEnd");
const EMITTING_END = Symbol("emittingEnd");
const EMITTED_ERROR = Symbol("emittedError");
const CLOSED = Symbol("closed");
const READ = Symbol("read");
const FLUSH = Symbol("flush");
const FLUSHCHUNK = Symbol("flushChunk");
const ENCODING = Symbol("encoding");
const DECODER = Symbol("decoder");
const FLOWING = Symbol("flowing");
const PAUSED = Symbol("paused");
const RESUME = Symbol("resume");
const BUFFER = Symbol("buffer");
const PIPES = Symbol("pipes");
const BUFFERLENGTH = Symbol("bufferLength");
const BUFFERPUSH = Symbol("bufferPush");
const BUFFERSHIFT = Symbol("bufferShift");
const OBJECTMODE = Symbol("objectMode");
const DESTROYED = Symbol("destroyed");
const ERROR = Symbol("error");
const EMITDATA = Symbol("emitData");
const EMITEND = Symbol("emitEnd");
const EMITEND2 = Symbol("emitEnd2");
const ASYNC = Symbol("async");
const ABORT = Symbol("abort");
const ABORTED = Symbol("aborted");
const SIGNAL = Symbol("signal");
const DATALISTENERS = Symbol("dataListeners");
const DISCARDED = Symbol("discarded");
const defer = (fn) => Promise.resolve().then(fn);
const nodefer = (fn) => fn();
const isEndish = (ev) => ev === "end" || ev === "finish" || ev === "prefinish";
const isArrayBufferLike = (b) =>
  b instanceof ArrayBuffer ||
  (!!b &&
    typeof b === "object" &&
    b.constructor &&
    b.constructor.name === "ArrayBuffer" &&
    b.byteLength >= 0);
const isArrayBufferView = (b) => !Buffer.isBuffer(b) && ArrayBuffer.isView(b);
class Pipe {
  src;
  dest;
  opts;
  ondrain;
  constructor(src, dest, opts) {
    this.src = src;
    this.dest = dest;
    this.opts = opts;
    this.ondrain = () => src[RESUME]();
    this.dest.on("drain", this.ondrain);
  }
  unpipe() {
    this.dest.removeListener("drain", this.ondrain);
  }
  proxyErrors(_er) {}
  end() {
    this.unpipe();
    if (this.opts.end) this.dest.end();
  }
}
class PipeProxyErrors extends Pipe {
  unpipe() {
    this.src.removeListener("error", this.proxyErrors);
    super.unpipe();
  }
  constructor(src, dest, opts) {
    super(src, dest, opts);
    this.proxyErrors = (er) => dest.emit("error", er);
    src.on("error", this.proxyErrors);
  }
}
const isObjectModeOptions = (o) => !!o.objectMode;
const isEncodingOptions = (o) =>
  !o.objectMode && !!o.encoding && o.encoding !== "buffer";
class Minipass extends external_node_events_namespaceObject.EventEmitter {
  [FLOWING] = false;
  [PAUSED] = false;
  [PIPES] = [];
  [BUFFER] = [];
  [OBJECTMODE];
  [ENCODING];
  [ASYNC];
  [DECODER];
  [EOF] = false;
  [EMITTED_END] = false;
  [EMITTING_END] = false;
  [CLOSED] = false;
  [EMITTED_ERROR] = null;
  [BUFFERLENGTH] = 0;
  [DESTROYED] = false;
  [SIGNAL];
  [ABORTED] = false;
  [DATALISTENERS] = 0;
  [DISCARDED] = false;
  writable = true;
  readable = true;
  constructor(...args) {
    const options = args[0] || {};
    super();
    if (options.objectMode && typeof options.encoding === "string") {
      throw new TypeError("Encoding and objectMode may not be used together");
    }
    if (isObjectModeOptions(options)) {
      this[OBJECTMODE] = true;
      this[ENCODING] = null;
    } else if (isEncodingOptions(options)) {
      this[ENCODING] = options.encoding;
      this[OBJECTMODE] = false;
    } else {
      this[OBJECTMODE] = false;
      this[ENCODING] = null;
    }
    this[ASYNC] = !!options.async;
    this[DECODER] = this[ENCODING]
      ? new external_node_string_decoder_namespaceObject.StringDecoder(
          this[ENCODING],
        )
      : null;
    if (options && options.debugExposeBuffer === true) {
      Object.defineProperty(this, "buffer", { get: () => this[BUFFER] });
    }
    if (options && options.debugExposePipes === true) {
      Object.defineProperty(this, "pipes", { get: () => this[PIPES] });
    }
    const { signal } = options;
    if (signal) {
      this[SIGNAL] = signal;
      if (signal.aborted) {
        this[ABORT]();
      } else {
        signal.addEventListener("abort", () => this[ABORT]());
      }
    }
  }
  get bufferLength() {
    return this[BUFFERLENGTH];
  }
  get encoding() {
    return this[ENCODING];
  }
  set encoding(_enc) {
    throw new Error("Encoding must be set at instantiation time");
  }
  setEncoding(_enc) {
    throw new Error("Encoding must be set at instantiation time");
  }
  get objectMode() {
    return this[OBJECTMODE];
  }
  set objectMode(_om) {
    throw new Error("objectMode must be set at instantiation time");
  }
  get ["async"]() {
    return this[ASYNC];
  }
  set ["async"](a) {
    this[ASYNC] = this[ASYNC] || !!a;
  }
  [ABORT]() {
    this[ABORTED] = true;
    this.emit("abort", this[SIGNAL]?.reason);
    this.destroy(this[SIGNAL]?.reason);
  }
  get aborted() {
    return this[ABORTED];
  }
  set aborted(_) {}
  write(chunk, encoding, cb) {
    if (this[ABORTED]) return false;
    if (this[EOF]) throw new Error("write after end");
    if (this[DESTROYED]) {
      this.emit(
        "error",
        Object.assign(
          new Error("Cannot call write after a stream was destroyed"),
          { code: "ERR_STREAM_DESTROYED" },
        ),
      );
      return true;
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = "utf8";
    }
    if (!encoding) encoding = "utf8";
    const fn = this[ASYNC] ? defer : nodefer;
    if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk)) {
      if (isArrayBufferView(chunk)) {
        chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
      } else if (isArrayBufferLike(chunk)) {
        chunk = Buffer.from(chunk);
      } else if (typeof chunk !== "string") {
        throw new Error("Non-contiguous data written to non-objectMode stream");
      }
    }
    if (this[OBJECTMODE]) {
      if (this[FLOWING] && this[BUFFERLENGTH] !== 0) this[FLUSH](true);
      if (this[FLOWING]) this.emit("data", chunk);
      else this[BUFFERPUSH](chunk);
      if (this[BUFFERLENGTH] !== 0) this.emit("readable");
      if (cb) fn(cb);
      return this[FLOWING];
    }
    if (!chunk.length) {
      if (this[BUFFERLENGTH] !== 0) this.emit("readable");
      if (cb) fn(cb);
      return this[FLOWING];
    }
    if (
      typeof chunk === "string" &&
      !(encoding === this[ENCODING] && !this[DECODER]?.lastNeed)
    ) {
      chunk = Buffer.from(chunk, encoding);
    }
    if (Buffer.isBuffer(chunk) && this[ENCODING]) {
      chunk = this[DECODER].write(chunk);
    }
    if (this[FLOWING] && this[BUFFERLENGTH] !== 0) this[FLUSH](true);
    if (this[FLOWING]) this.emit("data", chunk);
    else this[BUFFERPUSH](chunk);
    if (this[BUFFERLENGTH] !== 0) this.emit("readable");
    if (cb) fn(cb);
    return this[FLOWING];
  }
  read(n) {
    if (this[DESTROYED]) return null;
    this[DISCARDED] = false;
    if (this[BUFFERLENGTH] === 0 || n === 0 || (n && n > this[BUFFERLENGTH])) {
      this[MAYBE_EMIT_END]();
      return null;
    }
    if (this[OBJECTMODE]) n = null;
    if (this[BUFFER].length > 1 && !this[OBJECTMODE]) {
      this[BUFFER] = [
        this[ENCODING]
          ? this[BUFFER].join("")
          : Buffer.concat(this[BUFFER], this[BUFFERLENGTH]),
      ];
    }
    const ret = this[READ](n || null, this[BUFFER][0]);
    this[MAYBE_EMIT_END]();
    return ret;
  }
  [READ](n, chunk) {
    if (this[OBJECTMODE]) this[BUFFERSHIFT]();
    else {
      const c = chunk;
      if (n === c.length || n === null) this[BUFFERSHIFT]();
      else if (typeof c === "string") {
        this[BUFFER][0] = c.slice(n);
        chunk = c.slice(0, n);
        this[BUFFERLENGTH] -= n;
      } else {
        this[BUFFER][0] = c.subarray(n);
        chunk = c.subarray(0, n);
        this[BUFFERLENGTH] -= n;
      }
    }
    this.emit("data", chunk);
    if (!this[BUFFER].length && !this[EOF]) this.emit("drain");
    return chunk;
  }
  end(chunk, encoding, cb) {
    if (typeof chunk === "function") {
      cb = chunk;
      chunk = undefined;
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = "utf8";
    }
    if (chunk !== undefined) this.write(chunk, encoding);
    if (cb) this.once("end", cb);
    this[EOF] = true;
    this.writable = false;
    if (this[FLOWING] || !this[PAUSED]) this[MAYBE_EMIT_END]();
    return this;
  }
  [RESUME]() {
    if (this[DESTROYED]) return;
    if (!this[DATALISTENERS] && !this[PIPES].length) {
      this[DISCARDED] = true;
    }
    this[PAUSED] = false;
    this[FLOWING] = true;
    this.emit("resume");
    if (this[BUFFER].length) this[FLUSH]();
    else if (this[EOF]) this[MAYBE_EMIT_END]();
    else this.emit("drain");
  }
  resume() {
    return this[RESUME]();
  }
  pause() {
    this[FLOWING] = false;
    this[PAUSED] = true;
    this[DISCARDED] = false;
  }
  get destroyed() {
    return this[DESTROYED];
  }
  get flowing() {
    return this[FLOWING];
  }
  get paused() {
    return this[PAUSED];
  }
  [BUFFERPUSH](chunk) {
    if (this[OBJECTMODE]) this[BUFFERLENGTH] += 1;
    else this[BUFFERLENGTH] += chunk.length;
    this[BUFFER].push(chunk);
  }
  [BUFFERSHIFT]() {
    if (this[OBJECTMODE]) this[BUFFERLENGTH] -= 1;
    else this[BUFFERLENGTH] -= this[BUFFER][0].length;
    return this[BUFFER].shift();
  }
  [FLUSH](noDrain = false) {
    do {} while (this[FLUSHCHUNK](this[BUFFERSHIFT]()) && this[BUFFER].length);
    if (!noDrain && !this[BUFFER].length && !this[EOF]) this.emit("drain");
  }
  [FLUSHCHUNK](chunk) {
    this.emit("data", chunk);
    return this[FLOWING];
  }
  pipe(dest, opts) {
    if (this[DESTROYED]) return dest;
    this[DISCARDED] = false;
    const ended = this[EMITTED_END];
    opts = opts || {};
    if (dest === proc.stdout || dest === proc.stderr) opts.end = false;
    else opts.end = opts.end !== false;
    opts.proxyErrors = !!opts.proxyErrors;
    if (ended) {
      if (opts.end) dest.end();
    } else {
      this[PIPES].push(
        !opts.proxyErrors
          ? new Pipe(this, dest, opts)
          : new PipeProxyErrors(this, dest, opts),
      );
      if (this[ASYNC]) defer(() => this[RESUME]());
      else this[RESUME]();
    }
    return dest;
  }
  unpipe(dest) {
    const p = this[PIPES].find((p) => p.dest === dest);
    if (p) {
      if (this[PIPES].length === 1) {
        if (this[FLOWING] && this[DATALISTENERS] === 0) {
          this[FLOWING] = false;
        }
        this[PIPES] = [];
      } else this[PIPES].splice(this[PIPES].indexOf(p), 1);
      p.unpipe();
    }
  }
  addListener(ev, handler) {
    return this.on(ev, handler);
  }
  on(ev, handler) {
    const ret = super.on(ev, handler);
    if (ev === "data") {
      this[DISCARDED] = false;
      this[DATALISTENERS]++;
      if (!this[PIPES].length && !this[FLOWING]) {
        this[RESUME]();
      }
    } else if (ev === "readable" && this[BUFFERLENGTH] !== 0) {
      super.emit("readable");
    } else if (isEndish(ev) && this[EMITTED_END]) {
      super.emit(ev);
      this.removeAllListeners(ev);
    } else if (ev === "error" && this[EMITTED_ERROR]) {
      const h = handler;
      if (this[ASYNC]) defer(() => h.call(this, this[EMITTED_ERROR]));
      else h.call(this, this[EMITTED_ERROR]);
    }
    return ret;
  }
  removeListener(ev, handler) {
    return this.off(ev, handler);
  }
  off(ev, handler) {
    const ret = super.off(ev, handler);
    if (ev === "data") {
      this[DATALISTENERS] = this.listeners("data").length;
      if (
        this[DATALISTENERS] === 0 &&
        !this[DISCARDED] &&
        !this[PIPES].length
      ) {
        this[FLOWING] = false;
      }
    }
    return ret;
  }
  removeAllListeners(ev) {
    const ret = super.removeAllListeners(ev);
    if (ev === "data" || ev === undefined) {
      this[DATALISTENERS] = 0;
      if (!this[DISCARDED] && !this[PIPES].length) {
        this[FLOWING] = false;
      }
    }
    return ret;
  }
  get emittedEnd() {
    return this[EMITTED_END];
  }
  [MAYBE_EMIT_END]() {
    if (
      !this[EMITTING_END] &&
      !this[EMITTED_END] &&
      !this[DESTROYED] &&
      this[BUFFER].length === 0 &&
      this[EOF]
    ) {
      this[EMITTING_END] = true;
      this.emit("end");
      this.emit("prefinish");
      this.emit("finish");
      if (this[CLOSED]) this.emit("close");
      this[EMITTING_END] = false;
    }
  }
  emit(ev, ...args) {
    const data = args[0];
    if (
      ev !== "error" &&
      ev !== "close" &&
      ev !== DESTROYED &&
      this[DESTROYED]
    ) {
      return false;
    } else if (ev === "data") {
      return !this[OBJECTMODE] && !data
        ? false
        : this[ASYNC]
          ? (defer(() => this[EMITDATA](data)), true)
          : this[EMITDATA](data);
    } else if (ev === "end") {
      return this[EMITEND]();
    } else if (ev === "close") {
      this[CLOSED] = true;
      if (!this[EMITTED_END] && !this[DESTROYED]) return false;
      const ret = super.emit("close");
      this.removeAllListeners("close");
      return ret;
    } else if (ev === "error") {
      this[EMITTED_ERROR] = data;
      super.emit(ERROR, data);
      const ret =
        !this[SIGNAL] || this.listeners("error").length
          ? super.emit("error", data)
          : false;
      this[MAYBE_EMIT_END]();
      return ret;
    } else if (ev === "resume") {
      const ret = super.emit("resume");
      this[MAYBE_EMIT_END]();
      return ret;
    } else if (ev === "finish" || ev === "prefinish") {
      const ret = super.emit(ev);
      this.removeAllListeners(ev);
      return ret;
    }
    const ret = super.emit(ev, ...args);
    this[MAYBE_EMIT_END]();
    return ret;
  }
  [EMITDATA](data) {
    for (const p of this[PIPES]) {
      if (p.dest.write(data) === false) this.pause();
    }
    const ret = this[DISCARDED] ? false : super.emit("data", data);
    this[MAYBE_EMIT_END]();
    return ret;
  }
  [EMITEND]() {
    if (this[EMITTED_END]) return false;
    this[EMITTED_END] = true;
    this.readable = false;
    return this[ASYNC]
      ? (defer(() => this[EMITEND2]()), true)
      : this[EMITEND2]();
  }
  [EMITEND2]() {
    if (this[DECODER]) {
      const data = this[DECODER].end();
      if (data) {
        for (const p of this[PIPES]) {
          p.dest.write(data);
        }
        if (!this[DISCARDED]) super.emit("data", data);
      }
    }
    for (const p of this[PIPES]) {
      p.end();
    }
    const ret = super.emit("end");
    this.removeAllListeners("end");
    return ret;
  }
  async collect() {
    const buf = Object.assign([], { dataLength: 0 });
    if (!this[OBJECTMODE]) buf.dataLength = 0;
    const p = this.promise();
    this.on("data", (c) => {
      buf.push(c);
      if (!this[OBJECTMODE]) buf.dataLength += c.length;
    });
    await p;
    return buf;
  }
  async concat() {
    if (this[OBJECTMODE]) {
      throw new Error("cannot concat in objectMode");
    }
    const buf = await this.collect();
    return this[ENCODING] ? buf.join("") : Buffer.concat(buf, buf.dataLength);
  }
  async promise() {
    return new Promise((resolve, reject) => {
      this.on(DESTROYED, () => reject(new Error("stream destroyed")));
      this.on("error", (er) => reject(er));
      this.on("end", () => resolve());
    });
  }
  [Symbol.asyncIterator]() {
    this[DISCARDED] = false;
    let stopped = false;
    const stop = async () => {
      this.pause();
      stopped = true;
      return { value: undefined, done: true };
    };
    const next = () => {
      if (stopped) return stop();
      const res = this.read();
      if (res !== null) return Promise.resolve({ done: false, value: res });
      if (this[EOF]) return stop();
      let resolve;
      let reject;
      const onerr = (er) => {
        this.off("data", ondata);
        this.off("end", onend);
        this.off(DESTROYED, ondestroy);
        stop();
        reject(er);
      };
      const ondata = (value) => {
        this.off("error", onerr);
        this.off("end", onend);
        this.off(DESTROYED, ondestroy);
        this.pause();
        resolve({ value, done: !!this[EOF] });
      };
      const onend = () => {
        this.off("error", onerr);
        this.off("data", ondata);
        this.off(DESTROYED, ondestroy);
        stop();
        resolve({ done: true, value: undefined });
      };
      const ondestroy = () => onerr(new Error("stream destroyed"));
      return new Promise((res, rej) => {
        reject = rej;
        resolve = res;
        this.once(DESTROYED, ondestroy);
        this.once("error", onerr);
        this.once("end", onend);
        this.once("data", ondata);
      });
    };
    return {
      next,
      throw: stop,
      return: stop,
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }
  [Symbol.iterator]() {
    this[DISCARDED] = false;
    let stopped = false;
    const stop = () => {
      this.pause();
      this.off(ERROR, stop);
      this.off(DESTROYED, stop);
      this.off("end", stop);
      stopped = true;
      return { done: true, value: undefined };
    };
    const next = () => {
      if (stopped) return stop();
      const value = this.read();
      return value === null ? stop() : { done: false, value };
    };
    this.once("end", stop);
    this.once(ERROR, stop);
    this.once(DESTROYED, stop);
    return {
      next,
      throw: stop,
      return: stop,
      [Symbol.iterator]() {
        return this;
      },
    };
  }
  destroy(er) {
    if (this[DESTROYED]) {
      if (er) this.emit("error", er);
      else this.emit(DESTROYED);
      return this;
    }
    this[DESTROYED] = true;
    this[DISCARDED] = true;
    this[BUFFER].length = 0;
    this[BUFFERLENGTH] = 0;
    const wc = this;
    if (typeof wc.close === "function" && !this[CLOSED]) wc.close();
    if (er) this.emit("error", er);
    else this.emit(DESTROYED);
    return this;
  }
  static get isStream() {
    return isStream;
  }
}
const writev = external_fs_namespaceObject.writev;
const _autoClose = Symbol("_autoClose");
const _close = Symbol("_close");
const _ended = Symbol("_ended");
const _fd = Symbol("_fd");
const _finished = Symbol("_finished");
const _flags = Symbol("_flags");
const _flush = Symbol("_flush");
const _handleChunk = Symbol("_handleChunk");
const _makeBuf = Symbol("_makeBuf");
const _mode = Symbol("_mode");
const _needDrain = Symbol("_needDrain");
const _onerror = Symbol("_onerror");
const _onopen = Symbol("_onopen");
const _onread = Symbol("_onread");
const _onwrite = Symbol("_onwrite");
const _open = Symbol("_open");
const _path = Symbol("_path");
const _pos = Symbol("_pos");
const _queue = Symbol("_queue");
const _read = Symbol("_read");
const _readSize = Symbol("_readSize");
const _reading = Symbol("_reading");
const _remain = Symbol("_remain");
const _size = Symbol("_size");
const _write = Symbol("_write");
const _writing = Symbol("_writing");
const _defaultFlag = Symbol("_defaultFlag");
const _errored = Symbol("_errored");
class ReadStream extends Minipass {
  [_errored] = false;
  [_fd];
  [_path];
  [_readSize];
  [_reading] = false;
  [_size];
  [_remain];
  [_autoClose];
  constructor(path, opt) {
    opt = opt || {};
    super(opt);
    this.readable = true;
    this.writable = false;
    if (typeof path !== "string") {
      throw new TypeError("path must be a string");
    }
    this[_errored] = false;
    this[_fd] = typeof opt.fd === "number" ? opt.fd : undefined;
    this[_path] = path;
    this[_readSize] = opt.readSize || 16 * 1024 * 1024;
    this[_reading] = false;
    this[_size] = typeof opt.size === "number" ? opt.size : Infinity;
    this[_remain] = this[_size];
    this[_autoClose] =
      typeof opt.autoClose === "boolean" ? opt.autoClose : true;
    if (typeof this[_fd] === "number") {
      this[_read]();
    } else {
      this[_open]();
    }
  }
  get fd() {
    return this[_fd];
  }
  get path() {
    return this[_path];
  }
  write() {
    throw new TypeError("this is a readable stream");
  }
  end() {
    throw new TypeError("this is a readable stream");
  }
  [_open]() {
    external_fs_namespaceObject.open(this[_path], "r", (er, fd) =>
      this[_onopen](er, fd),
    );
  }
  [_onopen](er, fd) {
    if (er) {
      this[_onerror](er);
    } else {
      this[_fd] = fd;
      this.emit("open", fd);
      this[_read]();
    }
  }
  [_makeBuf]() {
    return Buffer.allocUnsafe(Math.min(this[_readSize], this[_remain]));
  }
  [_read]() {
    if (!this[_reading]) {
      this[_reading] = true;
      const buf = this[_makeBuf]();
      if (buf.length === 0) {
        return process.nextTick(() => this[_onread](null, 0, buf));
      }
      external_fs_namespaceObject.read(
        this[_fd],
        buf,
        0,
        buf.length,
        null,
        (er, br, b) => this[_onread](er, br, b),
      );
    }
  }
  [_onread](er, br, buf) {
    this[_reading] = false;
    if (er) {
      this[_onerror](er);
    } else if (this[_handleChunk](br, buf)) {
      this[_read]();
    }
  }
  [_close]() {
    if (this[_autoClose] && typeof this[_fd] === "number") {
      const fd = this[_fd];
      this[_fd] = undefined;
      external_fs_namespaceObject.close(fd, (er) =>
        er ? this.emit("error", er) : this.emit("close"),
      );
    }
  }
  [_onerror](er) {
    this[_reading] = true;
    this[_close]();
    this.emit("error", er);
  }
  [_handleChunk](br, buf) {
    let ret = false;
    this[_remain] -= br;
    if (br > 0) {
      ret = super.write(br < buf.length ? buf.subarray(0, br) : buf);
    }
    if (br === 0 || this[_remain] <= 0) {
      ret = false;
      this[_close]();
      super.end();
    }
    return ret;
  }
  emit(ev, ...args) {
    switch (ev) {
      case "prefinish":
      case "finish":
        return false;
      case "drain":
        if (typeof this[_fd] === "number") {
          this[_read]();
        }
        return false;
      case "error":
        if (this[_errored]) {
          return false;
        }
        this[_errored] = true;
        return super.emit(ev, ...args);
      default:
        return super.emit(ev, ...args);
    }
  }
}
class ReadStreamSync extends ReadStream {
  [_open]() {
    let threw = true;
    try {
      this[_onopen](
        null,
        external_fs_namespaceObject.openSync(this[_path], "r"),
      );
      threw = false;
    } finally {
      if (threw) {
        this[_close]();
      }
    }
  }
  [_read]() {
    let threw = true;
    try {
      if (!this[_reading]) {
        this[_reading] = true;
        do {
          const buf = this[_makeBuf]();
          const br =
            buf.length === 0
              ? 0
              : external_fs_namespaceObject.readSync(
                  this[_fd],
                  buf,
                  0,
                  buf.length,
                  null,
                );
          if (!this[_handleChunk](br, buf)) {
            break;
          }
        } while (true);
        this[_reading] = false;
      }
      threw = false;
    } finally {
      if (threw) {
        this[_close]();
      }
    }
  }
  [_close]() {
    if (this[_autoClose] && typeof this[_fd] === "number") {
      const fd = this[_fd];
      this[_fd] = undefined;
      external_fs_namespaceObject.closeSync(fd);
      this.emit("close");
    }
  }
}
class WriteStream extends external_events_namespaceObject {
  readable = false;
  writable = true;
  [_errored] = false;
  [_writing] = false;
  [_ended] = false;
  [_queue] = [];
  [_needDrain] = false;
  [_path];
  [_mode];
  [_autoClose];
  [_fd];
  [_defaultFlag];
  [_flags];
  [_finished] = false;
  [_pos];
  constructor(path, opt) {
    opt = opt || {};
    super(opt);
    this[_path] = path;
    this[_fd] = typeof opt.fd === "number" ? opt.fd : undefined;
    this[_mode] = opt.mode === undefined ? 438 : opt.mode;
    this[_pos] = typeof opt.start === "number" ? opt.start : undefined;
    this[_autoClose] =
      typeof opt.autoClose === "boolean" ? opt.autoClose : true;
    const defaultFlag = this[_pos] !== undefined ? "r+" : "w";
    this[_defaultFlag] = opt.flags === undefined;
    this[_flags] = opt.flags === undefined ? defaultFlag : opt.flags;
    if (this[_fd] === undefined) {
      this[_open]();
    }
  }
  emit(ev, ...args) {
    if (ev === "error") {
      if (this[_errored]) {
        return false;
      }
      this[_errored] = true;
    }
    return super.emit(ev, ...args);
  }
  get fd() {
    return this[_fd];
  }
  get path() {
    return this[_path];
  }
  [_onerror](er) {
    this[_close]();
    this[_writing] = true;
    this.emit("error", er);
  }
  [_open]() {
    external_fs_namespaceObject.open(
      this[_path],
      this[_flags],
      this[_mode],
      (er, fd) => this[_onopen](er, fd),
    );
  }
  [_onopen](er, fd) {
    if (
      this[_defaultFlag] &&
      this[_flags] === "r+" &&
      er &&
      er.code === "ENOENT"
    ) {
      this[_flags] = "w";
      this[_open]();
    } else if (er) {
      this[_onerror](er);
    } else {
      this[_fd] = fd;
      this.emit("open", fd);
      if (!this[_writing]) {
        this[_flush]();
      }
    }
  }
  end(buf, enc) {
    if (buf) {
      this.write(buf, enc);
    }
    this[_ended] = true;
    if (
      !this[_writing] &&
      !this[_queue].length &&
      typeof this[_fd] === "number"
    ) {
      this[_onwrite](null, 0);
    }
    return this;
  }
  write(buf, enc) {
    if (typeof buf === "string") {
      buf = Buffer.from(buf, enc);
    }
    if (this[_ended]) {
      this.emit("error", new Error("write() after end()"));
      return false;
    }
    if (this[_fd] === undefined || this[_writing] || this[_queue].length) {
      this[_queue].push(buf);
      this[_needDrain] = true;
      return false;
    }
    this[_writing] = true;
    this[_write](buf);
    return true;
  }
  [_write](buf) {
    external_fs_namespaceObject.write(
      this[_fd],
      buf,
      0,
      buf.length,
      this[_pos],
      (er, bw) => this[_onwrite](er, bw),
    );
  }
  [_onwrite](er, bw) {
    if (er) {
      this[_onerror](er);
    } else {
      if (this[_pos] !== undefined && typeof bw === "number") {
        this[_pos] += bw;
      }
      if (this[_queue].length) {
        this[_flush]();
      } else {
        this[_writing] = false;
        if (this[_ended] && !this[_finished]) {
          this[_finished] = true;
          this[_close]();
          this.emit("finish");
        } else if (this[_needDrain]) {
          this[_needDrain] = false;
          this.emit("drain");
        }
      }
    }
  }
  [_flush]() {
    if (this[_queue].length === 0) {
      if (this[_ended]) {
        this[_onwrite](null, 0);
      }
    } else if (this[_queue].length === 1) {
      this[_write](this[_queue].pop());
    } else {
      const iovec = this[_queue];
      this[_queue] = [];
      writev(this[_fd], iovec, this[_pos], (er, bw) => this[_onwrite](er, bw));
    }
  }
  [_close]() {
    if (this[_autoClose] && typeof this[_fd] === "number") {
      const fd = this[_fd];
      this[_fd] = undefined;
      external_fs_namespaceObject.close(fd, (er) =>
        er ? this.emit("error", er) : this.emit("close"),
      );
    }
  }
}
class WriteStreamSync extends WriteStream {
  [_open]() {
    let fd;
    if (this[_defaultFlag] && this[_flags] === "r+") {
      try {
        fd = external_fs_namespaceObject.openSync(
          this[_path],
          this[_flags],
          this[_mode],
        );
      } catch (er) {
        if (er?.code === "ENOENT") {
          this[_flags] = "w";
          return this[_open]();
        } else {
          throw er;
        }
      }
    } else {
      fd = external_fs_namespaceObject.openSync(
        this[_path],
        this[_flags],
        this[_mode],
      );
    }
    this[_onopen](null, fd);
  }
  [_close]() {
    if (this[_autoClose] && typeof this[_fd] === "number") {
      const fd = this[_fd];
      this[_fd] = undefined;
      external_fs_namespaceObject.closeSync(fd);
      this.emit("close");
    }
  }
  [_write](buf) {
    let threw = true;
    try {
      this[_onwrite](
        null,
        external_fs_namespaceObject.writeSync(
          this[_fd],
          buf,
          0,
          buf.length,
          this[_pos],
        ),
      );
      threw = false;
    } finally {
      if (threw) {
        try {
          this[_close]();
        } catch {}
      }
    }
  }
}
const external_node_path_namespaceObject = __WEBPACK_EXTERNAL_createRequire(
  import.meta.url,
)("node:path");
const external_node_fs_namespaceObject = __WEBPACK_EXTERNAL_createRequire(
  import.meta.url,
)("node:fs");
const external_path_namespaceObject = __WEBPACK_EXTERNAL_createRequire(
  import.meta.url,
)("path");
const argmap = new Map([
  ["C", "cwd"],
  ["f", "file"],
  ["z", "gzip"],
  ["P", "preservePaths"],
  ["U", "unlink"],
  ["strip-components", "strip"],
  ["stripComponents", "strip"],
  ["keep-newer", "newer"],
  ["keepNewer", "newer"],
  ["keep-newer-files", "newer"],
  ["keepNewerFiles", "newer"],
  ["k", "keep"],
  ["keep-existing", "keep"],
  ["keepExisting", "keep"],
  ["m", "noMtime"],
  ["no-mtime", "noMtime"],
  ["p", "preserveOwner"],
  ["L", "follow"],
  ["h", "follow"],
  ["onentry", "onReadEntry"],
]);
const isSyncFile = (o) => !!o.sync && !!o.file;
const isAsyncFile = (o) => !o.sync && !!o.file;
const isSyncNoFile = (o) => !!o.sync && !o.file;
const isAsyncNoFile = (o) => !o.sync && !o.file;
const isSync = (o) => !!o.sync;
const isAsync = (o) => !o.sync;
const isFile = (o) => !!o.file;
const isNoFile = (o) => !o.file;
const dealiasKey = (k) => {
  const d = argmap.get(k);
  if (d) return d;
  return k;
};
const dealias = (opt = {}) => {
  if (!opt) return {};
  const result = {};
  for (const [key, v] of Object.entries(opt)) {
    const k = dealiasKey(key);
    result[k] = v;
  }
  if (result.chmod === undefined && result.noChmod === false) {
    result.chmod = true;
  }
  delete result.noChmod;
  return result;
};
const makeCommand = (syncFile, asyncFile, syncNoFile, asyncNoFile, validate) =>
  Object.assign(
    (opt_ = [], entries, cb) => {
      if (Array.isArray(opt_)) {
        entries = opt_;
        opt_ = {};
      }
      if (typeof entries === "function") {
        cb = entries;
        entries = undefined;
      }
      if (!entries) {
        entries = [];
      } else {
        entries = Array.from(entries);
      }
      const opt = dealias(opt_);
      validate?.(opt, entries);
      if (isSyncFile(opt)) {
        if (typeof cb === "function") {
          throw new TypeError("callback not supported for sync tar functions");
        }
        return syncFile(opt, entries);
      } else if (isAsyncFile(opt)) {
        const p = asyncFile(opt, entries);
        const c = cb ? cb : undefined;
        return c ? p.then(() => c(), c) : p;
      } else if (isSyncNoFile(opt)) {
        if (typeof cb === "function") {
          throw new TypeError("callback not supported for sync tar functions");
        }
        return syncNoFile(opt, entries);
      } else if (isAsyncNoFile(opt)) {
        if (typeof cb === "function") {
          throw new TypeError("callback only supported with file option");
        }
        return asyncNoFile(opt, entries);
      } else {
        throw new Error("impossible options??");
      }
    },
    { syncFile, asyncFile, syncNoFile, asyncNoFile, validate },
  );
const external_assert_namespaceObject = __WEBPACK_EXTERNAL_createRequire(
  import.meta.url,
)("assert");
const external_buffer_namespaceObject = __WEBPACK_EXTERNAL_createRequire(
  import.meta.url,
)("buffer");
const external_zlib_namespaceObject = __WEBPACK_EXTERNAL_createRequire(
  import.meta.url,
)("zlib");
const realZlibConstants = external_zlib_namespaceObject.constants || {
  ZLIB_VERNUM: 4736,
};
const constants = Object.freeze(
  Object.assign(
    Object.create(null),
    {
      Z_NO_FLUSH: 0,
      Z_PARTIAL_FLUSH: 1,
      Z_SYNC_FLUSH: 2,
      Z_FULL_FLUSH: 3,
      Z_FINISH: 4,
      Z_BLOCK: 5,
      Z_OK: 0,
      Z_STREAM_END: 1,
      Z_NEED_DICT: 2,
      Z_ERRNO: -1,
      Z_STREAM_ERROR: -2,
      Z_DATA_ERROR: -3,
      Z_MEM_ERROR: -4,
      Z_BUF_ERROR: -5,
      Z_VERSION_ERROR: -6,
      Z_NO_COMPRESSION: 0,
      Z_BEST_SPEED: 1,
      Z_BEST_COMPRESSION: 9,
      Z_DEFAULT_COMPRESSION: -1,
      Z_FILTERED: 1,
      Z_HUFFMAN_ONLY: 2,
      Z_RLE: 3,
      Z_FIXED: 4,
      Z_DEFAULT_STRATEGY: 0,
      DEFLATE: 1,
      INFLATE: 2,
      GZIP: 3,
      GUNZIP: 4,
      DEFLATERAW: 5,
      INFLATERAW: 6,
      UNZIP: 7,
      BROTLI_DECODE: 8,
      BROTLI_ENCODE: 9,
      Z_MIN_WINDOWBITS: 8,
      Z_MAX_WINDOWBITS: 15,
      Z_DEFAULT_WINDOWBITS: 15,
      Z_MIN_CHUNK: 64,
      Z_MAX_CHUNK: Infinity,
      Z_DEFAULT_CHUNK: 16384,
      Z_MIN_MEMLEVEL: 1,
      Z_MAX_MEMLEVEL: 9,
      Z_DEFAULT_MEMLEVEL: 8,
      Z_MIN_LEVEL: -1,
      Z_MAX_LEVEL: 9,
      Z_DEFAULT_LEVEL: -1,
      BROTLI_OPERATION_PROCESS: 0,
      BROTLI_OPERATION_FLUSH: 1,
      BROTLI_OPERATION_FINISH: 2,
      BROTLI_OPERATION_EMIT_METADATA: 3,
      BROTLI_MODE_GENERIC: 0,
      BROTLI_MODE_TEXT: 1,
      BROTLI_MODE_FONT: 2,
      BROTLI_DEFAULT_MODE: 0,
      BROTLI_MIN_QUALITY: 0,
      BROTLI_MAX_QUALITY: 11,
      BROTLI_DEFAULT_QUALITY: 11,
      BROTLI_MIN_WINDOW_BITS: 10,
      BROTLI_MAX_WINDOW_BITS: 24,
      BROTLI_LARGE_MAX_WINDOW_BITS: 30,
      BROTLI_DEFAULT_WINDOW: 22,
      BROTLI_MIN_INPUT_BLOCK_BITS: 16,
      BROTLI_MAX_INPUT_BLOCK_BITS: 24,
      BROTLI_PARAM_MODE: 0,
      BROTLI_PARAM_QUALITY: 1,
      BROTLI_PARAM_LGWIN: 2,
      BROTLI_PARAM_LGBLOCK: 3,
      BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING: 4,
      BROTLI_PARAM_SIZE_HINT: 5,
      BROTLI_PARAM_LARGE_WINDOW: 6,
      BROTLI_PARAM_NPOSTFIX: 7,
      BROTLI_PARAM_NDIRECT: 8,
      BROTLI_DECODER_RESULT_ERROR: 0,
      BROTLI_DECODER_RESULT_SUCCESS: 1,
      BROTLI_DECODER_RESULT_NEEDS_MORE_INPUT: 2,
      BROTLI_DECODER_RESULT_NEEDS_MORE_OUTPUT: 3,
      BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION: 0,
      BROTLI_DECODER_PARAM_LARGE_WINDOW: 1,
      BROTLI_DECODER_NO_ERROR: 0,
      BROTLI_DECODER_SUCCESS: 1,
      BROTLI_DECODER_NEEDS_MORE_INPUT: 2,
      BROTLI_DECODER_NEEDS_MORE_OUTPUT: 3,
      BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_NIBBLE: -1,
      BROTLI_DECODER_ERROR_FORMAT_RESERVED: -2,
      BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_META_NIBBLE: -3,
      BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_ALPHABET: -4,
      BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_SAME: -5,
      BROTLI_DECODER_ERROR_FORMAT_CL_SPACE: -6,
      BROTLI_DECODER_ERROR_FORMAT_HUFFMAN_SPACE: -7,
      BROTLI_DECODER_ERROR_FORMAT_CONTEXT_MAP_REPEAT: -8,
      BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_1: -9,
      BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_2: -10,
      BROTLI_DECODER_ERROR_FORMAT_TRANSFORM: -11,
      BROTLI_DECODER_ERROR_FORMAT_DICTIONARY: -12,
      BROTLI_DECODER_ERROR_FORMAT_WINDOW_BITS: -13,
      BROTLI_DECODER_ERROR_FORMAT_PADDING_1: -14,
      BROTLI_DECODER_ERROR_FORMAT_PADDING_2: -15,
      BROTLI_DECODER_ERROR_FORMAT_DISTANCE: -16,
      BROTLI_DECODER_ERROR_DICTIONARY_NOT_SET: -19,
      BROTLI_DECODER_ERROR_INVALID_ARGUMENTS: -20,
      BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MODES: -21,
      BROTLI_DECODER_ERROR_ALLOC_TREE_GROUPS: -22,
      BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MAP: -25,
      BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_1: -26,
      BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_2: -27,
      BROTLI_DECODER_ERROR_ALLOC_BLOCK_TYPE_TREES: -30,
      BROTLI_DECODER_ERROR_UNREACHABLE: -31,
    },
    realZlibConstants,
  ),
);
const OriginalBufferConcat = external_buffer_namespaceObject.Buffer.concat;
const _superWrite = Symbol("_superWrite");
class ZlibError extends Error {
  code;
  errno;
  constructor(err) {
    super("zlib: " + err.message);
    this.code = err.code;
    this.errno = err.errno;
    if (!this.code) this.code = "ZLIB_ERROR";
    this.message = "zlib: " + err.message;
    Error.captureStackTrace(this, this.constructor);
  }
  get name() {
    return "ZlibError";
  }
}
const _flushFlag = Symbol("flushFlag");
class ZlibBase extends Minipass {
  #sawError = false;
  #ended = false;
  #flushFlag;
  #finishFlushFlag;
  #fullFlushFlag;
  #handle;
  #onError;
  get sawError() {
    return this.#sawError;
  }
  get handle() {
    return this.#handle;
  }
  get flushFlag() {
    return this.#flushFlag;
  }
  constructor(opts, mode) {
    if (!opts || typeof opts !== "object")
      throw new TypeError("invalid options for ZlibBase constructor");
    super(opts);
    this.#flushFlag = opts.flush ?? 0;
    this.#finishFlushFlag = opts.finishFlush ?? 0;
    this.#fullFlushFlag = opts.fullFlushFlag ?? 0;
    try {
      this.#handle = new external_zlib_namespaceObject[mode](opts);
    } catch (er) {
      throw new ZlibError(er);
    }
    this.#onError = (err) => {
      if (this.#sawError) return;
      this.#sawError = true;
      this.close();
      this.emit("error", err);
    };
    this.#handle?.on("error", (er) => this.#onError(new ZlibError(er)));
    this.once("end", () => this.close);
  }
  close() {
    if (this.#handle) {
      this.#handle.close();
      this.#handle = undefined;
      this.emit("close");
    }
  }
  reset() {
    if (!this.#sawError) {
      external_assert_namespaceObject(this.#handle, "zlib binding closed");
      return this.#handle.reset?.();
    }
  }
  flush(flushFlag) {
    if (this.ended) return;
    if (typeof flushFlag !== "number") flushFlag = this.#fullFlushFlag;
    this.write(
      Object.assign(external_buffer_namespaceObject.Buffer.alloc(0), {
        [_flushFlag]: flushFlag,
      }),
    );
  }
  end(chunk, encoding, cb) {
    if (typeof chunk === "function") {
      cb = chunk;
      encoding = undefined;
      chunk = undefined;
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = undefined;
    }
    if (chunk) {
      if (encoding) this.write(chunk, encoding);
      else this.write(chunk);
    }
    this.flush(this.#finishFlushFlag);
    this.#ended = true;
    return super.end(cb);
  }
  get ended() {
    return this.#ended;
  }
  [_superWrite](data) {
    return super.write(data);
  }
  write(chunk, encoding, cb) {
    if (typeof encoding === "function") (cb = encoding), (encoding = "utf8");
    if (typeof chunk === "string")
      chunk = external_buffer_namespaceObject.Buffer.from(chunk, encoding);
    if (this.#sawError) return;
    external_assert_namespaceObject(this.#handle, "zlib binding closed");
    const nativeHandle = this.#handle._handle;
    const originalNativeClose = nativeHandle.close;
    nativeHandle.close = () => {};
    const originalClose = this.#handle.close;
    this.#handle.close = () => {};
    external_buffer_namespaceObject.Buffer.concat = (args) => args;
    let result = undefined;
    try {
      const flushFlag =
        typeof chunk[_flushFlag] === "number"
          ? chunk[_flushFlag]
          : this.#flushFlag;
      result = this.#handle._processChunk(chunk, flushFlag);
      external_buffer_namespaceObject.Buffer.concat = OriginalBufferConcat;
    } catch (err) {
      external_buffer_namespaceObject.Buffer.concat = OriginalBufferConcat;
      this.#onError(new ZlibError(err));
    } finally {
      if (this.#handle) {
        this.#handle._handle = nativeHandle;
        nativeHandle.close = originalNativeClose;
        this.#handle.close = originalClose;
        this.#handle.removeAllListeners("error");
      }
    }
    if (this.#handle)
      this.#handle.on("error", (er) => this.#onError(new ZlibError(er)));
    let writeReturn;
    if (result) {
      if (Array.isArray(result) && result.length > 0) {
        const r = result[0];
        writeReturn = this[_superWrite](
          external_buffer_namespaceObject.Buffer.from(r),
        );
        for (let i = 1; i < result.length; i++) {
          writeReturn = this[_superWrite](result[i]);
        }
      } else {
        writeReturn = this[_superWrite](
          external_buffer_namespaceObject.Buffer.from(result),
        );
      }
    }
    if (cb) cb();
    return writeReturn;
  }
}
class Zlib extends ZlibBase {
  #level;
  #strategy;
  constructor(opts, mode) {
    opts = opts || {};
    opts.flush = opts.flush || constants.Z_NO_FLUSH;
    opts.finishFlush = opts.finishFlush || constants.Z_FINISH;
    opts.fullFlushFlag = constants.Z_FULL_FLUSH;
    super(opts, mode);
    this.#level = opts.level;
    this.#strategy = opts.strategy;
  }
  params(level, strategy) {
    if (this.sawError) return;
    if (!this.handle)
      throw new Error("cannot switch params when binding is closed");
    if (!this.handle.params)
      throw new Error("not supported in this implementation");
    if (this.#level !== level || this.#strategy !== strategy) {
      this.flush(constants.Z_SYNC_FLUSH);
      external_assert_namespaceObject(this.handle, "zlib binding closed");
      const origFlush = this.handle.flush;
      this.handle.flush = (flushFlag, cb) => {
        if (typeof flushFlag === "function") {
          cb = flushFlag;
          flushFlag = this.flushFlag;
        }
        this.flush(flushFlag);
        cb?.();
      };
      try {
        this.handle.params(level, strategy);
      } finally {
        this.handle.flush = origFlush;
      }
      if (this.handle) {
        this.#level = level;
        this.#strategy = strategy;
      }
    }
  }
}
class Deflate extends (null && Zlib) {
  constructor(opts) {
    super(opts, "Deflate");
  }
}
class Inflate extends (null && Zlib) {
  constructor(opts) {
    super(opts, "Inflate");
  }
}
class Gzip extends Zlib {
  #portable;
  constructor(opts) {
    super(opts, "Gzip");
    this.#portable = opts && !!opts.portable;
  }
  [_superWrite](data) {
    if (!this.#portable) return super[_superWrite](data);
    this.#portable = false;
    data[9] = 255;
    return super[_superWrite](data);
  }
}
class Gunzip extends (null && Zlib) {
  constructor(opts) {
    super(opts, "Gunzip");
  }
}
class DeflateRaw extends (null && Zlib) {
  constructor(opts) {
    super(opts, "DeflateRaw");
  }
}
class InflateRaw extends (null && Zlib) {
  constructor(opts) {
    super(opts, "InflateRaw");
  }
}
class Unzip extends Zlib {
  constructor(opts) {
    super(opts, "Unzip");
  }
}
class Brotli extends ZlibBase {
  constructor(opts, mode) {
    opts = opts || {};
    opts.flush = opts.flush || constants.BROTLI_OPERATION_PROCESS;
    opts.finishFlush = opts.finishFlush || constants.BROTLI_OPERATION_FINISH;
    opts.fullFlushFlag = constants.BROTLI_OPERATION_FLUSH;
    super(opts, mode);
  }
}
class BrotliCompress extends Brotli {
  constructor(opts) {
    super(opts, "BrotliCompress");
  }
}
class BrotliDecompress extends Brotli {
  constructor(opts) {
    super(opts, "BrotliDecompress");
  }
}
class Yallist {
  tail;
  head;
  length = 0;
  static create(list = []) {
    return new Yallist(list);
  }
  constructor(list = []) {
    for (const item of list) {
      this.push(item);
    }
  }
  *[Symbol.iterator]() {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value;
    }
  }
  removeNode(node) {
    if (node.list !== this) {
      throw new Error("removing node which does not belong to this list");
    }
    const next = node.next;
    const prev = node.prev;
    if (next) {
      next.prev = prev;
    }
    if (prev) {
      prev.next = next;
    }
    if (node === this.head) {
      this.head = next;
    }
    if (node === this.tail) {
      this.tail = prev;
    }
    this.length--;
    node.next = undefined;
    node.prev = undefined;
    node.list = undefined;
    return next;
  }
  unshiftNode(node) {
    if (node === this.head) {
      return;
    }
    if (node.list) {
      node.list.removeNode(node);
    }
    const head = this.head;
    node.list = this;
    node.next = head;
    if (head) {
      head.prev = node;
    }
    this.head = node;
    if (!this.tail) {
      this.tail = node;
    }
    this.length++;
  }
  pushNode(node) {
    if (node === this.tail) {
      return;
    }
    if (node.list) {
      node.list.removeNode(node);
    }
    const tail = this.tail;
    node.list = this;
    node.prev = tail;
    if (tail) {
      tail.next = node;
    }
    this.tail = node;
    if (!this.head) {
      this.head = node;
    }
    this.length++;
  }
  push(...args) {
    for (let i = 0, l = args.length; i < l; i++) {
      push(this, args[i]);
    }
    return this.length;
  }
  unshift(...args) {
    for (var i = 0, l = args.length; i < l; i++) {
      unshift(this, args[i]);
    }
    return this.length;
  }
  pop() {
    if (!this.tail) {
      return undefined;
    }
    const res = this.tail.value;
    const t = this.tail;
    this.tail = this.tail.prev;
    if (this.tail) {
      this.tail.next = undefined;
    } else {
      this.head = undefined;
    }
    t.list = undefined;
    this.length--;
    return res;
  }
  shift() {
    if (!this.head) {
      return undefined;
    }
    const res = this.head.value;
    const h = this.head;
    this.head = this.head.next;
    if (this.head) {
      this.head.prev = undefined;
    } else {
      this.tail = undefined;
    }
    h.list = undefined;
    this.length--;
    return res;
  }
  forEach(fn, thisp) {
    thisp = thisp || this;
    for (let walker = this.head, i = 0; !!walker; i++) {
      fn.call(thisp, walker.value, i, this);
      walker = walker.next;
    }
  }
  forEachReverse(fn, thisp) {
    thisp = thisp || this;
    for (let walker = this.tail, i = this.length - 1; !!walker; i--) {
      fn.call(thisp, walker.value, i, this);
      walker = walker.prev;
    }
  }
  get(n) {
    let i = 0;
    let walker = this.head;
    for (; !!walker && i < n; i++) {
      walker = walker.next;
    }
    if (i === n && !!walker) {
      return walker.value;
    }
  }
  getReverse(n) {
    let i = 0;
    let walker = this.tail;
    for (; !!walker && i < n; i++) {
      walker = walker.prev;
    }
    if (i === n && !!walker) {
      return walker.value;
    }
  }
  map(fn, thisp) {
    thisp = thisp || this;
    const res = new Yallist();
    for (let walker = this.head; !!walker; ) {
      res.push(fn.call(thisp, walker.value, this));
      walker = walker.next;
    }
    return res;
  }
  mapReverse(fn, thisp) {
    thisp = thisp || this;
    var res = new Yallist();
    for (let walker = this.tail; !!walker; ) {
      res.push(fn.call(thisp, walker.value, this));
      walker = walker.prev;
    }
    return res;
  }
  reduce(fn, initial) {
    let acc;
    let walker = this.head;
    if (arguments.length > 1) {
      acc = initial;
    } else if (this.head) {
      walker = this.head.next;
      acc = this.head.value;
    } else {
      throw new TypeError("Reduce of empty list with no initial value");
    }
    for (var i = 0; !!walker; i++) {
      acc = fn(acc, walker.value, i);
      walker = walker.next;
    }
    return acc;
  }
  reduceReverse(fn, initial) {
    let acc;
    let walker = this.tail;
    if (arguments.length > 1) {
      acc = initial;
    } else if (this.tail) {
      walker = this.tail.prev;
      acc = this.tail.value;
    } else {
      throw new TypeError("Reduce of empty list with no initial value");
    }
    for (let i = this.length - 1; !!walker; i--) {
      acc = fn(acc, walker.value, i);
      walker = walker.prev;
    }
    return acc;
  }
  toArray() {
    const arr = new Array(this.length);
    for (let i = 0, walker = this.head; !!walker; i++) {
      arr[i] = walker.value;
      walker = walker.next;
    }
    return arr;
  }
  toArrayReverse() {
    const arr = new Array(this.length);
    for (let i = 0, walker = this.tail; !!walker; i++) {
      arr[i] = walker.value;
      walker = walker.prev;
    }
    return arr;
  }
  slice(from = 0, to = this.length) {
    if (to < 0) {
      to += this.length;
    }
    if (from < 0) {
      from += this.length;
    }
    const ret = new Yallist();
    if (to < from || to < 0) {
      return ret;
    }
    if (from < 0) {
      from = 0;
    }
    if (to > this.length) {
      to = this.length;
    }
    let walker = this.head;
    let i = 0;
    for (i = 0; !!walker && i < from; i++) {
      walker = walker.next;
    }
    for (; !!walker && i < to; i++, walker = walker.next) {
      ret.push(walker.value);
    }
    return ret;
  }
  sliceReverse(from = 0, to = this.length) {
    if (to < 0) {
      to += this.length;
    }
    if (from < 0) {
      from += this.length;
    }
    const ret = new Yallist();
    if (to < from || to < 0) {
      return ret;
    }
    if (from < 0) {
      from = 0;
    }
    if (to > this.length) {
      to = this.length;
    }
    let i = this.length;
    let walker = this.tail;
    for (; !!walker && i > to; i--) {
      walker = walker.prev;
    }
    for (; !!walker && i > from; i--, walker = walker.prev) {
      ret.push(walker.value);
    }
    return ret;
  }
  splice(start, deleteCount = 0, ...nodes) {
    if (start > this.length) {
      start = this.length - 1;
    }
    if (start < 0) {
      start = this.length + start;
    }
    let walker = this.head;
    for (let i = 0; !!walker && i < start; i++) {
      walker = walker.next;
    }
    const ret = [];
    for (let i = 0; !!walker && i < deleteCount; i++) {
      ret.push(walker.value);
      walker = this.removeNode(walker);
    }
    if (!walker) {
      walker = this.tail;
    } else if (walker !== this.tail) {
      walker = walker.prev;
    }
    for (const v of nodes) {
      walker = insertAfter(this, walker, v);
    }
    return ret;
  }
  reverse() {
    const head = this.head;
    const tail = this.tail;
    for (let walker = head; !!walker; walker = walker.prev) {
      const p = walker.prev;
      walker.prev = walker.next;
      walker.next = p;
    }
    this.head = tail;
    this.tail = head;
    return this;
  }
}
function insertAfter(self, node, value) {
  const prev = node;
  const next = node ? node.next : self.head;
  const inserted = new Node(value, prev, next, self);
  if (inserted.next === undefined) {
    self.tail = inserted;
  }
  if (inserted.prev === undefined) {
    self.head = inserted;
  }
  self.length++;
  return inserted;
}
function push(self, item) {
  self.tail = new Node(item, self.tail, undefined, self);
  if (!self.head) {
    self.head = self.tail;
  }
  self.length++;
}
function unshift(self, item) {
  self.head = new Node(item, undefined, self.head, self);
  if (!self.tail) {
    self.tail = self.head;
  }
  self.length++;
}
class Node {
  list;
  next;
  prev;
  value;
  constructor(value, prev, next, list) {
    this.list = list;
    this.value = value;
    if (prev) {
      prev.next = this;
      this.prev = prev;
    } else {
      this.prev = undefined;
    }
    if (next) {
      next.prev = this;
      this.next = next;
    } else {
      this.next = undefined;
    }
  }
}
const encode = (num, buf) => {
  if (!Number.isSafeInteger(num)) {
    throw Error(
      "cannot encode number outside of javascript safe integer range",
    );
  } else if (num < 0) {
    encodeNegative(num, buf);
  } else {
    encodePositive(num, buf);
  }
  return buf;
};
const encodePositive = (num, buf) => {
  buf[0] = 128;
  for (var i = buf.length; i > 1; i--) {
    buf[i - 1] = num & 255;
    num = Math.floor(num / 256);
  }
};
const encodeNegative = (num, buf) => {
  buf[0] = 255;
  var flipped = false;
  num = num * -1;
  for (var i = buf.length; i > 1; i--) {
    var byte = num & 255;
    num = Math.floor(num / 256);
    if (flipped) {
      buf[i - 1] = onesComp(byte);
    } else if (byte === 0) {
      buf[i - 1] = 0;
    } else {
      flipped = true;
      buf[i - 1] = twosComp(byte);
    }
  }
};
const parse = (buf) => {
  const pre = buf[0];
  const value =
    pre === 128
      ? pos(buf.subarray(1, buf.length))
      : pre === 255
        ? twos(buf)
        : null;
  if (value === null) {
    throw Error("invalid base256 encoding");
  }
  if (!Number.isSafeInteger(value)) {
    throw Error("parsed number outside of javascript safe integer range");
  }
  return value;
};
const twos = (buf) => {
  var len = buf.length;
  var sum = 0;
  var flipped = false;
  for (var i = len - 1; i > -1; i--) {
    var byte = Number(buf[i]);
    var f;
    if (flipped) {
      f = onesComp(byte);
    } else if (byte === 0) {
      f = byte;
    } else {
      flipped = true;
      f = twosComp(byte);
    }
    if (f !== 0) {
      sum -= f * Math.pow(256, len - i - 1);
    }
  }
  return sum;
};
const pos = (buf) => {
  var len = buf.length;
  var sum = 0;
  for (var i = len - 1; i > -1; i--) {
    var byte = Number(buf[i]);
    if (byte !== 0) {
      sum += byte * Math.pow(256, len - i - 1);
    }
  }
  return sum;
};
const onesComp = (byte) => (255 ^ byte) & 255;
const twosComp = (byte) => ((255 ^ byte) + 1) & 255;
const isCode = (c) => types_name.has(c);
const isName = (c) => code.has(c);
const types_name = new Map([
  ["0", "File"],
  ["", "OldFile"],
  ["1", "Link"],
  ["2", "SymbolicLink"],
  ["3", "CharacterDevice"],
  ["4", "BlockDevice"],
  ["5", "Directory"],
  ["6", "FIFO"],
  ["7", "ContiguousFile"],
  ["g", "GlobalExtendedHeader"],
  ["x", "ExtendedHeader"],
  ["A", "SolarisACL"],
  ["D", "GNUDumpDir"],
  ["I", "Inode"],
  ["K", "NextFileHasLongLinkpath"],
  ["L", "NextFileHasLongPath"],
  ["M", "ContinuationFile"],
  ["N", "OldGnuLongPath"],
  ["S", "SparseFile"],
  ["V", "TapeVolumeHeader"],
  ["X", "OldExtendedHeader"],
]);
const code = new Map(Array.from(types_name).map((kv) => [kv[1], kv[0]]));
class Header {
  cksumValid = false;
  needPax = false;
  nullBlock = false;
  block;
  path;
  mode;
  uid;
  gid;
  size;
  cksum;
  #type = "Unsupported";
  linkpath;
  uname;
  gname;
  devmaj = 0;
  devmin = 0;
  atime;
  ctime;
  mtime;
  charset;
  comment;
  constructor(data, off = 0, ex, gex) {
    if (Buffer.isBuffer(data)) {
      this.decode(data, off || 0, ex, gex);
    } else if (data) {
      this.#slurp(data);
    }
  }
  decode(buf, off, ex, gex) {
    if (!off) {
      off = 0;
    }
    if (!buf || !(buf.length >= off + 512)) {
      throw new Error("need 512 bytes for header");
    }
    this.path = decString(buf, off, 100);
    this.mode = decNumber(buf, off + 100, 8);
    this.uid = decNumber(buf, off + 108, 8);
    this.gid = decNumber(buf, off + 116, 8);
    this.size = decNumber(buf, off + 124, 12);
    this.mtime = decDate(buf, off + 136, 12);
    this.cksum = decNumber(buf, off + 148, 12);
    if (gex) this.#slurp(gex, true);
    if (ex) this.#slurp(ex);
    const t = decString(buf, off + 156, 1);
    if (isCode(t)) {
      this.#type = t || "0";
    }
    if (this.#type === "0" && this.path.slice(-1) === "/") {
      this.#type = "5";
    }
    if (this.#type === "5") {
      this.size = 0;
    }
    this.linkpath = decString(buf, off + 157, 100);
    if (buf.subarray(off + 257, off + 265).toString() === "ustar\x0000") {
      this.uname = decString(buf, off + 265, 32);
      this.gname = decString(buf, off + 297, 32);
      this.devmaj = decNumber(buf, off + 329, 8) ?? 0;
      this.devmin = decNumber(buf, off + 337, 8) ?? 0;
      if (buf[off + 475] !== 0) {
        const prefix = decString(buf, off + 345, 155);
        this.path = prefix + "/" + this.path;
      } else {
        const prefix = decString(buf, off + 345, 130);
        if (prefix) {
          this.path = prefix + "/" + this.path;
        }
        this.atime = decDate(buf, off + 476, 12);
        this.ctime = decDate(buf, off + 488, 12);
      }
    }
    let sum = 8 * 32;
    for (let i = off; i < off + 148; i++) {
      sum += buf[i];
    }
    for (let i = off + 156; i < off + 512; i++) {
      sum += buf[i];
    }
    this.cksumValid = sum === this.cksum;
    if (this.cksum === undefined && sum === 8 * 32) {
      this.nullBlock = true;
    }
  }
  #slurp(ex, gex = false) {
    Object.assign(
      this,
      Object.fromEntries(
        Object.entries(ex).filter(
          ([k, v]) =>
            !(
              v === null ||
              v === undefined ||
              (k === "path" && gex) ||
              (k === "linkpath" && gex) ||
              k === "global"
            ),
        ),
      ),
    );
  }
  encode(buf, off = 0) {
    if (!buf) {
      buf = this.block = Buffer.alloc(512);
    }
    if (this.#type === "Unsupported") {
      this.#type = "0";
    }
    if (!(buf.length >= off + 512)) {
      throw new Error("need 512 bytes for header");
    }
    const prefixSize = this.ctime || this.atime ? 130 : 155;
    const split = splitPrefix(this.path || "", prefixSize);
    const path = split[0];
    const prefix = split[1];
    this.needPax = !!split[2];
    this.needPax = encString(buf, off, 100, path) || this.needPax;
    this.needPax = encNumber(buf, off + 100, 8, this.mode) || this.needPax;
    this.needPax = encNumber(buf, off + 108, 8, this.uid) || this.needPax;
    this.needPax = encNumber(buf, off + 116, 8, this.gid) || this.needPax;
    this.needPax = encNumber(buf, off + 124, 12, this.size) || this.needPax;
    this.needPax = encDate(buf, off + 136, 12, this.mtime) || this.needPax;
    buf[off + 156] = this.#type.charCodeAt(0);
    this.needPax =
      encString(buf, off + 157, 100, this.linkpath) || this.needPax;
    buf.write("ustar\x0000", off + 257, 8);
    this.needPax = encString(buf, off + 265, 32, this.uname) || this.needPax;
    this.needPax = encString(buf, off + 297, 32, this.gname) || this.needPax;
    this.needPax = encNumber(buf, off + 329, 8, this.devmaj) || this.needPax;
    this.needPax = encNumber(buf, off + 337, 8, this.devmin) || this.needPax;
    this.needPax =
      encString(buf, off + 345, prefixSize, prefix) || this.needPax;
    if (buf[off + 475] !== 0) {
      this.needPax = encString(buf, off + 345, 155, prefix) || this.needPax;
    } else {
      this.needPax = encString(buf, off + 345, 130, prefix) || this.needPax;
      this.needPax = encDate(buf, off + 476, 12, this.atime) || this.needPax;
      this.needPax = encDate(buf, off + 488, 12, this.ctime) || this.needPax;
    }
    let sum = 8 * 32;
    for (let i = off; i < off + 148; i++) {
      sum += buf[i];
    }
    for (let i = off + 156; i < off + 512; i++) {
      sum += buf[i];
    }
    this.cksum = sum;
    encNumber(buf, off + 148, 8, this.cksum);
    this.cksumValid = true;
    return this.needPax;
  }
  get type() {
    return this.#type === "Unsupported"
      ? this.#type
      : types_name.get(this.#type);
  }
  get typeKey() {
    return this.#type;
  }
  set type(type) {
    const c = String(code.get(type));
    if (isCode(c) || c === "Unsupported") {
      this.#type = c;
    } else if (isCode(type)) {
      this.#type = type;
    } else {
      throw new TypeError("invalid entry type: " + type);
    }
  }
}
const splitPrefix = (p, prefixSize) => {
  const pathSize = 100;
  let pp = p;
  let prefix = "";
  let ret = undefined;
  const root = external_node_path_namespaceObject.posix.parse(p).root || ".";
  if (Buffer.byteLength(pp) < pathSize) {
    ret = [pp, prefix, false];
  } else {
    prefix = external_node_path_namespaceObject.posix.dirname(pp);
    pp = external_node_path_namespaceObject.posix.basename(pp);
    do {
      if (
        Buffer.byteLength(pp) <= pathSize &&
        Buffer.byteLength(prefix) <= prefixSize
      ) {
        ret = [pp, prefix, false];
      } else if (
        Buffer.byteLength(pp) > pathSize &&
        Buffer.byteLength(prefix) <= prefixSize
      ) {
        ret = [pp.slice(0, pathSize - 1), prefix, true];
      } else {
        pp = external_node_path_namespaceObject.posix.join(
          external_node_path_namespaceObject.posix.basename(prefix),
          pp,
        );
        prefix = external_node_path_namespaceObject.posix.dirname(prefix);
      }
    } while (prefix !== root && ret === undefined);
    if (!ret) {
      ret = [p.slice(0, pathSize - 1), "", true];
    }
  }
  return ret;
};
const decString = (buf, off, size) =>
  buf
    .subarray(off, off + size)
    .toString("utf8")
    .replace(/\0.*/, "");
const decDate = (buf, off, size) => numToDate(decNumber(buf, off, size));
const numToDate = (num) =>
  num === undefined ? undefined : new Date(num * 1e3);
const decNumber = (buf, off, size) =>
  Number(buf[off]) & 128
    ? parse(buf.subarray(off, off + size))
    : decSmallNumber(buf, off, size);
const nanUndef = (value) => (isNaN(value) ? undefined : value);
const decSmallNumber = (buf, off, size) =>
  nanUndef(
    parseInt(
      buf
        .subarray(off, off + size)
        .toString("utf8")
        .replace(/\0.*$/, "")
        .trim(),
      8,
    ),
  );
const MAXNUM = { 12: 8589934591, 8: 2097151 };
const encNumber = (buf, off, size, num) =>
  num === undefined
    ? false
    : num > MAXNUM[size] || num < 0
      ? (encode(num, buf.subarray(off, off + size)), true)
      : (encSmallNumber(buf, off, size, num), false);
const encSmallNumber = (buf, off, size, num) =>
  buf.write(octalString(num, size), off, size, "ascii");
const octalString = (num, size) => padOctal(Math.floor(num).toString(8), size);
const padOctal = (str, size) =>
  (str.length === size - 1
    ? str
    : new Array(size - str.length - 1).join("0") + str + " ") + "\0";
const encDate = (buf, off, size, date) =>
  date === undefined ? false : encNumber(buf, off, size, date.getTime() / 1e3);
const NULLS = new Array(156).join("\0");
const encString = (buf, off, size, str) =>
  str === undefined
    ? false
    : (buf.write(str + NULLS, off, size, "utf8"),
      str.length !== Buffer.byteLength(str) || str.length > size);
class Pax {
  atime;
  mtime;
  ctime;
  charset;
  comment;
  gid;
  uid;
  gname;
  uname;
  linkpath;
  dev;
  ino;
  nlink;
  path;
  size;
  mode;
  global;
  constructor(obj, global = false) {
    this.atime = obj.atime;
    this.charset = obj.charset;
    this.comment = obj.comment;
    this.ctime = obj.ctime;
    this.dev = obj.dev;
    this.gid = obj.gid;
    this.global = global;
    this.gname = obj.gname;
    this.ino = obj.ino;
    this.linkpath = obj.linkpath;
    this.mtime = obj.mtime;
    this.nlink = obj.nlink;
    this.path = obj.path;
    this.size = obj.size;
    this.uid = obj.uid;
    this.uname = obj.uname;
  }
  encode() {
    const body = this.encodeBody();
    if (body === "") {
      return Buffer.allocUnsafe(0);
    }
    const bodyLen = Buffer.byteLength(body);
    const bufLen = 512 * Math.ceil(1 + bodyLen / 512);
    const buf = Buffer.allocUnsafe(bufLen);
    for (let i = 0; i < 512; i++) {
      buf[i] = 0;
    }
    new Header({
      path: (
        "PaxHeader/" +
        (0, external_node_path_namespaceObject.basename)(this.path ?? "")
      ).slice(0, 99),
      mode: this.mode || 420,
      uid: this.uid,
      gid: this.gid,
      size: bodyLen,
      mtime: this.mtime,
      type: this.global ? "GlobalExtendedHeader" : "ExtendedHeader",
      linkpath: "",
      uname: this.uname || "",
      gname: this.gname || "",
      devmaj: 0,
      devmin: 0,
      atime: this.atime,
      ctime: this.ctime,
    }).encode(buf);
    buf.write(body, 512, bodyLen, "utf8");
    for (let i = bodyLen + 512; i < buf.length; i++) {
      buf[i] = 0;
    }
    return buf;
  }
  encodeBody() {
    return (
      this.encodeField("path") +
      this.encodeField("ctime") +
      this.encodeField("atime") +
      this.encodeField("dev") +
      this.encodeField("ino") +
      this.encodeField("nlink") +
      this.encodeField("charset") +
      this.encodeField("comment") +
      this.encodeField("gid") +
      this.encodeField("gname") +
      this.encodeField("linkpath") +
      this.encodeField("mtime") +
      this.encodeField("size") +
      this.encodeField("uid") +
      this.encodeField("uname")
    );
  }
  encodeField(field) {
    if (this[field] === undefined) {
      return "";
    }
    const r = this[field];
    const v = r instanceof Date ? r.getTime() / 1e3 : r;
    const s =
      " " +
      (field === "dev" || field === "ino" || field === "nlink"
        ? "SCHILY."
        : "") +
      field +
      "=" +
      v +
      "\n";
    const byteLen = Buffer.byteLength(s);
    let digits = Math.floor(Math.log(byteLen) / Math.log(10)) + 1;
    if (byteLen + digits >= Math.pow(10, digits)) {
      digits += 1;
    }
    const len = digits + byteLen;
    return len + s;
  }
  static parse(str, ex, g = false) {
    return new Pax(merge(parseKV(str), ex), g);
  }
}
const merge = (a, b) => (b ? Object.assign({}, b, a) : a);
const parseKV = (str) =>
  str.replace(/\n$/, "").split("\n").reduce(parseKVLine, Object.create(null));
const parseKVLine = (set, line) => {
  const n = parseInt(line, 10);
  if (n !== Buffer.byteLength(line) + 1) {
    return set;
  }
  line = line.slice((n + " ").length);
  const kv = line.split("=");
  const r = kv.shift();
  if (!r) {
    return set;
  }
  const k = r.replace(/^SCHILY\.(dev|ino|nlink)/, "$1");
  const v = kv.join("=");
  set[k] = /^([A-Z]+\.)?([mac]|birth|creation)time$/.test(k)
    ? new Date(Number(v) * 1e3)
    : /^[0-9]+$/.test(v)
      ? +v
      : v;
  return set;
};
const platform = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
const normalizeWindowsPath =
  platform !== "win32" ? (p) => p : (p) => p && p.replace(/\\/g, "/");
class ReadEntry extends Minipass {
  extended;
  globalExtended;
  header;
  startBlockSize;
  blockRemain;
  remain;
  type;
  meta = false;
  ignore = false;
  path;
  mode;
  uid;
  gid;
  uname;
  gname;
  size = 0;
  mtime;
  atime;
  ctime;
  linkpath;
  dev;
  ino;
  nlink;
  invalid = false;
  absolute;
  unsupported = false;
  constructor(header, ex, gex) {
    super({});
    this.pause();
    this.extended = ex;
    this.globalExtended = gex;
    this.header = header;
    this.remain = header.size ?? 0;
    this.startBlockSize = 512 * Math.ceil(this.remain / 512);
    this.blockRemain = this.startBlockSize;
    this.type = header.type;
    switch (this.type) {
      case "File":
      case "OldFile":
      case "Link":
      case "SymbolicLink":
      case "CharacterDevice":
      case "BlockDevice":
      case "Directory":
      case "FIFO":
      case "ContiguousFile":
      case "GNUDumpDir":
        break;
      case "NextFileHasLongLinkpath":
      case "NextFileHasLongPath":
      case "OldGnuLongPath":
      case "GlobalExtendedHeader":
      case "ExtendedHeader":
      case "OldExtendedHeader":
        this.meta = true;
        break;
      default:
        this.ignore = true;
    }
    if (!header.path) {
      throw new Error("no path provided for tar.ReadEntry");
    }
    this.path = normalizeWindowsPath(header.path);
    this.mode = header.mode;
    if (this.mode) {
      this.mode = this.mode & 4095;
    }
    this.uid = header.uid;
    this.gid = header.gid;
    this.uname = header.uname;
    this.gname = header.gname;
    this.size = this.remain;
    this.mtime = header.mtime;
    this.atime = header.atime;
    this.ctime = header.ctime;
    this.linkpath = header.linkpath
      ? normalizeWindowsPath(header.linkpath)
      : undefined;
    this.uname = header.uname;
    this.gname = header.gname;
    if (ex) {
      this.#slurp(ex);
    }
    if (gex) {
      this.#slurp(gex, true);
    }
  }
  write(data) {
    const writeLen = data.length;
    if (writeLen > this.blockRemain) {
      throw new Error("writing more to entry than is appropriate");
    }
    const r = this.remain;
    const br = this.blockRemain;
    this.remain = Math.max(0, r - writeLen);
    this.blockRemain = Math.max(0, br - writeLen);
    if (this.ignore) {
      return true;
    }
    if (r >= writeLen) {
      return super.write(data);
    }
    return super.write(data.subarray(0, r));
  }
  #slurp(ex, gex = false) {
    if (ex.path) ex.path = normalizeWindowsPath(ex.path);
    if (ex.linkpath) ex.linkpath = normalizeWindowsPath(ex.linkpath);
    Object.assign(
      this,
      Object.fromEntries(
        Object.entries(ex).filter(
          ([k, v]) => !(v === null || v === undefined || (k === "path" && gex)),
        ),
      ),
    );
  }
}
const warnMethod = (self, code, message, data = {}) => {
  if (self.file) {
    data.file = self.file;
  }
  if (self.cwd) {
    data.cwd = self.cwd;
  }
  data.code = (message instanceof Error && message.code) || code;
  data.tarCode = code;
  if (!self.strict && data.recoverable !== false) {
    if (message instanceof Error) {
      data = Object.assign(message, data);
      message = message.message;
    }
    self.emit("warn", code, message, data);
  } else if (message instanceof Error) {
    self.emit("error", Object.assign(message, data));
  } else {
    self.emit("error", Object.assign(new Error(`${code}: ${message}`), data));
  }
};
const maxMetaEntrySize = 1024 * 1024;
const gzipHeader = Buffer.from([31, 139]);
const STATE = Symbol("state");
const WRITEENTRY = Symbol("writeEntry");
const READENTRY = Symbol("readEntry");
const NEXTENTRY = Symbol("nextEntry");
const PROCESSENTRY = Symbol("processEntry");
const EX = Symbol("extendedHeader");
const GEX = Symbol("globalExtendedHeader");
const META = Symbol("meta");
const EMITMETA = Symbol("emitMeta");
const parse_BUFFER = Symbol("buffer");
const QUEUE = Symbol("queue");
const ENDED = Symbol("ended");
const EMITTEDEND = Symbol("emittedEnd");
const EMIT = Symbol("emit");
const UNZIP = Symbol("unzip");
const CONSUMECHUNK = Symbol("consumeChunk");
const CONSUMECHUNKSUB = Symbol("consumeChunkSub");
const CONSUMEBODY = Symbol("consumeBody");
const CONSUMEMETA = Symbol("consumeMeta");
const CONSUMEHEADER = Symbol("consumeHeader");
const CONSUMING = Symbol("consuming");
const BUFFERCONCAT = Symbol("bufferConcat");
const MAYBEEND = Symbol("maybeEnd");
const WRITING = Symbol("writing");
const parse_ABORTED = Symbol("aborted");
const DONE = Symbol("onDone");
const SAW_VALID_ENTRY = Symbol("sawValidEntry");
const SAW_NULL_BLOCK = Symbol("sawNullBlock");
const SAW_EOF = Symbol("sawEOF");
const CLOSESTREAM = Symbol("closeStream");
const noop = () => true;
class Parser extends external_events_namespaceObject.EventEmitter {
  file;
  strict;
  maxMetaEntrySize;
  filter;
  brotli;
  writable = true;
  readable = false;
  [QUEUE] = new Yallist();
  [parse_BUFFER];
  [READENTRY];
  [WRITEENTRY];
  [STATE] = "begin";
  [META] = "";
  [EX];
  [GEX];
  [ENDED] = false;
  [UNZIP];
  [parse_ABORTED] = false;
  [SAW_VALID_ENTRY];
  [SAW_NULL_BLOCK] = false;
  [SAW_EOF] = false;
  [WRITING] = false;
  [CONSUMING] = false;
  [EMITTEDEND] = false;
  constructor(opt = {}) {
    super();
    this.file = opt.file || "";
    this.on(DONE, () => {
      if (this[STATE] === "begin" || this[SAW_VALID_ENTRY] === false) {
        this.warn("TAR_BAD_ARCHIVE", "Unrecognized archive format");
      }
    });
    if (opt.ondone) {
      this.on(DONE, opt.ondone);
    } else {
      this.on(DONE, () => {
        this.emit("prefinish");
        this.emit("finish");
        this.emit("end");
      });
    }
    this.strict = !!opt.strict;
    this.maxMetaEntrySize = opt.maxMetaEntrySize || maxMetaEntrySize;
    this.filter = typeof opt.filter === "function" ? opt.filter : noop;
    const isTBR =
      opt.file && (opt.file.endsWith(".tar.br") || opt.file.endsWith(".tbr"));
    this.brotli =
      !opt.gzip && opt.brotli !== undefined
        ? opt.brotli
        : isTBR
          ? undefined
          : false;
    this.on("end", () => this[CLOSESTREAM]());
    if (typeof opt.onwarn === "function") {
      this.on("warn", opt.onwarn);
    }
    if (typeof opt.onReadEntry === "function") {
      this.on("entry", opt.onReadEntry);
    }
  }
  warn(code, message, data = {}) {
    warnMethod(this, code, message, data);
  }
  [CONSUMEHEADER](chunk, position) {
    if (this[SAW_VALID_ENTRY] === undefined) {
      this[SAW_VALID_ENTRY] = false;
    }
    let header;
    try {
      header = new Header(chunk, position, this[EX], this[GEX]);
    } catch (er) {
      return this.warn("TAR_ENTRY_INVALID", er);
    }
    if (header.nullBlock) {
      if (this[SAW_NULL_BLOCK]) {
        this[SAW_EOF] = true;
        if (this[STATE] === "begin") {
          this[STATE] = "header";
        }
        this[EMIT]("eof");
      } else {
        this[SAW_NULL_BLOCK] = true;
        this[EMIT]("nullBlock");
      }
    } else {
      this[SAW_NULL_BLOCK] = false;
      if (!header.cksumValid) {
        this.warn("TAR_ENTRY_INVALID", "checksum failure", { header });
      } else if (!header.path) {
        this.warn("TAR_ENTRY_INVALID", "path is required", { header });
      } else {
        const type = header.type;
        if (/^(Symbolic)?Link$/.test(type) && !header.linkpath) {
          this.warn("TAR_ENTRY_INVALID", "linkpath required", { header });
        } else if (
          !/^(Symbolic)?Link$/.test(type) &&
          !/^(Global)?ExtendedHeader$/.test(type) &&
          header.linkpath
        ) {
          this.warn("TAR_ENTRY_INVALID", "linkpath forbidden", { header });
        } else {
          const entry = (this[WRITEENTRY] = new ReadEntry(
            header,
            this[EX],
            this[GEX],
          ));
          if (!this[SAW_VALID_ENTRY]) {
            if (entry.remain) {
              const onend = () => {
                if (!entry.invalid) {
                  this[SAW_VALID_ENTRY] = true;
                }
              };
              entry.on("end", onend);
            } else {
              this[SAW_VALID_ENTRY] = true;
            }
          }
          if (entry.meta) {
            if (entry.size > this.maxMetaEntrySize) {
              entry.ignore = true;
              this[EMIT]("ignoredEntry", entry);
              this[STATE] = "ignore";
              entry.resume();
            } else if (entry.size > 0) {
              this[META] = "";
              entry.on("data", (c) => (this[META] += c));
              this[STATE] = "meta";
            }
          } else {
            this[EX] = undefined;
            entry.ignore = entry.ignore || !this.filter(entry.path, entry);
            if (entry.ignore) {
              this[EMIT]("ignoredEntry", entry);
              this[STATE] = entry.remain ? "ignore" : "header";
              entry.resume();
            } else {
              if (entry.remain) {
                this[STATE] = "body";
              } else {
                this[STATE] = "header";
                entry.end();
              }
              if (!this[READENTRY]) {
                this[QUEUE].push(entry);
                this[NEXTENTRY]();
              } else {
                this[QUEUE].push(entry);
              }
            }
          }
        }
      }
    }
  }
  [CLOSESTREAM]() {
    queueMicrotask(() => this.emit("close"));
  }
  [PROCESSENTRY](entry) {
    let go = true;
    if (!entry) {
      this[READENTRY] = undefined;
      go = false;
    } else if (Array.isArray(entry)) {
      const [ev, ...args] = entry;
      this.emit(ev, ...args);
    } else {
      this[READENTRY] = entry;
      this.emit("entry", entry);
      if (!entry.emittedEnd) {
        entry.on("end", () => this[NEXTENTRY]());
        go = false;
      }
    }
    return go;
  }
  [NEXTENTRY]() {
    do {} while (this[PROCESSENTRY](this[QUEUE].shift()));
    if (!this[QUEUE].length) {
      const re = this[READENTRY];
      const drainNow = !re || re.flowing || re.size === re.remain;
      if (drainNow) {
        if (!this[WRITING]) {
          this.emit("drain");
        }
      } else {
        re.once("drain", () => this.emit("drain"));
      }
    }
  }
  [CONSUMEBODY](chunk, position) {
    const entry = this[WRITEENTRY];
    if (!entry) {
      throw new Error("attempt to consume body without entry??");
    }
    const br = entry.blockRemain ?? 0;
    const c =
      br >= chunk.length && position === 0
        ? chunk
        : chunk.subarray(position, position + br);
    entry.write(c);
    if (!entry.blockRemain) {
      this[STATE] = "header";
      this[WRITEENTRY] = undefined;
      entry.end();
    }
    return c.length;
  }
  [CONSUMEMETA](chunk, position) {
    const entry = this[WRITEENTRY];
    const ret = this[CONSUMEBODY](chunk, position);
    if (!this[WRITEENTRY] && entry) {
      this[EMITMETA](entry);
    }
    return ret;
  }
  [EMIT](ev, data, extra) {
    if (!this[QUEUE].length && !this[READENTRY]) {
      this.emit(ev, data, extra);
    } else {
      this[QUEUE].push([ev, data, extra]);
    }
  }
  [EMITMETA](entry) {
    this[EMIT]("meta", this[META]);
    switch (entry.type) {
      case "ExtendedHeader":
      case "OldExtendedHeader":
        this[EX] = Pax.parse(this[META], this[EX], false);
        break;
      case "GlobalExtendedHeader":
        this[GEX] = Pax.parse(this[META], this[GEX], true);
        break;
      case "NextFileHasLongPath":
      case "OldGnuLongPath": {
        const ex = this[EX] ?? Object.create(null);
        this[EX] = ex;
        ex.path = this[META].replace(/\0.*/, "");
        break;
      }
      case "NextFileHasLongLinkpath": {
        const ex = this[EX] || Object.create(null);
        this[EX] = ex;
        ex.linkpath = this[META].replace(/\0.*/, "");
        break;
      }
      default:
        throw new Error("unknown meta: " + entry.type);
    }
  }
  abort(error) {
    this[parse_ABORTED] = true;
    this.emit("abort", error);
    this.warn("TAR_ABORT", error, { recoverable: false });
  }
  write(chunk, encoding, cb) {
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = undefined;
    }
    if (typeof chunk === "string") {
      chunk = Buffer.from(
        chunk,
        typeof encoding === "string" ? encoding : "utf8",
      );
    }
    if (this[parse_ABORTED]) {
      cb?.();
      return false;
    }
    const needSniff =
      this[UNZIP] === undefined ||
      (this.brotli === undefined && this[UNZIP] === false);
    if (needSniff && chunk) {
      if (this[parse_BUFFER]) {
        chunk = Buffer.concat([this[parse_BUFFER], chunk]);
        this[parse_BUFFER] = undefined;
      }
      if (chunk.length < gzipHeader.length) {
        this[parse_BUFFER] = chunk;
        cb?.();
        return true;
      }
      for (let i = 0; this[UNZIP] === undefined && i < gzipHeader.length; i++) {
        if (chunk[i] !== gzipHeader[i]) {
          this[UNZIP] = false;
        }
      }
      const maybeBrotli = this.brotli === undefined;
      if (this[UNZIP] === false && maybeBrotli) {
        if (chunk.length < 512) {
          if (this[ENDED]) {
            this.brotli = true;
          } else {
            this[parse_BUFFER] = chunk;
            cb?.();
            return true;
          }
        } else {
          try {
            new Header(chunk.subarray(0, 512));
            this.brotli = false;
          } catch (_) {
            this.brotli = true;
          }
        }
      }
      if (this[UNZIP] === undefined || (this[UNZIP] === false && this.brotli)) {
        const ended = this[ENDED];
        this[ENDED] = false;
        this[UNZIP] =
          this[UNZIP] === undefined ? new Unzip({}) : new BrotliDecompress({});
        this[UNZIP].on("data", (chunk) => this[CONSUMECHUNK](chunk));
        this[UNZIP].on("error", (er) => this.abort(er));
        this[UNZIP].on("end", () => {
          this[ENDED] = true;
          this[CONSUMECHUNK]();
        });
        this[WRITING] = true;
        const ret = !!this[UNZIP][ended ? "end" : "write"](chunk);
        this[WRITING] = false;
        cb?.();
        return ret;
      }
    }
    this[WRITING] = true;
    if (this[UNZIP]) {
      this[UNZIP].write(chunk);
    } else {
      this[CONSUMECHUNK](chunk);
    }
    this[WRITING] = false;
    const ret = this[QUEUE].length
      ? false
      : this[READENTRY]
        ? this[READENTRY].flowing
        : true;
    if (!ret && !this[QUEUE].length) {
      this[READENTRY]?.once("drain", () => this.emit("drain"));
    }
    cb?.();
    return ret;
  }
  [BUFFERCONCAT](c) {
    if (c && !this[parse_ABORTED]) {
      this[parse_BUFFER] = this[parse_BUFFER]
        ? Buffer.concat([this[parse_BUFFER], c])
        : c;
    }
  }
  [MAYBEEND]() {
    if (
      this[ENDED] &&
      !this[EMITTEDEND] &&
      !this[parse_ABORTED] &&
      !this[CONSUMING]
    ) {
      this[EMITTEDEND] = true;
      const entry = this[WRITEENTRY];
      if (entry && entry.blockRemain) {
        const have = this[parse_BUFFER] ? this[parse_BUFFER].length : 0;
        this.warn(
          "TAR_BAD_ARCHIVE",
          `Truncated input (needed ${entry.blockRemain} more bytes, only ${have} available)`,
          { entry },
        );
        if (this[parse_BUFFER]) {
          entry.write(this[parse_BUFFER]);
        }
        entry.end();
      }
      this[EMIT](DONE);
    }
  }
  [CONSUMECHUNK](chunk) {
    if (this[CONSUMING] && chunk) {
      this[BUFFERCONCAT](chunk);
    } else if (!chunk && !this[parse_BUFFER]) {
      this[MAYBEEND]();
    } else if (chunk) {
      this[CONSUMING] = true;
      if (this[parse_BUFFER]) {
        this[BUFFERCONCAT](chunk);
        const c = this[parse_BUFFER];
        this[parse_BUFFER] = undefined;
        this[CONSUMECHUNKSUB](c);
      } else {
        this[CONSUMECHUNKSUB](chunk);
      }
      while (
        this[parse_BUFFER] &&
        this[parse_BUFFER]?.length >= 512 &&
        !this[parse_ABORTED] &&
        !this[SAW_EOF]
      ) {
        const c = this[parse_BUFFER];
        this[parse_BUFFER] = undefined;
        this[CONSUMECHUNKSUB](c);
      }
      this[CONSUMING] = false;
    }
    if (!this[parse_BUFFER] || this[ENDED]) {
      this[MAYBEEND]();
    }
  }
  [CONSUMECHUNKSUB](chunk) {
    let position = 0;
    const length = chunk.length;
    while (position + 512 <= length && !this[parse_ABORTED] && !this[SAW_EOF]) {
      switch (this[STATE]) {
        case "begin":
        case "header":
          this[CONSUMEHEADER](chunk, position);
          position += 512;
          break;
        case "ignore":
        case "body":
          position += this[CONSUMEBODY](chunk, position);
          break;
        case "meta":
          position += this[CONSUMEMETA](chunk, position);
          break;
        default:
          throw new Error("invalid state: " + this[STATE]);
      }
    }
    if (position < length) {
      if (this[parse_BUFFER]) {
        this[parse_BUFFER] = Buffer.concat([
          chunk.subarray(position),
          this[parse_BUFFER],
        ]);
      } else {
        this[parse_BUFFER] = chunk.subarray(position);
      }
    }
  }
  end(chunk, encoding, cb) {
    if (typeof chunk === "function") {
      cb = chunk;
      encoding = undefined;
      chunk = undefined;
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = undefined;
    }
    if (typeof chunk === "string") {
      chunk = Buffer.from(chunk, encoding);
    }
    if (cb) this.once("finish", cb);
    if (!this[parse_ABORTED]) {
      if (this[UNZIP]) {
        if (chunk) this[UNZIP].write(chunk);
        this[UNZIP].end();
      } else {
        this[ENDED] = true;
        if (this.brotli === undefined) chunk = chunk || Buffer.alloc(0);
        if (chunk) this.write(chunk);
        this[MAYBEEND]();
      }
    }
    return this;
  }
}
const stripTrailingSlashes = (str) => {
  let i = str.length - 1;
  let slashesStart = -1;
  while (i > -1 && str.charAt(i) === "/") {
    slashesStart = i;
    i--;
  }
  return slashesStart === -1 ? str : str.slice(0, slashesStart);
};
const onReadEntryFunction = (opt) => {
  const onReadEntry = opt.onReadEntry;
  opt.onReadEntry = onReadEntry
    ? (e) => {
        onReadEntry(e);
        e.resume();
      }
    : (e) => e.resume();
};
const filesFilter = (opt, files) => {
  const map = new Map(files.map((f) => [stripTrailingSlashes(f), true]));
  const filter = opt.filter;
  const mapHas = (file, r = "") => {
    const root =
      r || (0, external_path_namespaceObject.parse)(file).root || ".";
    let ret;
    if (file === root) ret = false;
    else {
      const m = map.get(file);
      if (m !== undefined) {
        ret = m;
      } else {
        ret = mapHas((0, external_path_namespaceObject.dirname)(file), root);
      }
    }
    map.set(file, ret);
    return ret;
  };
  opt.filter = filter
    ? (file, entry) => filter(file, entry) && mapHas(stripTrailingSlashes(file))
    : (file) => mapHas(stripTrailingSlashes(file));
};
const listFileSync = (opt) => {
  const p = new Parser(opt);
  const file = opt.file;
  let fd;
  try {
    const stat = external_node_fs_namespaceObject.statSync(file);
    const readSize = opt.maxReadSize || 16 * 1024 * 1024;
    if (stat.size < readSize) {
      p.end(external_node_fs_namespaceObject.readFileSync(file));
    } else {
      let pos = 0;
      const buf = Buffer.allocUnsafe(readSize);
      fd = external_node_fs_namespaceObject.openSync(file, "r");
      while (pos < stat.size) {
        const bytesRead = external_node_fs_namespaceObject.readSync(
          fd,
          buf,
          0,
          readSize,
          pos,
        );
        pos += bytesRead;
        p.write(buf.subarray(0, bytesRead));
      }
      p.end();
    }
  } finally {
    if (typeof fd === "number") {
      try {
        external_node_fs_namespaceObject.closeSync(fd);
      } catch (er) {}
    }
  }
};
const listFile = (opt, _files) => {
  const parse = new Parser(opt);
  const readSize = opt.maxReadSize || 16 * 1024 * 1024;
  const file = opt.file;
  const p = new Promise((resolve, reject) => {
    parse.on("error", reject);
    parse.on("end", resolve);
    external_node_fs_namespaceObject.stat(file, (er, stat) => {
      if (er) {
        reject(er);
      } else {
        const stream = new ReadStream(file, { readSize, size: stat.size });
        stream.on("error", reject);
        stream.pipe(parse);
      }
    });
  });
  return p;
};
const list = makeCommand(
  listFileSync,
  listFile,
  (opt) => new Parser(opt),
  (opt) => new Parser(opt),
  (opt, files) => {
    if (files?.length) filesFilter(opt, files);
    if (!opt.noResume) onReadEntryFunction(opt);
  },
);
const modeFix = (mode, isDir, portable) => {
  mode &= 4095;
  if (portable) {
    mode = (mode | 384) & ~18;
  }
  if (isDir) {
    if (mode & 256) {
      mode |= 64;
    }
    if (mode & 32) {
      mode |= 8;
    }
    if (mode & 4) {
      mode |= 1;
    }
  }
  return mode;
};
const { isAbsolute, parse: strip_absolute_path_parse } =
  external_node_path_namespaceObject.win32;
const stripAbsolutePath = (path) => {
  let r = "";
  let parsed = strip_absolute_path_parse(path);
  while (isAbsolute(path) || parsed.root) {
    const root =
      path.charAt(0) === "/" && path.slice(0, 4) !== "//?/" ? "/" : parsed.root;
    path = path.slice(root.length);
    r += root;
    parsed = strip_absolute_path_parse(path);
  }
  return [r, path];
};
const raw = ["|", "<", ">", "?", ":"];
const win = raw.map((char) => String.fromCharCode(61440 + char.charCodeAt(0)));
const toWin = new Map(raw.map((char, i) => [char, win[i]]));
const toRaw = new Map(win.map((char, i) => [char, raw[i]]));
const winchars_encode = (s) =>
  raw.reduce((s, c) => s.split(c).join(toWin.get(c)), s);
const decode = (s) => win.reduce((s, c) => s.split(c).join(toRaw.get(c)), s);
const prefixPath = (path, prefix) => {
  if (!prefix) {
    return normalizeWindowsPath(path);
  }
  path = normalizeWindowsPath(path).replace(/^\.(\/|$)/, "");
  return stripTrailingSlashes(prefix) + "/" + path;
};
const maxReadSize = 16 * 1024 * 1024;
const PROCESS = Symbol("process");
const FILE = Symbol("file");
const DIRECTORY = Symbol("directory");
const SYMLINK = Symbol("symlink");
const HARDLINK = Symbol("hardlink");
const HEADER = Symbol("header");
const write_entry_READ = Symbol("read");
const LSTAT = Symbol("lstat");
const ONLSTAT = Symbol("onlstat");
const ONREAD = Symbol("onread");
const ONREADLINK = Symbol("onreadlink");
const OPENFILE = Symbol("openfile");
const ONOPENFILE = Symbol("onopenfile");
const CLOSE = Symbol("close");
const MODE = Symbol("mode");
const AWAITDRAIN = Symbol("awaitDrain");
const ONDRAIN = Symbol("ondrain");
const PREFIX = Symbol("prefix");
class WriteEntry extends Minipass {
  path;
  portable;
  myuid = (process.getuid && process.getuid()) || 0;
  myuser = process.env.USER || "";
  maxReadSize;
  linkCache;
  statCache;
  preservePaths;
  cwd;
  strict;
  mtime;
  noPax;
  noMtime;
  prefix;
  fd;
  blockLen = 0;
  blockRemain = 0;
  buf;
  pos = 0;
  remain = 0;
  length = 0;
  offset = 0;
  win32;
  absolute;
  header;
  type;
  linkpath;
  stat;
  onWriteEntry;
  #hadError = false;
  constructor(p, opt_ = {}) {
    const opt = dealias(opt_);
    super();
    this.path = normalizeWindowsPath(p);
    this.portable = !!opt.portable;
    this.maxReadSize = opt.maxReadSize || maxReadSize;
    this.linkCache = opt.linkCache || new Map();
    this.statCache = opt.statCache || new Map();
    this.preservePaths = !!opt.preservePaths;
    this.cwd = normalizeWindowsPath(opt.cwd || process.cwd());
    this.strict = !!opt.strict;
    this.noPax = !!opt.noPax;
    this.noMtime = !!opt.noMtime;
    this.mtime = opt.mtime;
    this.prefix = opt.prefix ? normalizeWindowsPath(opt.prefix) : undefined;
    this.onWriteEntry = opt.onWriteEntry;
    if (typeof opt.onwarn === "function") {
      this.on("warn", opt.onwarn);
    }
    let pathWarn = false;
    if (!this.preservePaths) {
      const [root, stripped] = stripAbsolutePath(this.path);
      if (root && typeof stripped === "string") {
        this.path = stripped;
        pathWarn = root;
      }
    }
    this.win32 = !!opt.win32 || process.platform === "win32";
    if (this.win32) {
      this.path = decode(this.path.replace(/\\/g, "/"));
      p = p.replace(/\\/g, "/");
    }
    this.absolute = normalizeWindowsPath(
      opt.absolute || external_path_namespaceObject.resolve(this.cwd, p),
    );
    if (this.path === "") {
      this.path = "./";
    }
    if (pathWarn) {
      this.warn("TAR_ENTRY_INFO", `stripping ${pathWarn} from absolute path`, {
        entry: this,
        path: pathWarn + this.path,
      });
    }
    const cs = this.statCache.get(this.absolute);
    if (cs) {
      this[ONLSTAT](cs);
    } else {
      this[LSTAT]();
    }
  }
  warn(code, message, data = {}) {
    return warnMethod(this, code, message, data);
  }
  emit(ev, ...data) {
    if (ev === "error") {
      this.#hadError = true;
    }
    return super.emit(ev, ...data);
  }
  [LSTAT]() {
    external_fs_namespaceObject.lstat(this.absolute, (er, stat) => {
      if (er) {
        return this.emit("error", er);
      }
      this[ONLSTAT](stat);
    });
  }
  [ONLSTAT](stat) {
    this.statCache.set(this.absolute, stat);
    this.stat = stat;
    if (!stat.isFile()) {
      stat.size = 0;
    }
    this.type = getType(stat);
    this.emit("stat", stat);
    this[PROCESS]();
  }
  [PROCESS]() {
    switch (this.type) {
      case "File":
        return this[FILE]();
      case "Directory":
        return this[DIRECTORY]();
      case "SymbolicLink":
        return this[SYMLINK]();
      default:
        return this.end();
    }
  }
  [MODE](mode) {
    return modeFix(mode, this.type === "Directory", this.portable);
  }
  [PREFIX](path) {
    return prefixPath(path, this.prefix);
  }
  [HEADER]() {
    if (!this.stat) {
      throw new Error("cannot write header before stat");
    }
    if (this.type === "Directory" && this.portable) {
      this.noMtime = true;
    }
    this.onWriteEntry?.(this);
    this.header = new Header({
      path: this[PREFIX](this.path),
      linkpath:
        this.type === "Link" && this.linkpath !== undefined
          ? this[PREFIX](this.linkpath)
          : this.linkpath,
      mode: this[MODE](this.stat.mode),
      uid: this.portable ? undefined : this.stat.uid,
      gid: this.portable ? undefined : this.stat.gid,
      size: this.stat.size,
      mtime: this.noMtime ? undefined : this.mtime || this.stat.mtime,
      type: this.type === "Unsupported" ? undefined : this.type,
      uname: this.portable
        ? undefined
        : this.stat.uid === this.myuid
          ? this.myuser
          : "",
      atime: this.portable ? undefined : this.stat.atime,
      ctime: this.portable ? undefined : this.stat.ctime,
    });
    if (this.header.encode() && !this.noPax) {
      super.write(
        new Pax({
          atime: this.portable ? undefined : this.header.atime,
          ctime: this.portable ? undefined : this.header.ctime,
          gid: this.portable ? undefined : this.header.gid,
          mtime: this.noMtime ? undefined : this.mtime || this.header.mtime,
          path: this[PREFIX](this.path),
          linkpath:
            this.type === "Link" && this.linkpath !== undefined
              ? this[PREFIX](this.linkpath)
              : this.linkpath,
          size: this.header.size,
          uid: this.portable ? undefined : this.header.uid,
          uname: this.portable ? undefined : this.header.uname,
          dev: this.portable ? undefined : this.stat.dev,
          ino: this.portable ? undefined : this.stat.ino,
          nlink: this.portable ? undefined : this.stat.nlink,
        }).encode(),
      );
    }
    const block = this.header?.block;
    if (!block) {
      throw new Error("failed to encode header");
    }
    super.write(block);
  }
  [DIRECTORY]() {
    if (!this.stat) {
      throw new Error("cannot create directory entry without stat");
    }
    if (this.path.slice(-1) !== "/") {
      this.path += "/";
    }
    this.stat.size = 0;
    this[HEADER]();
    this.end();
  }
  [SYMLINK]() {
    external_fs_namespaceObject.readlink(this.absolute, (er, linkpath) => {
      if (er) {
        return this.emit("error", er);
      }
      this[ONREADLINK](linkpath);
    });
  }
  [ONREADLINK](linkpath) {
    this.linkpath = normalizeWindowsPath(linkpath);
    this[HEADER]();
    this.end();
  }
  [HARDLINK](linkpath) {
    if (!this.stat) {
      throw new Error("cannot create link entry without stat");
    }
    this.type = "Link";
    this.linkpath = normalizeWindowsPath(
      external_path_namespaceObject.relative(this.cwd, linkpath),
    );
    this.stat.size = 0;
    this[HEADER]();
    this.end();
  }
  [FILE]() {
    if (!this.stat) {
      throw new Error("cannot create file entry without stat");
    }
    if (this.stat.nlink > 1) {
      const linkKey = `${this.stat.dev}:${this.stat.ino}`;
      const linkpath = this.linkCache.get(linkKey);
      if (linkpath?.indexOf(this.cwd) === 0) {
        return this[HARDLINK](linkpath);
      }
      this.linkCache.set(linkKey, this.absolute);
    }
    this[HEADER]();
    if (this.stat.size === 0) {
      return this.end();
    }
    this[OPENFILE]();
  }
  [OPENFILE]() {
    external_fs_namespaceObject.open(this.absolute, "r", (er, fd) => {
      if (er) {
        return this.emit("error", er);
      }
      this[ONOPENFILE](fd);
    });
  }
  [ONOPENFILE](fd) {
    this.fd = fd;
    if (this.#hadError) {
      return this[CLOSE]();
    }
    if (!this.stat) {
      throw new Error("should stat before calling onopenfile");
    }
    this.blockLen = 512 * Math.ceil(this.stat.size / 512);
    this.blockRemain = this.blockLen;
    const bufLen = Math.min(this.blockLen, this.maxReadSize);
    this.buf = Buffer.allocUnsafe(bufLen);
    this.offset = 0;
    this.pos = 0;
    this.remain = this.stat.size;
    this.length = this.buf.length;
    this[write_entry_READ]();
  }
  [write_entry_READ]() {
    const { fd, buf, offset, length, pos } = this;
    if (fd === undefined || buf === undefined) {
      throw new Error("cannot read file without first opening");
    }
    external_fs_namespaceObject.read(
      fd,
      buf,
      offset,
      length,
      pos,
      (er, bytesRead) => {
        if (er) {
          return this[CLOSE](() => this.emit("error", er));
        }
        this[ONREAD](bytesRead);
      },
    );
  }
  [CLOSE](cb = () => {}) {
    if (this.fd !== undefined) external_fs_namespaceObject.close(this.fd, cb);
  }
  [ONREAD](bytesRead) {
    if (bytesRead <= 0 && this.remain > 0) {
      const er = Object.assign(new Error("encountered unexpected EOF"), {
        path: this.absolute,
        syscall: "read",
        code: "EOF",
      });
      return this[CLOSE](() => this.emit("error", er));
    }
    if (bytesRead > this.remain) {
      const er = Object.assign(new Error("did not encounter expected EOF"), {
        path: this.absolute,
        syscall: "read",
        code: "EOF",
      });
      return this[CLOSE](() => this.emit("error", er));
    }
    if (!this.buf) {
      throw new Error("should have created buffer prior to reading");
    }
    if (bytesRead === this.remain) {
      for (
        let i = bytesRead;
        i < this.length && bytesRead < this.blockRemain;
        i++
      ) {
        this.buf[i + this.offset] = 0;
        bytesRead++;
        this.remain++;
      }
    }
    const chunk =
      this.offset === 0 && bytesRead === this.buf.length
        ? this.buf
        : this.buf.subarray(this.offset, this.offset + bytesRead);
    const flushed = this.write(chunk);
    if (!flushed) {
      this[AWAITDRAIN](() => this[ONDRAIN]());
    } else {
      this[ONDRAIN]();
    }
  }
  [AWAITDRAIN](cb) {
    this.once("drain", cb);
  }
  write(chunk, encoding, cb) {
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = undefined;
    }
    if (typeof chunk === "string") {
      chunk = Buffer.from(
        chunk,
        typeof encoding === "string" ? encoding : "utf8",
      );
    }
    if (this.blockRemain < chunk.length) {
      const er = Object.assign(new Error("writing more data than expected"), {
        path: this.absolute,
      });
      return this.emit("error", er);
    }
    this.remain -= chunk.length;
    this.blockRemain -= chunk.length;
    this.pos += chunk.length;
    this.offset += chunk.length;
    return super.write(chunk, null, cb);
  }
  [ONDRAIN]() {
    if (!this.remain) {
      if (this.blockRemain) {
        super.write(Buffer.alloc(this.blockRemain));
      }
      return this[CLOSE]((er) => (er ? this.emit("error", er) : this.end()));
    }
    if (!this.buf) {
      throw new Error("buffer lost somehow in ONDRAIN");
    }
    if (this.offset >= this.length) {
      this.buf = Buffer.allocUnsafe(
        Math.min(this.blockRemain, this.buf.length),
      );
      this.offset = 0;
    }
    this.length = this.buf.length - this.offset;
    this[write_entry_READ]();
  }
}
class WriteEntrySync extends WriteEntry {
  sync = true;
  [LSTAT]() {
    this[ONLSTAT](external_fs_namespaceObject.lstatSync(this.absolute));
  }
  [SYMLINK]() {
    this[ONREADLINK](external_fs_namespaceObject.readlinkSync(this.absolute));
  }
  [OPENFILE]() {
    this[ONOPENFILE](external_fs_namespaceObject.openSync(this.absolute, "r"));
  }
  [write_entry_READ]() {
    let threw = true;
    try {
      const { fd, buf, offset, length, pos } = this;
      if (fd === undefined || buf === undefined) {
        throw new Error("fd and buf must be set in READ method");
      }
      const bytesRead = external_fs_namespaceObject.readSync(
        fd,
        buf,
        offset,
        length,
        pos,
      );
      this[ONREAD](bytesRead);
      threw = false;
    } finally {
      if (threw) {
        try {
          this[CLOSE](() => {});
        } catch (er) {}
      }
    }
  }
  [AWAITDRAIN](cb) {
    cb();
  }
  [CLOSE](cb = () => {}) {
    if (this.fd !== undefined) external_fs_namespaceObject.closeSync(this.fd);
    cb();
  }
}
class WriteEntryTar extends Minipass {
  blockLen = 0;
  blockRemain = 0;
  buf = 0;
  pos = 0;
  remain = 0;
  length = 0;
  preservePaths;
  portable;
  strict;
  noPax;
  noMtime;
  readEntry;
  type;
  prefix;
  path;
  mode;
  uid;
  gid;
  uname;
  gname;
  header;
  mtime;
  atime;
  ctime;
  linkpath;
  size;
  onWriteEntry;
  warn(code, message, data = {}) {
    return warnMethod(this, code, message, data);
  }
  constructor(readEntry, opt_ = {}) {
    const opt = dealias(opt_);
    super();
    this.preservePaths = !!opt.preservePaths;
    this.portable = !!opt.portable;
    this.strict = !!opt.strict;
    this.noPax = !!opt.noPax;
    this.noMtime = !!opt.noMtime;
    this.onWriteEntry = opt.onWriteEntry;
    this.readEntry = readEntry;
    const { type } = readEntry;
    if (type === "Unsupported") {
      throw new Error("writing entry that should be ignored");
    }
    this.type = type;
    if (this.type === "Directory" && this.portable) {
      this.noMtime = true;
    }
    this.prefix = opt.prefix;
    this.path = normalizeWindowsPath(readEntry.path);
    this.mode =
      readEntry.mode !== undefined ? this[MODE](readEntry.mode) : undefined;
    this.uid = this.portable ? undefined : readEntry.uid;
    this.gid = this.portable ? undefined : readEntry.gid;
    this.uname = this.portable ? undefined : readEntry.uname;
    this.gname = this.portable ? undefined : readEntry.gname;
    this.size = readEntry.size;
    this.mtime = this.noMtime ? undefined : opt.mtime || readEntry.mtime;
    this.atime = this.portable ? undefined : readEntry.atime;
    this.ctime = this.portable ? undefined : readEntry.ctime;
    this.linkpath =
      readEntry.linkpath !== undefined
        ? normalizeWindowsPath(readEntry.linkpath)
        : undefined;
    if (typeof opt.onwarn === "function") {
      this.on("warn", opt.onwarn);
    }
    let pathWarn = false;
    if (!this.preservePaths) {
      const [root, stripped] = stripAbsolutePath(this.path);
      if (root && typeof stripped === "string") {
        this.path = stripped;
        pathWarn = root;
      }
    }
    this.remain = readEntry.size;
    this.blockRemain = readEntry.startBlockSize;
    this.onWriteEntry?.(this);
    this.header = new Header({
      path: this[PREFIX](this.path),
      linkpath:
        this.type === "Link" && this.linkpath !== undefined
          ? this[PREFIX](this.linkpath)
          : this.linkpath,
      mode: this.mode,
      uid: this.portable ? undefined : this.uid,
      gid: this.portable ? undefined : this.gid,
      size: this.size,
      mtime: this.noMtime ? undefined : this.mtime,
      type: this.type,
      uname: this.portable ? undefined : this.uname,
      atime: this.portable ? undefined : this.atime,
      ctime: this.portable ? undefined : this.ctime,
    });
    if (pathWarn) {
      this.warn("TAR_ENTRY_INFO", `stripping ${pathWarn} from absolute path`, {
        entry: this,
        path: pathWarn + this.path,
      });
    }
    if (this.header.encode() && !this.noPax) {
      super.write(
        new Pax({
          atime: this.portable ? undefined : this.atime,
          ctime: this.portable ? undefined : this.ctime,
          gid: this.portable ? undefined : this.gid,
          mtime: this.noMtime ? undefined : this.mtime,
          path: this[PREFIX](this.path),
          linkpath:
            this.type === "Link" && this.linkpath !== undefined
              ? this[PREFIX](this.linkpath)
              : this.linkpath,
          size: this.size,
          uid: this.portable ? undefined : this.uid,
          uname: this.portable ? undefined : this.uname,
          dev: this.portable ? undefined : this.readEntry.dev,
          ino: this.portable ? undefined : this.readEntry.ino,
          nlink: this.portable ? undefined : this.readEntry.nlink,
        }).encode(),
      );
    }
    const b = this.header?.block;
    if (!b) throw new Error("failed to encode header");
    super.write(b);
    readEntry.pipe(this);
  }
  [PREFIX](path) {
    return prefixPath(path, this.prefix);
  }
  [MODE](mode) {
    return modeFix(mode, this.type === "Directory", this.portable);
  }
  write(chunk, encoding, cb) {
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = undefined;
    }
    if (typeof chunk === "string") {
      chunk = Buffer.from(
        chunk,
        typeof encoding === "string" ? encoding : "utf8",
      );
    }
    const writeLen = chunk.length;
    if (writeLen > this.blockRemain) {
      throw new Error("writing more to entry than is appropriate");
    }
    this.blockRemain -= writeLen;
    return super.write(chunk, cb);
  }
  end(chunk, encoding, cb) {
    if (this.blockRemain) {
      super.write(Buffer.alloc(this.blockRemain));
    }
    if (typeof chunk === "function") {
      cb = chunk;
      encoding = undefined;
      chunk = undefined;
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = undefined;
    }
    if (typeof chunk === "string") {
      chunk = Buffer.from(chunk, encoding ?? "utf8");
    }
    if (cb) this.once("finish", cb);
    chunk ? super.end(chunk, cb) : super.end(cb);
    return this;
  }
}
const getType = (stat) =>
  stat.isFile()
    ? "File"
    : stat.isDirectory()
      ? "Directory"
      : stat.isSymbolicLink()
        ? "SymbolicLink"
        : "Unsupported";
class PackJob {
  path;
  absolute;
  entry;
  stat;
  readdir;
  pending = false;
  ignore = false;
  piped = false;
  constructor(path, absolute) {
    this.path = path || "./";
    this.absolute = absolute;
  }
}
const pack_EOF = Buffer.alloc(1024);
const ONSTAT = Symbol("onStat");
const pack_ENDED = Symbol("ended");
const pack_QUEUE = Symbol("queue");
const CURRENT = Symbol("current");
const pack_PROCESS = Symbol("process");
const PROCESSING = Symbol("processing");
const PROCESSJOB = Symbol("processJob");
const JOBS = Symbol("jobs");
const JOBDONE = Symbol("jobDone");
const ADDFSENTRY = Symbol("addFSEntry");
const ADDTARENTRY = Symbol("addTarEntry");
const STAT = Symbol("stat");
const READDIR = Symbol("readdir");
const ONREADDIR = Symbol("onreaddir");
const PIPE = Symbol("pipe");
const ENTRY = Symbol("entry");
const ENTRYOPT = Symbol("entryOpt");
const WRITEENTRYCLASS = Symbol("writeEntryClass");
const WRITE = Symbol("write");
const pack_ONDRAIN = Symbol("ondrain");
class Pack extends Minipass {
  opt;
  cwd;
  maxReadSize;
  preservePaths;
  strict;
  noPax;
  prefix;
  linkCache;
  statCache;
  file;
  portable;
  zip;
  readdirCache;
  noDirRecurse;
  follow;
  noMtime;
  mtime;
  filter;
  jobs;
  [WRITEENTRYCLASS];
  onWriteEntry;
  [pack_QUEUE];
  [JOBS] = 0;
  [PROCESSING] = false;
  [pack_ENDED] = false;
  constructor(opt = {}) {
    super();
    this.opt = opt;
    this.file = opt.file || "";
    this.cwd = opt.cwd || process.cwd();
    this.maxReadSize = opt.maxReadSize;
    this.preservePaths = !!opt.preservePaths;
    this.strict = !!opt.strict;
    this.noPax = !!opt.noPax;
    this.prefix = normalizeWindowsPath(opt.prefix || "");
    this.linkCache = opt.linkCache || new Map();
    this.statCache = opt.statCache || new Map();
    this.readdirCache = opt.readdirCache || new Map();
    this.onWriteEntry = opt.onWriteEntry;
    this[WRITEENTRYCLASS] = WriteEntry;
    if (typeof opt.onwarn === "function") {
      this.on("warn", opt.onwarn);
    }
    this.portable = !!opt.portable;
    if (opt.gzip || opt.brotli) {
      if (opt.gzip && opt.brotli) {
        throw new TypeError("gzip and brotli are mutually exclusive");
      }
      if (opt.gzip) {
        if (typeof opt.gzip !== "object") {
          opt.gzip = {};
        }
        if (this.portable) {
          opt.gzip.portable = true;
        }
        this.zip = new Gzip(opt.gzip);
      }
      if (opt.brotli) {
        if (typeof opt.brotli !== "object") {
          opt.brotli = {};
        }
        this.zip = new BrotliCompress(opt.brotli);
      }
      if (!this.zip) throw new Error("impossible");
      const zip = this.zip;
      zip.on("data", (chunk) => super.write(chunk));
      zip.on("end", () => super.end());
      zip.on("drain", () => this[pack_ONDRAIN]());
      this.on("resume", () => zip.resume());
    } else {
      this.on("drain", this[pack_ONDRAIN]);
    }
    this.noDirRecurse = !!opt.noDirRecurse;
    this.follow = !!opt.follow;
    this.noMtime = !!opt.noMtime;
    if (opt.mtime) this.mtime = opt.mtime;
    this.filter = typeof opt.filter === "function" ? opt.filter : () => true;
    this[pack_QUEUE] = new Yallist();
    this[JOBS] = 0;
    this.jobs = Number(opt.jobs) || 4;
    this[PROCESSING] = false;
    this[pack_ENDED] = false;
  }
  [WRITE](chunk) {
    return super.write(chunk);
  }
  add(path) {
    this.write(path);
    return this;
  }
  end(path, encoding, cb) {
    if (typeof path === "function") {
      cb = path;
      path = undefined;
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = undefined;
    }
    if (path) {
      this.add(path);
    }
    this[pack_ENDED] = true;
    this[pack_PROCESS]();
    if (cb) cb();
    return this;
  }
  write(path) {
    if (this[pack_ENDED]) {
      throw new Error("write after end");
    }
    if (path instanceof ReadEntry) {
      this[ADDTARENTRY](path);
    } else {
      this[ADDFSENTRY](path);
    }
    return this.flowing;
  }
  [ADDTARENTRY](p) {
    const absolute = normalizeWindowsPath(
      external_path_namespaceObject.resolve(this.cwd, p.path),
    );
    if (!this.filter(p.path, p)) {
      p.resume();
    } else {
      const job = new PackJob(p.path, absolute);
      job.entry = new WriteEntryTar(p, this[ENTRYOPT](job));
      job.entry.on("end", () => this[JOBDONE](job));
      this[JOBS] += 1;
      this[pack_QUEUE].push(job);
    }
    this[pack_PROCESS]();
  }
  [ADDFSENTRY](p) {
    const absolute = normalizeWindowsPath(
      external_path_namespaceObject.resolve(this.cwd, p),
    );
    this[pack_QUEUE].push(new PackJob(p, absolute));
    this[pack_PROCESS]();
  }
  [STAT](job) {
    job.pending = true;
    this[JOBS] += 1;
    const stat = this.follow ? "stat" : "lstat";
    external_fs_namespaceObject[stat](job.absolute, (er, stat) => {
      job.pending = false;
      this[JOBS] -= 1;
      if (er) {
        this.emit("error", er);
      } else {
        this[ONSTAT](job, stat);
      }
    });
  }
  [ONSTAT](job, stat) {
    this.statCache.set(job.absolute, stat);
    job.stat = stat;
    if (!this.filter(job.path, stat)) {
      job.ignore = true;
    }
    this[pack_PROCESS]();
  }
  [READDIR](job) {
    job.pending = true;
    this[JOBS] += 1;
    external_fs_namespaceObject.readdir(job.absolute, (er, entries) => {
      job.pending = false;
      this[JOBS] -= 1;
      if (er) {
        return this.emit("error", er);
      }
      this[ONREADDIR](job, entries);
    });
  }
  [ONREADDIR](job, entries) {
    this.readdirCache.set(job.absolute, entries);
    job.readdir = entries;
    this[pack_PROCESS]();
  }
  [pack_PROCESS]() {
    if (this[PROCESSING]) {
      return;
    }
    this[PROCESSING] = true;
    for (
      let w = this[pack_QUEUE].head;
      !!w && this[JOBS] < this.jobs;
      w = w.next
    ) {
      this[PROCESSJOB](w.value);
      if (w.value.ignore) {
        const p = w.next;
        this[pack_QUEUE].removeNode(w);
        w.next = p;
      }
    }
    this[PROCESSING] = false;
    if (this[pack_ENDED] && !this[pack_QUEUE].length && this[JOBS] === 0) {
      if (this.zip) {
        this.zip.end(pack_EOF);
      } else {
        super.write(pack_EOF);
        super.end();
      }
    }
  }
  get [CURRENT]() {
    return (
      this[pack_QUEUE] && this[pack_QUEUE].head && this[pack_QUEUE].head.value
    );
  }
  [JOBDONE](_job) {
    this[pack_QUEUE].shift();
    this[JOBS] -= 1;
    this[pack_PROCESS]();
  }
  [PROCESSJOB](job) {
    if (job.pending) {
      return;
    }
    if (job.entry) {
      if (job === this[CURRENT] && !job.piped) {
        this[PIPE](job);
      }
      return;
    }
    if (!job.stat) {
      const sc = this.statCache.get(job.absolute);
      if (sc) {
        this[ONSTAT](job, sc);
      } else {
        this[STAT](job);
      }
    }
    if (!job.stat) {
      return;
    }
    if (job.ignore) {
      return;
    }
    if (!this.noDirRecurse && job.stat.isDirectory() && !job.readdir) {
      const rc = this.readdirCache.get(job.absolute);
      if (rc) {
        this[ONREADDIR](job, rc);
      } else {
        this[READDIR](job);
      }
      if (!job.readdir) {
        return;
      }
    }
    job.entry = this[ENTRY](job);
    if (!job.entry) {
      job.ignore = true;
      return;
    }
    if (job === this[CURRENT] && !job.piped) {
      this[PIPE](job);
    }
  }
  [ENTRYOPT](job) {
    return {
      onwarn: (code, msg, data) => this.warn(code, msg, data),
      noPax: this.noPax,
      cwd: this.cwd,
      absolute: job.absolute,
      preservePaths: this.preservePaths,
      maxReadSize: this.maxReadSize,
      strict: this.strict,
      portable: this.portable,
      linkCache: this.linkCache,
      statCache: this.statCache,
      noMtime: this.noMtime,
      mtime: this.mtime,
      prefix: this.prefix,
      onWriteEntry: this.onWriteEntry,
    };
  }
  [ENTRY](job) {
    this[JOBS] += 1;
    try {
      const e = new this[WRITEENTRYCLASS](job.path, this[ENTRYOPT](job));
      return e
        .on("end", () => this[JOBDONE](job))
        .on("error", (er) => this.emit("error", er));
    } catch (er) {
      this.emit("error", er);
    }
  }
  [pack_ONDRAIN]() {
    if (this[CURRENT] && this[CURRENT].entry) {
      this[CURRENT].entry.resume();
    }
  }
  [PIPE](job) {
    job.piped = true;
    if (job.readdir) {
      job.readdir.forEach((entry) => {
        const p = job.path;
        const base = p === "./" ? "" : p.replace(/\/*$/, "/");
        this[ADDFSENTRY](base + entry);
      });
    }
    const source = job.entry;
    const zip = this.zip;
    if (!source) throw new Error("cannot pipe without source");
    if (zip) {
      source.on("data", (chunk) => {
        if (!zip.write(chunk)) {
          source.pause();
        }
      });
    } else {
      source.on("data", (chunk) => {
        if (!super.write(chunk)) {
          source.pause();
        }
      });
    }
  }
  pause() {
    if (this.zip) {
      this.zip.pause();
    }
    return super.pause();
  }
  warn(code, message, data = {}) {
    warnMethod(this, code, message, data);
  }
}
class PackSync extends Pack {
  sync = true;
  constructor(opt) {
    super(opt);
    this[WRITEENTRYCLASS] = WriteEntrySync;
  }
  pause() {}
  resume() {}
  [STAT](job) {
    const stat = this.follow ? "statSync" : "lstatSync";
    this[ONSTAT](job, external_fs_namespaceObject[stat](job.absolute));
  }
  [READDIR](job) {
    this[ONREADDIR](job, external_fs_namespaceObject.readdirSync(job.absolute));
  }
  [PIPE](job) {
    const source = job.entry;
    const zip = this.zip;
    if (job.readdir) {
      job.readdir.forEach((entry) => {
        const p = job.path;
        const base = p === "./" ? "" : p.replace(/\/*$/, "/");
        this[ADDFSENTRY](base + entry);
      });
    }
    if (!source) throw new Error("Cannot pipe without source");
    if (zip) {
      source.on("data", (chunk) => {
        zip.write(chunk);
      });
    } else {
      source.on("data", (chunk) => {
        super[WRITE](chunk);
      });
    }
  }
}
const createFileSync = (opt, files) => {
  const p = new PackSync(opt);
  const stream = new WriteStreamSync(opt.file, { mode: opt.mode || 438 });
  p.pipe(stream);
  addFilesSync(p, files);
};
const createFile = (opt, files) => {
  const p = new Pack(opt);
  const stream = new WriteStream(opt.file, { mode: opt.mode || 438 });
  p.pipe(stream);
  const promise = new Promise((res, rej) => {
    stream.on("error", rej);
    stream.on("close", res);
    p.on("error", rej);
  });
  addFilesAsync(p, files);
  return promise;
};
const addFilesSync = (p, files) => {
  files.forEach((file) => {
    if (file.charAt(0) === "@") {
      list({
        file: external_node_path_namespaceObject.resolve(p.cwd, file.slice(1)),
        sync: true,
        noResume: true,
        onReadEntry: (entry) => p.add(entry),
      });
    } else {
      p.add(file);
    }
  });
  p.end();
};
const addFilesAsync = async (p, files) => {
  for (let i = 0; i < files.length; i++) {
    const file = String(files[i]);
    if (file.charAt(0) === "@") {
      await list({
        file: external_node_path_namespaceObject.resolve(
          String(p.cwd),
          file.slice(1),
        ),
        noResume: true,
        onReadEntry: (entry) => {
          p.add(entry);
        },
      });
    } else {
      p.add(file);
    }
  }
  p.end();
};
const createSync = (opt, files) => {
  const p = new PackSync(opt);
  addFilesSync(p, files);
  return p;
};
const createAsync = (opt, files) => {
  const p = new Pack(opt);
  addFilesAsync(p, files);
  return p;
};
const create = makeCommand(
  createFileSync,
  createFile,
  createSync,
  createAsync,
  (_opt, files) => {
    if (!files?.length) {
      throw new TypeError("no paths specified to add to archive");
    }
  },
);
const external_node_assert_namespaceObject = __WEBPACK_EXTERNAL_createRequire(
  import.meta.url,
)("node:assert");
const external_node_crypto_namespaceObject = __WEBPACK_EXTERNAL_createRequire(
  import.meta.url,
)("node:crypto");
const get_write_flag_platform =
  process.env.__FAKE_PLATFORM__ || process.platform;
const isWindows = get_write_flag_platform === "win32";
const { O_CREAT, O_TRUNC, O_WRONLY } = external_fs_namespaceObject.constants;
const UV_FS_O_FILEMAP =
  Number(process.env.__FAKE_FS_O_FILENAME__) ||
  external_fs_namespaceObject.constants.UV_FS_O_FILEMAP ||
  0;
const fMapEnabled = isWindows && !!UV_FS_O_FILEMAP;
const fMapLimit = 512 * 1024;
const fMapFlag = UV_FS_O_FILEMAP | O_TRUNC | O_CREAT | O_WRONLY;
const getWriteFlag = !fMapEnabled
  ? () => "w"
  : (size) => (size < fMapLimit ? fMapFlag : "w");
const lchownSync = (path, uid, gid) => {
  try {
    return external_node_fs_namespaceObject.lchownSync(path, uid, gid);
  } catch (er) {
    if (er?.code !== "ENOENT") throw er;
  }
};
const chown = (cpath, uid, gid, cb) => {
  external_node_fs_namespaceObject.lchown(cpath, uid, gid, (er) => {
    cb(er && er?.code !== "ENOENT" ? er : null);
  });
};
const chownrKid = (p, child, uid, gid, cb) => {
  if (child.isDirectory()) {
    chownr(
      external_node_path_namespaceObject.resolve(p, child.name),
      uid,
      gid,
      (er) => {
        if (er) return cb(er);
        const cpath = external_node_path_namespaceObject.resolve(p, child.name);
        chown(cpath, uid, gid, cb);
      },
    );
  } else {
    const cpath = external_node_path_namespaceObject.resolve(p, child.name);
    chown(cpath, uid, gid, cb);
  }
};
const chownr = (p, uid, gid, cb) => {
  external_node_fs_namespaceObject.readdir(
    p,
    { withFileTypes: true },
    (er, children) => {
      if (er) {
        if (er.code === "ENOENT") return cb();
        else if (er.code !== "ENOTDIR" && er.code !== "ENOTSUP") return cb(er);
      }
      if (er || !children.length) return chown(p, uid, gid, cb);
      let len = children.length;
      let errState = null;
      const then = (er) => {
        if (errState) return;
        if (er) return cb((errState = er));
        if (--len === 0) return chown(p, uid, gid, cb);
      };
      for (const child of children) {
        chownrKid(p, child, uid, gid, then);
      }
    },
  );
};
const chownrKidSync = (p, child, uid, gid) => {
  if (child.isDirectory())
    chownrSync(
      external_node_path_namespaceObject.resolve(p, child.name),
      uid,
      gid,
    );
  lchownSync(
    external_node_path_namespaceObject.resolve(p, child.name),
    uid,
    gid,
  );
};
const chownrSync = (p, uid, gid) => {
  let children;
  try {
    children = external_node_fs_namespaceObject.readdirSync(p, {
      withFileTypes: true,
    });
  } catch (er) {
    const e = er;
    if (e?.code === "ENOENT") return;
    else if (e?.code === "ENOTDIR" || e?.code === "ENOTSUP")
      return lchownSync(p, uid, gid);
    else throw e;
  }
  for (const child of children) {
    chownrKidSync(p, child, uid, gid);
  }
  return lchownSync(p, uid, gid);
};
const optsArg = (opts) => {
  if (!opts) {
    opts = { mode: 511 };
  } else if (typeof opts === "object") {
    opts = { mode: 511, ...opts };
  } else if (typeof opts === "number") {
    opts = { mode: opts };
  } else if (typeof opts === "string") {
    opts = { mode: parseInt(opts, 8) };
  } else {
    throw new TypeError("invalid options argument");
  }
  const resolved = opts;
  const optsFs = opts.fs || {};
  opts.mkdir = opts.mkdir || optsFs.mkdir || external_fs_namespaceObject.mkdir;
  opts.mkdirAsync = opts.mkdirAsync
    ? opts.mkdirAsync
    : async (path, options) =>
        new Promise((res, rej) =>
          resolved.mkdir(path, options, (er, made) =>
            er ? rej(er) : res(made),
          ),
        );
  opts.stat = opts.stat || optsFs.stat || external_fs_namespaceObject.stat;
  opts.statAsync = opts.statAsync
    ? opts.statAsync
    : async (path) =>
        new Promise((res, rej) =>
          resolved.stat(path, (err, stats) => (err ? rej(err) : res(stats))),
        );
  opts.statSync =
    opts.statSync || optsFs.statSync || external_fs_namespaceObject.statSync;
  opts.mkdirSync =
    opts.mkdirSync || optsFs.mkdirSync || external_fs_namespaceObject.mkdirSync;
  return resolved;
};
const mkdirp_manual_mkdirpManualSync = (path, options, made) => {
  const parent = (0, external_path_namespaceObject.dirname)(path);
  const opts = { ...optsArg(options), recursive: false };
  if (parent === path) {
    try {
      return opts.mkdirSync(path, opts);
    } catch (er) {
      const fer = er;
      if (fer && fer.code !== "EISDIR") {
        throw er;
      }
      return;
    }
  }
  try {
    opts.mkdirSync(path, opts);
    return made || path;
  } catch (er) {
    const fer = er;
    if (fer && fer.code === "ENOENT") {
      return mkdirp_manual_mkdirpManualSync(
        path,
        opts,
        mkdirp_manual_mkdirpManualSync(parent, opts, made),
      );
    }
    if (fer && fer.code !== "EEXIST" && fer && fer.code !== "EROFS") {
      throw er;
    }
    try {
      if (!opts.statSync(path).isDirectory()) throw er;
    } catch (_) {
      throw er;
    }
  }
};
const mkdirp_manual_mkdirpManual = Object.assign(
  async (path, options, made) => {
    const opts = optsArg(options);
    opts.recursive = false;
    const parent = (0, external_path_namespaceObject.dirname)(path);
    if (parent === path) {
      return opts.mkdirAsync(path, opts).catch((er) => {
        const fer = er;
        if (fer && fer.code !== "EISDIR") {
          throw er;
        }
      });
    }
    return opts.mkdirAsync(path, opts).then(
      () => made || path,
      async (er) => {
        const fer = er;
        if (fer && fer.code === "ENOENT") {
          return mkdirp_manual_mkdirpManual(parent, opts).then((made) =>
            mkdirp_manual_mkdirpManual(path, opts, made),
          );
        }
        if (fer && fer.code !== "EEXIST" && fer.code !== "EROFS") {
          throw er;
        }
        return opts.statAsync(path).then(
          (st) => {
            if (st.isDirectory()) {
              return made;
            } else {
              throw er;
            }
          },
          () => {
            throw er;
          },
        );
      },
    );
  },
  { sync: mkdirp_manual_mkdirpManualSync },
);
const findMade = async (opts, parent, path) => {
  if (path === parent) {
    return;
  }
  return opts.statAsync(parent).then(
    (st) => (st.isDirectory() ? path : undefined),
    (er) => {
      const fer = er;
      return fer && fer.code === "ENOENT"
        ? findMade(
            opts,
            (0, external_path_namespaceObject.dirname)(parent),
            parent,
          )
        : undefined;
    },
  );
};
const findMadeSync = (opts, parent, path) => {
  if (path === parent) {
    return undefined;
  }
  try {
    return opts.statSync(parent).isDirectory() ? path : undefined;
  } catch (er) {
    const fer = er;
    return fer && fer.code === "ENOENT"
      ? findMadeSync(
          opts,
          (0, external_path_namespaceObject.dirname)(parent),
          parent,
        )
      : undefined;
  }
};
const mkdirp_native_mkdirpNativeSync = (path, options) => {
  const opts = optsArg(options);
  opts.recursive = true;
  const parent = (0, external_path_namespaceObject.dirname)(path);
  if (parent === path) {
    return opts.mkdirSync(path, opts);
  }
  const made = findMadeSync(opts, path);
  try {
    opts.mkdirSync(path, opts);
    return made;
  } catch (er) {
    const fer = er;
    if (fer && fer.code === "ENOENT") {
      return mkdirp_manual_mkdirpManualSync(path, opts);
    } else {
      throw er;
    }
  }
};
const mkdirp_native_mkdirpNative = Object.assign(
  async (path, options) => {
    const opts = { ...optsArg(options), recursive: true };
    const parent = (0, external_path_namespaceObject.dirname)(path);
    if (parent === path) {
      return await opts.mkdirAsync(path, opts);
    }
    return findMade(opts, path).then((made) =>
      opts
        .mkdirAsync(path, opts)
        .then((m) => made || m)
        .catch((er) => {
          const fer = er;
          if (fer && fer.code === "ENOENT") {
            return mkdirp_manual_mkdirpManual(path, opts);
          } else {
            throw er;
          }
        }),
    );
  },
  { sync: mkdirp_native_mkdirpNativeSync },
);
const path_arg_platform =
  process.env.__TESTING_MKDIRP_PLATFORM__ || process.platform;
const pathArg = (path) => {
  if (/\0/.test(path)) {
    throw Object.assign(
      new TypeError("path must be a string without null bytes"),
      { path, code: "ERR_INVALID_ARG_VALUE" },
    );
  }
  path = (0, external_path_namespaceObject.resolve)(path);
  if (path_arg_platform === "win32") {
    const badWinChars = /[*|"<>?:]/;
    const { root } = (0, external_path_namespaceObject.parse)(path);
    if (badWinChars.test(path.substring(root.length))) {
      throw Object.assign(new Error("Illegal characters in path."), {
        path,
        code: "EINVAL",
      });
    }
  }
  return path;
};
const version = process.env.__TESTING_MKDIRP_NODE_VERSION__ || process.version;
const versArr = version.replace(/^v/, "").split(".");
const hasNative = +versArr[0] > 10 || (+versArr[0] === 10 && +versArr[1] >= 12);
const useNativeSync = !hasNative
  ? () => false
  : (opts) => optsArg(opts).mkdirSync === external_fs_namespaceObject.mkdirSync;
const useNative = Object.assign(
  !hasNative
    ? () => false
    : (opts) => optsArg(opts).mkdir === external_fs_namespaceObject.mkdir,
  { sync: useNativeSync },
);
const mkdirpSync = (path, opts) => {
  path = pathArg(path);
  const resolved = optsArg(opts);
  return useNativeSync(resolved)
    ? mkdirp_native_mkdirpNativeSync(path, resolved)
    : mkdirp_manual_mkdirpManualSync(path, resolved);
};
const sync = null && mkdirpSync;
const manual = null && mkdirpManual;
const manualSync = null && mkdirpManualSync;
const mjs_native = null && mkdirpNative;
const nativeSync = null && mkdirpNativeSync;
const mkdirp = Object.assign(
  async (path, opts) => {
    path = pathArg(path);
    const resolved = optsArg(opts);
    return useNative(resolved)
      ? mkdirp_native_mkdirpNative(path, resolved)
      : mkdirp_manual_mkdirpManual(path, resolved);
  },
  {
    mkdirpSync,
    mkdirpNative: mkdirp_native_mkdirpNative,
    mkdirpNativeSync: mkdirp_native_mkdirpNativeSync,
    mkdirpManual: mkdirp_manual_mkdirpManual,
    mkdirpManualSync: mkdirp_manual_mkdirpManualSync,
    sync: mkdirpSync,
    native: mkdirp_native_mkdirpNative,
    nativeSync: mkdirp_native_mkdirpNativeSync,
    manual: mkdirp_manual_mkdirpManual,
    manualSync: mkdirp_manual_mkdirpManualSync,
    useNative,
    useNativeSync,
  },
);
class CwdError extends Error {
  path;
  code;
  syscall = "chdir";
  constructor(path, code) {
    super(`${code}: Cannot cd into '${path}'`);
    this.path = path;
    this.code = code;
  }
  get name() {
    return "CwdError";
  }
}
class SymlinkError extends Error {
  path;
  symlink;
  syscall = "symlink";
  code = "TAR_SYMLINK_ERROR";
  constructor(symlink, path) {
    super("TAR_SYMLINK_ERROR: Cannot extract through symbolic link");
    this.symlink = symlink;
    this.path = path;
  }
  get name() {
    return "SymlinkError";
  }
}
const cGet = (cache, key) => cache.get(normalizeWindowsPath(key));
const cSet = (cache, key, val) => cache.set(normalizeWindowsPath(key), val);
const checkCwd = (dir, cb) => {
  external_fs_namespaceObject.stat(dir, (er, st) => {
    if (er || !st.isDirectory()) {
      er = new CwdError(dir, er?.code || "ENOTDIR");
    }
    cb(er);
  });
};
const mkdir = (dir, opt, cb) => {
  dir = normalizeWindowsPath(dir);
  const umask = opt.umask ?? 18;
  const mode = opt.mode | 448;
  const needChmod = (mode & umask) !== 0;
  const uid = opt.uid;
  const gid = opt.gid;
  const doChown =
    typeof uid === "number" &&
    typeof gid === "number" &&
    (uid !== opt.processUid || gid !== opt.processGid);
  const preserve = opt.preserve;
  const unlink = opt.unlink;
  const cache = opt.cache;
  const cwd = normalizeWindowsPath(opt.cwd);
  const done = (er, created) => {
    if (er) {
      cb(er);
    } else {
      cSet(cache, dir, true);
      if (created && doChown) {
        chownr(created, uid, gid, (er) => done(er));
      } else if (needChmod) {
        external_fs_namespaceObject.chmod(dir, mode, cb);
      } else {
        cb();
      }
    }
  };
  if (cache && cGet(cache, dir) === true) {
    return done();
  }
  if (dir === cwd) {
    return checkCwd(dir, done);
  }
  if (preserve) {
    return mkdirp(dir, { mode }).then(
      (made) => done(null, made ?? undefined),
      done,
    );
  }
  const sub = normalizeWindowsPath(
    external_node_path_namespaceObject.relative(cwd, dir),
  );
  const parts = sub.split("/");
  mkdir_(cwd, parts, mode, cache, unlink, cwd, undefined, done);
};
const mkdir_ = (base, parts, mode, cache, unlink, cwd, created, cb) => {
  if (!parts.length) {
    return cb(null, created);
  }
  const p = parts.shift();
  const part = normalizeWindowsPath(
    external_node_path_namespaceObject.resolve(base + "/" + p),
  );
  if (cGet(cache, part)) {
    return mkdir_(part, parts, mode, cache, unlink, cwd, created, cb);
  }
  external_fs_namespaceObject.mkdir(
    part,
    mode,
    onmkdir(part, parts, mode, cache, unlink, cwd, created, cb),
  );
};
const onmkdir =
  (part, parts, mode, cache, unlink, cwd, created, cb) => (er) => {
    if (er) {
      external_fs_namespaceObject.lstat(part, (statEr, st) => {
        if (statEr) {
          statEr.path = statEr.path && normalizeWindowsPath(statEr.path);
          cb(statEr);
        } else if (st.isDirectory()) {
          mkdir_(part, parts, mode, cache, unlink, cwd, created, cb);
        } else if (unlink) {
          external_fs_namespaceObject.unlink(part, (er) => {
            if (er) {
              return cb(er);
            }
            external_fs_namespaceObject.mkdir(
              part,
              mode,
              onmkdir(part, parts, mode, cache, unlink, cwd, created, cb),
            );
          });
        } else if (st.isSymbolicLink()) {
          return cb(new SymlinkError(part, part + "/" + parts.join("/")));
        } else {
          cb(er);
        }
      });
    } else {
      created = created || part;
      mkdir_(part, parts, mode, cache, unlink, cwd, created, cb);
    }
  };
const checkCwdSync = (dir) => {
  let ok = false;
  let code = undefined;
  try {
    ok = external_fs_namespaceObject.statSync(dir).isDirectory();
  } catch (er) {
    code = er?.code;
  } finally {
    if (!ok) {
      throw new CwdError(dir, code ?? "ENOTDIR");
    }
  }
};
const mkdirSync = (dir, opt) => {
  dir = normalizeWindowsPath(dir);
  const umask = opt.umask ?? 18;
  const mode = opt.mode | 448;
  const needChmod = (mode & umask) !== 0;
  const uid = opt.uid;
  const gid = opt.gid;
  const doChown =
    typeof uid === "number" &&
    typeof gid === "number" &&
    (uid !== opt.processUid || gid !== opt.processGid);
  const preserve = opt.preserve;
  const unlink = opt.unlink;
  const cache = opt.cache;
  const cwd = normalizeWindowsPath(opt.cwd);
  const done = (created) => {
    cSet(cache, dir, true);
    if (created && doChown) {
      chownrSync(created, uid, gid);
    }
    if (needChmod) {
      external_fs_namespaceObject.chmodSync(dir, mode);
    }
  };
  if (cache && cGet(cache, dir) === true) {
    return done();
  }
  if (dir === cwd) {
    checkCwdSync(cwd);
    return done();
  }
  if (preserve) {
    return done(mkdirpSync(dir, mode) ?? undefined);
  }
  const sub = normalizeWindowsPath(
    external_node_path_namespaceObject.relative(cwd, dir),
  );
  const parts = sub.split("/");
  let created = undefined;
  for (
    let p = parts.shift(), part = cwd;
    p && (part += "/" + p);
    p = parts.shift()
  ) {
    part = normalizeWindowsPath(
      external_node_path_namespaceObject.resolve(part),
    );
    if (cGet(cache, part)) {
      continue;
    }
    try {
      external_fs_namespaceObject.mkdirSync(part, mode);
      created = created || part;
      cSet(cache, part, true);
    } catch (er) {
      const st = external_fs_namespaceObject.lstatSync(part);
      if (st.isDirectory()) {
        cSet(cache, part, true);
        continue;
      } else if (unlink) {
        external_fs_namespaceObject.unlinkSync(part);
        external_fs_namespaceObject.mkdirSync(part, mode);
        created = created || part;
        cSet(cache, part, true);
        continue;
      } else if (st.isSymbolicLink()) {
        return new SymlinkError(part, part + "/" + parts.join("/"));
      }
    }
  }
  return done(created);
};
const normalizeCache = Object.create(null);
const { hasOwnProperty: normalize_unicode_hasOwnProperty } = Object.prototype;
const normalizeUnicode = (s) => {
  if (!normalize_unicode_hasOwnProperty.call(normalizeCache, s)) {
    normalizeCache[s] = s.normalize("NFD");
  }
  return normalizeCache[s];
};
const path_reservations_platform =
  process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
const path_reservations_isWindows = path_reservations_platform === "win32";
const getDirs = (path) => {
  const dirs = path
    .split("/")
    .slice(0, -1)
    .reduce((set, path) => {
      const s = set[set.length - 1];
      if (s !== undefined) {
        path = (0, external_node_path_namespaceObject.join)(s, path);
      }
      set.push(path || "/");
      return set;
    }, []);
  return dirs;
};
class PathReservations {
  #queues = new Map();
  #reservations = new Map();
  #running = new Set();
  reserve(paths, fn) {
    paths = path_reservations_isWindows
      ? ["win32 parallelization disabled"]
      : paths.map((p) =>
          stripTrailingSlashes(
            (0, external_node_path_namespaceObject.join)(normalizeUnicode(p)),
          ).toLowerCase(),
        );
    const dirs = new Set(
      paths.map((path) => getDirs(path)).reduce((a, b) => a.concat(b)),
    );
    this.#reservations.set(fn, { dirs, paths });
    for (const p of paths) {
      const q = this.#queues.get(p);
      if (!q) {
        this.#queues.set(p, [fn]);
      } else {
        q.push(fn);
      }
    }
    for (const dir of dirs) {
      const q = this.#queues.get(dir);
      if (!q) {
        this.#queues.set(dir, [new Set([fn])]);
      } else {
        const l = q[q.length - 1];
        if (l instanceof Set) {
          l.add(fn);
        } else {
          q.push(new Set([fn]));
        }
      }
    }
    return this.#run(fn);
  }
  #getQueues(fn) {
    const res = this.#reservations.get(fn);
    if (!res) {
      throw new Error("function does not have any path reservations");
    }
    return {
      paths: res.paths.map((path) => this.#queues.get(path)),
      dirs: [...res.dirs].map((path) => this.#queues.get(path)),
    };
  }
  check(fn) {
    const { paths, dirs } = this.#getQueues(fn);
    return (
      paths.every((q) => q && q[0] === fn) &&
      dirs.every((q) => q && q[0] instanceof Set && q[0].has(fn))
    );
  }
  #run(fn) {
    if (this.#running.has(fn) || !this.check(fn)) {
      return false;
    }
    this.#running.add(fn);
    fn(() => this.#clear(fn));
    return true;
  }
  #clear(fn) {
    if (!this.#running.has(fn)) {
      return false;
    }
    const res = this.#reservations.get(fn);
    if (!res) {
      throw new Error("invalid reservation");
    }
    const { paths, dirs } = res;
    const next = new Set();
    for (const path of paths) {
      const q = this.#queues.get(path);
      if (!q || q?.[0] !== fn) {
        continue;
      }
      const q0 = q[1];
      if (!q0) {
        this.#queues.delete(path);
        continue;
      }
      q.shift();
      if (typeof q0 === "function") {
        next.add(q0);
      } else {
        for (const f of q0) {
          next.add(f);
        }
      }
    }
    for (const dir of dirs) {
      const q = this.#queues.get(dir);
      const q0 = q?.[0];
      if (!q || !(q0 instanceof Set)) continue;
      if (q0.size === 1 && q.length === 1) {
        this.#queues.delete(dir);
        continue;
      } else if (q0.size === 1) {
        q.shift();
        const n = q[0];
        if (typeof n === "function") {
          next.add(n);
        }
      } else {
        q0.delete(fn);
      }
    }
    this.#running.delete(fn);
    next.forEach((fn) => this.#run(fn));
    return true;
  }
}
const ONENTRY = Symbol("onEntry");
const CHECKFS = Symbol("checkFs");
const CHECKFS2 = Symbol("checkFs2");
const PRUNECACHE = Symbol("pruneCache");
const ISREUSABLE = Symbol("isReusable");
const MAKEFS = Symbol("makeFs");
const unpack_FILE = Symbol("file");
const unpack_DIRECTORY = Symbol("directory");
const LINK = Symbol("link");
const unpack_SYMLINK = Symbol("symlink");
const unpack_HARDLINK = Symbol("hardlink");
const UNSUPPORTED = Symbol("unsupported");
const CHECKPATH = Symbol("checkPath");
const MKDIR = Symbol("mkdir");
const ONERROR = Symbol("onError");
const PENDING = Symbol("pending");
const PEND = Symbol("pend");
const UNPEND = Symbol("unpend");
const unpack_ENDED = Symbol("ended");
const MAYBECLOSE = Symbol("maybeClose");
const SKIP = Symbol("skip");
const DOCHOWN = Symbol("doChown");
const UID = Symbol("uid");
const GID = Symbol("gid");
const CHECKED_CWD = Symbol("checkedCwd");
const unpack_platform =
  process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
const unpack_isWindows = unpack_platform === "win32";
const DEFAULT_MAX_DEPTH = 1024;
const unlinkFile = (path, cb) => {
  if (!unpack_isWindows) {
    return external_node_fs_namespaceObject.unlink(path, cb);
  }
  const name =
    path +
    ".DELETE." +
    (0, external_node_crypto_namespaceObject.randomBytes)(16).toString("hex");
  external_node_fs_namespaceObject.rename(path, name, (er) => {
    if (er) {
      return cb(er);
    }
    external_node_fs_namespaceObject.unlink(name, cb);
  });
};
const unlinkFileSync = (path) => {
  if (!unpack_isWindows) {
    return external_node_fs_namespaceObject.unlinkSync(path);
  }
  const name =
    path +
    ".DELETE." +
    (0, external_node_crypto_namespaceObject.randomBytes)(16).toString("hex");
  external_node_fs_namespaceObject.renameSync(path, name);
  external_node_fs_namespaceObject.unlinkSync(name);
};
const uint32 = (a, b, c) =>
  a !== undefined && a === a >>> 0
    ? a
    : b !== undefined && b === b >>> 0
      ? b
      : c;
const cacheKeyNormalize = (path) =>
  stripTrailingSlashes(
    normalizeWindowsPath(normalizeUnicode(path)),
  ).toLowerCase();
const pruneCache = (cache, abs) => {
  abs = cacheKeyNormalize(abs);
  for (const path of cache.keys()) {
    const pnorm = cacheKeyNormalize(path);
    if (pnorm === abs || pnorm.indexOf(abs + "/") === 0) {
      cache.delete(path);
    }
  }
};
const dropCache = (cache) => {
  for (const key of cache.keys()) {
    cache.delete(key);
  }
};
class Unpack extends Parser {
  [unpack_ENDED] = false;
  [CHECKED_CWD] = false;
  [PENDING] = 0;
  reservations = new PathReservations();
  transform;
  writable = true;
  readable = false;
  dirCache;
  uid;
  gid;
  setOwner;
  preserveOwner;
  processGid;
  processUid;
  maxDepth;
  forceChown;
  win32;
  newer;
  keep;
  noMtime;
  preservePaths;
  unlink;
  cwd;
  strip;
  processUmask;
  umask;
  dmode;
  fmode;
  chmod;
  constructor(opt = {}) {
    opt.ondone = () => {
      this[unpack_ENDED] = true;
      this[MAYBECLOSE]();
    };
    super(opt);
    this.transform = opt.transform;
    this.dirCache = opt.dirCache || new Map();
    this.chmod = !!opt.chmod;
    if (typeof opt.uid === "number" || typeof opt.gid === "number") {
      if (typeof opt.uid !== "number" || typeof opt.gid !== "number") {
        throw new TypeError("cannot set owner without number uid and gid");
      }
      if (opt.preserveOwner) {
        throw new TypeError(
          "cannot preserve owner in archive and also set owner explicitly",
        );
      }
      this.uid = opt.uid;
      this.gid = opt.gid;
      this.setOwner = true;
    } else {
      this.uid = undefined;
      this.gid = undefined;
      this.setOwner = false;
    }
    if (opt.preserveOwner === undefined && typeof opt.uid !== "number") {
      this.preserveOwner = !!(process.getuid && process.getuid() === 0);
    } else {
      this.preserveOwner = !!opt.preserveOwner;
    }
    this.processUid =
      (this.preserveOwner || this.setOwner) && process.getuid
        ? process.getuid()
        : undefined;
    this.processGid =
      (this.preserveOwner || this.setOwner) && process.getgid
        ? process.getgid()
        : undefined;
    this.maxDepth =
      typeof opt.maxDepth === "number" ? opt.maxDepth : DEFAULT_MAX_DEPTH;
    this.forceChown = opt.forceChown === true;
    this.win32 = !!opt.win32 || unpack_isWindows;
    this.newer = !!opt.newer;
    this.keep = !!opt.keep;
    this.noMtime = !!opt.noMtime;
    this.preservePaths = !!opt.preservePaths;
    this.unlink = !!opt.unlink;
    this.cwd = normalizeWindowsPath(
      external_node_path_namespaceObject.resolve(opt.cwd || process.cwd()),
    );
    this.strip = Number(opt.strip) || 0;
    this.processUmask = !this.chmod
      ? 0
      : typeof opt.processUmask === "number"
        ? opt.processUmask
        : process.umask();
    this.umask = typeof opt.umask === "number" ? opt.umask : this.processUmask;
    this.dmode = opt.dmode || 511 & ~this.umask;
    this.fmode = opt.fmode || 438 & ~this.umask;
    this.on("entry", (entry) => this[ONENTRY](entry));
  }
  warn(code, msg, data = {}) {
    if (code === "TAR_BAD_ARCHIVE" || code === "TAR_ABORT") {
      data.recoverable = false;
    }
    return super.warn(code, msg, data);
  }
  [MAYBECLOSE]() {
    if (this[unpack_ENDED] && this[PENDING] === 0) {
      this.emit("prefinish");
      this.emit("finish");
      this.emit("end");
    }
  }
  [CHECKPATH](entry) {
    const p = normalizeWindowsPath(entry.path);
    const parts = p.split("/");
    if (this.strip) {
      if (parts.length < this.strip) {
        return false;
      }
      if (entry.type === "Link") {
        const linkparts = normalizeWindowsPath(String(entry.linkpath)).split(
          "/",
        );
        if (linkparts.length >= this.strip) {
          entry.linkpath = linkparts.slice(this.strip).join("/");
        } else {
          return false;
        }
      }
      parts.splice(0, this.strip);
      entry.path = parts.join("/");
    }
    if (isFinite(this.maxDepth) && parts.length > this.maxDepth) {
      this.warn("TAR_ENTRY_ERROR", "path excessively deep", {
        entry,
        path: p,
        depth: parts.length,
        maxDepth: this.maxDepth,
      });
      return false;
    }
    if (!this.preservePaths) {
      if (
        parts.includes("..") ||
        (unpack_isWindows && /^[a-z]:\.\.$/i.test(parts[0] ?? ""))
      ) {
        this.warn("TAR_ENTRY_ERROR", `path contains '..'`, { entry, path: p });
        return false;
      }
      const [root, stripped] = stripAbsolutePath(p);
      if (root) {
        entry.path = String(stripped);
        this.warn("TAR_ENTRY_INFO", `stripping ${root} from absolute path`, {
          entry,
          path: p,
        });
      }
    }
    if (external_node_path_namespaceObject.isAbsolute(entry.path)) {
      entry.absolute = normalizeWindowsPath(
        external_node_path_namespaceObject.resolve(entry.path),
      );
    } else {
      entry.absolute = normalizeWindowsPath(
        external_node_path_namespaceObject.resolve(this.cwd, entry.path),
      );
    }
    if (
      !this.preservePaths &&
      typeof entry.absolute === "string" &&
      entry.absolute.indexOf(this.cwd + "/") !== 0 &&
      entry.absolute !== this.cwd
    ) {
      this.warn("TAR_ENTRY_ERROR", "path escaped extraction target", {
        entry,
        path: normalizeWindowsPath(entry.path),
        resolvedPath: entry.absolute,
        cwd: this.cwd,
      });
      return false;
    }
    if (
      entry.absolute === this.cwd &&
      entry.type !== "Directory" &&
      entry.type !== "GNUDumpDir"
    ) {
      return false;
    }
    if (this.win32) {
      const { root: aRoot } = external_node_path_namespaceObject.win32.parse(
        String(entry.absolute),
      );
      entry.absolute =
        aRoot + winchars_encode(String(entry.absolute).slice(aRoot.length));
      const { root: pRoot } = external_node_path_namespaceObject.win32.parse(
        entry.path,
      );
      entry.path = pRoot + winchars_encode(entry.path.slice(pRoot.length));
    }
    return true;
  }
  [ONENTRY](entry) {
    if (!this[CHECKPATH](entry)) {
      return entry.resume();
    }
    external_node_assert_namespaceObject.equal(typeof entry.absolute, "string");
    switch (entry.type) {
      case "Directory":
      case "GNUDumpDir":
        if (entry.mode) {
          entry.mode = entry.mode | 448;
        }
      case "File":
      case "OldFile":
      case "ContiguousFile":
      case "Link":
      case "SymbolicLink":
        return this[CHECKFS](entry);
      case "CharacterDevice":
      case "BlockDevice":
      case "FIFO":
      default:
        return this[UNSUPPORTED](entry);
    }
  }
  [ONERROR](er, entry) {
    if (er.name === "CwdError") {
      this.emit("error", er);
    } else {
      this.warn("TAR_ENTRY_ERROR", er, { entry });
      this[UNPEND]();
      entry.resume();
    }
  }
  [MKDIR](dir, mode, cb) {
    mkdir(
      normalizeWindowsPath(dir),
      {
        uid: this.uid,
        gid: this.gid,
        processUid: this.processUid,
        processGid: this.processGid,
        umask: this.processUmask,
        preserve: this.preservePaths,
        unlink: this.unlink,
        cache: this.dirCache,
        cwd: this.cwd,
        mode,
      },
      cb,
    );
  }
  [DOCHOWN](entry) {
    return (
      this.forceChown ||
      (this.preserveOwner &&
        ((typeof entry.uid === "number" && entry.uid !== this.processUid) ||
          (typeof entry.gid === "number" && entry.gid !== this.processGid))) ||
      (typeof this.uid === "number" && this.uid !== this.processUid) ||
      (typeof this.gid === "number" && this.gid !== this.processGid)
    );
  }
  [UID](entry) {
    return uint32(this.uid, entry.uid, this.processUid);
  }
  [GID](entry) {
    return uint32(this.gid, entry.gid, this.processGid);
  }
  [unpack_FILE](entry, fullyDone) {
    const mode =
      typeof entry.mode === "number" ? entry.mode & 4095 : this.fmode;
    const stream = new WriteStream(String(entry.absolute), {
      flags: getWriteFlag(entry.size),
      mode,
      autoClose: false,
    });
    stream.on("error", (er) => {
      if (stream.fd) {
        external_node_fs_namespaceObject.close(stream.fd, () => {});
      }
      stream.write = () => true;
      this[ONERROR](er, entry);
      fullyDone();
    });
    let actions = 1;
    const done = (er) => {
      if (er) {
        if (stream.fd) {
          external_node_fs_namespaceObject.close(stream.fd, () => {});
        }
        this[ONERROR](er, entry);
        fullyDone();
        return;
      }
      if (--actions === 0) {
        if (stream.fd !== undefined) {
          external_node_fs_namespaceObject.close(stream.fd, (er) => {
            if (er) {
              this[ONERROR](er, entry);
            } else {
              this[UNPEND]();
            }
            fullyDone();
          });
        }
      }
    };
    stream.on("finish", () => {
      const abs = String(entry.absolute);
      const fd = stream.fd;
      if (typeof fd === "number" && entry.mtime && !this.noMtime) {
        actions++;
        const atime = entry.atime || new Date();
        const mtime = entry.mtime;
        external_node_fs_namespaceObject.futimes(fd, atime, mtime, (er) =>
          er
            ? external_node_fs_namespaceObject.utimes(
                abs,
                atime,
                mtime,
                (er2) => done(er2 && er),
              )
            : done(),
        );
      }
      if (typeof fd === "number" && this[DOCHOWN](entry)) {
        actions++;
        const uid = this[UID](entry);
        const gid = this[GID](entry);
        if (typeof uid === "number" && typeof gid === "number") {
          external_node_fs_namespaceObject.fchown(fd, uid, gid, (er) =>
            er
              ? external_node_fs_namespaceObject.chown(abs, uid, gid, (er2) =>
                  done(er2 && er),
                )
              : done(),
          );
        }
      }
      done();
    });
    const tx = this.transform ? this.transform(entry) || entry : entry;
    if (tx !== entry) {
      tx.on("error", (er) => {
        this[ONERROR](er, entry);
        fullyDone();
      });
      entry.pipe(tx);
    }
    tx.pipe(stream);
  }
  [unpack_DIRECTORY](entry, fullyDone) {
    const mode =
      typeof entry.mode === "number" ? entry.mode & 4095 : this.dmode;
    this[MKDIR](String(entry.absolute), mode, (er) => {
      if (er) {
        this[ONERROR](er, entry);
        fullyDone();
        return;
      }
      let actions = 1;
      const done = () => {
        if (--actions === 0) {
          fullyDone();
          this[UNPEND]();
          entry.resume();
        }
      };
      if (entry.mtime && !this.noMtime) {
        actions++;
        external_node_fs_namespaceObject.utimes(
          String(entry.absolute),
          entry.atime || new Date(),
          entry.mtime,
          done,
        );
      }
      if (this[DOCHOWN](entry)) {
        actions++;
        external_node_fs_namespaceObject.chown(
          String(entry.absolute),
          Number(this[UID](entry)),
          Number(this[GID](entry)),
          done,
        );
      }
      done();
    });
  }
  [UNSUPPORTED](entry) {
    entry.unsupported = true;
    this.warn(
      "TAR_ENTRY_UNSUPPORTED",
      `unsupported entry type: ${entry.type}`,
      { entry },
    );
    entry.resume();
  }
  [unpack_SYMLINK](entry, done) {
    this[LINK](entry, String(entry.linkpath), "symlink", done);
  }
  [unpack_HARDLINK](entry, done) {
    const linkpath = normalizeWindowsPath(
      external_node_path_namespaceObject.resolve(
        this.cwd,
        String(entry.linkpath),
      ),
    );
    this[LINK](entry, linkpath, "link", done);
  }
  [PEND]() {
    this[PENDING]++;
  }
  [UNPEND]() {
    this[PENDING]--;
    this[MAYBECLOSE]();
  }
  [SKIP](entry) {
    this[UNPEND]();
    entry.resume();
  }
  [ISREUSABLE](entry, st) {
    return (
      entry.type === "File" &&
      !this.unlink &&
      st.isFile() &&
      st.nlink <= 1 &&
      !unpack_isWindows
    );
  }
  [CHECKFS](entry) {
    this[PEND]();
    const paths = [entry.path];
    if (entry.linkpath) {
      paths.push(entry.linkpath);
    }
    this.reservations.reserve(paths, (done) => this[CHECKFS2](entry, done));
  }
  [PRUNECACHE](entry) {
    if (entry.type === "SymbolicLink") {
      dropCache(this.dirCache);
    } else if (entry.type !== "Directory") {
      pruneCache(this.dirCache, String(entry.absolute));
    }
  }
  [CHECKFS2](entry, fullyDone) {
    this[PRUNECACHE](entry);
    const done = (er) => {
      this[PRUNECACHE](entry);
      fullyDone(er);
    };
    const checkCwd = () => {
      this[MKDIR](this.cwd, this.dmode, (er) => {
        if (er) {
          this[ONERROR](er, entry);
          done();
          return;
        }
        this[CHECKED_CWD] = true;
        start();
      });
    };
    const start = () => {
      if (entry.absolute !== this.cwd) {
        const parent = normalizeWindowsPath(
          external_node_path_namespaceObject.dirname(String(entry.absolute)),
        );
        if (parent !== this.cwd) {
          return this[MKDIR](parent, this.dmode, (er) => {
            if (er) {
              this[ONERROR](er, entry);
              done();
              return;
            }
            afterMakeParent();
          });
        }
      }
      afterMakeParent();
    };
    const afterMakeParent = () => {
      external_node_fs_namespaceObject.lstat(
        String(entry.absolute),
        (lstatEr, st) => {
          if (
            st &&
            (this.keep || (this.newer && st.mtime > (entry.mtime ?? st.mtime)))
          ) {
            this[SKIP](entry);
            done();
            return;
          }
          if (lstatEr || this[ISREUSABLE](entry, st)) {
            return this[MAKEFS](null, entry, done);
          }
          if (st.isDirectory()) {
            if (entry.type === "Directory") {
              const needChmod =
                this.chmod && entry.mode && (st.mode & 4095) !== entry.mode;
              const afterChmod = (er) => this[MAKEFS](er ?? null, entry, done);
              if (!needChmod) {
                return afterChmod();
              }
              return external_node_fs_namespaceObject.chmod(
                String(entry.absolute),
                Number(entry.mode),
                afterChmod,
              );
            }
            if (entry.absolute !== this.cwd) {
              return external_node_fs_namespaceObject.rmdir(
                String(entry.absolute),
                (er) => this[MAKEFS](er ?? null, entry, done),
              );
            }
          }
          if (entry.absolute === this.cwd) {
            return this[MAKEFS](null, entry, done);
          }
          unlinkFile(String(entry.absolute), (er) =>
            this[MAKEFS](er ?? null, entry, done),
          );
        },
      );
    };
    if (this[CHECKED_CWD]) {
      start();
    } else {
      checkCwd();
    }
  }
  [MAKEFS](er, entry, done) {
    if (er) {
      this[ONERROR](er, entry);
      done();
      return;
    }
    switch (entry.type) {
      case "File":
      case "OldFile":
      case "ContiguousFile":
        return this[unpack_FILE](entry, done);
      case "Link":
        return this[unpack_HARDLINK](entry, done);
      case "SymbolicLink":
        return this[unpack_SYMLINK](entry, done);
      case "Directory":
      case "GNUDumpDir":
        return this[unpack_DIRECTORY](entry, done);
    }
  }
  [LINK](entry, linkpath, link, done) {
    external_node_fs_namespaceObject[link](
      linkpath,
      String(entry.absolute),
      (er) => {
        if (er) {
          this[ONERROR](er, entry);
        } else {
          this[UNPEND]();
          entry.resume();
        }
        done();
      },
    );
  }
}
const callSync = (fn) => {
  try {
    return [null, fn()];
  } catch (er) {
    return [er, null];
  }
};
class UnpackSync extends Unpack {
  sync = true;
  [MAKEFS](er, entry) {
    return super[MAKEFS](er, entry, () => {});
  }
  [CHECKFS](entry) {
    this[PRUNECACHE](entry);
    if (!this[CHECKED_CWD]) {
      const er = this[MKDIR](this.cwd, this.dmode);
      if (er) {
        return this[ONERROR](er, entry);
      }
      this[CHECKED_CWD] = true;
    }
    if (entry.absolute !== this.cwd) {
      const parent = normalizeWindowsPath(
        external_node_path_namespaceObject.dirname(String(entry.absolute)),
      );
      if (parent !== this.cwd) {
        const mkParent = this[MKDIR](parent, this.dmode);
        if (mkParent) {
          return this[ONERROR](mkParent, entry);
        }
      }
    }
    const [lstatEr, st] = callSync(() =>
      external_node_fs_namespaceObject.lstatSync(String(entry.absolute)),
    );
    if (
      st &&
      (this.keep || (this.newer && st.mtime > (entry.mtime ?? st.mtime)))
    ) {
      return this[SKIP](entry);
    }
    if (lstatEr || this[ISREUSABLE](entry, st)) {
      return this[MAKEFS](null, entry);
    }
    if (st.isDirectory()) {
      if (entry.type === "Directory") {
        const needChmod =
          this.chmod && entry.mode && (st.mode & 4095) !== entry.mode;
        const [er] = needChmod
          ? callSync(() => {
              external_node_fs_namespaceObject.chmodSync(
                String(entry.absolute),
                Number(entry.mode),
              );
            })
          : [];
        return this[MAKEFS](er, entry);
      }
      const [er] = callSync(() =>
        external_node_fs_namespaceObject.rmdirSync(String(entry.absolute)),
      );
      this[MAKEFS](er, entry);
    }
    const [er] =
      entry.absolute === this.cwd
        ? []
        : callSync(() => unlinkFileSync(String(entry.absolute)));
    this[MAKEFS](er, entry);
  }
  [unpack_FILE](entry, done) {
    const mode =
      typeof entry.mode === "number" ? entry.mode & 4095 : this.fmode;
    const oner = (er) => {
      let closeError;
      try {
        external_node_fs_namespaceObject.closeSync(fd);
      } catch (e) {
        closeError = e;
      }
      if (er || closeError) {
        this[ONERROR](er || closeError, entry);
      }
      done();
    };
    let fd;
    try {
      fd = external_node_fs_namespaceObject.openSync(
        String(entry.absolute),
        getWriteFlag(entry.size),
        mode,
      );
    } catch (er) {
      return oner(er);
    }
    const tx = this.transform ? this.transform(entry) || entry : entry;
    if (tx !== entry) {
      tx.on("error", (er) => this[ONERROR](er, entry));
      entry.pipe(tx);
    }
    tx.on("data", (chunk) => {
      try {
        external_node_fs_namespaceObject.writeSync(fd, chunk, 0, chunk.length);
      } catch (er) {
        oner(er);
      }
    });
    tx.on("end", () => {
      let er = null;
      if (entry.mtime && !this.noMtime) {
        const atime = entry.atime || new Date();
        const mtime = entry.mtime;
        try {
          external_node_fs_namespaceObject.futimesSync(fd, atime, mtime);
        } catch (futimeser) {
          try {
            external_node_fs_namespaceObject.utimesSync(
              String(entry.absolute),
              atime,
              mtime,
            );
          } catch (utimeser) {
            er = futimeser;
          }
        }
      }
      if (this[DOCHOWN](entry)) {
        const uid = this[UID](entry);
        const gid = this[GID](entry);
        try {
          external_node_fs_namespaceObject.fchownSync(
            fd,
            Number(uid),
            Number(gid),
          );
        } catch (fchowner) {
          try {
            external_node_fs_namespaceObject.chownSync(
              String(entry.absolute),
              Number(uid),
              Number(gid),
            );
          } catch (chowner) {
            er = er || fchowner;
          }
        }
      }
      oner(er);
    });
  }
  [unpack_DIRECTORY](entry, done) {
    const mode =
      typeof entry.mode === "number" ? entry.mode & 4095 : this.dmode;
    const er = this[MKDIR](String(entry.absolute), mode);
    if (er) {
      this[ONERROR](er, entry);
      done();
      return;
    }
    if (entry.mtime && !this.noMtime) {
      try {
        external_node_fs_namespaceObject.utimesSync(
          String(entry.absolute),
          entry.atime || new Date(),
          entry.mtime,
        );
      } catch (er) {}
    }
    if (this[DOCHOWN](entry)) {
      try {
        external_node_fs_namespaceObject.chownSync(
          String(entry.absolute),
          Number(this[UID](entry)),
          Number(this[GID](entry)),
        );
      } catch (er) {}
    }
    done();
    entry.resume();
  }
  [MKDIR](dir, mode) {
    try {
      return mkdirSync(normalizeWindowsPath(dir), {
        uid: this.uid,
        gid: this.gid,
        processUid: this.processUid,
        processGid: this.processGid,
        umask: this.processUmask,
        preserve: this.preservePaths,
        unlink: this.unlink,
        cache: this.dirCache,
        cwd: this.cwd,
        mode,
      });
    } catch (er) {
      return er;
    }
  }
  [LINK](entry, linkpath, link, done) {
    const ls = `${link}Sync`;
    try {
      external_node_fs_namespaceObject[ls](linkpath, String(entry.absolute));
      done();
      entry.resume();
    } catch (er) {
      return this[ONERROR](er, entry);
    }
  }
}
const extractFileSync = (opt) => {
  const u = new UnpackSync(opt);
  const file = opt.file;
  const stat = external_node_fs_namespaceObject.statSync(file);
  const readSize = opt.maxReadSize || 16 * 1024 * 1024;
  const stream = new ReadStreamSync(file, { readSize, size: stat.size });
  stream.pipe(u);
};
const extractFile = (opt, _) => {
  const u = new Unpack(opt);
  const readSize = opt.maxReadSize || 16 * 1024 * 1024;
  const file = opt.file;
  const p = new Promise((resolve, reject) => {
    u.on("error", reject);
    u.on("close", resolve);
    external_node_fs_namespaceObject.stat(file, (er, stat) => {
      if (er) {
        reject(er);
      } else {
        const stream = new ReadStream(file, { readSize, size: stat.size });
        stream.on("error", reject);
        stream.pipe(u);
      }
    });
  });
  return p;
};
const extract = makeCommand(
  extractFileSync,
  extractFile,
  (opt) => new UnpackSync(opt),
  (opt) => new Unpack(opt),
  (opt, files) => {
    if (files?.length) filesFilter(opt, files);
  },
);
const replaceSync = (opt, files) => {
  const p = new PackSync(opt);
  let threw = true;
  let fd;
  let position;
  try {
    try {
      fd = external_node_fs_namespaceObject.openSync(opt.file, "r+");
    } catch (er) {
      if (er?.code === "ENOENT") {
        fd = external_node_fs_namespaceObject.openSync(opt.file, "w+");
      } else {
        throw er;
      }
    }
    const st = external_node_fs_namespaceObject.fstatSync(fd);
    const headBuf = Buffer.alloc(512);
    POSITION: for (position = 0; position < st.size; position += 512) {
      for (let bufPos = 0, bytes = 0; bufPos < 512; bufPos += bytes) {
        bytes = external_node_fs_namespaceObject.readSync(
          fd,
          headBuf,
          bufPos,
          headBuf.length - bufPos,
          position + bufPos,
        );
        if (position === 0 && headBuf[0] === 31 && headBuf[1] === 139) {
          throw new Error("cannot append to compressed archives");
        }
        if (!bytes) {
          break POSITION;
        }
      }
      const h = new Header(headBuf);
      if (!h.cksumValid) {
        break;
      }
      const entryBlockSize = 512 * Math.ceil((h.size || 0) / 512);
      if (position + entryBlockSize + 512 > st.size) {
        break;
      }
      position += entryBlockSize;
      if (opt.mtimeCache && h.mtime) {
        opt.mtimeCache.set(String(h.path), h.mtime);
      }
    }
    threw = false;
    streamSync(opt, p, position, fd, files);
  } finally {
    if (threw) {
      try {
        external_node_fs_namespaceObject.closeSync(fd);
      } catch (er) {}
    }
  }
};
const streamSync = (opt, p, position, fd, files) => {
  const stream = new WriteStreamSync(opt.file, { fd, start: position });
  p.pipe(stream);
  replace_addFilesSync(p, files);
};
const replaceAsync = (opt, files) => {
  files = Array.from(files);
  const p = new Pack(opt);
  const getPos = (fd, size, cb_) => {
    const cb = (er, pos) => {
      if (er) {
        external_node_fs_namespaceObject.close(fd, (_) => cb_(er));
      } else {
        cb_(null, pos);
      }
    };
    let position = 0;
    if (size === 0) {
      return cb(null, 0);
    }
    let bufPos = 0;
    const headBuf = Buffer.alloc(512);
    const onread = (er, bytes) => {
      if (er || typeof bytes === "undefined") {
        return cb(er);
      }
      bufPos += bytes;
      if (bufPos < 512 && bytes) {
        return external_node_fs_namespaceObject.read(
          fd,
          headBuf,
          bufPos,
          headBuf.length - bufPos,
          position + bufPos,
          onread,
        );
      }
      if (position === 0 && headBuf[0] === 31 && headBuf[1] === 139) {
        return cb(new Error("cannot append to compressed archives"));
      }
      if (bufPos < 512) {
        return cb(null, position);
      }
      const h = new Header(headBuf);
      if (!h.cksumValid) {
        return cb(null, position);
      }
      const entryBlockSize = 512 * Math.ceil((h.size ?? 0) / 512);
      if (position + entryBlockSize + 512 > size) {
        return cb(null, position);
      }
      position += entryBlockSize + 512;
      if (position >= size) {
        return cb(null, position);
      }
      if (opt.mtimeCache && h.mtime) {
        opt.mtimeCache.set(String(h.path), h.mtime);
      }
      bufPos = 0;
      external_node_fs_namespaceObject.read(
        fd,
        headBuf,
        0,
        512,
        position,
        onread,
      );
    };
    external_node_fs_namespaceObject.read(
      fd,
      headBuf,
      0,
      512,
      position,
      onread,
    );
  };
  const promise = new Promise((resolve, reject) => {
    p.on("error", reject);
    let flag = "r+";
    const onopen = (er, fd) => {
      if (er && er.code === "ENOENT" && flag === "r+") {
        flag = "w+";
        return external_node_fs_namespaceObject.open(opt.file, flag, onopen);
      }
      if (er || !fd) {
        return reject(er);
      }
      external_node_fs_namespaceObject.fstat(fd, (er, st) => {
        if (er) {
          return external_node_fs_namespaceObject.close(fd, () => reject(er));
        }
        getPos(fd, st.size, (er, position) => {
          if (er) {
            return reject(er);
          }
          const stream = new WriteStream(opt.file, { fd, start: position });
          p.pipe(stream);
          stream.on("error", reject);
          stream.on("close", resolve);
          replace_addFilesAsync(p, files);
        });
      });
    };
    external_node_fs_namespaceObject.open(opt.file, flag, onopen);
  });
  return promise;
};
const replace_addFilesSync = (p, files) => {
  files.forEach((file) => {
    if (file.charAt(0) === "@") {
      list({
        file: external_node_path_namespaceObject.resolve(p.cwd, file.slice(1)),
        sync: true,
        noResume: true,
        onReadEntry: (entry) => p.add(entry),
      });
    } else {
      p.add(file);
    }
  });
  p.end();
};
const replace_addFilesAsync = async (p, files) => {
  for (let i = 0; i < files.length; i++) {
    const file = String(files[i]);
    if (file.charAt(0) === "@") {
      await list({
        file: external_node_path_namespaceObject.resolve(
          String(p.cwd),
          file.slice(1),
        ),
        noResume: true,
        onReadEntry: (entry) => p.add(entry),
      });
    } else {
      p.add(file);
    }
  }
  p.end();
};
const replace = makeCommand(
  replaceSync,
  replaceAsync,
  () => {
    throw new TypeError("file is required");
  },
  () => {
    throw new TypeError("file is required");
  },
  (opt, entries) => {
    if (!isFile(opt)) {
      throw new TypeError("file is required");
    }
    if (
      opt.gzip ||
      opt.brotli ||
      opt.file.endsWith(".br") ||
      opt.file.endsWith(".tbr")
    ) {
      throw new TypeError("cannot append to compressed archives");
    }
    if (!entries?.length) {
      throw new TypeError("no paths specified to add/replace");
    }
  },
);
const update = makeCommand(
  replace.syncFile,
  replace.asyncFile,
  replace.syncNoFile,
  replace.asyncNoFile,
  (opt, entries = []) => {
    replace.validate?.(opt, entries);
    mtimeFilter(opt);
  },
);
const mtimeFilter = (opt) => {
  const filter = opt.filter;
  if (!opt.mtimeCache) {
    opt.mtimeCache = new Map();
  }
  opt.filter = filter
    ? (path, stat) =>
        filter(path, stat) &&
        !((opt.mtimeCache?.get(path) ?? stat.mtime ?? 0) > (stat.mtime ?? 0))
    : (path, stat) =>
        !((opt.mtimeCache?.get(path) ?? stat.mtime ?? 0) > (stat.mtime ?? 0));
};
var __webpack_exports__Header = __webpack_exports__.h4;
var __webpack_exports__Pack = __webpack_exports__.Qi;
var __webpack_exports__PackJob = __webpack_exports__.nF;
var __webpack_exports__PackSync = __webpack_exports__.Yg;
var __webpack_exports__Parser = __webpack_exports__._b;
var __webpack_exports__Pax = __webpack_exports__.Jd;
var __webpack_exports__ReadEntry = __webpack_exports__.OH;
var __webpack_exports__Unpack = __webpack_exports__.To;
var __webpack_exports__UnpackSync = __webpack_exports__.qE;
var __webpack_exports__WriteEntry = __webpack_exports__.Vi;
var __webpack_exports__WriteEntrySync = __webpack_exports__.OD;
var __webpack_exports__WriteEntryTar = __webpack_exports__.hq;
var __webpack_exports__c = __webpack_exports__.c;
var __webpack_exports__create = __webpack_exports__.Ue;
var __webpack_exports__extract = __webpack_exports__.Kl;
var __webpack_exports__filesFilter = __webpack_exports__.nw;
var __webpack_exports__list = __webpack_exports__.pb;
var __webpack_exports__r = __webpack_exports__.r;
var __webpack_exports__replace = __webpack_exports__.gx;
var __webpack_exports__t = __webpack_exports__.t;
var __webpack_exports__types = __webpack_exports__.V5;
var __webpack_exports__u = __webpack_exports__.u;
var __webpack_exports__update = __webpack_exports__.Vx;
var __webpack_exports__x = __webpack_exports__.x;
export {
  __webpack_exports__Header as Header,
  __webpack_exports__Pack as Pack,
  __webpack_exports__PackJob as PackJob,
  __webpack_exports__PackSync as PackSync,
  __webpack_exports__Parser as Parser,
  __webpack_exports__Pax as Pax,
  __webpack_exports__ReadEntry as ReadEntry,
  __webpack_exports__Unpack as Unpack,
  __webpack_exports__UnpackSync as UnpackSync,
  __webpack_exports__WriteEntry as WriteEntry,
  __webpack_exports__WriteEntrySync as WriteEntrySync,
  __webpack_exports__WriteEntryTar as WriteEntryTar,
  __webpack_exports__c as c,
  __webpack_exports__create as create,
  __webpack_exports__extract as extract,
  __webpack_exports__filesFilter as filesFilter,
  __webpack_exports__list as list,
  __webpack_exports__r as r,
  __webpack_exports__replace as replace,
  __webpack_exports__t as t,
  __webpack_exports__types as types,
  __webpack_exports__u as u,
  __webpack_exports__update as update,
  __webpack_exports__x as x,
};
