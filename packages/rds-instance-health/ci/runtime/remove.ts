/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import FS   from "fs";
import Path from "path";

const Utility = require( "util" );

const CWD = __dirname;

const PKG = Path.dirname( Path.resolve( Path.dirname( CWD ) ) );

/***
 * Promisified Version of {@link FS.rm}
 * ---
 *
 * Asynchronously, recursively deletes the entire directory structure from target,
 * including subdirectories and files.
 *
 * @experimental
 *
 * @param {string} target
 * @returns {Promise<void>}
 *
 * @constructor
 *
 */
export const Remove = async (target: string = Path.join( PKG, "layer" )): Promise<Error | boolean> => {
    return new Promise( (resolve) => {
        FS.rm( target, { recursive: true, force: true }, () => resolve( true ) );
    } );
};

export default Remove;
