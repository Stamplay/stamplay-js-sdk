module.exports = {
	options: {
		separator: "\n/* ---- STAMPLAY JS SDK ---- */\n",
		stripBanners: {
			block: true
		},
		banner: "/*! Stamplay v<%= pkg.version %> | " + "(c) " + new Date().getFullYear() + " The Stamplay Dreamteam */"
	},
	dist :{
		src: [
      'bower_components/underscore/underscore-min.js',
      'bower_components/q/q.js',
      'src/stamplay.js',
      'src/promise.js',
      'src/baseComponent.js',
      'src/query.js',
      'src/user.js',
      'src/cobject.js',
      'src/webhook.js',
      'src/support.js'
    ],
		dest: 'dist/stamplay.js'
	}
};