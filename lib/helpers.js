"use strict";

// Returns a Blob (using BlobConstuctor or BlobBuilder for older browser) if the
// code is running in a browser, else return a NodE.js Buffer with a
// "type" attribute appened.
function toBlob(data, mime) {
    var blob = null;

    // Try to make a Blob (browser)
    if (global.Blob) {
        try {
            blob = new Blob(data, {type: mime});
        } catch (error) {
            var BB = global.BlobBuilder || global.WebKitBlobBuilder || global.MozBlobBuilder || global.MZBlobBuilder;
            if (error.name == "TypeError" && BB) {
                var bb = new BB();
                bb.append(data);
                blob = bb.getBlob(mime);
            } else {
                throw new Error("BlobNotSupported");
            }
        }
    }

    // Make a Buffer (Node.js)
    if (!blob) {
        blob = Buffer.concat(data);
        blob.type = mime;
    }

    return blob;
}

module.exports = {
    toBlob: toBlob
};
