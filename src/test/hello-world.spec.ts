// tslint:disable:only-arrow-functions
import * as df from '../lib/index';
import 'mocha';
import * as chai from 'chai';
const expect = chai.expect;
describe('smoke test', function () {
    it('should not smoke', function () {
        expect(true).equals(true);
    });
});

describe('Doc fusion', function () {
    it('merge options', function () {
        const o1: df.IDocFusionOptions = {};
        const o2: df.IDocFusionOptions = { generationDirectory: '/tmp' };
        const docFusionClass: any = df.DocFusion;
        const o3 = docFusionClass.mergeOptions(o1, o2);
        expect(o3).eql({ generationDirectory: '/tmp' });
    });
    it('should fusion', async function () {
        const f = new df.DocFusion({
            generationDirectory: '/tmp',
        });
        const fileName = await f.generateDoc({ outputFileName: 'x.docx' }, {});
        expect(fileName).eql('/tmp/x.docx');
    });
});
