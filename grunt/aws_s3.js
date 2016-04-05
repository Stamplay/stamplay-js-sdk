module.exports = {
  options: {
    accessKeyId: '<%= aws.AWSAccessKeyId %>',
    secretAccessKey: '<%= aws.AWSSecretKey %>',
    uploadConcurrency: 10
  },
  'deploy-js':{
    options: {
      bucket: 'cdn.stamplay.com', 
      region: 'eu-west-1',
      params: {
        'CacheControl': 'max-age=6400'
      }
    },
    files: [{
      cwd: 'dist/',
      src: ['**.min.js','**.js','**.min.js.map'],
      dest: 'libs/stamplay-js-sdk/<%= pkg.version %>',
      action: 'upload',
      expand: true
    },{
      cwd: 'dist/',
      src: ['**.min.js','**.js','**.min.js.map'],
      dest: 'libs/stamplay-js-sdk',
      action: 'upload',
      expand: true
    }]
  },
  'deploy-gzip':{
    options: {
      bucket: 'cdn.stamplay.com', 
      region: 'eu-west-1',
      params: {
        'ContentEncoding': 'gzip',
        'CacheControl': 'max-age=86400'
      }
    },
    files: [{
      cwd: 'dist/',
      src: ['**.gz.js'],
      dest: 'libs/stamplay-js-sdk/<%= pkg.version %>',
      action: 'upload',
      expand: true
    },{
      cwd: 'dist/',
      src: ['**.gz.js'],
      dest: 'libs/stamplay-js-sdk',
      action: 'upload',
      expand: true
    }]
  }
};