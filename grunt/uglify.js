module.exports = {

	options: {
		preserveComments: false
	},

	'dist': {
		options: {
			sourceMap: true,
			banner: "/*! Stamplay v<%= pkg.version %> | " + "(c) " + new Date().getFullYear() + " The Stamplay Dreamteam */ \n"
		},
		files: {
			'dist/stamplay.min.js': ['dist/stamplay.js']
		}
	}

};