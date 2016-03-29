module.exports = function (grunt) {
  'use strict';

  require('./grunt-task/build')(grunt);
  require('./grunt-task/deploy')(grunt);

  require('load-grunt-config')(grunt, {
    init: true,
    config: {
      pkg: grunt.file.readJSON('package.json'),
      aws: grunt.file.readJSON('aws-keys.json')
    }
  });
};