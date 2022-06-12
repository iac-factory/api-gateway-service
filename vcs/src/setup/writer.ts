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

const Writer = async (contents: object): Promise<boolean> => {
    return new Promise( (resolve) => {
        FS.writeFile( settings, JSON.stringify(contents, null, 4), (error) => {
            if ( error ) throw error;

            resolve( true );
        } );
    } );
};

export const Local = async (contents: object): Promise<boolean> => {
    const settings = Path.join(process.cwd(), "settings.json");
    return new Promise( (resolve) => {
        FS.writeFile( settings, JSON.stringify(contents, null, 4), (error) => {
            if ( error ) throw error;

            resolve( true );
        } );
    } );
};

export { Writer };

export default Writer;

