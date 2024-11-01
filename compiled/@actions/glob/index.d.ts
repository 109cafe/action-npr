/**
 * Options to control globbing behavior
 */
interface GlobOptions {
    /**
     * Indicates whether to follow symbolic links. Generally should set to false
     * when deleting files.
     *
     * @default true
     */
    followSymbolicLinks?: boolean;
    /**
     * Indicates whether directories that match a glob pattern, should implicitly
     * cause all descendant paths to be matched.
     *
     * For example, given the directory `my-dir`, the following glob patterns
     * would produce the same results: `my-dir/**`, `my-dir/`, `my-dir`
     *
     * @default true
     */
    implicitDescendants?: boolean;
    /**
     * Indicates whether matching directories should be included in the
     * result set.
     *
     * @default true
     */
    matchDirectories?: boolean;
    /**
     * Indicates whether broken symbolic should be ignored and omitted from the
     * result set. Otherwise an error will be thrown.
     *
     * @default true
     */
    omitBrokenSymbolicLinks?: boolean;
}

/**
 * Used to match files and directories
 */
interface Globber {
    /**
     * Returns the search path preceding the first glob segment, from each pattern.
     * Duplicates and descendants of other paths are filtered out.
     *
     * Example 1: The patterns `/foo/*` and `/bar/*` returns `/foo` and `/bar`.
     *
     * Example 2: The patterns `/foo/*` and `/foo/bar/*` returns `/foo`.
     */
    getSearchPaths(): string[];
    /**
     * Returns files and directories matching the glob patterns.
     *
     * Order of the results is not guaranteed.
     */
    glob(): Promise<string[]>;
    /**
     * Returns files and directories matching the glob patterns.
     *
     * Order of the results is not guaranteed.
     */
    globGenerator(): AsyncGenerator<string, void>;
}

/**
 * Options to control globbing behavior
 */
interface HashFileOptions {
    /**
     * Indicates whether to follow symbolic links. Generally should set to false
     * when deleting files.
     *
     * @default true
     */
    followSymbolicLinks?: boolean;
}

/**
 * Constructs a globber
 *
 * @param patterns  Patterns separated by newlines
 * @param options   Glob options
 */
declare function create(patterns: string, options?: GlobOptions): Promise<Globber>;
/**
 * Computes the sha256 hash of a glob
 *
 * @param patterns  Patterns separated by newlines
 * @param currentWorkspace  Workspace used when matching files
 * @param options   Glob options
 * @param verbose   Enables verbose logging
 */
declare function hashFiles(patterns: string, currentWorkspace?: string, options?: HashFileOptions, verbose?: Boolean): Promise<string>;

export { type GlobOptions, type Globber, create, hashFiles };
