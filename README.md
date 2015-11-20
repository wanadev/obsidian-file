# Wanadev Project File Library

Library and CLI tool to read and write the Wanadev Project file format.


## CLI

### Get informations about a project file

    wanaproject -d project.wprj

### Extract a project

    wanaproject -xf project.wprj [outputdir/]

### Create a project

    wanaproject -cf project.wprj [files]
    wanaproject -t PROJTYPE -cf project.wprj [files]

__NOTE:__ files containing `metadata`, `project` and `blobIndex` sections can
be passed explicitly with the `-m`, `-p` and `-i` options, or can be listed
with other files but must me named `__metadata__.json`, `__project__.json` and
`__blobindex__.json`.

### Help and other options

    wanaproject -h


## Tests

To lunch all tests, run the following command:

    npm test

