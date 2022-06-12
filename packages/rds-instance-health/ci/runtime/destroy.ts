/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

const Spawn = require("child_process");
const Path = require("path");
const Utility = require("util");

const CWD = __dirname;

const PKG = Path.resolve(Path.dirname(CWD));

export const Destroy = (command = "terraform", args = ["apply", "--destroy", "--var-file", "auto.terraform.tfvars", "--auto-approve"], cwd = Path.join(PKG, "ci"), ignore = false) => {
    process.chdir(cwd);
    return new Promise( (resolve, reject) => {
        const subprocess = Spawn.spawn( command, args, {
            shell: true,
            env: process.env,
            cwd: cwd
        } );

        subprocess.stdout?.on( "data", (chunk: Buffer | string | string[]) => {
            if (!ignore) {
                const buffer = chunk.toString( "utf-8", 0, chunk.length );

                chunk = buffer.split("\n");

                chunk.forEach((line) => {
                    (line.trim() !== "") && process.stdout.write( " >>> " + line.trim() + "\n");
                })
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
    } ).catch((exception) => {
        console.error(exception);
    })
};
