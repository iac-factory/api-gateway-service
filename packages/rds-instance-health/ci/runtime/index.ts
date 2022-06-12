/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

export * from "./install";
export * from "./initialize";
export * from "./compile";
export * from "./destroy";
export * from "./remove";
export * from "./copy";
export * from "./dependencies";
export * from "./restore";
export * from "./terraform";
export * from "./ansi";

export default async () => {
    const { Terraform } = await import("./terraform");
    const { Initialize } = await import("./initialize");
    const { Install } = await import("./install");
    const { Compile } = await import("./compile");
    const { Validate } = await import("./validate");
    const { Dependencies } = await import("./dependencies");
    const { Remove } = await import("./remove");
    const { Restore } = await import("./restore");

    /*** @external {Install} */
    await Install();

    /*** @external {Compile} */
    await Compile();

    /*** @external {Initialize} */
    await Initialize();

    /*** @external {Validate} */
    await Validate();

    /*** @external {Remove} */
    await Remove();

    /*** @external {Dependencies} */
    await Dependencies();

    /*** @external {Terraform} */
    await Terraform();

    /*** @external {Restore} */
    await Restore();
}
