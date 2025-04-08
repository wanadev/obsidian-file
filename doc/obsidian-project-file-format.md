# Obsidian Project File Format

This document describe the Obsidian Project file format.


## Header

The `Header` is a 51 byte binary section containing the following fields:

| Offset | Field           | Length | Type    | Description                                                            |
|--------|-----------------|--------|---------|------------------------------------------------------------------------|
|      0 | magic           |      4 | ASCII   | Magic number (`"WPRJ"`)                                                |
|      4 | version         |      2 | Integer | Version of the file format                                             |
|      6 | type            |     10 | ASCII   | Project type, uppercase, right padded with spaces (`0x20`)             |
|     16 | metadataFormat  |      1 | Integer | Format of the `Metadata` section (`0x00`: JSON, `0x01`: JSON+deflate)  |
|     17 | metadataOffset  |      4 | Integer | Offset of the `Metadata` section (from the beginning of the file)      |
|     21 | metadataLength  |      4 | Integer | Length of the `Metadata` section                                       |
|     25 | projectFormat   |      1 | Integer | Format of the `Project` section (`0x00`: JSON, `0x01`: JSON+deflate)   |
|     26 | projectOffset   |      4 | Integer | Offset of the `Project` section (from the beginning of the file)       |
|     30 | projectLength   |      4 | Integer | Length of the `Project` section                                        |
|     34 | blobIndexFormat |      1 | Integer | Format of the `BlobIndex` section (`0x00`: JSON, `0x01`: JSON+deflate) |
|     35 | blobIndexOffset |      4 | Integer | Offset of the `BlobIndex` section (from the beginning of the file)     |
|     39 | blobIndexLength |      4 | Integer | Length of the `BlobIndex` section                                      |
|     43 | blobsOffset     |      4 | Integer | Offset of the `Blobs` section (from the beginning of the file)         |
|     47 | blobsLength     |      4 | Integer | Length of the `Blobs` section                                          |

__NOTE:__ Integer fields are unsigned and stored as bigendian.


## Sections

### Metadata

The `Metadata` section contains metadata as key / value pairs encoded in the JSON format. Additionally, this section can be compressed using the *raw deflate* algorithm.

E.g.:

    {
        "creationDate": "Fri, 13 Nov 2015 15:18:34 +0100",
        "author": "John DOE",
        "projectVersion": "1.1.0"
    }


### Project

The `Project` section contains the project objects serialised as JSON. Additionally, this section can be compressed using the *raw deflate* algorithm.


### BlobIndex

The `BlobIndex` section lists the attached blobs. The blob list is encoded in the JSON format and can be compressed using the *raw deflate* algorithm.

Example of `BlobIndex` structure:

    {
        "blobId": {
            "offset": 0,
            "length": 1024,
            "mime": "image/png",
            "metadata": {}
        },
        ...
    }

* `offset`: offset of the blob (relative to the `Blobs` section)
* `length`: length of the blob
* `mime`: the mime type of the blob (interpreted as `"application/octet-stream"` if not defined)
* `metadata`: any metadata about the blob


### Blobs

The `Blobs` section contains a concatenation of all attached blobs described in the `BlobIndex` section. This section can be empty if there are no attachments.


## Sections formats

Sections Metadata, Project and BlobIndex can use two different encodings depending of the value set in the header:

* **JSON:** a JSON encoded in UTF-8,
* **JSON+deflate:** a JSON encoded in UTF-8 and then compressed with *raw deflate* algorithm (`windowBits` param of the Zlib set to `-15` [doc](https://www.zlib.net/manual.html#Advanced)).
