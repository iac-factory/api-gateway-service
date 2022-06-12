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

/*** Relative to the dot-directory, the root rc file */
const settings = Path.join( user.homedir, "." + PKG.name, "settings.json" );

const file: { create: (path?: string) => Promise<Error | true>; exists: (path?: string) => Promise<boolean>; target: string } = {
    target: settings,
    create: async (path: string = file.target): Promise<Error | true> => {
        return new Promise( (resolve) => {
            FS.writeFile( path, JSON.stringify( {}, null, 4 ), { encoding: "utf-8" }, (error) => {
                if ( error ) throw error;

                resolve( true );
            } );
        } );
    },

    exists: async (path: string = file.target): Promise<boolean> => {
        return new Promise( (resolve) => {
            FS.readFile( path, { encoding: "utf-8" }, (error, _) => {
                if ( error ) resolve( false );

                resolve( true );
            } );
        } );
    }
} as const;

const setup = async () => {
    await file.create();
    await file.exists();

    return null;
};

export default (async () => setup())();

