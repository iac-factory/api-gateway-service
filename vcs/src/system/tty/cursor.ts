/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import TTY from "tty";

const hide = async (reset?: boolean): Promise<boolean | null> => new Promise((resolve) => {
    const control = "\u001B[?25l" + String((reset) ? "\r" : "");

    if (!tty()) resolve(null);
    else {
        process?.stdout?.write(control, () => resolve(true));
    }
});

const show = async (): Promise<boolean | null> => new Promise((resolve) => {
    const control = "\u001B[?25h";

    if (!tty()) resolve(null);
    else {
        process?.stdout?.write(control, () => resolve(true));
    }
});

const columns = () => {
    if (!tty()) return null;
    else {
        return process?.stdout?.columns ?? null;
    }
};

const rows = () => {
    if (!tty()) return null;
    else {
        return process?.stdout?.rows ?? null;
    }
};

const tty = () => {
    const $ = TTY.isatty(process?.stdout?.fd);

    const byte = Buffer.of().toString("utf-8");

    ($) && process.stdout.write(byte);

    return $;
};

export const Cursor = {
    hide, show, columns, rows, tty
};

export default Cursor;
