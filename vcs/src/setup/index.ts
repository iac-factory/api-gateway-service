/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Confirmation, Token, Input } from "../prompt";
import { Writer } from "./writer";
import { Local } from "./writer";
import { TTY } from "../system";

export const Setup = async () => {
    await TTY.Clear();

    const questions = {
        continue: Confirmation.construct( {
            assignment: "continue",
            prompt: "Continue with Setup"
        } ),
        url: Input.construct( {
            assignment: "url",
            prompt: "GitLab Base URL"
        } ),
        project: Input.construct( {
            assignment: "project",
            prompt: "GitLab Project Identifier (Integer)"
        } ),
        token: Token.construct( {
            assignment: "token",
            prompt: "GitLab Personal-Access Token"
        } )
    };

    const proceed: { continue: boolean } = await questions.continue
        .prompt().then( ($) => {
            return $ as { continue: boolean };
        } );

    ( proceed.continue ) && await import("./directory");
    ( proceed.continue ) && process.stdout.write( "\n" );

    const url: { url: string } | null = ( proceed.continue ) ? await questions.url
        .prompt( proceed.continue ).then( ($) => {
            return $ as { url: string };
        } ) : null;

    const project: { project: string } | null = ( proceed.continue ) ? await questions.project
        .prompt( proceed.continue ).then( ($) => {
            return $ as { project: string };
        } ) : null;

    const token: { token: string } | null = ( proceed.continue ) ? await questions.token
        .prompt( proceed.continue ).then( ($) => {
            return $ as { token: string };
        } ) : null;

    ( proceed.continue ) && await Writer( {
        ... url,
        ... token
    } );

    ( proceed.continue ) && await Local( {
        ... url,
        ... token,
        ... project
    } );

    ( proceed.continue ) && process.stdout.write("\n");
    ( proceed.continue ) && console.log( "Successful" );

    await TTY.Cursor.show();
};

export default Setup;
