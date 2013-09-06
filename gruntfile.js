var _ = require('underscore');

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-targethtml');
  grunt.loadNpmTasks('node-spritesheet');
  grunt.loadNpmTasks('grunt-closure-tools');
  grunt.loadNpmTasks('grunt-smushit');
  grunt.loadNpmTasks('grunt-rev-package');
  grunt.loadNpmTasks('grunt-bump');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      temp: ['public/dist/temp', 'public/dist/debug/app.js.report.txt'. 'public/dist/release/app.js.report.txt']
    }
  });


}
