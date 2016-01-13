module.exports = {
  dist: {
    options: {
      mode: 'gzip',
      level: 8
    },
    files: [
      {expand: true, src: ['dist/stamplay.min.js'], dest: './', ext: '.gz.js'}
    ]
  }
}