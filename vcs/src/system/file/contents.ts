import FS from "fs";

const Contents = async (path: string): Promise<string|null> => {
    return new Promise( (resolve) => {
        FS.readFile( path, { encoding: "utf-8" }, (error, data) => {
            if ( error ) resolve(null);

            resolve( data );
        } );
    } );
};

export default Contents;

export { Contents };