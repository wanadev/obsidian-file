"use strict";

var expect = require("expect.js");
var codecs = require("../lib/codecs.js");

describe("codecs", function () {

    describe("JSON codec", function () {

        it("can encode data", function () {
            var data = {foo: "bar"};
            var encoded = codecs.jsonEncoder(data);
            expect(encoded.toString("utf8")).to.equal('{"foo":"bar"}');
        });

        it("can encode data containing unicode", function () {
            var data = {foo: "unicode¿éÉ"};
            var encoded = codecs.jsonEncoder(data);
            expect(encoded.toString("utf8")).to.equal('{"foo":"unicode¿éÉ"}');
        });

        it("can decode data", function () {
            var data = '{"foo":"bar"}';
            var data2 = Buffer.from(data);
            var decoded = codecs.jsonDecoder(data);
            var decoded2 = codecs.jsonDecoder(data2);
            expect(decoded).to.eql({foo: "bar"});
            expect(decoded2).to.eql({foo: "bar"});
        });

    });

    describe("JSON+deflate codec", function () {

        it("can encode data", function () {
            var data = {foo: "bar"};
            var encoded = codecs.jsonDeflateEncoder(data);
            expect(encoded.length).to.be.greaterThan(0);
            expect(encoded).not.to.equal('{"foo":"bar"}');
        });

        it("can encode data containing unicode", function () {
            var data = {foo: "unicode¿éÉ"};
            var encoded = codecs.jsonDeflateEncoder(data);
            expect(encoded.length).to.be.greaterThan(0);
            expect(encoded).not.to.equal('{"foo":"unicode¿éÉ"}');
        });

        it("can decode data", function () {
            var data = [0xAB, 0x56, 0x4A, 0xCB, 0xCF, 0x57, 0xB2, 0x52, 0x4A, 0x4A, 0x2C, 0x52, 0xAA, 0x05, 0x00];
            var data2 = Buffer.from(data);
            var decoded = codecs.jsonDeflateDecoder(data);
            var decoded2 = codecs.jsonDeflateDecoder(data2);
            expect(decoded).to.eql({foo: "bar"});
            expect(decoded2).to.eql({foo: "bar"});
        });

    });

});
