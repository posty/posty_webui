# posty\_webUI v2.0.0

The posty\_webUI is connected to the restful posty\_API and represents the web-interface of the posty softwarestack. It is developed to administrate a mailserver based on Postfix and Dovecot.


## Requirements

You need a running webserver 


## Dependences

The posty\_webUI has the following dependences:

* Underscore
* AngularJS
* Angular-bootstrap
* Angular-mocks
* Angular-route
* Angular-scenario
* Restangular
* RequireJS
* RequireJS-text
* D3
* Lodash
* Posty\_webModel


## Installation for users

1.  Download the source either using git or from the GitHub page as archive.
2.  Extract the archive
3.  Copy the extracted dist directory into the folder where your webserver is running
4.  Adjust your posty\_api URL and API Key in the settings.json


## Installation for developer

1.  Download the source either using git or from the GitHub page as archive.
2.  Extract the archive
3.  Install node.js (http://nodejs.org/)
4.	Install Bower -> npm install -g bower
5.	Install Grunt -> npm install -g grunt-cli
6.	Install the Grunt Plugins:
	*	npm install -g grunt-cli
	*	npm install -g grunt
	*	npm install grunt-contrib-cssmin --save-dev
	*	npm install grunt-contrib-yuidoc --save-dev
	*	npm install grunt-contrib-concat --save-dev
	*	npm install grunt-contrib-htmlmin --save-dev
	*	npm install grunt-contrib-requirejs --save-dev
	*	npm install grunt-sync --save-dev
	*	npm install grunt-contrib-copy --save-dev
	*	npm install grunt-contrib-uglify --save-dev
7.  Adjust your posty\_api URL and API Key in the dev/settings.json
8.	Run bower install
9.  Run grunt

## Documentation

A complete documentation of posty_webUI, see:

[http://www.posty-soft.org/webuiv2Doc/](http://www.posty-soft.org/webuiv2Doc/)

## Usage

Here is a short overview about the main screens of the posty-webUI.
Also available at [(http://demo.posty-soft.org)](http://demo.posty-soft.org/)

[![Build Status](http://demo.posty-soft.org/img_screen/select_a_server_v2.png)](http://demo.posty-soft.org)
[![Build Status](http://demo.posty-soft.org/img_screen/dashboard_v2.png)](http://demo.posty-soft.org/)
[![Build Status](http://demo.posty-soft.org/img_screen/domain_v2.png)](http://demo.posty-soft.org/#/view_domain)
[![Build Status](http://demo.posty-soft.org/img_screen/domainAliase_v2.png)](http://demo.posty-soft.org/#/view_domain)
[![Build Status](http://demo.posty-soft.org/img_screen/user_v2.png)](http://demo.posty-soft.org/#/view_account)
[![Build Status](http://demo.posty-soft.org/img_screen/userAliase_v2.png)](http://demo.posty-soft.org/#/view_account)
[![Build Status](http://demo.posty-soft.org/img_screen/transport_v2.png)](http://demo.posty-soft.org/#/view_transport)
[![Build Status](http://demo.posty-soft.org/img_screen/summary_v2.png)](http://demo.posty-soft.org/#/view_summary)



## 	Features

* Domain administration
* Domain aliases
* User administration
* User aliases
* Statistic for domains, users, domain aliases and user aliases
* Transports
* Filters
* API Key administration

## Compatible browser

![Build Status](http://demo.posty-soft.org/img_screen/chrome_small.png)
![Build Status](http://demo.posty-soft.org/img_screen/firefox_small.png)
![Build Status](http://demo.posty-soft.org/img_screen/opera_small.png)
![Build Status](http://demo.posty-soft.org/img_screen/safari_small.png)
![Build Status](http://demo.posty-soft.org/img_screen/ie_small.png)  

## Information

For more informations about posty please visit our website:
[www.posty-soft.org](http://www.posty-soft.org)

## Support

* Email:
	* support@posty-soft.org

### Bug reports

If you discover any bugs, feel free to create an issue on GitHub. Please add as much information as possible to help us fixing the possible bug. We also encourage you to help even more by forking and sending us a pull request.

### License

LGPL v3 license. See LICENSE for details.

### Third-Party Software Components

[Crystal Project](http://www.everaldo.com/crystal) Icons Copyright © Everaldo.com [GNU Lesser GPL].

### Copyright

All rights are at (C) posty Team [http://www.posty-soft.org](http://www.posty-soft.org) 2014
