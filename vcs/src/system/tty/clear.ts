/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import TTY from "tty";

export const Clear: () => Promise<void> = async () => {
    const columns = process.stdout.columns;
    const rows = process.stdout.rows;

    const tty = () => TTY.isatty(process?.stdout?.fd);

    const overwrite = async (): Promise<void> => new Promise((resolve) => {
        if (tty()) {
            Array(rows).forEach((_) => {
                process?.stdout?.write("\n".repeat(columns));
            });

            process?.stdout?.clearScreenDown(resolve);
        }

        !(tty()) && resolve();
    });

    const reset = async (): Promise<boolean> => new Promise((resolve) => {
        if (tty()) {
            process?.stdout?.cursorTo(0, 0, () => resolve(true));
        }

        !(tty()) && resolve(false);
    });

    await reset() && await overwrite();
};

export default Clear;
