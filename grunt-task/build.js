module.exports = function (grunt) {
	/**
	 * Assets creation and minifization
	 */
	//Build allinone js file
	grunt.registerTask('build', 'Minify Stamplay SDK', [
		'clean:dist',
		'concat:dist',
		'uglify:dist',
	]);

}