# posty\_webUI v1.9.3

The posty\_webUI is connected to the restful posty\_API and represents the web-interface of the posty softwarestack. It is developed to administrate a mailserver based on Postfix and Dovecot.


## Requirements

You need a running webserver

## Dependences

The posty\_webUI has the following dependences:

* AngularJS
* Angular-bootstrap
* Angular-mocks
* Angular-route
* Angular-scenario
* D3
* lodash
* RequireJS
* RequireJS-text
* Restangular
* Underscore


## Installation for users

1.  Download the source either using git or from the GitHub page as archive.
2.  Extract the archive
3.  Copy the extracted directory into the folder where your webserver is running
4.  Adjust your posty\_api URL in the dist/settings.js


## Installation for developer

1.  Download the source either using git or from the GitHub page as archive.
2.  Extract the archive
3.  Install node.js (http://nodejs.org/)
4.	Install Bower -> npm install -g bower
5.	Install Grunt -> npm install -g grunt-cli
6.	Install the Grunt Plugins:
		6.1.	npm install -g grunt-cli
		6.2.	npm install -g grunt
		6.3.	npm install grunt-contrib-cssmin --save-dev
		6.4.	npm install grunt-contrib-yuidoc --save-dev
		6.5.	npm install grunt-contrib-concat --save-dev
		6.6.	npm install grunt-contrib-htmlmin --save-dev
		6.7.	npm install grunt-contrib-requirejs --save-dev
		6.8.	npm install grunt-sync --save-dev
7.	Run "bower install"
8.  Adjust your posty\_api URL in the dev/settings.js


## Usage

Here is a short overview about the main screens of the posty-webUI.
Also available at [(http://www.posty-soft.org/webuiv2/)](http://www.posty-soft.org/webuiv2/)

[![Build Status](http://posty-soft.org/img/dashboard_screen.png)](http://www.posty-soft.org/webui/)
[![Build Status](http://posty-soft.org/img/domain_screen.png)](http://www.posty-soft.org/webui/#/view_domain)
[![Build Status](http://posty-soft.org/img/account_screen.png)](http://www.posty-soft.org/webui/#/view_account)
[![Build Status](http://posty-soft.org/img/alias_screen.png)](http://www.posty-soft.org/webui/#/view_alias)

## 	Features

* Domain administration
* Domain aliases
* User administration
* User aliases
* Statistic for domains, users, domain aliases and user aliases
* Transports
* API Key administration

## Compatible browser

![Build Status](http://posty-soft.org/img/chrome_small.png)
![Build Status](http://posty-soft.org/img/firefox_small.png)
![Build Status](http://posty-soft.org/img/opera_small.png)
![Build Status](http://posty-soft.org/img/safari_small.png)
![Build Status](http://posty-soft.org/img/ie_small.png)  

## Information

For more informations about posty please visit our website:
[www.posty-soft.org](http://www.posty-soft.org)

### Bug reports

If you discover any bugs, feel free to create an issue on GitHub. Please add as much information as possible to help us fixing the possible bug. We also encourage you to help even more by forking and sending us a pull request.

### License

LGPL v3 license. See LICENSE for details.

### Third-Party Software Components

[Crystal Project](http://www.everaldo.com/crystal) Icons Copyright © Everaldo.com [GNU Lesser GPL].

### Copyright

All rights are at (C) [http://www.posty-soft.org](http://www.posty-soft.org) 2014