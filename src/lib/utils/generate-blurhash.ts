import { blurhashToDataUri } from '@unpic/placeholder';
import path from 'node:path'
import { encode } from "blurhash";
import { getPixels } from "@unpic/pixels";

const { STATE_DIRECTORY = '.state_directory' } = process.env

export async function generateBlurhashDataUri(imagePath: string): Promise<string> {
    const p = decodeURIComponent(imagePath)

    const file_path = path.normalize(path.join(STATE_DIRECTORY, p))

    const file = Bun.file(file_path);
    const arrayBuffer = await file.arrayBuffer();

    const file_data = await getPixels(arrayBuffer);
    const data = Uint8ClampedArray.from(file_data.data);
    return blurhashToDataUri(encode(data, file_data.width, file_data.height, 4, 4));
}