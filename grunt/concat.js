module.exports = {
  options: {
    separator: "",
    stripBanners: {
      block: true
    },
    banner: "/*! Stamplay v<%= pkg.version %> | " + "(c) " + new Date().getFullYear() + " Stamplay */"
  },
  dist: {
    src: [
      'bower_components/underscore/underscore-min.js',
      'bower_components/q/q.js',
      'bower_components/store.js/store.js',
      'src/stamplay.js',
      'src/promise.js',
      'src/baseComponent.js',
      'src/support.js',
      'src/query.js',
      'src/user.js',
      'src/cobject.js',
      'src/webhook.js',
      'src/stripe.js',
      'src/codeblock.js',
      'src/role.js'
    ],
    dest: 'dist/stamplay.js'
  }
};