module.exports = function (grunt) {
	grunt.registerTask('build', 'Minify Stamplay SDK', [
		'clean:dist',
		'concat:dist',
		'uglify:dist',
		'compress:dist'
	]); 
}