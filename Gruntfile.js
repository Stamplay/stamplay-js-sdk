module.exports = function (grunt) {
  'use strict';

  require('./grunt-task/build')(grunt);

  require('load-grunt-config')(grunt, {
    init: true,
    config: {
      pkg: grunt.file.readJSON('package.json')
    }
  });
};