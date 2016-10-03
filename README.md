# Obsidian Project File Library

[![Build Status](https://travis-ci.org/wanadev/obsidian-file.svg?branch=master)](https://travis-ci.org/wanadev/obsidian-file)
[![NPM Version](http://img.shields.io/npm/v/obsidian-file.svg?style=flat)](https://www.npmjs.com/package/obsidian-file)
[![License](http://img.shields.io/npm/l/obsidian-file.svg?style=flat)](https://github.com/wanadev/obsidian-file/blob/master/LICENSE)
[![Dependencies](https://img.shields.io/david/wanadev/obsidian-file.svg?maxAge=2592000)]()
[![Dev Dependencies](https://img.shields.io/david/dev/wanadev/obsidian-file.svg?maxAge=2592000)]()


Library and CLI tool to read and write the Obsidian Project file format.


## CLI

### Get informations about a project file

    obsidian-file -d project.wprj

### Extract a project

    obsidian-file -xf project.wprj [outputdir/]

### Create a project

    obsidian-file -cf project.wprj [files]
    obsidian-file -t PROJTYPE -cf project.wprj [files]

__NOTE:__ files containing `metadata`, `project` and `blobIndex` sections can
be passed explicitly with the `-m`, `-p` and `-i` options, or can be listed
with other files but must me named `__metadata__.json`, `__project__.json` and
`__blobindex__.json`.

### Help and other options

    obsidian-file -h


## Tests

To lunch all tests, run the following command:

    npm test


## Changelog

* **2.0.2**: Updates `cli` dependencie
* **2.0.1**: Updates dependencies
* **2.0.0**: First public release
