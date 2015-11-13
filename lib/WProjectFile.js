"use strict";

var Class = require("abitbol");

var codecs = require("./codecs.js");

var WProjectFile = Class.$extend({

    __init__: function (wProjectFile) {
        this.$data.version = 1;
        this.$data.type = "ARCHIVE";
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
        return this.$metadata;
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

    exportAsBlob: function () {
        throw new Error("NotImplementedError"); // TODO
    },

    exportAsData64Url: function () {
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
    }

});

module.export = WProjectFile;
