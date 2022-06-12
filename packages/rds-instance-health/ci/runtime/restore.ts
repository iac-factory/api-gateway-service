/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Control } from ".";

const Spawn = require("child_process");
const Path = require("path");
const CWD = __dirname;

const PKG = Path.dirname(Path.resolve(Path.dirname(CWD)));

import ANSI from "ansi-colors";

/***
 * Install *ALL* Dependencies
 * ---
 * `devDependencies` are required at this stage in order to compile the
 * typescript down to aws-lambda compliant javascript.
 *
 * @param {string} command
 * @param {(string | string)[]} args
 * @param {string} cwd
 * @param {boolean} ignore
 * @returns {Promise<boolean>}
 *
 * @constructor
 */
export async function Restore (command: string = "npm", args: ( string | string )[] = [ "install", PKG, "--verbose" ], cwd: string = PKG, ignore: boolean = false): Promise<boolean> {
    const instance = Restore.name;

    process.stdout.write( ANSI.dim ( "[" + instance + "]" ) + " >>> " + "Restoring Development Dependencies ..." + "\n" );

    return new Promise( (resolve, reject) => {
        const subprocess = Spawn.spawn( command, args, {
            shell: false,
            env: process.env,
            cwd: cwd,
            stdio: (ignore) ? "ignore" : "pipe"
        } );

        subprocess.stdout?.on( "data", (chunk: Buffer | string | string[]) => {
            if (!ignore) {
                const buffer = chunk.toString( "utf-8", 0, chunk.length );

                chunk = buffer.split("\n");

                chunk.forEach( (line) => {
                    const raw = line.replaceAll( Control, "" ).replace( "[0m", "" ).trim();
                    ( raw !== "" ) && process.stdout.write( ANSI.white( "[" + instance + "]" ) + " >>> " + line.trim() + "\n" );
                } );
            }
        } );

        subprocess.stderr?.on( "data", (chunk: Buffer | string | string[]) => {
            if (!ignore) {
                const buffer = chunk.toString( "utf-8", 0, chunk.length );

                chunk = buffer.split("\n");

                chunk.forEach( (line) => {
                    const raw = line.replaceAll( Control, "" ).replace( "[0m", "" ).trim();
                    ( raw !== "" && raw.includes("cache miss") ) && process.stdout.write( ANSI.dim( "[" + instance + "]" ) + " >>> " + line.trim() + "\n" );
                } );
            }
        } );

        subprocess.on( "message", (message: any, handle: any) => {
            console.log( message, handle );
        } );

        subprocess.on( "error", (error: NodeJS.ErrnoException) => {
            console.warn( error );

            reject( error );
        } );

        subprocess.on( "exit", (code: number, handle: any) => {
            ( code !== 0 ) && reject( { code, handle } );
        } );

        subprocess.on( "close", (code: number, handle: any) => {
            ( code !== 0 ) && reject( { code, handle } );

            resolve( true );
        } );
    } );
}

export default Restore;

/*** In the event Function.name is ever deprecated ... */
Reflect.set(Restore, "name", "Restore");

