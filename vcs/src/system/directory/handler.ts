/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import FS from "fs";
import Path from "path";

/***
 * Mode Enumeration
 * ---
 *
 * ```
 * enum Mode {
 *     object = "object",
 *     default = "default"
 * }
 * ```
 *
 * @example
 * /// Example Usage
 * Mode.object // >>> "object"
 *
 * @example
 * /// Default Assignment
 * Mode.default // >>> "default"
 */
export enum Mode {
    object = "object",
    default = "default"
}

export declare module Handler {
    /***
     * The `Existence` function's throwable Type
     * ---
     * Expected usage expects a file descriptor (file-system path) as input,
     * and an optional `raise` argument (defaults assignment to `false`).
     *
     * The default value of `false` for `raise` will ensure the callback
     * resolves a `boolean` := `true` | `false`.
     */
    type Existence = Promise<boolean | object | NodeJS.ErrnoException & object>;

    /***
     * The `Existence` *Return* Type
     * ---
     *
     * See {@link Handler.Type} for additional details
     */
    type Return = () => Existence;

    /***
     * The File System Path, Type-Castable to a {@link String}
     */
    type Descriptor = string | FS.PathOrFileDescriptor | Path.PlatformPath & String

    /***
     * The Runtime Mode
     * ---
     *
     * Can either interface an Enumeration callable,
     * or pass in an alike string:
     * - `"object"`
     * - `"mode"`
     *
     * See {@link Handler.Mode} for the Enumeration type
     */

    type Modes = keyof typeof Mode & string;

    export type { Existence, Descriptor, Modes, Return };
}
