/*!
* posty_webUI
*
* Copyright 2014 posty-soft.org
* Licensed under the LGPL v3
* https://www.gnu.org/licenses/lgpl.html
*
* grunt package cssmin, yuidoc, requirejs, concat, htmlmin, sync, copy, uglify
*
* npm install -g grunt-cli
* npm install -g grunt
* npm install grunt-contrib-cssmin --save-dev
* npm install grunt-contrib-yuidoc --save-dev
* npm install grunt-contrib-concat --save-dev
* npm install grunt-contrib-htmlmin --save-dev
* npm install grunt-contrib-requirejs --save-dev
* npm install grunt-sync --save-dev
* npm install grunt-angular-gettext --save-dev
* npm install grunt-contrib-copy --save-dev
* npm install grunt-contrib-uglify --save-dev
*
*/
module.exports = function(grunt) {
  
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	
	/*!
	* concat the css files from dev/css to one css file in dist/css
	*
	*/
	concat: {
		options: {
			separator: ';',
		},
		dist: {
			src: 'dev/css/*.css',
			dest: 'dist/css/posty_webUI.css',
		},
	},
	
	/*!
	* minify the concat css file
	*
	*/
	cssmin: {
		  minify: {
			expand: false,
			src: 'dist/css/posty_webUI.css',
			dest: 'dist/css/posty_webUI.min.css'
		  }
	},
  
	/*!
	* create a yuidoc from the js files in dev/js
	*
	*/
	yuidoc: {
		compile: {
		  name: '<%= pkg.name %>',
		  description: '<%= pkg.description %>',
		  version: '<%= pkg.version %>',
		  url: '<%= pkg.homepage %>',
		  options: {
			paths: 'dev/js/',
			outdir: 'docs/'
		  }
		}
	},
	
	/*!
	* minify the js files 
	*
	*/
	
	requirejs: {
	  compile: {
		options: {
		  baseUrl: "dev/js",
		  mainConfigFile: "dev/js/main.js",
		  name: "main",
		  out: "dist/js/optimized.js"
		}
	  }
	},

	/*!
	* cminify the html files
	*
	*/
	htmlmin: {                                  
		dist: {                                      
		  options: {                                 
			removeComments: true,
			collapseWhitespace: true
		  },
		  files: {                                 
			'dist/index.html': 'dev/index.dist.html',
			'dist/partials/partial_alias.html': 'dev/partials/partial_alias.html',    
			'dist/partials/partial_apikey.html': 'dev/partials/partial_apikey.html',
			'dist/partials/partial_dashboard.html': 'dev/partials/partial_dashboard.html',
			'dist/partials/partial_domain.html': 'dev/partials/partial_domain.html',
			'dist/partials/partial_domain_alias.html': 'dev/partials/partial_domain_alias.html',
			'dist/partials/partial_error.html': 'dev/partials/partial_error.html',
			'dist/partials/partial_modal.html': 'dev/partials/partial_modal.html',
			'dist/partials/partial_navbar.html': 'dev/partials/partial_navbar.html',
			'dist/partials/partial_navbar_dash.html': 'dev/partials/partial_navbar_dash.html',
			'dist/partials/partial_navbar_summary.html': 'dev/partials/partial_navbar_summary.html',
			'dist/partials/partial_process.html': 'dev/partials/partial_process.html',
			'dist/partials/partial_request_messages.html': 'dev/partials/partial_request_messages.html',
			'dist/partials/partial_select_domain.html': 'dev/partials/partial_select_domain.html',
			'dist/partials/partial_summary.html': 'dev/partials/partial_summary.html',
			'dist/partials/partial_transport.html': 'dev/partials/partial_transport.html',
			'dist/partials/partial_user.html': 'dev/partials/partial_user.html',
			'dist/partials/partial_user_alias.html': 'dev/partials/partial_user_alias.html',		
			'dist/partials/partial_select_server.html': 'dev/partials/partial_select_server.html'		
		  }
		}
	}, 
	
	/*!
	* sync images
	*
	*/
	sync: {
	  main: {
		files: [{
			  cwd: 'dev/img/',
			  src: [
				'**' 
			  ],
			  dest: 'dist/img',
			}],
			verbose: true 
	  }
	},
	
	
	/*!
	* copy settings.js
	*
	*/
	copy: {
	  main: {
		files:[
			{
			src: 'dev/settings.js',
			dest: 'dist/settings.js'
			}
		]
		
	  },
	},
	
	/*!
	* uglify require.js
	*
	*/
	   uglify: {
		options: {
		  banner: '/*!vim: et:ts=4:sw=4:sts=4 \n' +
					'* @license RequireJS 2.1.14 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.\n' +
					'* Available via the MIT or new BSD license.\n' +
					'* see: http://github.com/jrburke/requirejs for details\n*/\n',
		  compress: {
			global_defs: {
			  "DEBUG": false
			},
			dead_code: true
		  }
		},
		my_target: {
		  files: {
			'dist/js/require.js': ['dev/components/requirejs/require.js']
		  }
		}
	  }

  });

	/*!
	* Load tasks
	*
	*/
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-sync');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', [
		'concat', 'cssmin', 'yuidoc', 'requirejs', 'htmlmin', 'sync', 'copy', 'uglify'
	]);

};