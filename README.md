# Obsidian Project File

[![Lint and test](https://github.com/wanadev/obsidian-file/actions/workflows/tests.yml/badge.svg)](https://github.com/wanadev/obsidian-file/actions/workflows/tests.yml)
[![NPM Version](http://img.shields.io/npm/v/obsidian-file.svg?style=flat)](https://www.npmjs.com/package/obsidian-file)
[![License](http://img.shields.io/npm/l/obsidian-file.svg?style=flat)](https://github.com/wanadev/obsidian-file/blob/master/LICENSE)
[![Discord](https://img.shields.io/badge/chat-Discord-8c9eff?logo=discord&logoColor=ffffff)](https://discord.gg/BmUkEdMuFp)


Library and CLI tool to read and write the Obsidian Project file format.


## Install

    npm install obsidian-file


## obsidian-file CLI tool

### Usage

    Usage:
      obsidian-file [OPTIONS] [ARGS]

    Options:
      -x, --extract          Extract the sections of the given project
      -c, --create           Create a project file from the given files
      -d, --detail           Get informations about the given project file
      -f, --file FILE        The project file to read or write
      -t, --type [STRING]    Project type (Default is GENERIC)
      -m, --metadata FILE    JSON file that contains project's metadata
      -M, --metadata-format [N]Format of the metadata section (0: JSON, 1:
                               JSON+Deflate)  (Default is 1)
      -p, --project FILE     JSON file that contains the seriallized project
      -P, --project-format [N]Format of the project section (0: JSON, 1:
                              JSON+Deflate)  (Default is 1)
      -i, --index FILE       JSON file that contains the blob index
                             (automatically built by default)
      -I, --index-format [N] Format of the blob index section (0: JSON, 1:
                             JSON+Deflate)  (Default is 1)
      -k, --no-color         Omit color from output
          --debug            Show debug information
      -h, --help             Display help and usage details


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


## Library

TODO


## File format

See [doc/obsidian-project-file-format.md](./doc/obsidian-project-file-format.md).


## Contributing

### Questions

If you have any question, you can:

* [Open an issue on GitHub][gh-issue]
* [Ask on discord][discord]

### Bugs

If you found a bug, please [open an issue on Github][gh-issue] with as much information as possible.

### Pull Requests

Please consider [filing a bug][gh-issue] before starting to work on a new feature. This will allow us to discuss the best way to do it. This is of course not necessary if you just want to fix some typo or small errors in the code.

### Coding Style / Lint

To check coding style, run the follwoing command:

    npx grunt jshint

### Tests

Tu run tests, use the following command:

    npx grunt test


[gh-issue]: https://github.com/wanadev/obsidian-file/issues
[discord]: https://discord.gg/BmUkEdMuFp



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
