#pragma description Obsidian Project File
#pragma magic [0x57 0x50 0x52 0x4A] @ 0
#pragma endian big

import hex.dec;

enum SectionFormats: u8 {
    JSON = 0x00,
    JSONDeflate = 0x01,
};

struct Header {
    char magic[4];
    u16 version;
    char type[10];
    SectionFormats metadataFormat;
    u32 metadataOffset;
    u32 metadataLength;
    SectionFormats projectFormat;
    u32 projectOffset;
    u32 projectLength;
    SectionFormats blobIndexFormat;
    u32 blobIndexOffset;
    u32 blobIndexLength;
    u32 blobsOffset;
    u32 blobsLength;
};

struct MetadataSection {
    u8 metadata[parent.header.metadataLength] [[inline]];
    if (parent.header.metadataFormat == SectionFormats::JSONDeflate) {
        std::mem::Section decompressed = std::mem::create_section("MetadataSection (decompressed)");
        hex::dec::zlib_decompress(metadata, decompressed, -15);
    }
};

struct ProjectSection {
    u8 project[parent.header.projectLength] [[inline]];
    if (parent.header.projectFormat == SectionFormats::JSONDeflate) {
        std::mem::Section decompressed = std::mem::create_section("ProjectSection (decompressed)");
        hex::dec::zlib_decompress(project, decompressed, -15);
    }
};

struct BlobIndexSection {
    u8 blobIndex[parent.header.blobIndexLength] [[inline]];
    if (parent.header.blobIndexFormat == SectionFormats::JSONDeflate) {
        std::mem::Section decompressed = std::mem::create_section("BlobIndexSection (decompressed)");
        hex::dec::zlib_decompress(blobIndex, decompressed, -15);
    }
};

struct Blobs {
    u8 blobs[parent.header.blobsLength] [[inline]];
};

struct ObsidianProjectFile {
    Header header;
    MetadataSection metadata @ header.metadataOffset;
    ProjectSection project @ header.projectOffset;
    BlobIndexSection blobIndex @ header.blobIndexOffset;
    Blobs blobs @ header.blobsOffset;
};

ObsidianProjectFile file @ 0;
