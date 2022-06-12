/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { PG } from "./postgres";
import { Response } from "./utilities";

console.debug("[Debug]", "Lambda Initialization Time", "(" + Date.now() + ")");
export const handler = async (event: Event, context: Context) => {
    console.trace("[Trace] Invocation Context" + ":", JSON.stringify(context));

    const version = await PG.Version();

    console.trace("[Trace] PostgreSQL Version" + ":", version);

    return Response({ version });
};

/*** For Local Runtime Invocation + Testing */
(async () => process.argv.includes("--debug") && console.debug("[Debug] Local", await PG.Version()))();

import type { APIGatewayProxyEvent as Event } from "./utilities";
import type { APIGatewayEventRequestContext as Context } from "./utilities";
