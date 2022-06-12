/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import * as XRay from "aws-xray-sdk-core"

void (async () => {
    XRay.setContextMissingStrategy(() => {});
    XRay.captureAWS(require("aws-sdk"));
})();
