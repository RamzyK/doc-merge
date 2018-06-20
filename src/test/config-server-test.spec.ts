// // tslint:disable:only-arrow-functions
// // tslint:disable:no-console
// import * as dm from '../lib/index';
// import 'mocha';
// import * as request from 'request';
// import * as chai from 'chai';
// import * as path from 'path';
// import * as fs from 'fs';
// import { promisify } from 'util';
// import { IBody } from 'doc-merge-intf';
// import { App } from '../lib/app';

// const assert = chai.assert;

// const exists = promisify(fs.exists);
// const asyncMkDir = promisify(fs.mkdir);
// const readdir = promisify(fs.readdir);
// const unlink = promisify(fs.unlink);

// async function deleteDirectoryContent(dirPath: string) {
//     try {
//         const files = await readdir(dirPath);
//         const unlinkPromises = files.map((filename) => unlink(`${dirPath}/${filename}`));
//         await Promise.all(unlinkPromises);
//     } catch (err) {
//         console.log(err);
//     }
// }

// describe('Config server test', function () {
//     it('Should remove old files from the', async function () {
//         const tmpFolder = path.join(__dirname, '../../src/test/', 'tmp');
//         // TODO creer le repertoire (et le vider)
//         if (! await exists(tmpFolder)) {
//             await asyncMkDir(tmpFolder);
//         } else {
//             await deleteDirectoryContent(tmpFolder);
//         }
//         // TODO file:// + chemin vers model.docx;
//         const modelUrl = 'file:\\\\' + path.join(__dirname, '..\\..\\src\\test\\docx-generator-data', 'model.docx');
//         const app = new App({
//             port: 0,
//             tmpFolder,
//         });
//         const server = await app.start();
//         try {
//             const port = server.address().port;
//             const body: IBody = {
//                 data: {},
//                 modeleRef: { url: modelUrl },
//                 type: 'docx',
//                 outputType: dm.OutputType.download,
//             };

//             const testUrl = `http://localhost:${port}/merge`;
//             const requestResponse = await new Promise<void>((resolve, reject) => {
//                 let r = request.post(testUrl,
//                     {
//                         body: JSON.stringify(body),
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                     });
//                 r.on('error', (error: any) => {
//                     reject(error);
//                 });
//                 let output = fs.createWriteStream(path.join(tmpFolder, 'output.docx'));
//                 r.pipe(output);
//                 output.on('finish', () => resolve());
//             });
//         } finally {
//             await app.stop();
//         }
//     });

// });
