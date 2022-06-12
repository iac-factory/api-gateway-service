/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import FS from "fs";

import type { Handler } from "./handler";

/***
 * @internal
 * Interestingly, taking note of the `Directory` function, notice how the `mode` argument is seemingly
 * self-referencing, but is still correctly interfacing the Handler's `enum` (`Mode`). I'm unsure
 * of how that's working; I believe the answer lies somewhere with typescript's implementation of
 * enumeration constants.
 *
 * Overall, it should be assumed that the enumeration black-box shouldn't be expected to forever
 * remain compatible. I'll add some metadata to point this out.
 *
 * [Update] I was wrong; rather, this is a TypeScript Bug
 * [Update] Confirmed that the bug is limited to only exports when via a namespace
 *
 * @todo - File Bug Report
 *
 * @bug Implicit Enumeration Resolution
 */

/***
 * See the Error-based {@link Handler.Type} and {@link Handler.Return} type(s) for additional information.
 *
 * @param {Handler.Descriptor} descriptor
 * @param {boolean} raise
 * @param mode {Handler.Modes}
 *
 * @returns {Handler.Existence | Handler.Return}
 *
 * @constructor
 *
 * @example
 * /// Simplified Default Usage
 * const doesDirectoryExist: boolean = await File("./definitely-existing-file-descriptor");
 *
 * @example
 * /// Additional Verbosity with Object Return Type
 * const directory = !( await Directory( directory, false, "object" ) );
 *
 * @example
 * /// Basically a Existence Assertion
 * await Directory("~/.file-descriptor", true);
 *
 */
const Directory = async (descriptor: Handler.Descriptor, raise: boolean = false, mode: Handler.Modes = "default"): Promise<Handler.Existence | Handler.Return> => {
    const callback: Handler.Return = () => new Promise( (resolve, reject) => {
        FS.open( String( descriptor ), "r", (error, fd: number | undefined) => {
            if ( error ) {
                const caught = "ENOENT";
                const message = ( error.code == caught ) ? "Directory Not Found"
                    : "Unknown Error";
                const location = error?.[ "path" ];

                const throwable = JSON.stringify( {
                    File: fd ?? null,
                    Code: error.code,
                    System: error.syscall,
                    Message: message,
                    Location: location
                }, null, 4 );

                if ( error.code === caught && raise ) {
                    throw new Error( throwable );
                } else {
                    if ( !raise ) {
                        resolve( ( mode === "object" ) ? JSON.parse( throwable ) : false );
                    }
                }

                reject( throwable );
            }

            resolve( true );
        } );
    } );

    return callback();
};

// const Directory = async (descriptor: Handler.Descriptor, raise: boolean = false, mode: Handler.Modes = Directory.Mode.default): Promise<Handler.Existence | Handler.Return> => {
//     const callback: Handler.Return = () => new Promise( (resolve, reject) => {
//         FS.open( String( descriptor ), "r", (error, fd: number | undefined) => {
//             if ( error ) {
//                 const caught = "ENOENT";
//                 const message = ( error.code == caught ) ? "Directory Not Found"
//                     : "Unknown Error";
//                 const location = error?.[ "path" ];
//
//                 const throwable = JSON.stringify( {
//                     File: fd ?? null,
//                     Code: error.code,
//                     System: error.syscall,
//                     Message: message,
//                     Location: location
//                 }, null, 4 );
//
//                 if ( error.code === caught && raise ) {
//                     throw new Error( throwable );
//                 } else {
//                     if ( !raise ) {
//                         resolve( ( mode === "object" ) ? JSON.parse( throwable ) : false );
//                     }
//                 }
//
//                 reject( throwable );
//             }
//
//             resolve( true );
//         } );
//     } );
//
//     return callback();
// };

export { Directory as Exists };

export default Directory;
