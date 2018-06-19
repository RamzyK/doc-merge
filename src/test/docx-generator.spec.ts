// tslint:disable:only-arrow-functions

import * as dm from '../lib/index';
import 'mocha';
import * as chai from 'chai';
import * as path from 'path';
import { promisify } from 'util';
import * as fs from 'fs';

import * as gen from '../lib/interfaces';

const exists = promisify(fs.exists);
const unlink = promisify(fs.unlink);
const expect = chai.expect;
describe('DocGenerator', function () {
    it('Merge file', async function () {
        const modelFileName = path.join(__dirname, '../../src/test/docx-generator-data', 'model.docx');
        const outputFileName = path.join(__dirname, '../../src/test/docx-generator-data', 'generated.docx');
        const input: gen.IPluginInput = {
            data: {},
            modelFileName,
            outputFileName,
        };
        if (await exists(outputFileName)) {
            await unlink(outputFileName);
        }
        if (await exists(outputFileName)) {
            throw new Error(`File ${outputFileName} can not be removed`);
        }

        const generator = new dm.DocGenerator();
        const output = await generator.generate(input);
        expect(await exists(output.outputFileName)).eql(true);
        // await unlink(outputFileName);
        // expect(await exists(output.outputFileName)).eql(false);
    });
});
