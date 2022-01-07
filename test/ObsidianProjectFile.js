"use strict";

var expect = require("expect.js");
var ObsidianProjectFile = require("../lib/ObsidianProjectFile.js");
var codecs = require("../lib/codecs.js");
var data = require("./data/data.js");

describe("ObsidianProjectFile", function () {

    describe("isObsidianProjectFile", function () {

        it("checks that the buffer has the right magic", function () {
            var buff = Buffer.alloc(data.projectBuffer.length);
            data.projectBuffer.copy(buff);
            buff[0] = 0x20;

            expect(ObsidianProjectFile.isObsidianProjectFile(buff)).not.to.be.ok();
        });

        it("checks that the buffer size is coherent with values found in the header", function () {
            var buff = Buffer.alloc(data.projectBuffer.length-1);
            data.projectBuffer.copy(buff);

            expect(ObsidianProjectFile.isObsidianProjectFile(buff)).not.to.be.ok();
            expect(ObsidianProjectFile.isObsidianProjectFile(data.projectBuffer)).to.be.ok();
        });

    });

    describe("BLOB MANAGEMENT", function () {

        it("addBlob adds blob from a Blob or Buffer object", function () {
            var p = new ObsidianProjectFile();

            p.addBlob(data.imageBuffer, "buffer1");
            p.addBlob(data.imageBuffer, "buffer2", {mime: "image/png", metadata: {foo: "bar"}});

            expect(p.$data.blobs.buffer1).not.to.be(undefined);
            expect(p.$data.blobs.buffer1.mime).to.equal("application/octet-stream");
            expect(p.$data.blobs.buffer1.metadata).to.be.empty();
            expect(p.$data.blobs.buffer1._buffer).to.equal(data.imageBuffer);

            expect(p.$data.blobs.buffer2).not.to.be(undefined);
            expect(p.$data.blobs.buffer2.mime).to.equal("image/png");
            expect(p.$data.blobs.buffer2.metadata).to.eql({foo: "bar"});
            expect(p.$data.blobs.buffer2._buffer).to.equal(data.imageBuffer);
        });

        it("addBlobFromData64Url creates and adds blob from a data64 URL", function () {
            var p = new ObsidianProjectFile();

            p.addBlobFromData64Url(data.imageData64, "buffer1");
            p.addBlobFromData64Url(data.imageData64, "buffer2", {mime: "application/x-test", metadata: {foo: "bar"}});

            expect(p.$data.blobs.buffer1).not.to.be(undefined);
            expect(p.$data.blobs.buffer1.mime).to.equal("image/png");
            expect(p.$data.blobs.buffer1.metadata).to.be.empty();
            expect(p.$data.blobs.buffer1._buffer).to.eql(data.imageBuffer);

            expect(p.$data.blobs.buffer2).not.to.be(undefined);
            expect(p.$data.blobs.buffer2.mime).to.equal("application/x-test");
            expect(p.$data.blobs.buffer2.metadata).to.eql({foo: "bar"});
            expect(p.$data.blobs.buffer2._buffer).to.eql(data.imageBuffer);
        });

        it("addBlobFromString creates and adds blob from a string ", function () {
            var p = new ObsidianProjectFile();

            p.addBlobFromString("Hello World", "buffer1");
            p.addBlobFromString("Hello World è_é", "buffer2", {mime: "text/plain", metadata: {foo: "bar"}});

            expect(p.$data.blobs.buffer1).not.to.be(undefined);
            expect(p.$data.blobs.buffer1.mime).to.equal("application/octet-stream");
            expect(p.$data.blobs.buffer1.metadata).to.be.empty();
            expect(p.$data.blobs.buffer1._buffer.toString()).to.equal("Hello World");

            expect(p.$data.blobs.buffer2).not.to.be(undefined);
            expect(p.$data.blobs.buffer2.mime).to.equal("text/plain");
            expect(p.$data.blobs.buffer2.metadata).to.eql({foo: "bar"});
            expect(p.$data.blobs.buffer2._buffer.toString()).to.equal("Hello World è_é");
        });


        it("getBlob returns the requested blob as Buffer", function () {
            var p = new ObsidianProjectFile();
            p.addBlob(data.imageBuffer, "buffer1");

            expect(p.getBlob("buffer1")).to.equal(data.imageBuffer);
            expect(p.getBlob("foo")).to.be(null);
        });

        it("getBlobAsData64Url returns the blob as data64 URI", function () {
            var p = new ObsidianProjectFile();
            p.addBlob(data.imageBuffer, "buffer1", {mime: "image/png"});

            expect(p.getBlobAsData64Url("buffer1")).to.equal(data.imageData64);
            expect(p.getBlobAsData64Url("foo")).to.be("data:application/octet-stream;base64,");
        });

        it("getBlobAsString returns the blob as string", function () {
            var p = new ObsidianProjectFile();
            p.addBlobFromString("Hello World", "buffer1");

            expect(p.getBlobAsString("buffer1")).to.equal("Hello World");
            expect(p.getBlobAsString("foo")).to.be("");
        });


        it("getBlobRecord returns inormations about a blob", function () {
            var p = new ObsidianProjectFile();
            p.addBlob(data.imageBuffer, "buffer1", {mime: "image/png", metadata: {foo: "bar"}});

            expect(p.getBlobRecord("buffer1")).to.eql({
                offset: null,
                length: 192,
                mime: "image/png",
                metadata: {
                    foo: "bar"
                }
            });
        });

        it("removeBlob can remove a blob", function () {
            var p = new ObsidianProjectFile();
            p.addBlobFromString("Hello World", "blob1");
            expect(p.$data.blobs.blob1).not.to.be(undefined);
            p.removeBlob("blob1");
            expect(p.$data.blobs.blob1).to.be(undefined);
        });

        it("blobExists allows to check if a blob exists", function () {
            var p = new ObsidianProjectFile();
            p.addBlobFromString("Hello World", "blob1");

            expect(p.blobExists("blob1")).to.be.ok();
            expect(p.blobExists("blob2")).not.to.be.ok();
        });

        it("getBlobList returns a list of all blobs", function () {
            var p = new ObsidianProjectFile();
            p.addBlobFromString("Hello World", "blob1");
            p.addBlobFromString("Hello World", "blob2");

            expect(p.getBlobList()).to.eql(["blob1", "blob2"]);
        });

    });

    describe("EXPORT", function () {

        describe("_exportHeader", function () {

            var project = null;
            var header = null;

            before(function () {
                project = new ObsidianProjectFile();
                header = project._exportHeader({
                    metadataFormat: ObsidianProjectFile.FORMAT_JSON_DEFLATE,
                    metadataLength: 10,
                    projectFormat: ObsidianProjectFile.FORMAT_JSON_DEFLATE,
                    projectLength: 20,
                    blobIndexFormat: ObsidianProjectFile.FORMAT_JSON_DEFLATE,
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

            it("exports the right type", function () {
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

        it("_exportBlobs exports blobIndex and blobs as Buffer", function () {
            var p = new ObsidianProjectFile();
            p.addBlob(data.imageBuffer, "image.png", {mime: "image/png"}); // 192 B
            p.addBlobFromString("Hello!", "hello.txt", {mime: "text/plain"}); // 6 B

            var blobs = p._exportBlobs(ObsidianProjectFile.FORMAT_JSON_DEFLATE);
            var index = codecs.jsonDeflateDecoder(blobs[0]);

            expect(index).to.eql({
                "image.png": {
                    offset: 0,
                    length: 192,
                    mime: "image/png",
                    metadata: {}
                },
                "hello.txt": {
                    offset: 192,
                    length: 6,
                    mime: "text/plain",
                    metadata: {}
                }
            });

            expect(blobs[1].length).to.equal(192 + 6);
        });

        it("exportAsBlob exports the project as Buffer", function () {
            var p = new ObsidianProjectFile();
            var buffer = p.exportAsBlob();
            expect(buffer instanceof Buffer).to.be.ok();
            expect(buffer.length).to.be.greaterThan(51);
        });

        it("exportAsData64Url exports the project as Data64 URI", function () {
            var p = new ObsidianProjectFile();
            var data64 = p.exportAsData64Url();
            expect(data64.indexOf("data:application/x-obsidian-project;base64")).to.equal(0);
        });

    });

    describe("LOAD", function () {

        it("_loadBlob can load a project from a Buffer", function () {
            var p = new ObsidianProjectFile();
            p._loadBlob(data.projectBuffer);

            expect(p.metadata).to.eql({
                author: "John DOE",
                projectVersion: "1.2.0",
                projectId: "de80a8a5-0238-41c4-89ad-56406d78a00b",
                lastEdit: 1447942109
            });

            expect(p.project).to.eql([
                [
                    {"__name__":"BaseStructure","id":"84130666-bc2d-4414-8ac4-621887f9cd7d"}
                ],
                []
            ]);

            expect(p.getBlob("image.png")).to.eql(data.imageBuffer);
        });

        it("_loadData64Url can load a project from a data64 URI", function () {
            var p = new ObsidianProjectFile();
            p._loadData64Url(data.projectData64);

            expect(p.metadata).to.eql({
                author: "John DOE",
                projectVersion: "1.2.0",
                projectId: "de80a8a5-0238-41c4-89ad-56406d78a00b",
                lastEdit: 1447942109
            });

            expect(p.project).to.eql([
                [
                    {"__name__":"BaseStructure","id":"84130666-bc2d-4414-8ac4-621887f9cd7d"}
                ],
                []
            ]);

            expect(p.getBlob("image.png")).to.eql(data.imageBuffer);
        });

        describe("_loadHeader", function () {

            var project = null;
            var header = Buffer.from([
                0x57, 0x50, 0x52, 0x4a, 0x00, 0x01, 0x47, 0x45,
                0x4e, 0x45, 0x52, 0x49, 0x43, 0x20, 0x20, 0x20,
                0x01, 0x00, 0x00, 0x00, 0x33, 0x00, 0x00, 0x00,
                0x0a, 0x01, 0x00, 0x00, 0x00, 0x3d, 0x00, 0x00,
                0x00, 0x14, 0x01, 0x00, 0x00, 0x00, 0x51, 0x00,
                0x00, 0x00, 0x1e, 0x00, 0x00, 0x00, 0x6f, 0x00,
                0x00, 0x00, 0x28
            ]);

            before(function () {
                project = new ObsidianProjectFile();
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
                expect(project._loadHeader.bind(null, Buffer.alloc(42))).to.throwException(/BufferTruncated/);
            });

        });

        it("_loadMetadata", function () {
            var p = new ObsidianProjectFile();

            var metadata = p._loadMetadata(data.projectBuffer, 51, 108, ObsidianProjectFile.FORMAT_JSON_DEFLATE);

            expect(metadata).to.eql({
                author: "John DOE",
                projectVersion: "1.2.0",
                projectId: "de80a8a5-0238-41c4-89ad-56406d78a00b",
                lastEdit: 1447942109
            });
        });

        it("_loadProject", function () {
            var p = new ObsidianProjectFile();

            var project = p._loadProject(data.projectBuffer, 159, 80, ObsidianProjectFile.FORMAT_JSON_DEFLATE);

            expect(project).to.eql([
                [
                    {"__name__":"BaseStructure","id":"84130666-bc2d-4414-8ac4-621887f9cd7d"}
                ],
                []
            ]);
        });

        it("_loadBlobs", function () {
            var p = new ObsidianProjectFile();

            var blobs = p._loadBlobs(data.projectBuffer, 239, 94, ObsidianProjectFile.FORMAT_JSON_DEFLATE, 333, 205);

            expect(blobs).to.eql({
                "image.png": {
                    _buffer: data.imageBuffer,
                    mime: "image/png",
                    metadata: {}
                },
                "hello.txt": {
                    _buffer: Buffer.from("Hello World!\n", "ascii"),
                    mime: "text/plain",
                    metadata: {}
                }
            });
        });

    });

    describe("MISC", function () {

        describe("__init__", function () {

            it("can create a new empty project", function () {
                var p = new ObsidianProjectFile();
                expect(p.blobList).to.be.empty();
                expect(p.project).to.be.empty();
                expect(p.metadata).to.be.empty();
            });

            it("can create a project from a blob", function () {
                var p = new ObsidianProjectFile(data.projectBuffer);

                expect(p.metadata).to.eql({
                    author: "John DOE",
                    projectVersion: "1.2.0",
                    projectId: "de80a8a5-0238-41c4-89ad-56406d78a00b",
                    lastEdit: 1447942109
                });

                expect(p.project).to.eql([
                    [
                        {"__name__":"BaseStructure","id":"84130666-bc2d-4414-8ac4-621887f9cd7d"}
                    ],
                    []
                ]);

                expect(p.getBlob("image.png")).to.eql(data.imageBuffer);
            });

            it("can create a project from a data64 URL", function () {
                var p = new ObsidianProjectFile(data.projectData64);

                expect(p.metadata).to.eql({
                    author: "John DOE",
                    projectVersion: "1.2.0",
                    projectId: "de80a8a5-0238-41c4-89ad-56406d78a00b",
                    lastEdit: 1447942109
                });

                expect(p.project).to.eql([
                    [
                        {"__name__":"BaseStructure","id":"84130666-bc2d-4414-8ac4-621887f9cd7d"}
                    ],
                    []
                ]);

                expect(p.getBlob("image.png")).to.eql(data.imageBuffer);
            });

        });

        it("version is defined", function () {
            var p = new ObsidianProjectFile();
            expect(p.version).to.equal(1);
        });

        it("type is 'GENERIC' by default", function () {
            var p = new ObsidianProjectFile();
            expect(p.type).to.equal("GENERIC");
        });

        it("type can be set with varous strings", function () {
            var p = new ObsidianProjectFile();

            p.type = "FOOTYPE"
            expect(p.type).to.equal("FOOTYPE");

            p.type = "bartype  "
            expect(p.type).to.equal("BARTYPE");

            p.type = "xxXXxxXXxxTYPE"
            expect(p.type).to.equal("XXXXXXXXXX");
        });

        it("metadata is an empty object by default ", function () {
            var p = new ObsidianProjectFile();
            expect(p.metadata).to.be.an("object");
            expect(p.metadata).to.be.empty();
        });

        it("project is an empty array by default", function () {
            var p = new ObsidianProjectFile();
            expect(p.project).to.be.an("array");
            expect(p.project).to.be.empty();
        });

    });
});

