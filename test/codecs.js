"use strict";

var expect = require("expect.js");
var codecs = require("../lib/codecs.js");

describe ("codecs", function () {

    describe("JSON codec", function () {

        it("can encode data", function () {
            var data = {foo: "bar"};
            var encoded = codecs.jsonEncoder(data);
            expect(encoded).to.equal('{"foo":"bar"}');
        });

        it("can decode data", function () {
            var data = '{"foo":"bar"}';
            var decoded = codecs.jsonDecoder(data);
            expect(decoded).to.eql({foo: "bar"});
        });

    });

    describe("JSON+deflate codec", function () {

        it("can encode data", function () {
            var data = {foo: "bar"};
            var encoded = codecs.jsonDeflateEncoder(data);
            expect(encoded.length).to.be.greater.than(0);
            expect(encoded).not.to.equal('{"foo":"bar"}');
        });

        it("can decode data", function () {
            throw new Error("NotImplementedError");  // TODO
        });

    });

});
