(() => {
  var __webpack_modules__ = {
    532: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const ANY = Symbol("SemVer ANY");
      class Comparator {
        static get ANY() {
          return ANY;
        }
        constructor(comp, options) {
          options = parseOptions(options);
          if (comp instanceof Comparator) {
            if (comp.loose === !!options.loose) {
              return comp;
            } else {
              comp = comp.value;
            }
          }
          comp = comp.trim().split(/\s+/).join(" ");
          debug("comparator", comp, options);
          this.options = options;
          this.loose = !!options.loose;
          this.parse(comp);
          if (this.semver === ANY) {
            this.value = "";
          } else {
            this.value = this.operator + this.semver.version;
          }
          debug("comp", this);
        }
        parse(comp) {
          const r = this.options.loose
            ? re[t.COMPARATORLOOSE]
            : re[t.COMPARATOR];
          const m = comp.match(r);
          if (!m) {
            throw new TypeError(`Invalid comparator: ${comp}`);
          }
          this.operator = m[1] !== undefined ? m[1] : "";
          if (this.operator === "=") {
            this.operator = "";
          }
          if (!m[2]) {
            this.semver = ANY;
          } else {
            this.semver = new SemVer(m[2], this.options.loose);
          }
        }
        toString() {
          return this.value;
        }
        test(version) {
          debug("Comparator.test", version, this.options.loose);
          if (this.semver === ANY || version === ANY) {
            return true;
          }
          if (typeof version === "string") {
            try {
              version = new SemVer(version, this.options);
            } catch (er) {
              return false;
            }
          }
          return cmp(version, this.operator, this.semver, this.options);
        }
        intersects(comp, options) {
          if (!(comp instanceof Comparator)) {
            throw new TypeError("a Comparator is required");
          }
          if (this.operator === "") {
            if (this.value === "") {
              return true;
            }
            return new Range(comp.value, options).test(this.value);
          } else if (comp.operator === "") {
            if (comp.value === "") {
              return true;
            }
            return new Range(this.value, options).test(comp.semver);
          }
          options = parseOptions(options);
          if (
            options.includePrerelease &&
            (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")
          ) {
            return false;
          }
          if (
            !options.includePrerelease &&
            (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))
          ) {
            return false;
          }
          if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
            return true;
          }
          if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
            return true;
          }
          if (
            this.semver.version === comp.semver.version &&
            this.operator.includes("=") &&
            comp.operator.includes("=")
          ) {
            return true;
          }
          if (
            cmp(this.semver, "<", comp.semver, options) &&
            this.operator.startsWith(">") &&
            comp.operator.startsWith("<")
          ) {
            return true;
          }
          if (
            cmp(this.semver, ">", comp.semver, options) &&
            this.operator.startsWith("<") &&
            comp.operator.startsWith(">")
          ) {
            return true;
          }
          return false;
        }
      }
      module.exports = Comparator;
      const parseOptions = __nccwpck_require__(785);
      const { safeRe: re, t } = __nccwpck_require__(523);
      const cmp = __nccwpck_require__(98);
      const debug = __nccwpck_require__(427);
      const SemVer = __nccwpck_require__(88);
      const Range = __nccwpck_require__(828);
    },
    828: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const SPACE_CHARACTERS = /\s+/g;
      class Range {
        constructor(range, options) {
          options = parseOptions(options);
          if (range instanceof Range) {
            if (
              range.loose === !!options.loose &&
              range.includePrerelease === !!options.includePrerelease
            ) {
              return range;
            } else {
              return new Range(range.raw, options);
            }
          }
          if (range instanceof Comparator) {
            this.raw = range.value;
            this.set = [[range]];
            this.formatted = undefined;
            return this;
          }
          this.options = options;
          this.loose = !!options.loose;
          this.includePrerelease = !!options.includePrerelease;
          this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
          this.set = this.raw
            .split("||")
            .map((r) => this.parseRange(r.trim()))
            .filter((c) => c.length);
          if (!this.set.length) {
            throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
          }
          if (this.set.length > 1) {
            const first = this.set[0];
            this.set = this.set.filter((c) => !isNullSet(c[0]));
            if (this.set.length === 0) {
              this.set = [first];
            } else if (this.set.length > 1) {
              for (const c of this.set) {
                if (c.length === 1 && isAny(c[0])) {
                  this.set = [c];
                  break;
                }
              }
            }
          }
          this.formatted = undefined;
        }
        get range() {
          if (this.formatted === undefined) {
            this.formatted = "";
            for (let i = 0; i < this.set.length; i++) {
              if (i > 0) {
                this.formatted += "||";
              }
              const comps = this.set[i];
              for (let k = 0; k < comps.length; k++) {
                if (k > 0) {
                  this.formatted += " ";
                }
                this.formatted += comps[k].toString().trim();
              }
            }
          }
          return this.formatted;
        }
        format() {
          return this.range;
        }
        toString() {
          return this.range;
        }
        parseRange(range) {
          const memoOpts =
            (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) |
            (this.options.loose && FLAG_LOOSE);
          const memoKey = memoOpts + ":" + range;
          const cached = cache.get(memoKey);
          if (cached) {
            return cached;
          }
          const loose = this.options.loose;
          const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
          range = range.replace(
            hr,
            hyphenReplace(this.options.includePrerelease),
          );
          debug("hyphen replace", range);
          range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
          debug("comparator trim", range);
          range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
          debug("tilde trim", range);
          range = range.replace(re[t.CARETTRIM], caretTrimReplace);
          debug("caret trim", range);
          let rangeList = range
            .split(" ")
            .map((comp) => parseComparator(comp, this.options))
            .join(" ")
            .split(/\s+/)
            .map((comp) => replaceGTE0(comp, this.options));
          if (loose) {
            rangeList = rangeList.filter((comp) => {
              debug("loose invalid filter", comp, this.options);
              return !!comp.match(re[t.COMPARATORLOOSE]);
            });
          }
          debug("range list", rangeList);
          const rangeMap = new Map();
          const comparators = rangeList.map(
            (comp) => new Comparator(comp, this.options),
          );
          for (const comp of comparators) {
            if (isNullSet(comp)) {
              return [comp];
            }
            rangeMap.set(comp.value, comp);
          }
          if (rangeMap.size > 1 && rangeMap.has("")) {
            rangeMap.delete("");
          }
          const result = [...rangeMap.values()];
          cache.set(memoKey, result);
          return result;
        }
        intersects(range, options) {
          if (!(range instanceof Range)) {
            throw new TypeError("a Range is required");
          }
          return this.set.some(
            (thisComparators) =>
              isSatisfiable(thisComparators, options) &&
              range.set.some(
                (rangeComparators) =>
                  isSatisfiable(rangeComparators, options) &&
                  thisComparators.every((thisComparator) =>
                    rangeComparators.every((rangeComparator) =>
                      thisComparator.intersects(rangeComparator, options),
                    ),
                  ),
              ),
          );
        }
        test(version) {
          if (!version) {
            return false;
          }
          if (typeof version === "string") {
            try {
              version = new SemVer(version, this.options);
            } catch (er) {
              return false;
            }
          }
          for (let i = 0; i < this.set.length; i++) {
            if (testSet(this.set[i], version, this.options)) {
              return true;
            }
          }
          return false;
        }
      }
      module.exports = Range;
      const LRU = __nccwpck_require__(339);
      const cache = new LRU();
      const parseOptions = __nccwpck_require__(785);
      const Comparator = __nccwpck_require__(532);
      const debug = __nccwpck_require__(427);
      const SemVer = __nccwpck_require__(88);
      const {
        safeRe: re,
        t,
        comparatorTrimReplace,
        tildeTrimReplace,
        caretTrimReplace,
      } = __nccwpck_require__(523);
      const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = __nccwpck_require__(293);
      const isNullSet = (c) => c.value === "<0.0.0-0";
      const isAny = (c) => c.value === "";
      const isSatisfiable = (comparators, options) => {
        let result = true;
        const remainingComparators = comparators.slice();
        let testComparator = remainingComparators.pop();
        while (result && remainingComparators.length) {
          result = remainingComparators.every((otherComparator) =>
            testComparator.intersects(otherComparator, options),
          );
          testComparator = remainingComparators.pop();
        }
        return result;
      };
      const parseComparator = (comp, options) => {
        debug("comp", comp, options);
        comp = replaceCarets(comp, options);
        debug("caret", comp);
        comp = replaceTildes(comp, options);
        debug("tildes", comp);
        comp = replaceXRanges(comp, options);
        debug("xrange", comp);
        comp = replaceStars(comp, options);
        debug("stars", comp);
        return comp;
      };
      const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
      const replaceTildes = (comp, options) =>
        comp
          .trim()
          .split(/\s+/)
          .map((c) => replaceTilde(c, options))
          .join(" ");
      const replaceTilde = (comp, options) => {
        const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
        return comp.replace(r, (_, M, m, p, pr) => {
          debug("tilde", comp, _, M, m, p, pr);
          let ret;
          if (isX(M)) {
            ret = "";
          } else if (isX(m)) {
            ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
          } else if (isX(p)) {
            ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
          } else if (pr) {
            debug("replaceTilde pr", pr);
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
          }
          debug("tilde return", ret);
          return ret;
        });
      };
      const replaceCarets = (comp, options) =>
        comp
          .trim()
          .split(/\s+/)
          .map((c) => replaceCaret(c, options))
          .join(" ");
      const replaceCaret = (comp, options) => {
        debug("caret", comp, options);
        const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
        const z = options.includePrerelease ? "-0" : "";
        return comp.replace(r, (_, M, m, p, pr) => {
          debug("caret", comp, _, M, m, p, pr);
          let ret;
          if (isX(M)) {
            ret = "";
          } else if (isX(m)) {
            ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
          } else if (isX(p)) {
            if (M === "0") {
              ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
            } else {
              ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
            }
          } else if (pr) {
            debug("replaceCaret pr", pr);
            if (M === "0") {
              if (m === "0") {
                ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
              } else {
                ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
              }
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
            }
          } else {
            debug("no pr");
            if (M === "0") {
              if (m === "0") {
                ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
              } else {
                ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
              }
            } else {
              ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
            }
          }
          debug("caret return", ret);
          return ret;
        });
      };
      const replaceXRanges = (comp, options) => {
        debug("replaceXRanges", comp, options);
        return comp
          .split(/\s+/)
          .map((c) => replaceXRange(c, options))
          .join(" ");
      };
      const replaceXRange = (comp, options) => {
        comp = comp.trim();
        const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
        return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
          debug("xRange", comp, ret, gtlt, M, m, p, pr);
          const xM = isX(M);
          const xm = xM || isX(m);
          const xp = xm || isX(p);
          const anyX = xp;
          if (gtlt === "=" && anyX) {
            gtlt = "";
          }
          pr = options.includePrerelease ? "-0" : "";
          if (xM) {
            if (gtlt === ">" || gtlt === "<") {
              ret = "<0.0.0-0";
            } else {
              ret = "*";
            }
          } else if (gtlt && anyX) {
            if (xm) {
              m = 0;
            }
            p = 0;
            if (gtlt === ">") {
              gtlt = ">=";
              if (xm) {
                M = +M + 1;
                m = 0;
                p = 0;
              } else {
                m = +m + 1;
                p = 0;
              }
            } else if (gtlt === "<=") {
              gtlt = "<";
              if (xm) {
                M = +M + 1;
              } else {
                m = +m + 1;
              }
            }
            if (gtlt === "<") {
              pr = "-0";
            }
            ret = `${gtlt + M}.${m}.${p}${pr}`;
          } else if (xm) {
            ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
          } else if (xp) {
            ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
          }
          debug("xRange return", ret);
          return ret;
        });
      };
      const replaceStars = (comp, options) => {
        debug("replaceStars", comp, options);
        return comp.trim().replace(re[t.STAR], "");
      };
      const replaceGTE0 = (comp, options) => {
        debug("replaceGTE0", comp, options);
        return comp
          .trim()
          .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
      };
      const hyphenReplace =
        (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
          if (isX(fM)) {
            from = "";
          } else if (isX(fm)) {
            from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
          } else if (isX(fp)) {
            from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
          } else if (fpr) {
            from = `>=${from}`;
          } else {
            from = `>=${from}${incPr ? "-0" : ""}`;
          }
          if (isX(tM)) {
            to = "";
          } else if (isX(tm)) {
            to = `<${+tM + 1}.0.0-0`;
          } else if (isX(tp)) {
            to = `<${tM}.${+tm + 1}.0-0`;
          } else if (tpr) {
            to = `<=${tM}.${tm}.${tp}-${tpr}`;
          } else if (incPr) {
            to = `<${tM}.${tm}.${+tp + 1}-0`;
          } else {
            to = `<=${to}`;
          }
          return `${from} ${to}`.trim();
        };
      const testSet = (set, version, options) => {
        for (let i = 0; i < set.length; i++) {
          if (!set[i].test(version)) {
            return false;
          }
        }
        if (version.prerelease.length && !options.includePrerelease) {
          for (let i = 0; i < set.length; i++) {
            debug(set[i].semver);
            if (set[i].semver === Comparator.ANY) {
              continue;
            }
            if (set[i].semver.prerelease.length > 0) {
              const allowed = set[i].semver;
              if (
                allowed.major === version.major &&
                allowed.minor === version.minor &&
                allowed.patch === version.patch
              ) {
                return true;
              }
            }
          }
          return false;
        }
        return true;
      };
    },
    88: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const debug = __nccwpck_require__(427);
      const { MAX_LENGTH, MAX_SAFE_INTEGER } = __nccwpck_require__(293);
      const { safeRe: re, t } = __nccwpck_require__(523);
      const parseOptions = __nccwpck_require__(785);
      const { compareIdentifiers } = __nccwpck_require__(463);
      class SemVer {
        constructor(version, options) {
          options = parseOptions(options);
          if (version instanceof SemVer) {
            if (
              version.loose === !!options.loose &&
              version.includePrerelease === !!options.includePrerelease
            ) {
              return version;
            } else {
              version = version.version;
            }
          } else if (typeof version !== "string") {
            throw new TypeError(
              `Invalid version. Must be a string. Got type "${typeof version}".`,
            );
          }
          if (version.length > MAX_LENGTH) {
            throw new TypeError(
              `version is longer than ${MAX_LENGTH} characters`,
            );
          }
          debug("SemVer", version, options);
          this.options = options;
          this.loose = !!options.loose;
          this.includePrerelease = !!options.includePrerelease;
          const m = version
            .trim()
            .match(options.loose ? re[t.LOOSE] : re[t.FULL]);
          if (!m) {
            throw new TypeError(`Invalid Version: ${version}`);
          }
          this.raw = version;
          this.major = +m[1];
          this.minor = +m[2];
          this.patch = +m[3];
          if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
            throw new TypeError("Invalid major version");
          }
          if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
            throw new TypeError("Invalid minor version");
          }
          if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
            throw new TypeError("Invalid patch version");
          }
          if (!m[4]) {
            this.prerelease = [];
          } else {
            this.prerelease = m[4].split(".").map((id) => {
              if (/^[0-9]+$/.test(id)) {
                const num = +id;
                if (num >= 0 && num < MAX_SAFE_INTEGER) {
                  return num;
                }
              }
              return id;
            });
          }
          this.build = m[5] ? m[5].split(".") : [];
          this.format();
        }
        format() {
          this.version = `${this.major}.${this.minor}.${this.patch}`;
          if (this.prerelease.length) {
            this.version += `-${this.prerelease.join(".")}`;
          }
          return this.version;
        }
        toString() {
          return this.version;
        }
        compare(other) {
          debug("SemVer.compare", this.version, this.options, other);
          if (!(other instanceof SemVer)) {
            if (typeof other === "string" && other === this.version) {
              return 0;
            }
            other = new SemVer(other, this.options);
          }
          if (other.version === this.version) {
            return 0;
          }
          return this.compareMain(other) || this.comparePre(other);
        }
        compareMain(other) {
          if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
          }
          return (
            compareIdentifiers(this.major, other.major) ||
            compareIdentifiers(this.minor, other.minor) ||
            compareIdentifiers(this.patch, other.patch)
          );
        }
        comparePre(other) {
          if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
          }
          if (this.prerelease.length && !other.prerelease.length) {
            return -1;
          } else if (!this.prerelease.length && other.prerelease.length) {
            return 1;
          } else if (!this.prerelease.length && !other.prerelease.length) {
            return 0;
          }
          let i = 0;
          do {
            const a = this.prerelease[i];
            const b = other.prerelease[i];
            debug("prerelease compare", i, a, b);
            if (a === undefined && b === undefined) {
              return 0;
            } else if (b === undefined) {
              return 1;
            } else if (a === undefined) {
              return -1;
            } else if (a === b) {
              continue;
            } else {
              return compareIdentifiers(a, b);
            }
          } while (++i);
        }
        compareBuild(other) {
          if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
          }
          let i = 0;
          do {
            const a = this.build[i];
            const b = other.build[i];
            debug("build compare", i, a, b);
            if (a === undefined && b === undefined) {
              return 0;
            } else if (b === undefined) {
              return 1;
            } else if (a === undefined) {
              return -1;
            } else if (a === b) {
              continue;
            } else {
              return compareIdentifiers(a, b);
            }
          } while (++i);
        }
        inc(release, identifier, identifierBase) {
          switch (release) {
            case "premajor":
              this.prerelease.length = 0;
              this.patch = 0;
              this.minor = 0;
              this.major++;
              this.inc("pre", identifier, identifierBase);
              break;
            case "preminor":
              this.prerelease.length = 0;
              this.patch = 0;
              this.minor++;
              this.inc("pre", identifier, identifierBase);
              break;
            case "prepatch":
              this.prerelease.length = 0;
              this.inc("patch", identifier, identifierBase);
              this.inc("pre", identifier, identifierBase);
              break;
            case "prerelease":
              if (this.prerelease.length === 0) {
                this.inc("patch", identifier, identifierBase);
              }
              this.inc("pre", identifier, identifierBase);
              break;
            case "major":
              if (
                this.minor !== 0 ||
                this.patch !== 0 ||
                this.prerelease.length === 0
              ) {
                this.major++;
              }
              this.minor = 0;
              this.patch = 0;
              this.prerelease = [];
              break;
            case "minor":
              if (this.patch !== 0 || this.prerelease.length === 0) {
                this.minor++;
              }
              this.patch = 0;
              this.prerelease = [];
              break;
            case "patch":
              if (this.prerelease.length === 0) {
                this.patch++;
              }
              this.prerelease = [];
              break;
            case "pre": {
              const base = Number(identifierBase) ? 1 : 0;
              if (!identifier && identifierBase === false) {
                throw new Error(
                  "invalid increment argument: identifier is empty",
                );
              }
              if (this.prerelease.length === 0) {
                this.prerelease = [base];
              } else {
                let i = this.prerelease.length;
                while (--i >= 0) {
                  if (typeof this.prerelease[i] === "number") {
                    this.prerelease[i]++;
                    i = -2;
                  }
                }
                if (i === -1) {
                  if (
                    identifier === this.prerelease.join(".") &&
                    identifierBase === false
                  ) {
                    throw new Error(
                      "invalid increment argument: identifier already exists",
                    );
                  }
                  this.prerelease.push(base);
                }
              }
              if (identifier) {
                let prerelease = [identifier, base];
                if (identifierBase === false) {
                  prerelease = [identifier];
                }
                if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                  if (isNaN(this.prerelease[1])) {
                    this.prerelease = prerelease;
                  }
                } else {
                  this.prerelease = prerelease;
                }
              }
              break;
            }
            default:
              throw new Error(`invalid increment argument: ${release}`);
          }
          this.raw = this.format();
          if (this.build.length) {
            this.raw += `+${this.build.join(".")}`;
          }
          return this;
        }
      }
      module.exports = SemVer;
    },
    848: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const parse = __nccwpck_require__(925);
      const clean = (version, options) => {
        const s = parse(version.trim().replace(/^[=v]+/, ""), options);
        return s ? s.version : null;
      };
      module.exports = clean;
    },
    98: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const eq = __nccwpck_require__(898);
      const neq = __nccwpck_require__(17);
      const gt = __nccwpck_require__(123);
      const gte = __nccwpck_require__(522);
      const lt = __nccwpck_require__(194);
      const lte = __nccwpck_require__(520);
      const cmp = (a, op, b, loose) => {
        switch (op) {
          case "===":
            if (typeof a === "object") {
              a = a.version;
            }
            if (typeof b === "object") {
              b = b.version;
            }
            return a === b;
          case "!==":
            if (typeof a === "object") {
              a = a.version;
            }
            if (typeof b === "object") {
              b = b.version;
            }
            return a !== b;
          case "":
          case "=":
          case "==":
            return eq(a, b, loose);
          case "!=":
            return neq(a, b, loose);
          case ">":
            return gt(a, b, loose);
          case ">=":
            return gte(a, b, loose);
          case "<":
            return lt(a, b, loose);
          case "<=":
            return lte(a, b, loose);
          default:
            throw new TypeError(`Invalid operator: ${op}`);
        }
      };
      module.exports = cmp;
    },
    466: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const SemVer = __nccwpck_require__(88);
      const parse = __nccwpck_require__(925);
      const { safeRe: re, t } = __nccwpck_require__(523);
      const coerce = (version, options) => {
        if (version instanceof SemVer) {
          return version;
        }
        if (typeof version === "number") {
          version = String(version);
        }
        if (typeof version !== "string") {
          return null;
        }
        options = options || {};
        let match = null;
        if (!options.rtl) {
          match = version.match(
            options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE],
          );
        } else {
          const coerceRtlRegex = options.includePrerelease
            ? re[t.COERCERTLFULL]
            : re[t.COERCERTL];
          let next;
          while (
            (next = coerceRtlRegex.exec(version)) &&
            (!match || match.index + match[0].length !== version.length)
          ) {
            if (
              !match ||
              next.index + next[0].length !== match.index + match[0].length
            ) {
              match = next;
            }
            coerceRtlRegex.lastIndex =
              next.index + next[1].length + next[2].length;
          }
          coerceRtlRegex.lastIndex = -1;
        }
        if (match === null) {
          return null;
        }
        const major = match[2];
        const minor = match[3] || "0";
        const patch = match[4] || "0";
        const prerelease =
          options.includePrerelease && match[5] ? `-${match[5]}` : "";
        const build =
          options.includePrerelease && match[6] ? `+${match[6]}` : "";
        return parse(
          `${major}.${minor}.${patch}${prerelease}${build}`,
          options,
        );
      };
      module.exports = coerce;
    },
    156: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const SemVer = __nccwpck_require__(88);
      const compareBuild = (a, b, loose) => {
        const versionA = new SemVer(a, loose);
        const versionB = new SemVer(b, loose);
        return versionA.compare(versionB) || versionA.compareBuild(versionB);
      };
      module.exports = compareBuild;
    },
    804: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const compare = __nccwpck_require__(309);
      const compareLoose = (a, b) => compare(a, b, true);
      module.exports = compareLoose;
    },
    309: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const SemVer = __nccwpck_require__(88);
      const compare = (a, b, loose) =>
        new SemVer(a, loose).compare(new SemVer(b, loose));
      module.exports = compare;
    },
    297: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const parse = __nccwpck_require__(925);
      const diff = (version1, version2) => {
        const v1 = parse(version1, null, true);
        const v2 = parse(version2, null, true);
        const comparison = v1.compare(v2);
        if (comparison === 0) {
          return null;
        }
        const v1Higher = comparison > 0;
        const highVersion = v1Higher ? v1 : v2;
        const lowVersion = v1Higher ? v2 : v1;
        const highHasPre = !!highVersion.prerelease.length;
        const lowHasPre = !!lowVersion.prerelease.length;
        if (lowHasPre && !highHasPre) {
          if (!lowVersion.patch && !lowVersion.minor) {
            return "major";
          }
          if (highVersion.patch) {
            return "patch";
          }
          if (highVersion.minor) {
            return "minor";
          }
          return "major";
        }
        const prefix = highHasPre ? "pre" : "";
        if (v1.major !== v2.major) {
          return prefix + "major";
        }
        if (v1.minor !== v2.minor) {
          return prefix + "minor";
        }
        if (v1.patch !== v2.patch) {
          return prefix + "patch";
        }
        return "prerelease";
      };
      module.exports = diff;
    },
    898: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const compare = __nccwpck_require__(309);
      const eq = (a, b, loose) => compare(a, b, loose) === 0;
      module.exports = eq;
    },
    123: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const compare = __nccwpck_require__(309);
      const gt = (a, b, loose) => compare(a, b, loose) > 0;
      module.exports = gt;
    },
    522: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const compare = __nccwpck_require__(309);
      const gte = (a, b, loose) => compare(a, b, loose) >= 0;
      module.exports = gte;
    },
    900: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const SemVer = __nccwpck_require__(88);
      const inc = (version, release, options, identifier, identifierBase) => {
        if (typeof options === "string") {
          identifierBase = identifier;
          identifier = options;
          options = undefined;
        }
        try {
          return new SemVer(
            version instanceof SemVer ? version.version : version,
            options,
          ).inc(release, identifier, identifierBase).version;
        } catch (er) {
          return null;
        }
      };
      module.exports = inc;
    },
    194: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const compare = __nccwpck_require__(309);
      const lt = (a, b, loose) => compare(a, b, loose) < 0;
      module.exports = lt;
    },
    520: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const compare = __nccwpck_require__(309);
      const lte = (a, b, loose) => compare(a, b, loose) <= 0;
      module.exports = lte;
    },
    688: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const SemVer = __nccwpck_require__(88);
      const major = (a, loose) => new SemVer(a, loose).major;
      module.exports = major;
    },
    447: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const SemVer = __nccwpck_require__(88);
      const minor = (a, loose) => new SemVer(a, loose).minor;
      module.exports = minor;
    },
    17: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const compare = __nccwpck_require__(309);
      const neq = (a, b, loose) => compare(a, b, loose) !== 0;
      module.exports = neq;
    },
    925: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const SemVer = __nccwpck_require__(88);
      const parse = (version, options, throwErrors = false) => {
        if (version instanceof SemVer) {
          return version;
        }
        try {
          return new SemVer(version, options);
        } catch (er) {
          if (!throwErrors) {
            return null;
          }
          throw er;
        }
      };
      module.exports = parse;
    },
    866: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const SemVer = __nccwpck_require__(88);
      const patch = (a, loose) => new SemVer(a, loose).patch;
      module.exports = patch;
    },
    16: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const parse = __nccwpck_require__(925);
      const prerelease = (version, options) => {
        const parsed = parse(version, options);
        return parsed && parsed.prerelease.length ? parsed.prerelease : null;
      };
      module.exports = prerelease;
    },
    417: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const compare = __nccwpck_require__(309);
      const rcompare = (a, b, loose) => compare(b, a, loose);
      module.exports = rcompare;
    },
    701: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const compareBuild = __nccwpck_require__(156);
      const rsort = (list, loose) =>
        list.sort((a, b) => compareBuild(b, a, loose));
      module.exports = rsort;
    },
    55: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const Range = __nccwpck_require__(828);
      const satisfies = (version, range, options) => {
        try {
          range = new Range(range, options);
        } catch (er) {
          return false;
        }
        return range.test(version);
      };
      module.exports = satisfies;
    },
    426: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const compareBuild = __nccwpck_require__(156);
      const sort = (list, loose) =>
        list.sort((a, b) => compareBuild(a, b, loose));
      module.exports = sort;
    },
    601: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const parse = __nccwpck_require__(925);
      const valid = (version, options) => {
        const v = parse(version, options);
        return v ? v.version : null;
      };
      module.exports = valid;
    },
    383: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const internalRe = __nccwpck_require__(523);
      const constants = __nccwpck_require__(293);
      const SemVer = __nccwpck_require__(88);
      const identifiers = __nccwpck_require__(463);
      const parse = __nccwpck_require__(925);
      const valid = __nccwpck_require__(601);
      const clean = __nccwpck_require__(848);
      const inc = __nccwpck_require__(900);
      const diff = __nccwpck_require__(297);
      const major = __nccwpck_require__(688);
      const minor = __nccwpck_require__(447);
      const patch = __nccwpck_require__(866);
      const prerelease = __nccwpck_require__(16);
      const compare = __nccwpck_require__(309);
      const rcompare = __nccwpck_require__(417);
      const compareLoose = __nccwpck_require__(804);
      const compareBuild = __nccwpck_require__(156);
      const sort = __nccwpck_require__(426);
      const rsort = __nccwpck_require__(701);
      const gt = __nccwpck_require__(123);
      const lt = __nccwpck_require__(194);
      const eq = __nccwpck_require__(898);
      const neq = __nccwpck_require__(17);
      const gte = __nccwpck_require__(522);
      const lte = __nccwpck_require__(520);
      const cmp = __nccwpck_require__(98);
      const coerce = __nccwpck_require__(466);
      const Comparator = __nccwpck_require__(532);
      const Range = __nccwpck_require__(828);
      const satisfies = __nccwpck_require__(55);
      const toComparators = __nccwpck_require__(706);
      const maxSatisfying = __nccwpck_require__(579);
      const minSatisfying = __nccwpck_require__(832);
      const minVersion = __nccwpck_require__(179);
      const validRange = __nccwpck_require__(741);
      const outside = __nccwpck_require__(420);
      const gtr = __nccwpck_require__(380);
      const ltr = __nccwpck_require__(323);
      const intersects = __nccwpck_require__(8);
      const simplifyRange = __nccwpck_require__(561);
      const subset = __nccwpck_require__(863);
      module.exports = {
        parse,
        valid,
        clean,
        inc,
        diff,
        major,
        minor,
        patch,
        prerelease,
        compare,
        rcompare,
        compareLoose,
        compareBuild,
        sort,
        rsort,
        gt,
        lt,
        eq,
        neq,
        gte,
        lte,
        cmp,
        coerce,
        Comparator,
        Range,
        satisfies,
        toComparators,
        maxSatisfying,
        minSatisfying,
        minVersion,
        validRange,
        outside,
        gtr,
        ltr,
        intersects,
        simplifyRange,
        subset,
        SemVer,
        re: internalRe.re,
        src: internalRe.src,
        tokens: internalRe.t,
        SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
        RELEASE_TYPES: constants.RELEASE_TYPES,
        compareIdentifiers: identifiers.compareIdentifiers,
        rcompareIdentifiers: identifiers.rcompareIdentifiers,
      };
    },
    293: (module) => {
      const SEMVER_SPEC_VERSION = "2.0.0";
      const MAX_LENGTH = 256;
      const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
      const MAX_SAFE_COMPONENT_LENGTH = 16;
      const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
      const RELEASE_TYPES = [
        "major",
        "premajor",
        "minor",
        "preminor",
        "patch",
        "prepatch",
        "prerelease",
      ];
      module.exports = {
        MAX_LENGTH,
        MAX_SAFE_COMPONENT_LENGTH,
        MAX_SAFE_BUILD_LENGTH,
        MAX_SAFE_INTEGER,
        RELEASE_TYPES,
        SEMVER_SPEC_VERSION,
        FLAG_INCLUDE_PRERELEASE: 1,
        FLAG_LOOSE: 2,
      };
    },
    427: (module) => {
      const debug =
        typeof process === "object" &&
        process.env &&
        process.env.NODE_DEBUG &&
        /\bsemver\b/i.test(process.env.NODE_DEBUG)
          ? (...args) => console.error("SEMVER", ...args)
          : () => {};
      module.exports = debug;
    },
    463: (module) => {
      const numeric = /^[0-9]+$/;
      const compareIdentifiers = (a, b) => {
        const anum = numeric.test(a);
        const bnum = numeric.test(b);
        if (anum && bnum) {
          a = +a;
          b = +b;
        }
        return a === b
          ? 0
          : anum && !bnum
            ? -1
            : bnum && !anum
              ? 1
              : a < b
                ? -1
                : 1;
      };
      const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
      module.exports = { compareIdentifiers, rcompareIdentifiers };
    },
    339: (module) => {
      class LRUCache {
        constructor() {
          this.max = 1e3;
          this.map = new Map();
        }
        get(key) {
          const value = this.map.get(key);
          if (value === undefined) {
            return undefined;
          } else {
            this.map.delete(key);
            this.map.set(key, value);
            return value;
          }
        }
        delete(key) {
          return this.map.delete(key);
        }
        set(key, value) {
          const deleted = this.delete(key);
          if (!deleted && value !== undefined) {
            if (this.map.size >= this.max) {
              const firstKey = this.map.keys().next().value;
              this.delete(firstKey);
            }
            this.map.set(key, value);
          }
          return this;
        }
      }
      module.exports = LRUCache;
    },
    785: (module) => {
      const looseOption = Object.freeze({ loose: true });
      const emptyOpts = Object.freeze({});
      const parseOptions = (options) => {
        if (!options) {
          return emptyOpts;
        }
        if (typeof options !== "object") {
          return looseOption;
        }
        return options;
      };
      module.exports = parseOptions;
    },
    523: (module, exports, __nccwpck_require__) => {
      const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } =
        __nccwpck_require__(293);
      const debug = __nccwpck_require__(427);
      exports = module.exports = {};
      const re = (exports.re = []);
      const safeRe = (exports.safeRe = []);
      const src = (exports.src = []);
      const t = (exports.t = {});
      let R = 0;
      const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
      const safeRegexReplacements = [
        ["\\s", 1],
        ["\\d", MAX_LENGTH],
        [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH],
      ];
      const makeSafeRegex = (value) => {
        for (const [token, max] of safeRegexReplacements) {
          value = value
            .split(`${token}*`)
            .join(`${token}{0,${max}}`)
            .split(`${token}+`)
            .join(`${token}{1,${max}}`);
        }
        return value;
      };
      const createToken = (name, value, isGlobal) => {
        const safe = makeSafeRegex(value);
        const index = R++;
        debug(name, index, value);
        t[name] = index;
        src[index] = value;
        re[index] = new RegExp(value, isGlobal ? "g" : undefined);
        safeRe[index] = new RegExp(safe, isGlobal ? "g" : undefined);
      };
      createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
      createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
      createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
      createToken(
        "MAINVERSION",
        `(${src[t.NUMERICIDENTIFIER]})\\.` +
          `(${src[t.NUMERICIDENTIFIER]})\\.` +
          `(${src[t.NUMERICIDENTIFIER]})`,
      );
      createToken(
        "MAINVERSIONLOOSE",
        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
          `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
          `(${src[t.NUMERICIDENTIFIERLOOSE]})`,
      );
      createToken(
        "PRERELEASEIDENTIFIER",
        `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`,
      );
      createToken(
        "PRERELEASEIDENTIFIERLOOSE",
        `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`,
      );
      createToken(
        "PRERELEASE",
        `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`,
      );
      createToken(
        "PRERELEASELOOSE",
        `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`,
      );
      createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
      createToken(
        "BUILD",
        `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`,
      );
      createToken(
        "FULLPLAIN",
        `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`,
      );
      createToken("FULL", `^${src[t.FULLPLAIN]}$`);
      createToken(
        "LOOSEPLAIN",
        `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`,
      );
      createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
      createToken("GTLT", "((?:<|>)?=?)");
      createToken(
        "XRANGEIDENTIFIERLOOSE",
        `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`,
      );
      createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
      createToken(
        "XRANGEPLAIN",
        `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
          `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
          `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
          `(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?` +
          `)?)?`,
      );
      createToken(
        "XRANGEPLAINLOOSE",
        `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
          `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
          `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
          `(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?` +
          `)?)?`,
      );
      createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
      createToken(
        "XRANGELOOSE",
        `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`,
      );
      createToken(
        "COERCEPLAIN",
        `${"(^|[^\\d])" + "(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})` +
          `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
          `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`,
      );
      createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
      createToken(
        "COERCEFULL",
        src[t.COERCEPLAIN] +
          `(?:${src[t.PRERELEASE]})?` +
          `(?:${src[t.BUILD]})?` +
          `(?:$|[^\\d])`,
      );
      createToken("COERCERTL", src[t.COERCE], true);
      createToken("COERCERTLFULL", src[t.COERCEFULL], true);
      createToken("LONETILDE", "(?:~>?)");
      createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
      exports.tildeTrimReplace = "$1~";
      createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
      createToken(
        "TILDELOOSE",
        `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`,
      );
      createToken("LONECARET", "(?:\\^)");
      createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
      exports.caretTrimReplace = "$1^";
      createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
      createToken(
        "CARETLOOSE",
        `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`,
      );
      createToken(
        "COMPARATORLOOSE",
        `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`,
      );
      createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
      createToken(
        "COMPARATORTRIM",
        `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`,
        true,
      );
      exports.comparatorTrimReplace = "$1$2$3";
      createToken(
        "HYPHENRANGE",
        `^\\s*(${src[t.XRANGEPLAIN]})` +
          `\\s+-\\s+` +
          `(${src[t.XRANGEPLAIN]})` +
          `\\s*$`,
      );
      createToken(
        "HYPHENRANGELOOSE",
        `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
          `\\s+-\\s+` +
          `(${src[t.XRANGEPLAINLOOSE]})` +
          `\\s*$`,
      );
      createToken("STAR", "(<|>)?=?\\s*\\*");
      createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
      createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
    },
    380: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const outside = __nccwpck_require__(420);
      const gtr = (version, range, options) =>
        outside(version, range, ">", options);
      module.exports = gtr;
    },
    8: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const Range = __nccwpck_require__(828);
      const intersects = (r1, r2, options) => {
        r1 = new Range(r1, options);
        r2 = new Range(r2, options);
        return r1.intersects(r2, options);
      };
      module.exports = intersects;
    },
    323: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const outside = __nccwpck_require__(420);
      const ltr = (version, range, options) =>
        outside(version, range, "<", options);
      module.exports = ltr;
    },
    579: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const SemVer = __nccwpck_require__(88);
      const Range = __nccwpck_require__(828);
      const maxSatisfying = (versions, range, options) => {
        let max = null;
        let maxSV = null;
        let rangeObj = null;
        try {
          rangeObj = new Range(range, options);
        } catch (er) {
          return null;
        }
        versions.forEach((v) => {
          if (rangeObj.test(v)) {
            if (!max || maxSV.compare(v) === -1) {
              max = v;
              maxSV = new SemVer(max, options);
            }
          }
        });
        return max;
      };
      module.exports = maxSatisfying;
    },
    832: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const SemVer = __nccwpck_require__(88);
      const Range = __nccwpck_require__(828);
      const minSatisfying = (versions, range, options) => {
        let min = null;
        let minSV = null;
        let rangeObj = null;
        try {
          rangeObj = new Range(range, options);
        } catch (er) {
          return null;
        }
        versions.forEach((v) => {
          if (rangeObj.test(v)) {
            if (!min || minSV.compare(v) === 1) {
              min = v;
              minSV = new SemVer(min, options);
            }
          }
        });
        return min;
      };
      module.exports = minSatisfying;
    },
    179: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const SemVer = __nccwpck_require__(88);
      const Range = __nccwpck_require__(828);
      const gt = __nccwpck_require__(123);
      const minVersion = (range, loose) => {
        range = new Range(range, loose);
        let minver = new SemVer("0.0.0");
        if (range.test(minver)) {
          return minver;
        }
        minver = new SemVer("0.0.0-0");
        if (range.test(minver)) {
          return minver;
        }
        minver = null;
        for (let i = 0; i < range.set.length; ++i) {
          const comparators = range.set[i];
          let setMin = null;
          comparators.forEach((comparator) => {
            const compver = new SemVer(comparator.semver.version);
            switch (comparator.operator) {
              case ">":
                if (compver.prerelease.length === 0) {
                  compver.patch++;
                } else {
                  compver.prerelease.push(0);
                }
                compver.raw = compver.format();
              case "":
              case ">=":
                if (!setMin || gt(compver, setMin)) {
                  setMin = compver;
                }
                break;
              case "<":
              case "<=":
                break;
              default:
                throw new Error(`Unexpected operation: ${comparator.operator}`);
            }
          });
          if (setMin && (!minver || gt(minver, setMin))) {
            minver = setMin;
          }
        }
        if (minver && range.test(minver)) {
          return minver;
        }
        return null;
      };
      module.exports = minVersion;
    },
    420: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const SemVer = __nccwpck_require__(88);
      const Comparator = __nccwpck_require__(532);
      const { ANY } = Comparator;
      const Range = __nccwpck_require__(828);
      const satisfies = __nccwpck_require__(55);
      const gt = __nccwpck_require__(123);
      const lt = __nccwpck_require__(194);
      const lte = __nccwpck_require__(520);
      const gte = __nccwpck_require__(522);
      const outside = (version, range, hilo, options) => {
        version = new SemVer(version, options);
        range = new Range(range, options);
        let gtfn, ltefn, ltfn, comp, ecomp;
        switch (hilo) {
          case ">":
            gtfn = gt;
            ltefn = lte;
            ltfn = lt;
            comp = ">";
            ecomp = ">=";
            break;
          case "<":
            gtfn = lt;
            ltefn = gte;
            ltfn = gt;
            comp = "<";
            ecomp = "<=";
            break;
          default:
            throw new TypeError('Must provide a hilo val of "<" or ">"');
        }
        if (satisfies(version, range, options)) {
          return false;
        }
        for (let i = 0; i < range.set.length; ++i) {
          const comparators = range.set[i];
          let high = null;
          let low = null;
          comparators.forEach((comparator) => {
            if (comparator.semver === ANY) {
              comparator = new Comparator(">=0.0.0");
            }
            high = high || comparator;
            low = low || comparator;
            if (gtfn(comparator.semver, high.semver, options)) {
              high = comparator;
            } else if (ltfn(comparator.semver, low.semver, options)) {
              low = comparator;
            }
          });
          if (high.operator === comp || high.operator === ecomp) {
            return false;
          }
          if (
            (!low.operator || low.operator === comp) &&
            ltefn(version, low.semver)
          ) {
            return false;
          } else if (low.operator === ecomp && ltfn(version, low.semver)) {
            return false;
          }
        }
        return true;
      };
      module.exports = outside;
    },
    561: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const satisfies = __nccwpck_require__(55);
      const compare = __nccwpck_require__(309);
      module.exports = (versions, range, options) => {
        const set = [];
        let first = null;
        let prev = null;
        const v = versions.sort((a, b) => compare(a, b, options));
        for (const version of v) {
          const included = satisfies(version, range, options);
          if (included) {
            prev = version;
            if (!first) {
              first = version;
            }
          } else {
            if (prev) {
              set.push([first, prev]);
            }
            prev = null;
            first = null;
          }
        }
        if (first) {
          set.push([first, null]);
        }
        const ranges = [];
        for (const [min, max] of set) {
          if (min === max) {
            ranges.push(min);
          } else if (!max && min === v[0]) {
            ranges.push("*");
          } else if (!max) {
            ranges.push(`>=${min}`);
          } else if (min === v[0]) {
            ranges.push(`<=${max}`);
          } else {
            ranges.push(`${min} - ${max}`);
          }
        }
        const simplified = ranges.join(" || ");
        const original =
          typeof range.raw === "string" ? range.raw : String(range);
        return simplified.length < original.length ? simplified : range;
      };
    },
    863: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const Range = __nccwpck_require__(828);
      const Comparator = __nccwpck_require__(532);
      const { ANY } = Comparator;
      const satisfies = __nccwpck_require__(55);
      const compare = __nccwpck_require__(309);
      const subset = (sub, dom, options = {}) => {
        if (sub === dom) {
          return true;
        }
        sub = new Range(sub, options);
        dom = new Range(dom, options);
        let sawNonNull = false;
        OUTER: for (const simpleSub of sub.set) {
          for (const simpleDom of dom.set) {
            const isSub = simpleSubset(simpleSub, simpleDom, options);
            sawNonNull = sawNonNull || isSub !== null;
            if (isSub) {
              continue OUTER;
            }
          }
          if (sawNonNull) {
            return false;
          }
        }
        return true;
      };
      const minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
      const minimumVersion = [new Comparator(">=0.0.0")];
      const simpleSubset = (sub, dom, options) => {
        if (sub === dom) {
          return true;
        }
        if (sub.length === 1 && sub[0].semver === ANY) {
          if (dom.length === 1 && dom[0].semver === ANY) {
            return true;
          } else if (options.includePrerelease) {
            sub = minimumVersionWithPreRelease;
          } else {
            sub = minimumVersion;
          }
        }
        if (dom.length === 1 && dom[0].semver === ANY) {
          if (options.includePrerelease) {
            return true;
          } else {
            dom = minimumVersion;
          }
        }
        const eqSet = new Set();
        let gt, lt;
        for (const c of sub) {
          if (c.operator === ">" || c.operator === ">=") {
            gt = higherGT(gt, c, options);
          } else if (c.operator === "<" || c.operator === "<=") {
            lt = lowerLT(lt, c, options);
          } else {
            eqSet.add(c.semver);
          }
        }
        if (eqSet.size > 1) {
          return null;
        }
        let gtltComp;
        if (gt && lt) {
          gtltComp = compare(gt.semver, lt.semver, options);
          if (gtltComp > 0) {
            return null;
          } else if (
            gtltComp === 0 &&
            (gt.operator !== ">=" || lt.operator !== "<=")
          ) {
            return null;
          }
        }
        for (const eq of eqSet) {
          if (gt && !satisfies(eq, String(gt), options)) {
            return null;
          }
          if (lt && !satisfies(eq, String(lt), options)) {
            return null;
          }
          for (const c of dom) {
            if (!satisfies(eq, String(c), options)) {
              return false;
            }
          }
          return true;
        }
        let higher, lower;
        let hasDomLT, hasDomGT;
        let needDomLTPre =
          lt && !options.includePrerelease && lt.semver.prerelease.length
            ? lt.semver
            : false;
        let needDomGTPre =
          gt && !options.includePrerelease && gt.semver.prerelease.length
            ? gt.semver
            : false;
        if (
          needDomLTPre &&
          needDomLTPre.prerelease.length === 1 &&
          lt.operator === "<" &&
          needDomLTPre.prerelease[0] === 0
        ) {
          needDomLTPre = false;
        }
        for (const c of dom) {
          hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
          hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
          if (gt) {
            if (needDomGTPre) {
              if (
                c.semver.prerelease &&
                c.semver.prerelease.length &&
                c.semver.major === needDomGTPre.major &&
                c.semver.minor === needDomGTPre.minor &&
                c.semver.patch === needDomGTPre.patch
              ) {
                needDomGTPre = false;
              }
            }
            if (c.operator === ">" || c.operator === ">=") {
              higher = higherGT(gt, c, options);
              if (higher === c && higher !== gt) {
                return false;
              }
            } else if (
              gt.operator === ">=" &&
              !satisfies(gt.semver, String(c), options)
            ) {
              return false;
            }
          }
          if (lt) {
            if (needDomLTPre) {
              if (
                c.semver.prerelease &&
                c.semver.prerelease.length &&
                c.semver.major === needDomLTPre.major &&
                c.semver.minor === needDomLTPre.minor &&
                c.semver.patch === needDomLTPre.patch
              ) {
                needDomLTPre = false;
              }
            }
            if (c.operator === "<" || c.operator === "<=") {
              lower = lowerLT(lt, c, options);
              if (lower === c && lower !== lt) {
                return false;
              }
            } else if (
              lt.operator === "<=" &&
              !satisfies(lt.semver, String(c), options)
            ) {
              return false;
            }
          }
          if (!c.operator && (lt || gt) && gtltComp !== 0) {
            return false;
          }
        }
        if (gt && hasDomLT && !lt && gtltComp !== 0) {
          return false;
        }
        if (lt && hasDomGT && !gt && gtltComp !== 0) {
          return false;
        }
        if (needDomGTPre || needDomLTPre) {
          return false;
        }
        return true;
      };
      const higherGT = (a, b, options) => {
        if (!a) {
          return b;
        }
        const comp = compare(a.semver, b.semver, options);
        return comp > 0
          ? a
          : comp < 0
            ? b
            : b.operator === ">" && a.operator === ">="
              ? b
              : a;
      };
      const lowerLT = (a, b, options) => {
        if (!a) {
          return b;
        }
        const comp = compare(a.semver, b.semver, options);
        return comp < 0
          ? a
          : comp > 0
            ? b
            : b.operator === "<" && a.operator === "<="
              ? b
              : a;
      };
      module.exports = subset;
    },
    706: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const Range = __nccwpck_require__(828);
      const toComparators = (range, options) =>
        new Range(range, options).set.map((comp) =>
          comp
            .map((c) => c.value)
            .join(" ")
            .trim()
            .split(" "),
        );
      module.exports = toComparators;
    },
    741: (module, __unused_webpack_exports, __nccwpck_require__) => {
      const Range = __nccwpck_require__(828);
      const validRange = (range, options) => {
        try {
          return new Range(range, options).range || "*";
        } catch (er) {
          return null;
        }
      };
      module.exports = validRange;
    },
  };
  var __webpack_module_cache__ = {};
  function __nccwpck_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (__webpack_module_cache__[moduleId] = { exports: {} });
    var threw = true;
    try {
      __webpack_modules__[moduleId](
        module,
        module.exports,
        __nccwpck_require__,
      );
      threw = false;
    } finally {
      if (threw) delete __webpack_module_cache__[moduleId];
    }
    return module.exports;
  }
  if (typeof __nccwpck_require__ !== "undefined")
    __nccwpck_require__.ab = __dirname + "/";
  var __webpack_exports__ = __nccwpck_require__(383);
  module.exports = __webpack_exports__;
})();
