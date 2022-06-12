/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Control } from ".";

const Spawn = require( "child_process" );
const Utility = require( "util" );
const Path = require( "path" );

const CWD = __dirname;

import ANSI from "ansi-colors";

const PKG = Path.dirname(Path.resolve(Path.dirname(CWD)));

/***
 * Compile Typescript
 * ---
 *
 * @param {string} command
 * @param {(string | string)[]} args
 * @param {string} cwd
 * @param {boolean} ignore
 * @returns {Promise<boolean>}
 * @constructor
 */
export async function Compile (command: string = "tsc", args: ( string | string )[] = [ "--build", Path.join( PKG, "tsconfig.json" ) ], cwd: string = PKG, ignore: boolean = false): Promise<boolean> {
    const instance = Compile.name;

    return new Promise( (resolve, reject) => {
        const subprocess = Spawn.spawn( command, args, {
            shell: false,
            env: process.env,
            cwd: cwd,
            stdio: ( ignore ) ? "ignore" : "pipe"
        } );

        subprocess.stdout?.on( "data", (chunk: Buffer | string | string[]) => {
            if ( !ignore ) {
                const buffer = chunk.toString( "utf-8", 0, chunk.length );

                chunk = buffer.split( "\n" );

                chunk.forEach( (line) => {
                    const raw = line.replaceAll( Control, "" ).replace( "[0m", "" ).trim();
                    ( raw !== "" ) && process.stdout.write( ANSI.green( "[" + instance + "]" ) + " >>> " + line.trim() + "\n" );
                } );
            }
        } );

        subprocess.stderr?.on( "data", (chunk: Buffer | string) => {
            console.error( chunk.toString() );
        } );

        subprocess.on( "message", (message: any, handle: any) => {
            console.log( message, handle );
        } );

        subprocess.on( "error", (error: NodeJS.ErrnoException) => {
            console.warn( error );

            reject( error );
        } );

        subprocess.on( "exit", (code: number, handle: any) => {
            ( code !== 0 ) && reject( {
                code,
                handle
            } );
        } );

        subprocess.on( "close", (code: number, handle: any) => {
            ( code !== 0 ) && reject( {
                code,
                handle
            } );

            resolve( true );
        } );
    } );
}

/*** In the event Function.name is ever deprecated ... */
Reflect.set(Compile, "name", "Compile");

export default Compile;
