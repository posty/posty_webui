/*!
 * posty_webUI
 *
 * Copyright 2014 posty-soft.org
 * Licensed under the LGPL v3
 * https://www.gnu.org/licenses/lgpl.html
 *
 */
define(['angular'], function (angular) {
    'use strict';

    /* Services */

    var app = angular.module('postySoft.services', []);

    app.value('version', '0.2');

    /**
     * central page-service. stores the actual page-title
     *
     * @class Page
     */
    app.factory('Page', function () {
        var title = 'default';
        return {
            title: function () {
                return title;
            },

            setTitle: function (newTitle) {
                title = newTitle;
            }
        };
    });

    /**
     * central modal-service. responsible for opening an modal-window
     *
     * @class ModalService
     */
    app.service('ModalService', ['$modal', function ($modal) {

        var modalDefaults = {
            backdrop: true,
            keyboard: false,
            modalFade: true,
            templateUrl: 'partials/partial_modal.html',
            resolve: {
                data: function () {
                    return null;
                }
            }
        };

        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'Save',
            headerText: '',
            bodyText: ''
        };

        /**
         * opens the modal view
         *
         * @method show
         * @param customModalDefaults {Object} defaultSettings for the modal-service
         * @param customModalOptions {Object} defaultOptions for the modal-service
         */
        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance, data) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.data = data;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                }
                //injection, necessary for the minifier
                tempModalDefaults.controller['$inject'] = ['$scope', '$modalInstance', 'data'];
            }
            return $modal.open(tempModalDefaults);
        };
    }]);

    /**
     * central modal-domain-selection-service. responsible for opening the domain-selection-view
     *
     * @class SelectDomainService
     */
    app.service('SelectDomainService', ['$modal', function ($modal) {

        var opened = false;

        var modalDefaults = {
            backdrop: true,
            keyboard: false,
            modalFade: true,
            openJustOnce: true,
            templateUrl: 'partials/partial_select_domain.html',
            resolve: {
                data: function () {
                    return null;
                }
            },
            controller: function ($scope, $location, $modalInstance, data, Domains) {
                $scope.data = data;
                $scope.getList = function () {
                    return Domains.getList();
                };
                $scope.ok = function (result) {
                    $modalInstance.close(result);
                };
                $scope.close = function (result) {
                    $location.path(""); // redirect to Dashboard
                    $modalInstance.dismiss('cancel');
                };
            }
        };

        //injection, necessary for the minifier
        modalDefaults.controller['$inject'] = ['$scope', '$location', '$modalInstance', 'data', 'Domains'];

        /**
         * opens the modal view
         *
         * @method show
         */
        this.show = function () {
            if (!modalDefaults.openJustOnce || (modalDefaults.openJustOnce && !opened)) {
                return $modal.open(modalDefaults);
            }
        };
    }]);

    /**
     * central Server-model.
     * This Service contains the available Servers and operations on it
     *
     * @class Servers
     */
    app.factory('Servers', ['Restangular', function (Restangular) {
        var list = [];

        var DEFAULT_SERVER = {
            url: "",
            key: ""
        }; // const for the default-server

        var currentServer = DEFAULT_SERVER;

        return {
            /**
             * adds a server
             *
             * @method add
             * @param server {Object} server-Object
             */
            add: function (server) {
                list.push(server);
            },
            /**
             * removes a server
             *
             * @method remove
             * @param server {Object} server-Object
             */
            remove: function (server) {
                var index = list.indexOf(server);
                if (index > -1) {
                    list.splice(index, 1);
                }
            },
            /**
             * returns the current server
             *
             * @method currentServer
             * @return {Object} Returns the current server
             */
            currentServer: function () {
                return currentServer;
            },
            /**
             * sets the current server
             *
             * @method setCurrentServer
             * @param value {Object} the new current server
             */
            setCurrentServer: function (server) {
                if (server != currentServer) {
                    currentServer = server;
                    Restangular.setBaseUrl(server.url);                          
                    Restangular.setDefaultHeaders(
                        {
                            'Content-Type':'application/json',
                            'auth_token': server.key                             
                        }
                    );                    
                }
            },
            /**
             * get the list of all servers
             *
             * @method getList
             * @return {Array} Returns list-member
             */
            getList: function () {
                return list;
            },
            /**
             * more than one server is saved
             *
             * @method moreThanOneServer
             * @return {Boolean} Returns true if the there are more than one server saved
             */
            moreThanOneServer: function () {
                return list.length > 1;
            },
            /**
             * valid Server is set
             *
             * @method isValid
             * @return {Boolean} Returns true if the current Server is valid
             */
            isValid: function () {
                return currentServer != null;
            }
        };
    }]);

    /**
     * central modal-server-selection-service. responsible for opening the server-selection-view
     *
     * @class SelectServerService
     */
    app.service('SelectServerService', ['$modal', function ($modal) {
        var opened = false;

        var modalDefaults = {
            backdrop: true,
            keyboard: false,
            modalFade: true,
            openJustOnce: true,
            templateUrl: 'partials/partial_select_server.html',
            resolve: {
                data: function () {
                    return null;
                }
            },
            controller: function ($scope, $modalInstance, data, Servers) {
                $scope.data = data;
                $scope.getList = function () {
                    return Servers.getList();
                };
                $scope.ok = function (result) {
                    $modalInstance.close(result);
                };
            }
        };

        //necessary for the minifier
        modalDefaults.controller['$inject'] = ['$scope', '$modalInstance', 'data', 'Servers'];

        /**
         * opens the modal view
         *
         * @method show
         */
        this.show = function () {
            if (!modalDefaults.openJustOnce || (modalDefaults.openJustOnce && !opened)) {
                return $modal.open(modalDefaults);
            }
        };
    }]);

    function ProcessStack() {

        this.DUMMY_PUSH_ELEMENT = true;
        this.processStack = [];

        /**
         * pushes the process-stack
         *
         * @method register
         */
        this.register = function () {
            this.processStack.push(this.DUMMY_PUSH_ELEMENT);
        };

        /**
         * pops an element fromt the process-stack
         *
         * @method unregister
         */
        this.unregister = function () {
            this.processStack.pop();
        };

        /**
         * refers if the stack is full or not
         *
         * @method isLoading
         * @return {Boolean} true if the stack is not empty
         */
        this.isLoading = function () {
            return (this.processStack.length > 0);
        }
    }

    /**
     * central process-service. stores a stack for each "thread" which is performed
     *
     * @class ProcessService
     */
    app.factory('ProcessService', [function () {
        return new ProcessStack();
    }]);

    /**
     * central process-provider. delegates the functions to a ProcessServiceInstance
     *
     * @class ProcessServiceProvider
     */
    app.provider('ProcessService', function ProcessServiceProvider() {
        var process = new ProcessStack();

        this.register = function () {
            process.register();
        };

        this.unregister = function () {
            process.unregister();
        };

        this.$get = [function ProcessServiceFactory() {
            return process;
        }];
    });

    /**
     * central error-service. stores the current Error
     *
     * @class ErrorService
     */
    app.service('ErrorService', [function () {

        this.statusCode = 0;
        this.msg = "";
        this.occurred = false;
        /**
         * add an alert to the service
         * and sets an timeout that removes the alert out of the alert-list
         *
         * @method throw
         */
        this.throw = function (statusCode, msg) {
            this.statusCode = statusCode;
            this.msg = msg;
            this.occurred = true;
        };
        /**
         * closes an alert by index of the alert-list
         *
         * @method reset
         */
        this.reset = function () {
            this.occurred = false;
        };
        /**
         * returns the statusCode
         *
         * @method getStatusCode
         * @return {Integer} statusCode
         */
        this.getStatusCode = function () {
            return this.statusCode;
        };
        /**
         * returns the message
         *
         * @method getMessage
         * @return {String} message
         */
        this.getMessage = function () {
            return this.msg;
        };
        /**
         * returns if an error is occurred or not
         *
         * @method occurred
         * @return {Boolean} returns if an error is occurred or not
         */
        this.occurred = function () {
            return this.occurred;
        };
    }]);

    /**
     * Central Response Handler. All Responses will be intercepted by the add method
     *
     * @class ResponseHandler
     */
    app.factory('ResponseHandler', ['ErrorService', '$location', function (ErrorService, $location) {

        return {
            /**
             * adding responses to the local list
             *
             * @method add
             * @param response {Object} response-Object
             */
            add: function (response) {
                switch (response.status) {
                    case 401:
                        ErrorService.throw("401", "Invalid API-Key");
                        $location.path('/error');
                        break;
                    case 404:
                        ErrorService.throw("404", "Ther Server is unreachable");
                        $location.path('/error');
                        break;
                }
            }
        };
    }]);
});
