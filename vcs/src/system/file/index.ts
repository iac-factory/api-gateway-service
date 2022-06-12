/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Contents } from "./contents";
import { Empty } from "./empty";
import { Exists } from "./existence";
import type { Handler } from "./handler";

declare module Module {
    export { Handler };
}

declare abstract class Abstract {
    Exists: typeof Exists;
    Contents: typeof Contents;
    Empty: typeof Empty;
}

class Implementation implements Abstract {
    Exists = Exists;
    Contents = Contents;
    Empty = Empty;
}

export const File = new Implementation();

export default File;
