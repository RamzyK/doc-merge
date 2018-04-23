// tslint:disable:only-arrow-functions
import * as dm from '../lib/index';
import 'mocha';
import * as chai from 'chai';
const expect = chai.expect;
describe('smoke test', function () {
    it('should not smoke', function () {
        expect(true).equals(true);
    });
});

describe('hello world', function() {
    it('should greets', function() {
        const hw = new dm.HelloWorld();
        const actual = hw.sayHello('world');
        const expected = 'Hello world';
        expect(actual).equals(expected);
    });
});
