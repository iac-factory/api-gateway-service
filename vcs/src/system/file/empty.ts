import FS from "fs";
import Contents from "./contents";

const Empty = async (path: string): Promise<boolean> => {
    const contents = String(await Contents(path));

    return ( contents.length > 0 && contents !== "" && contents !== "{}" );
};

export default Empty;

export { Empty };