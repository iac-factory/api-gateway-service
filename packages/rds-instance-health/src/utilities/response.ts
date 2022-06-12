/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

export type JSON = string;
export type Response <Generic> = { readonly data: Generic | object }
export interface Data <Generic> {
    statusCode: number
    headers: {[Header: string]: string}
    body: JSON
}

export const Response = async function<Generic> (input: Generic): Promise<Data<Generic>> {
    const body = {
        statusCode: 200,
        headers: {
            "Content-Type": "Application/JSON"
        },
        body: JSON.stringify({
            ... input
        }, null, 4)
    };

    return new Promise( (resolve) => {
        resolve( body );
    } );
}
