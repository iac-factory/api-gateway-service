/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import * as Package from "./src";

const Main = async () => {
    await Package.Setup();

    return true;
};

(async () => Main())();


