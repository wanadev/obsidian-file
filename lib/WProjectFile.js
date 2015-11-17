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
            this._loadProjectFromData64Url(wProjectFile);
        } else if (typeof wProjectFile == "object") {
            this._loadProjectFromBlob(wProjectFile);
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
        throw new Error("NotImplementedError"); // TODO
    },

    getBlob: function (blobId) {
        throw new Error("NotImplementedError"); // TODO
    },

    getBlobAsData64Url: function (blobId) {
        throw new Error("NotImplementedError"); // TODO
    },

    getBlobAsString: function (blobId) {
        throw new Error("NotImplementedError"); // TODO
    },

    getBlobUrl: function (blobId) {
        throw new Error("NotImplementedError"); // TODO
    },

    getBlobMetaData: function (blobId) {
        if (!this.blobExists(blobId)) {
            return {};
        }
        return this.$data.blobs[blobId].metadata;
    },

    addBlob: function (blob, blobId, options) {
        var blobRecord = {
            blob: blob,
            url: null,
            mime: options.mime || blob.type || "application/octet-stream",
            metadata: options.metadata || {}
        };
        if (this.blobExists(blobId)) {
            this.removeBlob(blobId);
        }
        this.$data.blobs[blobId] = blobRecord;
    },

    addBlobFromData64Url: function (data64, blobId, options) {
        throw new Error("NotImplementedError"); // TODO
    },

    addBlobFromString: function (string, blobId, options) {
        throw new Error("NotImplementedError"); // TODO
    },

    removeBlob: function (blobId) {
        throw new Error("NotImplementedError"); // TODO
    },

    blobExists: function (blobId) {
        return this.$data.blobs[blobId] !== undefined;
    },

    // Project Method

    exportAsBlob: function (options) {
        return this._export(options);
    },

    exportAsData64Url: function (options) {
        throw new Error("NotImplementedError"); // TODO
    },

    // Clean

    destroy: function () {
        throw new Error("NotImplementedError"); // TODO
    },

    // Project Loading

    _loadProjectFromBlob: function (blob) {
        throw new Error("NotImplementedError"); // TODO
    },

    _loadProjectFromData64Url: function (data64) {
        throw new Error("NotImplementedError"); // TODO
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
        var blobIndex = this._exportBlobIndex(options.blobIndexFormat);
        var blobs = this._exportBlobs();

        var header = this._exportHeader({
            metadataFormat: options.metadataFormat,
            metadataLength: metadata.length,
            projectFormat: options.projectFormat,
            projectLength: project.length,
            blobIndexFormat: options.blobIndexFormat,
            blobIndexLength: blobIndex.length,
            blobsLength: blobs.length,
        });

        if (global.Blob) {
            return new Blob([header, metadata, project, blobIndex, blobs], {type: this.$class.MIMETYPE});
        } else {
            return Buffer.concat([header, metadata, project, blobIndex, blobs]);
        }
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

    _exportBlobIndex: function (format) {
        return codecs.index[format].encoder({}); // TODO
    },

    _exportBlobs: function (format) {
        return new Buffer(0); // TODO
    }

});

module.exports = WProjectFile;
