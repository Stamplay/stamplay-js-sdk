module.exports = {

	options: {
		preserveComments: false
	},

	'dist': {
		options: {
			sourceMap: true
		},
		files: {
			'dist/stamplay.min.js': ['dist/stamplay.js']
		}
	}

};