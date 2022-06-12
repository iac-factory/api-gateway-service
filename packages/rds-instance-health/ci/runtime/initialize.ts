/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

const Spawn = require("child_process");
const Path = require("path");
const CWD = __dirname;

const CI = Path.resolve(Path.dirname(CWD));

import ANSI from "ansi-colors";

/***
 * Initialize Terraform
 * ---
 *
 * @param {string} command
 * @param {(string | string)[]} args
 * @param {string} cwd
 * @param {boolean} ignore
 * @returns {Promise<boolean>}
 *
 * @constructor
 */
export async function Initialize (command: string = "terraform", args: ( string | string )[] = [ "init" ], cwd: string = CI, ignore: boolean = false): Promise<boolean> {
    const instance = Initialize.name;

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

                chunk.forEach((line) => {
                    (line && line.trim() !== "") && process.stdout.write( ANSI.yellow("[" + instance + "]") + " >>> " + line.trim() + "\n");
                });
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
            ( code !== 0 ) && reject( { code, handle } );
        } );

        subprocess.on( "close", (code: number, handle: any) => {
            ( code !== 0 ) && reject( { code, handle } );

            resolve( true );
        } );
    } );
}

export default Initialize;

/*** In the event Function.name is ever deprecated ... */
Reflect.set(Initialize, "name", "Initialize");

