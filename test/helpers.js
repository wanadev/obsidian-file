"use strict";

var expect = require("expect.js");
var helpers = require("../lib/helpers.js");

describe("helpers", function () {

    describe("numberToBigEndianArray", function () {

        it("converts a number to a bigendian array", function () {
            expect(helpers.numberToBigEndianArray(0xBBAA, 2)).to.eql([0xBB, 0xAA]);
            expect(helpers.numberToBigEndianArray(0xBBAA, 4)).to.eql([0x00, 0x00, 0xBB, 0xAA]);
            expect(helpers.numberToBigEndianArray.bind(null, 0xDDCCBBAA, 2)).to.throwException(/NumberTooLarge/);
        });

    });

    describe("bigEndianArrayToNumber", function () {

        it("converts a bigendian array to number", function () {
            expect(helpers.bigEndianArrayToNumber([0xBB, 0xAA])).to.equal(0xBBAA);
            expect(helpers.bigEndianArrayToNumber([0x00, 0x00, 0xBB, 0xAA])).to.equal(0xBBAA);
        });

    });

});
