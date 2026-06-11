"use strict";

var inflateRawSync = require("zlib").inflateRawSync;
var deflateRawSync = require("zlib").deflateRawSync;

/** @type { TextEncoder } */
var textEncoder;
if (global.TextEncoder) {
    textEncoder = new TextEncoder();
}

function jsonEncoder(data) {
    var stringData = JSON.stringify(data);
    if (textEncoder) {
        return Buffer.from(textEncoder.encode(stringData));
    }
    return Buffer.from(stringData);
}

function jsonDecoder(data) {
    return JSON.parse(data);
}

function jsonDeflateEncoder(data) {
    return deflateRawSync(jsonEncoder(data), { level: 6 });
}

function jsonDeflateDecoder(data) {
    if (typeof data === 'object') {
        data = Buffer.from(data);
    }
    return jsonDecoder(inflateRawSync(data));
}

var index = {
    0: {  // JSON
        encoder: jsonEncoder,
        decoder: jsonDecoder
    },
    1: {  // JSON + Deflate
        encoder: jsonDeflateEncoder,
        decoder: jsonDeflateDecoder
    }
};

module.exports = {
    index: index,
    jsonEncoder: jsonEncoder,
    jsonDecoder: jsonDecoder,
    jsonDeflateEncoder: jsonDeflateEncoder,
    jsonDeflateDecoder: jsonDeflateDecoder
};
