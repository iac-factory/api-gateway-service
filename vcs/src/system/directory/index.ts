/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Exists } from "./existence";
import type { Handler } from "./handler";

declare module Module {
    export { Handler };
}

declare abstract class Abstract {
    Exists: typeof Exists;
}

class Implementation implements Abstract {
    Exists = Exists;
}

export const Directory = new Implementation();
export default Directory;
