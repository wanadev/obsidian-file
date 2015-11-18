"use strict";

var expect = require("expect.js");
var WProjectFile = require("../lib/WProjectFile");
var data = require("./data/data.js");

describe("WprojectFile", function () {

    describe("BLOB MANAGEMENT", function () {

        it.skip("addBlob", function () {
            // TODO
        });

        it.skip("addBlobFromData64Url", function () {
            // TODO
        });

        it.skip("addBlobFromString", function () {
            // TODO
        });


        it.skip("getBlob", function () {
            // TODO
        });

        it.skip("getBlobAsData64Url", function () {
            // TODO
        });

        it.skip("getBlobAsString", function () {
            // TODO
        });

        if (global.TEST_BROWSER) {
            it.skip("getBlobUrl", function () {
                // TODO
            });
        }


        it.skip("getBlobMetadata", function () {
            // TODO
        });

        it.skip("removeBlob", function () {
            // TODO
        });

        it.skip("blobExists", function () {
            // TODO
        });

        it.skip("getBlobList", function () {
            // TODO
        });

    });

    describe("EXPORT", function () {

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

        it.skip("exportAsBlob", function () {
            // TODO
        });

        it.skip("exportAsData64Url", function () {
            // TODO
        });

    });

    describe("LOAD", function () {

        it.skip("_loadProjectFromBlob", function () {
            // TODO
        });

        it.skip("_loadProjectFromData64Url", function () {
            // TODO
        });

        describe("_loadHeader", function () {

            var project = null;
            var header = new Buffer([
                0x57, 0x50, 0x52, 0x4a, 0x00, 0x01, 0x47, 0x45,
                0x4e, 0x45, 0x52, 0x49, 0x43, 0x20, 0x20, 0x20,
                0x01, 0x00, 0x00, 0x00, 0x33, 0x00, 0x00, 0x00,
                0x0a, 0x01, 0x00, 0x00, 0x00, 0x3d, 0x00, 0x00,
                0x00, 0x14, 0x01, 0x00, 0x00, 0x00, 0x51, 0x00,
                0x00, 0x00, 0x1e, 0x00, 0x00, 0x00, 0x6f, 0x00,
                0x00, 0x00, 0x28
            ]);

            before(function () {
                project = new WProjectFile();
            });

            it("can extract all fields of the header", function () {
                var headerData = project._loadHeader(header);

                expect(headerData.magic).to.equal("WPRJ");
                expect(headerData.version).to.equal(1);
                expect(headerData.type).to.equal("GENERIC");

                expect(headerData.metadataFormat).to.equal(1);
                expect(headerData.metadataOffset).to.equal(51);
                expect(headerData.metadataLength).to.equal(10);

                expect(headerData.projectFormat).to.equal(1);
                expect(headerData.projectOffset).to.equal(61);
                expect(headerData.projectLength).to.equal(20);

                expect(headerData.blobIndexFormat).to.equal(1);
                expect(headerData.blobIndexOffset).to.equal(81);
                expect(headerData.blobIndexLength).to.equal(30);

                expect(headerData.blobsOffset).to.equal(111);
                expect(headerData.blobsLength).to.equal(40);
            });

            it("raises an exception if the buffer is too small to contains the header", function () {
                expect(project._loadHeader.bind(null, new Buffer(42))).to.throwException(/BufferTruncated/);
            });

        });

    });

    describe("MISC", function () {

        describe("__init__", function () {

            it.skip("can create a new empty project", function () {
                // TODO
            });

            it.skip("can create a project from a blob", function () {
                // TODO
            });

            it.skip("can create a project from a data64 URL", function () {
                // TODO
            });

        });

        it.skip("destroy", function () {
            // TODO
        });

        it.skip("version", function () {
            // TODO
        });

        it.skip("type", function () {
            // TODO
        });

        it.skip("metadata", function () {
            // TODO
        });

        it.skip("project", function () {
            // TODO
        });

    });
});

