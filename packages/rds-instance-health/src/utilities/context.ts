/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

export type { Handler } from "aws-lambda";
export type { Context } from "aws-lambda";

export type { AuthResponse } from "aws-lambda";
export type { AuthResponseContext } from "aws-lambda";

export type { APIGatewayAuthorizerResult } from "aws-lambda";


export type { APIGatewayEvent } from "aws-lambda";

export type { APIGatewayProxyEvent } from "aws-lambda";
export type { APIGatewayProxyEventV2 } from "aws-lambda";
export type { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
export type { APIGatewayProxyEventV2WithRequestContext } from "aws-lambda";

export type { APIGatewayAuthorizerEvent } from "aws-lambda";

export type { SecretsManagerRotationEvent } from "aws-lambda";
export type { SecretsManagerRotationHandler } from "aws-lambda";
export type { SecretsManagerRotationEventStep } from "aws-lambda";
export type { APIGatewayProxyHandler } from "aws-lambda";
export type { ALBHandler } from "aws-lambda";

export type { APIGatewayEventRequestContext } from "aws-lambda"
export type { APIGatewayEventRequestContextJWTAuthorizer } from "aws-lambda"
export type { APIGatewayEventRequestContextLambdaAuthorizer } from "aws-lambda"

export type { APIGatewayAuthorizerHandler } from "aws-lambda";
export type { APIGatewayProxyHandlerV2 } from "aws-lambda";
export type { APIGatewayProxyHandlerV2WithJWTAuthorizer } from "aws-lambda";
export type { APIGatewayProxyHandlerV2WithLambdaAuthorizer } from "aws-lambda";
export type { APIGatewayProxyWithLambdaAuthorizerHandler } from "aws-lambda";
