module.exports = function (grunt) {

  // Project
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
			dist: {
				files: {
					'public/css/style.css' : 'app/styles/main.scss'
				}
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			}
		}
  });

  // Load Grunt plugins
  grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

  // Register custom tasks to run from the terminal
	grunt.registerTask('default',['watch']);
};
