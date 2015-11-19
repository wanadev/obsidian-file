"use strict";

var Class = require("abitbol");

var codecs = require("./codecs.js");

var WProjectFile = Class.$extend({

    __classvars__: {
        FORMAT_JSON:         0,
        FORMAT_JSON_DEFLATE: 1,
        MIMETYPE: "application/x-wanadev-project"
    },

    __init__: function (wProjectFile) {
        this.$data.version = 1;
        this.$data.type = "GENERIC";
        this.$data.metadata = {};
        this.$data.project = [];
        this.$data.blobs = {};

        if (typeof wProjectFile == "string") {
            this._loadData64Url(wProjectFile);
        } else if (wProjectFile instanceof Buffer) {
            this._loadBlob(wProjectFile);
        }
    },

    // Header

    getVersion: function () {
        return this.$data.version;
    },

    getType: function () {
        return this.$data.type;
    },

    setType: function (type) {
        type = type.trim();
        type = type.substr(0, 10);
        type = type.toUpperCase();
        this.$data.type = type;
    },

    // Metadata

    getMetadata: function () {
        return this.$data.metadata;
    },

    setMetadata: function (metadata) {
        this.$data.metadata = metadata;
    },

    // Project

    getProject: function () {
        return this.$data.project;
    },

    setProject: function (project) {
        this.$data.project = project;
    },

    // Blob

    getBlobList: function () {
        return Object.getOwnPropertyNames(this.$data.blobs);
    },

    getBlob: function (blobId) {
        if (!this.blobExists(blobId)) {
            return null;
        }
        return this.$data.blobs[blobId]._buffer;
    },

    getBlobAsData64Url: function (blobId) {
        if (!this.blobExists(blobId)) {
            return "";
        }
        return "data:" + this.$data.blobs[blobId].mime + ";base64," + this.$data.blobs[blobId]._buffer.toString("base64");
    },

    getBlobAsString: function (blobId) {
        if (!this.blobExists(blobId)) {
            return "";
        }
        return this.$data.blobs[blobId]._buffer.toString();
    },

    getBlobRecord: function (blobId) {
        var record = {
            offset: null,
            length: 0,
            mime: "application/octet-stream",
            metadata: {}
        };

        if (this.blobExists(blobId)) {
            record.length = this.$data.blobs[blobId]._buffer.length;
            record.mime = this.$data.blobs[blobId].mime;
            record.metadata = this.$data.blobs[blobId].metadata;
        }

        return record;
    },

    addBlob: function (blob, blobId, options) {
        options = options || {};
        var blobRecord = {
            _buffer: blob,
            mime: options.mime || "application/octet-stream",
            metadata: options.metadata || {}
        };

        if (this.blobExists(blobId)) {
            this.removeBlob(blobId);
        }
        this.$data.blobs[blobId] = blobRecord;
    },

    addBlobFromData64Url: function (data64, blobId, options) {
        options = options || {};
        var blob = new Buffer(data64.split(",")[1], "base64");
        if (!options.mime) {
            options.mime = data64.split(";")[0].split(":")[1];
        }
        this.addBlob(blob, blobId, options);
    },

    addBlobFromString: function (string, blobId, options) {
        var blob = new Buffer(string);
        this.addBlob(blob, blobId, options);
    },

    removeBlob: function (blobId) {
        delete this.$data.blobs[blobId];
    },

    blobExists: function (blobId) {
        return this.$data.blobs[blobId] !== undefined;
    },

    // Project Method

    exportAsBlob: function (options) {
        return this._export(options);
    },

    exportAsData64Url: function (options) {
        return "data:application/x-wanadev-project;base64," + this._export(options).toString("base64");
    },

    // Clean

    destroy: function () {
        throw new Error("NotImplementedError"); // TODO
    },

    // Project Loading

    _loadBlob: function (blob) {
        var header = this._loadHeader(blob);

        if (header.magic !== "WPRJ") {
            throw new Error("NotAWanadevProjectFile");
        }

        if (header.version !== 1) {
            throw new Error("UnsupportedVersion");
        }

        this.type = header.type;

        this.metadata = this._loadMetadata(
            blob,
            header.metadataOffset,
            header.metadataLength,
            header.metadataFormat
        );
        this.project = this._loadProject(
            blob,
            header.projectOffset,
            header.projectLength,
            header.projectFormat
        );
        this.$data.blobs = this._loadBlobs(
            blob,
            header.blobIndexOffset,
            header.blobIndexLength,
            header.blobIndexFormat,
            header.blobsOffset,
            header.blobsLength
        );
    },

    _loadData64Url: function (data64) {
        this._loadBlob(new Buffer(data64.split(",")[1], "base64"));
    },

    _loadHeader: function (buffer) {
        if (buffer.length < 51) {
            throw new Error("BufferTruncated");
        }
        return {
            magic: buffer.toString("ascii", 0, 4),
            version: buffer.readUInt16BE(4),
            type: buffer.toString("ascii", 6, 16).trim(),

            metadataFormat: buffer.readUInt8(16),
            metadataOffset: buffer.readUInt32BE(17),
            metadataLength: buffer.readUInt32BE(21),

            projectFormat: buffer.readUInt8(25),
            projectOffset: buffer.readUInt32BE(26),
            projectLength: buffer.readUInt32BE(30),

            blobIndexFormat: buffer.readUInt8(34),
            blobIndexOffset: buffer.readUInt32BE(35),
            blobIndexLength: buffer.readUInt32BE(39),

            blobsOffset: buffer.readUInt32BE(43),
            blobsLength: buffer.readUInt32BE(47)
        };
    },

    _loadMetadata: function (buffer, offset, length, format) {
        return codecs.index[format].decoder(buffer.slice(offset, offset+length));
    },

    _loadProject: function (buffer, offset, length, format) {
        return codecs.index[format].decoder(buffer.slice(offset, offset+length));
    },

    _loadBlobs: function (buffer, blobIndexOffset, blobIndexLength, blobIndexFormat, blobsOffset, blobsLength) {
        var blobs = {};
        var blobIndex = codecs.index[blobIndexFormat].decoder(buffer.slice(blobIndexOffset, blobIndexOffset+blobIndexLength));

        for (var blobId in blobIndex) {
            blobs[blobId] = {
                _buffer: buffer.slice(blobsOffset+blobIndex[blobId].offset, blobsOffset+blobIndex[blobId].offset+blobIndex[blobId].length),
                mime: blobIndex[blobId].mime || "application/octet-stream",
                metadata: blobIndex[blobId].metadata || {}
            };
        }

        return blobs;
    },

    // Project export

    _export: function (options) {
        options = options || {};
        options.metadataFormat = (options.metadataFormat === undefined) ?
            this.$class.FORMAT_JSON_DEFLATE : options.metadataFormat;
        options.projectFormat = (options.projectFormat === undefined) ?
            this.$class.FORMAT_JSON_DEFLATE : options.projectFormat;
        options.blobIndexFormat = (options.blobIndexFormat === undefined) ?
            this.$class.FORMAT_JSON_DEFLATE : options.blobIndexFormat;

        var metadata = this._exportMetadata(options.metadataFormat);
        var project = this._exportProject(options.projectFormat);
        var blobs = this._exportBlobs(options.blobIndexFormat);  // [blobIndex, blobs]

        var header = this._exportHeader({
            metadataFormat: options.metadataFormat,
            metadataLength: metadata.length,
            projectFormat: options.projectFormat,
            projectLength: project.length,
            blobIndexFormat: options.blobIndexFormat,
            blobIndexLength: blobs[0].length,  // blobIndex
            blobsLength: blobs[1].length,      // blobs
        });

        return Buffer.concat([header, metadata, project, blobs[0], blobs[1]]);
    },

    _exportHeader: function (params) {
        var headerLength = 51;

        var header = new Buffer(headerLength);
        header.fill(0);

        // magic
        header.write("WPRJ", 0);
        // version
        header.writeUInt16BE(this.version, 4);
        // type
        header.fill(0x20, 6, 16);
        header.write(this.type, 6);
        // metadata
        header.writeUInt8(params.metadataFormat, 16);
        header.writeUInt32BE(headerLength, 17);
        header.writeUInt32BE(params.metadataLength, 21);
        // project
        header.writeUInt8(params.projectFormat, 25);
        header.writeUInt32BE(headerLength + params.metadataLength, 26);
        header.writeUInt32BE(params.projectLength, 30);
        // blobIndex
        header.writeUInt8(params.blobIndexFormat, 34);
        header.writeUInt32BE(headerLength + params.metadataLength + params.projectLength, 35);
        header.writeUInt32BE(params.blobIndexLength, 39);
        // blobs
        header.writeUInt32BE(headerLength + params.metadataLength + params.projectLength + params.blobIndexLength, 43);
        header.writeUInt32BE(params.blobsLength, 47);

        return header;
    },

    _exportMetadata: function (format) {
        return codecs.index[format].encoder(this.metadata);
    },

    _exportProject: function (format) {
        return codecs.index[format].encoder(this.project);
    },

    _exportBlobs: function (format) {
        var offset = 0;
        var index = {};
        var blobs = [];
        for (var blobId in this.$data.blobs) {
            index[blobId] = this.getBlobRecord(blobId);
            index[blobId].offset = offset;
            blobs.push(this.$data.blobs[blobId]._buffer);
            offset += this.$data.blobs[blobId]._buffer.length;
        }
        return [codecs.index[format].encoder(index), Buffer.concat(blobs)];
    }

});

module.exports = WProjectFile;
