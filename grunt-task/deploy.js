module.exports = function (grunt) {
	grunt.registerTask('deploy', 'Deploy Stamplay SDK', [
		'aws_s3:deploy-js',
		'aws_s3:deploy-gzip'
	]);
}