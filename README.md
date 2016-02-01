# Obsidian Project File Library

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

    wanaproject -h


## Tests

To lunch all tests, run the following command:

    npm test

