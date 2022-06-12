/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import FS from "fs";
import Path from "path";

export const Copy = (source: string, target: string, debug = false) => {
    ( debug ) && console.log("[Debug] Source", source);
    ( debug ) && console.log("   -> Target", target);

    try {
        FS.mkdirSync(target, { recursive: true });
    } catch ( exception ) {}

    FS.readdirSync(source, { withFileTypes: true }).forEach((element: import("fs").Dirent) => {
        const Directory = element?.isDirectory() || false;
        const Link = element?.isSymbolicLink() || false;
        const Socket = element?.isSocket() || false;
        const File = element?.isFile() || false;

        try {
            if ( Directory ) {
                Copy(Path.join(source, element.name), Path.join(target, element.name));
            } else {
                FS.copyFileSync(Path.join(source, element.name), Path.join(target, element.name), FS.constants.COPYFILE_EXCL | FS.constants.COPYFILE_FICLONE);
            }
        } catch ( exception ) {}
    });
};

export default Copy;
