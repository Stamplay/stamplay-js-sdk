module.exports = function (grunt) {
  'use strict';

  require('./grunt-task/build')(grunt);
  require('./grunt-task/deploy')(grunt);

  var aws;
  try{
    aws = grunt.file.readJSON('aws-keys.json')
  }catch(e){
    aws = {}
  }

  require('load-grunt-config')(grunt, {
    init: true,
    config: {
      pkg: grunt.file.readJSON('package.json'),
      aws: aws
    }
  });
};