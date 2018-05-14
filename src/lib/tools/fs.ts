import { promisify } from 'util';
import * as fs from 'fs';
export const readFile = promisify(fs.readFile);
export const saveFile = promisify(fs.writeFile);

export async function getFileAsBase64(fileName: string): Promise<string> {
    const fileBuffer = await readFile(fileName);
    const contentsInBase64 = fileBuffer.toString('base64');
    return contentsInBase64;
}

export async function saveJson(data: any, fileName: string): Promise<void> {
    const dataStr = JSON.stringify(data);
    const fileContent = new Buffer(dataStr, 'base64');
    return await saveFile(fileContent, fileName);
}
