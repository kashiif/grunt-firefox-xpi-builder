## Introduction

This node script automates building a firefox extension xpi given the extension source code follows the following directory structure. 

## How To Use:

### Setup package.json:

The extension repository root should have a `package.json`. This can be achieved issuing a `npm init` and following the prompts. Setting up package.json is important because the script uses the configuration in build process. For example:

- The <vesion> in `install.rdf` is replaced by 'version' field in `package.json`
- The <homepageURL> in `install.rdf` is replaced by 'homepage' field in `package.json`
- The <creator> in `install.rdf` is replaced by 'author' field in `package.json`
- The final xpi file name is 'name' field in `package.json`.

### Install:
Once `package.json` is setup, type

```
npm install git@github.com:kashiif/grunt-firefox-xpi-builder.git --save-dev
```

### Minimal Grunt File:

Create `GruntFile.js` alongside `package.json` with the following minimal contents:

```
'use strict';

module.exports = function(grunt) {

 var path  = require('path'),
      builder = require('grunt-firefox-xpi-builder');

  var pkg = grunt.file.readJSON('package.json');

  var options = {
      pkg: pkg,
      srcDir: './src/',  // Path of directory where source code resides
      distDir: './dist/',
      tempDir: './dist/temp/'
  };

  builder(grunt, options);

  // Default task(s).
  grunt.registerTask('default', ['build']);  
};

```

## Directory Structure

This plugin expects the code in following structure:

```
<repository-root>
  |- <src>
      |- <*>
      |- chrome.manifest
      |- install.rdf
      |- bootstrap.js (optional)
  |- Gruntfile.js
  |- package.json

```

Basically all the extension source code should be inside ```src``` directory as you can see that ```chrome.manifest```, ```install.rdf``` and ```bootstrap.js``` reside in this folder. The ```src``` directory can have any number of sub-directories and files.

Personally, my restartless/bootstraped extensions have following directory structure:

```
<repository-root>
  |- <src>
  |    |- <__version__>
  |    |       |- <chrome>
  |    |       |     |- <content>
  |    |       |     |- <lib>
  |    |       |     |- <locale>
  |    |       |           |- <en-US>
  |    |       |    
  |    |       |- <defaults>
  |    |               |-<preferences>
  |    |                     |- defaults.js
  |    |  
  |    |- chrome.manifest
  |    |- install.rdf
  |    |- bootstrap.js
  |
  |- Gruntfile.js
  |- package.json

```

You can see that this structure is a lot like that of xul-based extensions. This is totally not required but keeps my mind at ease when I need to know where to look for a file.
