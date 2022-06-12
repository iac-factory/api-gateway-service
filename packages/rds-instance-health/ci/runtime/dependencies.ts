/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

const Spawn = require("child_process");
const Path = require("path");
const FS = require("fs");
const Utility = require("util");

const CWD = __dirname;

const PKG = Path.dirname(Path.resolve(Path.dirname(CWD)));
import ANSI from "ansi-colors";
import { Control } from ".";

const Install = async (command = "npm", args = ["install", PKG, "--omit", "dev", "--omit", "optional", "--omit", "peer"], cwd = PKG, ignore = false) => {
    process.stdout.write( ANSI.blue ( "[" + "Dependencies" + "]" ) + " >>> " + "Tree Shaking Production Package(s) ..." + "\n" );

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
                    ( raw !== "" ) && process.stdout.write( ANSI.blue( "[" + "Dependencies" + "]" ) + " >>> " + line.trim() + "\n" );
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
            ( code !== 0 ) && reject( { code, handle } );
        } );

        subprocess.on( "close", (code: number, handle: any) => {
            ( code !== 0 ) && reject( { code, handle } );

            resolve( true );
        } );
    } );
};

const Copy = (source: string, target: string, debug = false) => {
    process.stdout.write( ANSI.blue ( "[" + "Dependencies" + "]" ) + " >>> " + "Copying" + " " + Path.basename(source) + " " + "to" + " " + "Layer" + "\n" );

    try {
        FS.mkdirSync(target, { recursive: true });
    } catch ( exception ) {}

    FS.readdirSync(source, { withFileTypes: true }).forEach((element: import("fs").Dirent) => {
        const Directory = element?.isDirectory() || false;
        const Link = element?.isSymbolicLink() || false;
        const Socket = element?.isSocket() || false;
        const File = element?.isFile() || false;

        try {
            if ( Directory ) {
                Copy(Path.join(source, element.name), Path.join(target, element.name));
            } else {
                FS.copyFileSync(Path.join(source, element.name), Path.join(target, element.name), FS.constants.COPYFILE_EXCL | FS.constants.COPYFILE_FICLONE);
            }
        } catch ( exception ) {}
    });
};

export const Dependencies = async () => await Install() && Copy(Path.join(PKG, "node_modules"), Path.join(PKG, "layer/nodejs/node_modules"));
