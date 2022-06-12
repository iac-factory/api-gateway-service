/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import FS              from "fs";
import Path            from "path";
import Event           from "events";

export const Internal: WeakMap<Private<Prototype>, { total: number, files: (object | string)[], directories: (object | string)[] }> = new WeakMap();

export module Insertion {
    export type File = { readonly Type: "File", readonly Extension: string, readonly Relative: string, readonly Size: { B: number, MB: number, KB: number, GB: number }, readonly Filename: string, readonly Absolute: string };
    export type Directory = { readonly Type: "Directory", readonly Relative: string, readonly Size: { B: number, MB: number, KB: number, GB: number }, readonly Absolute: string, readonly Name: string };
}

/*** @constructor */
export function Walker(this: Prototype) {
    if ( !( ( this ) instanceof ( Walker ) ) ) void null;

    Internal.set( this, {
        total: 0,
        files: [],
        directories: []
    } );

    this.on( "end", () => {
        return Internal.get( this );
    } );
}

export type Prototype = typeof Walker & Instance;

Walker.prototype = Object.create( Event.prototype );
Walker.prototype.constructor = Walker;

Walker.prototype.close = function () {
    const internal = Internal.get( this );

    FS.writeFileSync( "output.json", JSON.stringify( internal, null, 4 ), { encoding: "utf-8" } );

    this.emit( "closure" );
};

export type Closure = typeof Walker.prototype.close & ( () => void );

/***
 * Setup the Directory Filter Function
 * ---
 *
 * @param fn {Function} a function that will be given a directory name; if resolving
 * a directory, the return will additionally contain its children
 */
Walker.prototype.filter = function (fn: (descriptor: string, statistics: FS.Stats) => boolean): Instance {
    this.filter = fn;

    return this as Instance;
};

export type Filter = typeof Walker.prototype.filter & ( (fn: FS.PathLike) => void );

Walker.prototype.data = function () {
    return Internal.get( this );
};

Walker.prototype.status = function () {
    return Internal.get( this );
};

/*** Process a file or directory */
Walker.prototype.walk = function (descriptor: FS.PathLike) {
    const instance: Instance = this;

    const internal = Internal.get( this );

    ( internal ) && internal.total++;

    FS.lstat( descriptor, function (exception, statistics) {
        if ( exception ) {
            instance.emit( "error", exception, descriptor, statistics );
            instance.close();
            return;
        }

        if ( !descriptor || !statistics ) {
            instance.emit( "finish" );

            instance.close();
        }

        if ( statistics.isDirectory() ) {
            if ( !descriptor || !statistics || !instance.filter( descriptor ) ) {
                instance.close();
            } else {
                // ( internal ) && internal.directories.push( descriptor );
                FS.readdir( descriptor, function (exception, files) {
                    if ( exception ) {
                        instance.emit( "error", exception, descriptor, statistics, files );
                        instance.close();
                        return;
                    }

                    /*** Divide the digital storage value by 1e+6 for Bytes => Megabytes conversion */
                        /// --> However, because node uses Base-10 Notation, UNIX Systems report different
                        /// ... results (UNIX systems use Base-2 Notation). Therefore, we additionally need to
                        /// ... convert := 1.024e+6

                    const B = parseInt( ( ( statistics.size ) / 1.024e+0 ).toFixed( 0 ) );

                    const KB = ( statistics.size ) / 1.024e+3;
                    const MB = ( statistics.size ) / 1.024e+6;
                    const GB = ( statistics.size ) / 1.024e+9;

                    const Size = { B, KB, MB, GB };

                    const Name = Path.basename( descriptor as string );
                    const Relative = Path.relative( process.cwd(), descriptor as string );
                    const Absolute = Path.resolve( Path.relative( process.cwd(), descriptor as string ) );
                    const Type = "Directory";

                    const Directory = { Name, Type, Relative: (Relative === "") ? Name : Relative, Absolute, Size } as const;

                    ( internal ) && internal.directories.push( Directory as Insertion.Directory );

                    instance.emit( "directory", descriptor, statistics, Directory );
                    files.forEach( function (part) {
                        if ( typeof descriptor === "string" ) instance.walk( Path.join( descriptor, part ) );
                    } );
                    instance.close();
                } );
            }
        } else {
            if ( statistics.isSymbolicLink() ) {
                instance.emit( "symbolic-link", descriptor, statistics );
                instance.close();
            } else {
                if ( statistics.isBlockDevice() ) {
                    instance.emit( "block-device", descriptor, statistics );
                    instance.close();
                } else {
                    if ( statistics.isCharacterDevice() ) {
                        instance.emit( "character-device", descriptor, statistics );
                        instance.close();
                    } else {
                        if ( statistics.isFIFO() ) {
                            instance.emit( "fifo", descriptor, statistics );
                            instance.close();
                        } else {
                            if ( statistics.isSocket() ) {
                                instance.emit( "socket", descriptor, statistics );
                                instance.close();
                            } else {
                                if ( statistics.isFile() ) {
                                    /*** Divide the digital storage value by 1e+6 for Bytes => Megabytes conversion */
                                        /// --> However, because node uses Base-10 Notation, UNIX Systems report different
                                        /// ... results (UNIX systems use Base-2 Notation). Therefore, we additionally need to
                                        /// ... convert := 1.024e+6

                                    const B = parseInt( ( ( statistics.size ) / 1.024e+0 ).toFixed( 0 ) );

                                    const KB = ( statistics.size ) / 1.024e+3;
                                    const MB = ( statistics.size ) / 1.024e+6;
                                    const GB = ( statistics.size ) / 1.024e+9;

                                    const Size = { B, KB, MB, GB };

                                    const Extension = Path.extname( descriptor as string );
                                    const Filename = Path.basename( descriptor as string );
                                    const Relative = Path.relative( process.cwd(), descriptor as string );
                                    const Absolute = Path.resolve( Path.relative( process.cwd(), descriptor as string ) );
                                    const Type = "File";

                                    const File = { Filename, Type, Extension, Relative, Absolute, Size } as const;

                                    ( internal ) && internal.files.push( File as Insertion.File );

                                    instance.emit( "file", descriptor, statistics, File );
                                    instance.close();
                                } else {
                                    instance.emit( "error", new Error( "Unknown-File-Type-Exception" ), descriptor, statistics );
                                    instance.close();
                                }
                            }
                        }
                    }
                }
            }
        }
    } );
};

export type Walk = typeof Walker.prototype.walk & ( (descriptor: FS.PathLike) => void );

export enum Emitter {
    "descriptor" = "descriptor",
    "directory" = "directory",
    "file" = "file",
    "symbolic-link" = "symbolic-link",
    "block-device" = "block-device",
    "fifo" = "fifo",
    "socket" = "socket",
    "character-device" = "character-device",
    "error" = "error",
    "end" = "end",
    "finish" = "finish",
    "closure" = "closure"
}

export type Emitters = keyof typeof Emitter;
export type Instance = Event & WeakMapConstructor & { close: Closure; filter: Filter; walk: Walk };
export type Private<Generic> = Generic & { prototype: Function["prototype"] };

export type { FS };
export type { Stats }  from "fs";
export type { Dirent } from "fs";

/***
 * @example <br/> <br/> File-Type Listening
 * Listener.filter( (descriptor: string, statistics: FS.Stats) => {
 *     return !( descriptor.includes( "/root" ) );
 * } ).on( "descriptor", function ( descriptor: FS.Dirent, statistics: FS.Stats ) {
 *     console.log( "Descriptor" + ":", descriptor );
 * } ).on( "directory", function (descriptor: FS.Dirent, statistics: FS.Stats ) {
 *     console.log( "Directory" + ":", descriptor );
 * } ).on( "file", function (descriptor: FS.Dirent, statistics: FS.Stats ) {
 *     console.log( "File" + ":", descriptor );
 * } ).on( "symbolic-link", function (descriptor: FS.Dirent, statistics: FS.Stats ) {
 *     console.log( "Symbolic-Link" + ":", descriptor );
 * } ).on( "block-device", function (descriptor: FS.Dirent, statistics: FS.Stats ) {
 *     console.log( "Block-Device" + ":", descriptor );
 * } ).on( "fifo", function (descriptor: FS.Dirent, statistics: FS.Stats ) {
 *     console.log( "FIFO" + ":", descriptor );
 * } ).on( "socket", function (descriptor: FS.Dirent, statistics: FS.Stats ) {
 *     console.log( "Socket" + ":", descriptor );
 * } ).on( "character-device", function (descriptor: FS.Dirent, statistics: FS.Stats ) {
 *     console.log( "Character-Device" + ":", descriptor );
 * } ).on( "error", function ( exception?: Error, descriptor?: FS.Dirent, statistics?: FS.Stats ) {
 *     console.error( "Error" + ":", exception, descriptor, statistics );
 * } ).on( "end", function () {
 *     console.log( "Complete" );
 * } );
 *
 * Listener.walk( "." );
 *
 * @example <br/> <br/> Get All Folder(s) - Skipping `node_modules`
 * Listener.filter((descriptor: string) => {
 *     return !!(descriptor && !(descriptor.includes("node_modules")));
 * });
 *
 * Listener.walk(".");
 *
 * @example <br/> <br/> Data Sources
 * const Files: Insertion.File[] = [];
 * const Directories: Insertion.Directory[] = [];
 *
 * Listener.filter( (descriptor: string, statistics: FS.Stats) => {
 *     return !!( descriptor && !( descriptor.includes( "node_modules" ) ) );
 * } ).on( "directory", function (descriptor: string, statistics: FS.Stats, instance: Insertion.Directory) {
 *     Directories.push(instance);
 * } ).on( "file", function (descriptor: string, statistics: FS.Stats, instance: Insertion.File) {
 *     Files.push(instance);
 * } ).on( "closure", function () {
 *     console.log(JSON.stringify(Files, null, 4));
 *     console.log(JSON.stringify(Directories, null, 4));
 * } ).on( "error", function (exception?: Error, descriptor?: FS.Dirent, statistics?: FS.Stats) {
 *     console.error( "Error" + ":", exception, descriptor, statistics );
 * } ).on( "end", function () {
 *     console.log( "Complete" );
 * } );
 *
 * Listener.walk( "." );
 */

export const Listener = new Walker.prototype.constructor;

export default Listener;
