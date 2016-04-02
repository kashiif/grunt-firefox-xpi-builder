'use strict';

module.exports = function(grunt, options) {

  var path  = require('path');


  var pkg = options.pkg, // JSON of extension project's package.json
      tempDir = options.tempDir,
      distDir = options.distDir,
      srcDir = options.srcDir,
      versionForFileSystem = pkg.version.replace(/\./g, '-');

  // Project configuration.
  grunt.initConfig({
	
	clean: {
		prod: [tempDir, distDir]
	},
	
	// Copy files to tempDir, and only change things in there
	copy: {
		common: {
			files: [
				{expand: true, cwd: srcDir, src : ['chrome.manifest' ],  dest: tempDir },
				{expand: true, cwd: srcDir, src : ['**/*.css','**/*.js','**/*.jsm', '**/*.xul', '**/*.png','**/*.jpg'],  dest: tempDir }
			]
		},
		prod: {
			files: [
				{expand: true, cwd: srcDir, src : ['**/*.dtd', '**/*.properties', '!**/*_amo_*.dtd'],  dest: tempDir }
			]
		},
		babelzilla: {
			files: [
				{expand: true, cwd: srcDir, src : ['**/*.dtd', '**/*.properties', '**/cue_translator.txt'],  dest: tempDir }
			]
		}
	},
	
	'string-replace': {
	  install_rdf: { /* Task to replace tokens in install.rdf */
      options: {
        replacements: [
          {
            pattern: /\<em\:creator\>.+\<\/em\:creator\>/g,
            replacement: '<em:creator>' + pkg.author.name + '</em:creator>'
          },
          {
            pattern: /\<em\:homepageURL\>.*\<\/em\:homepageURL\>/g,
            replacement: '<em:homepageURL>' + pkg.homepage + '</em:homepageURL>'
          },		  
          {
            pattern: /\<em\:description\>.*\<\/em\:description\>/g,
            replacement: '<em:description>' + pkg.description + '</em:description>'
          }
        ]
      },
      src: srcDir + 'install.rdf',
      dest: tempDir + 'install.rdf'
	  },
	
	  all_files: { /* Task to replace tokens in all files */
      options: {
        replacements: [{
          pattern: /___version___/g,
          replacement: pkg.version
        },
        {
          pattern: /__version__/g,
          replacement: versionForFileSystem
        }]
      },
      files: [
        {expand: true, cwd: tempDir, src : ['**/*.*', '!**/*.png', '!**/*.jpg', '!**/*.jpeg', '!**/*.gif' ], dest: tempDir }
      ]
	  }
	},
	
	compress: { 
		prod: { 
			options: {
			  archive: distDir + pkg.name + '-' + pkg.version + '.xpi',
			  mode: 'zip'
			},
			files: [ { expand: true, cwd: tempDir, src: '**/**' }]
		} 
	}
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-compress');
  
  // $: grunt bump
  grunt.loadNpmTasks('grunt-bump');
'8'

  grunt.registerTask('renameVersionDir', 'renames the __versiondir__ directory', function() {
      var fs = require('fs'),
          process = require('process'),
          oldName, newName;

      oldName = path.resolve(path.join(process.cwd(), tempDir, '__versiondir__'));

      if (fs.existsSync(oldName)) {
        newName = path.resolve(path.join(process.cwd(), tempDir, versionForFileSystem));
        fs.renameSync(oldName, newName);
      }

    });

  // Default task(s).
  grunt.registerTask('build', ['clean', 'copy:common', 'copy:prod', 'string-replace', 'renameVersionDir', 'compress']);
  grunt.registerTask('babelzilla', ['clean', 'copy:common', 'copy:babelzilla', 'string-replace', 'renameVersionDir', 'compress']);
  
};