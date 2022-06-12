/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import FS from "fs";
import OS from "os";
import Path from "path";

import PKG from "../package";

const user = OS.userInfo( { encoding: "utf-8" } );

/*** The home dot-directory location */
const home = Path.join( user.homedir, "." + PKG.name);

const directory: { create: (path?: string) => Promise<Error | true>; exists: (path?: string) => Promise<boolean>; target: string } = {
    target: home,
    create: async (path: string = directory.target): Promise<Error | true> => {
        return new Promise( (resolve) => {
            FS.mkdir( path, {
                recursive: true
            }, (error) => {
                if ( error ) throw error;

                resolve( true );
            } );
        } );
    },

    exists: async (path: string = directory.target): Promise<boolean> => new Promise( (resolve) => {
        FS.stat( path, async (error) => {
            if ( error ) throw error;

            resolve( true );
        } );
    } )
} as const;

const files = async (directory: string): Promise<Error | FS.Dirent[]> => new Promise( (resolve) => {
    FS.readdir( directory, {
        encoding: "utf-8",
        withFileTypes: true
    }, (error, files) => {
        if ( error ) throw error;

        resolve( files );
    } );
} );

const setup = async () => {
    await directory.create();
    await directory.exists();

    return null;
};

export default (async () => setup())();

