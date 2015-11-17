"use strict";

var expect = require("expect.js");
var WProjectFile = require("../lib/WProjectFile");

describe("WprojectFile", function () {

    describe("_exportHeader", function () {

        var project = null;
        var header = null;

        before(function () {
            project = new WProjectFile();
            header = project._exportHeader({
                metadataFormat: WProjectFile.FORMAT_JSON_DEFLATE,
                metadataLength: 10,
                projectFormat: WProjectFile.FORMAT_JSON_DEFLATE,
                projectLength: 20,
                blobIndexFormat: WProjectFile.FORMAT_JSON_DEFLATE,
                blobIndexLength: 30,
                blobsLength: 40
            });
        });

        it("exports the header with the right length", function () {
            expect(header.length).to.equal(51);
        });

        it("exports the right magic", function () {
            expect(header.toString("ascii", 0, 4)).to.equal("WPRJ");
        });

        it("exports the right version", function () {
            expect(header.readUInt16BE(4)).to.equal(1);
        });

        it("exports the header with the right length", function () {
            expect(header.toString("ascii", 6, 16)).to.equal("GENERIC   ");
        });


        it("exports the header with the right metadata format", function () {
            expect(header.readUInt8(16)).to.equal(1);
        });

        it("exports the header with the right metadata offset", function () {
            expect(header.readUInt32BE(17)).to.equal(51);
        });

        it("exports the header with the right metadata length", function () {
            expect(header.readUInt32BE(21)).to.equal(10);
        });


        it("exports the header with the right project format", function () {
            expect(header.readUInt8(25)).to.equal(1);
        });

        it("exports the header with the right project offset", function () {
            expect(header.readUInt32BE(26)).to.equal(61);
        });

        it("exports the header with the right project length", function () {
            expect(header.readUInt32BE(30)).to.equal(20);
        });


        it("exports the header with the right blob index format", function () {
            expect(header.readUInt8(34)).to.equal(1);
        });

        it("exports the header with the right blob index offset", function () {
            expect(header.readUInt32BE(35)).to.equal(81);
        });

        it("exports the header with the right blob index length", function () {
            expect(header.readUInt32BE(39)).to.equal(30);
        });


        it("exports the header with the right blob offset", function () {
            expect(header.readUInt32BE(43)).to.equal(111);
        });

        it("exports the header with the right blob length", function () {
            expect(header.readUInt32BE(47)).to.equal(40);
        });

    });
});

