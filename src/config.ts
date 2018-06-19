// tslint:disable:no-var-requires
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as interfaces from 'doc-merge-intf';

let exist = util.promisify(fs.existsSync);

let folder1 = '../../../';
const configFileName = path.join(folder1, 'config.js');
export const configuration = exist(configFileName) ? require(configFileName) : null;
