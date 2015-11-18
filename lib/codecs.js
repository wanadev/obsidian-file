"use strict";

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

function jsonDeflateDecoder(data) {
    data = pako.inflate(data, {to: "string", raw: true});
    return jsonDecoder(data);
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
