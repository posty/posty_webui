/*!
* posty_webModel
*
* Copyright 2014 posty-soft.org
* Licensed under the LGPL v3
* https://www.gnu.org/licenses/lgpl.html
*
* grunt package cssmin, yuidoc, requirejs, concat, htmlmin, sync, copy, uglify
*
* npm install -g grunt-cli
* npm install -g grunt
* npm install grunt-contrib-uglify --save-dev
*
*/
module.exports = function(grunt) {
  
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	/*!
	* uglify require.js
	*
	*/
	   uglify: {
		options: {
		  sourceMap: true,
		  sourceMapName: 'posty-web-model.min.map',
		  banner: '/*!vim: et:ts=4:sw=4:sts=4 \n' +
					'* posty_webModel\n\n' +
					'* Copyright 2014 posty-soft.org\n' +
					'* Licensed under the LGPL v3\n' +
					'* https://www.gnu.org/licenses/lgpl.html\n*/\n',
		  compress: {
			global_defs: {
			  "DEBUG": false
			},
			dead_code: true
		  }
		},
		my_target: {
		  files: {
			'posty-web-model.min.js': ['posty-web-model.js']
		  }
		}
	  }

  });

	/*!
	* Load tasks
	*
	*/
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', [
		'uglify'
	]);

};