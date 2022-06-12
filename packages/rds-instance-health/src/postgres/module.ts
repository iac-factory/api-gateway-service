/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import DB from "pg";

import * as FS from "fs";
import * as Path from "path";

export module PG {
    const Connection = new DB.Pool( {
        host: process.env[ "POSTGRES_HOSTNAME" ] ?? "localhost",
        password: process.env[ "POSTGRES_PASSWORD" ] ?? "postgres",
        port: parseInt( process.env[ "POSTGRES_PORT" ] ?? "5432" ),
        user: process.env[ "POSTGRES_USER" ] ?? "postgres",
        database: process.env[ "POSTGRES_DB" ] ?? "postgres",
        application_name: process.env[ "SERVER" ] ?? "AWS-Lambda",
        keepAlive: process.env[ "POSTGRES_CONNECTION_KEEPALIVE" ] === "true",
        ssl: ( process.env[ "POSTGRES_ENABLE_TLS" ] === "true" || process.env[ "NODE_ENV" ] === "production" ) ? {
            rejectUnauthorized: false,
            ca: JSON.parse( FS.readFileSync( Path.join( __dirname, "us-east-2-bundle.json" ) ).toString() )[ "Certificate" ]
        } : false
    } );

    export const Query = async function (input: string, parameters?: any): Promise<PG.Result> {
        const initial = new Date().getTime();

        const response = await Connection.query( input, parameters );

        const delta = ( new Date().getTime() - initial ) / 1000;

        console.debug( "Query Duration" + ":" + " " + delta + " " + "Second(s)" );

        return response;
    };

    export const Interface = async function () {
        const client = await Connection.connect() as DB.PoolClient & { lastQuery: any, query: any };
        const query: typeof client.query = client.query;
        const release: typeof client.release = client.release;

        // Establish a timeout of 5 seconds, after which the client's last query is logged
        const timeout = setTimeout( () => {
            console.error( "Client Query Timeout ( Greater than 5 Second(s) )" );
            console.error( "The last executed query was" + " " + client.lastQuery );
        }, 5000 );

        // Monkey patch the query method to keep track of the last query executed
        client.query = (... args: [ queryText: string, values: any[], callback: (err: Error, result: DB.QueryResult<DB.QueryResultRow>) => void ]) => {
            client.lastQuery = args;
            return query.apply( client, args );
        };

        client.release = () => {
            clearTimeout( timeout );

            // set the methods back to their old un-monkey-patched version
            client.query = query;
            client.release = release;
            return release.apply( client );
        };

        return client;
    };

    export const Activity = async function () {
        return await Query( "SELECT * FROM pg_stat_activity;" )
            .then( (output) => {
                console.debug( output );

                return output;
            } );
    };

    export const Version = async function () {
        return await Query( "SELECT version();" )
            .then( (output) => {
                console.debug( output.rows[ 0 ]?.version );

                return output.rows[ 0 ];
            } );
    };

    export const Health = async function () {
        return !!( await Version() );
    };

    export type Query = DB.Query & object;
    export type Result = DB.QueryResult;
}

export default PG;
