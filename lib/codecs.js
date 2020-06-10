"use strict";

const { inflateRawSync } = require("zlib");
var pako = require("pako");

function jsonEncoder(data) {
    return new Buffer(JSON.stringify(data));
}

function jsonDecoder(data) {
    return JSON.parse(data);
}

function jsonDeflateEncoder(data) {
    data = jsonEncoder(data);
    return new Buffer(pako.deflate(data, {level: 6, raw: true}));
}

function jsonDeflateDecoder(buffer) {
    let data;
    if (typeof module !== 'undefined' && module.exports && typeof inflateRawSync === 'function') {
        data = inflateRawSync(buffer).toString('utf-8');
    } else {
        data = pako.inflate(buffer, {to: "string", raw: true});
    }
    return jsonDecoder(data)
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
