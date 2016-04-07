module.exports = {
	dist: {
	  options: {
	    src: 'dist/stamplay-nodeps.js',
	    dest: 'dist/stamplay-umd-nodeps.js',
	    objectToExport: 'Stamplay', 
	    amdModuleId: 'Stamplay', 
	    globalAlias: 'Stamplay', 
	    deps: { 
	      'default': ['Q', 'store'],
	      amd: ['Q', 'store'],
	      cjs: ['Q', 'store']
	    }
	  }
  }
};