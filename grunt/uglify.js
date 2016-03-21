module.exports = {
	options: {
		preserveComments: false
	},
	'dist': {
		options: {
			sourceMap: true,
			banner: "/*! Stamplay v<%= pkg.version %> | " + "(c) " + new Date().getFullYear() + " Stamplay */"
		},
		files: {
			'dist/stamplay.min.js': ['dist/stamplay.js'],
			'dist/stamplay-nodeps.min.js':['dist/stamplay-nodeps.js']
		}
	}
};