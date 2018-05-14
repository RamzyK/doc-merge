/// <reference types="node" />
import * as fs from 'fs';
export declare const readFile: typeof fs.readFile.__promisify__;
export declare const saveFile: typeof fs.writeFile.__promisify__;
export declare function getFileAsBase64(fileName: string): Promise<string>;
export declare function saveJson(data: any, fileName: string): Promise<void>;
