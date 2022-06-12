/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import Clear from "./clear";
import Cursor from "./cursor";
import Handler from "./lock";

export declare module Module {
    export { Clear };
    export { Cursor };
    export { Handler };
}

export declare abstract class Abstract {
    Clear: typeof Clear;
    Cursor: typeof Cursor;
    Handler: typeof Handler;
}

class Interface implements Abstract {
    Clear = Clear;
    Cursor = Cursor;
    Handler = Handler;
}

const TTY = new Interface();

export { TTY };

export default TTY;
