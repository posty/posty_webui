/*!
* posty_webUI
*
* Copyright 2014 posty-soft.org
* Licensed under the LGPL v3
* https://www.gnu.org/licenses/lgpl.html
*
* grunt package cssmin, yuidoc, requirejs, concat, htmlmin, sync
*
* npm install -g grunt-cli
* npm install -g grunt
* npm install grunt-contrib-cssmin --save-dev
* npm install grunt-contrib-yuidoc --save-dev
* npm install grunt-contrib-concat --save-dev
* npm install grunt-contrib-htmlmin --save-dev
* npm install grunt-contrib-requirejs --save-dev
* npm install grunt-sync --save-dev
*
*/
module.exports = function(grunt) {
  
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	
	/*!
	* concat the css files from dev/css to one css file in ../css
	*
	*/
	concat: {
		options: {
			separator: ';',
		},
		dist: {
			src: 'dev/css/*.css',
			dest: 'css/posty_webUI.css',
		},
	},
	
	/*!
	* minify the concat css file
	*
	*/
	cssmin: {
		  minify: {
			expand: false,
			src: 'css/posty_webUI.css',
			dest: 'css/posty_webUI.min.css'
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
		  out: "js/optimized.js"
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
			'partials/partial_alias.html': 'dev/partials/partial_alias.html',    
			'partials/partial_apikey.html': 'dev/partials/partial_apikey.html',
			'partials/partial_dashboard.html': 'dev/partials/partial_dashboard.html',
			'partials/partial_domain.html': 'dev/partials/partial_domain.html',
			'partials/partial_domain_alias.html': 'dev/partials/partial_domain_alias.html',
			'partials/partial_modal.html': 'dev/partials/partial_modal.html',
			'partials/partial_navbar.html': 'dev/partials/partial_navbar.html',
			'partials/partial_navbar_dash.html': 'dev/partials/partial_navbar_dash.html',
			'partials/partial_navbar_summary.html': 'dev/partials/partial_navbar_summary.html',
			'partials/partial_process.html': 'dev/partials/partial_process.html',
			'partials/partial_request_messages.html': 'dev/partials/partial_request_messages.html',
			'partials/partial_select_domain.html': 'dev/partials/partial_select_domain.html',
			'partials/partial_summary.html': 'dev/partials/partial_summary.html',
			'partials/partial_transport.html': 'dev/partials/partial_transport.html',
			'partials/partial_user.html': 'dev/partials/partial_user.html',
			'partials/partial_user_alias.html': 'dev/partials/partial_user_alias.html'
			
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
			  dest: 'img',
			}],
			verbose: true 
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
	grunt.registerTask('default', [
		'concat', 'cssmin', 'yuidoc', 'requirejs', 'htmlmin', 'sync'
	]);

};