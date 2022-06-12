/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import TTY from "tty";

import { Cursor } from "./cursor";

const Handler = async (): Promise<true> => new Promise(async (resolve) => {
    process?.stdin?.on( "data", ($) => {
        /// CTRL + C

        /// @ts-ignore
        Buffer.from( [ 0x3 ], "hex" )
            .equals( $ ) && process?.exit( 0 );

        /// CTRL + D

        /// @ts-ignore
        Buffer.from( [ 0x4 ], "hex" )
            .equals( $ ) && process?.exit( 0 );

        /// CTRL + Z

        /// @ts-ignore
        Buffer.from( [ 0x1a ], "hex" )
            .equals( $ ) && process?.exit( 0 );
    } );

    process?.on( "exit", async () => Cursor.show() );

    resolve( true );
});

export const Lock = async (): Promise<void> => new Promise(async (resolve) => {
    await Cursor.hide( true );

    const tty = TTY.isatty( process?.stdout?.fd );

    ( tty ) && await Handler();

    resolve();
});

export default Lock;
