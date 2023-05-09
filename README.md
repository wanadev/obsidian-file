# Obsidian Project File Library

[![Build Status](https://travis-ci.org/wanadev/obsidian-file.svg?branch=master)](https://travis-ci.org/wanadev/obsidian-file)
[![NPM Version](http://img.shields.io/npm/v/obsidian-file.svg?style=flat)](https://www.npmjs.com/package/obsidian-file)
[![License](http://img.shields.io/npm/l/obsidian-file.svg?style=flat)](https://github.com/wanadev/obsidian-file/blob/master/LICENSE)


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

* **[NEXT]** (changes on master that have not been released yet):

  * Replaced deprecated mocha-phantomjs by mocha-headless-chrome to run tests (@jbghoul, #26)
  * Updated dependencies (@jbghoul, #26)

* **v3.0.1:**

  * Fix implicit and deprecated usages of Buffer (@tneullas, #18, #19)
  * Updated dependencies

* **v3.0.0:**

  * Pako replaced by zlib to improve perfs on Node.js (pako is still used in browser when the module is built using Browserify) (#17)

* **v2.0.4**:

  * Updated dependencies

* **v2.0.3**:

  * Fixed documentation errors

* **v2.0.2**:

  * Updated `cli` dependencie

* **v2.0.1**:

  * Updated dependencies

* **v2.0.0**:

  * First public release
