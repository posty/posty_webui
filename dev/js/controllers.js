/*!
 * posty_webUI
 *
 * Copyright 2014 posty-soft.org
 * Licensed under the LGPL v3
 * https://www.gnu.org/licenses/lgpl.html
 *
 */
define(['angular', 'services'], function (angular, services) {
    'use strict';

    /* Controllers */

    var app = angular.module('postySoft.controllers', ['postySoft.services', 'postySoft.configurations', 'ui.bootstrap']);


    /**
     * main-view-controller. first controller which will be instanced
     *
     * @class MainCtrl
     */
    app.controller('MainCtrl', ['$scope', '$rootScope', 'Page', 'Domains', 'Servers', 'SelectServerService' , 'ProcessService' , 'AlertService', 'CONFIGS', function ($scope, $rootScope, Page, Domains, Servers, SelectServerService, ProcessService, AlertService, CONFIGS) {

        /**
         * sets the new Server from the Selection-View and refreshes the app.
         *
         * @method initServer
         */
        var initServer = function () {
            var selectServer = SelectServerService.show();
            selectServer.result.then(function (server) {
                Servers.setCurrentServer(server);
                Domains.refresh();
            });
        };

        /**
         * initialises the Services which will be need in all scopes
         *
         * @method init
         */
        $rootScope.init = function () {
            $scope = $rootScope;
            $scope.Page = Page;
            $scope.ProcessService = ProcessService;
            $scope.AlertService = AlertService;
            $scope.CONFIGS = CONFIGS;
            if (Servers.moreThanOneServer()) {
                initServer();
            } else {
                Domains.refresh();
            }
        };

        /**
         * click-event for the postyIcon
         *
         * @method postyIcon
         */
        $rootScope.postyIcon = function () {
            Domains.refresh();
        };

        /**
         * click-event to change the Server
         *
         * @method changeServer
         */
        $rootScope.changeServer = function () {
            initServer();
        };

        /**
         * click-event to change the Server
         *
         * @method changeServer
         * @return {Boolean} Returns true if there is more than one Server registered
         */
        $rootScope.moreThanOneServer = function () {
            return Servers.moreThanOneServer();
        };
    }]);

    /**
     * view-controller for the errors
     *
     * @class ErrorCtrl
     */
    app.controller('ErrorCtrl', ['$scope', 'Page', 'ErrorService', function ($scope, Page, ErrorService) {

        /**
         * initialises the controller-data
         *
         * @method init
         */
        $scope.init = function () {
            Page.setTitle('Error');
        };

        /**
         * returns the status-code of the Errror-Service
         *
         * @method getStatusCode
         * @return {Boolean} Returns the status-code of the Errror-Service
         */
        $scope.getStatusCode = function () {
            return ErrorService.getStatusCode();
        };

        /**
         * returns the message of the Errror-Service
         *
         * @method getStatusCode
         * @return {Boolean} Returns the message of the Errror-Service
         */
        $scope.getMessage = function () {
            return ErrorService.getMessage();
        };
    }]);

    /**
     * view-controller for the process-service
     *
     * @class ProcessCtrl
     */
    app.controller('ProcessCtrl', ['$scope', 'ProcessService', function ($scope, ProcessService) {
    }]);

    /**
     * view-controller for the alert-service
     *
     * @class AlertCtrl
     */
    app.controller('AlertCtrl', ['$scope', 'AlertService', function ($scope, AlertService) {
    }]);

    /**
     * view-controller for the dashboard
     *
     * @class DashboardCtrl
     */
    app.controller('DashboardCtrl', ['$scope', 'Page', function ($scope, Page) {
        Page.setTitle('Dashboard');
    }]);

    /**
     * view-controller for the navbar
     *
     * @class NavBarCtrl
     */
    app.controller('NavBarCtrl', ['$scope', 'Domains', function ($scope, Domains) {
        $scope.getDomainList = function () {
            return Domains.getList();
        };

        $scope.getCurrentDomain = function () {
            return Domains.currentDomain();
        };

        $scope.setCurrentDomainToAll = function () {
            return Domains.setCurrentDomain(Domains.ALL_DOMAINS);
        };

        $scope.setCurrentDomain = function (domain) {
            return Domains.setCurrentDomain(domain);
        };
    }]);

    /**
     * Message-Class to transfer data between the domain-Ctrl
     *
     * @class DomainData
     */
    app.factory('DomainData', function () {
        return {domain: null};
    });

    /**
     * view-controller for the domains
     *
     * @class DomainCtrl
     */
    app.controller('DomainCtrl', ['$scope', 'ModalService', 'Page', 'Domains', 'DomainData', function ($scope, ModalService, Page, Domains, DomainData) {
        /**
         * initialises the controller-data
         *
         * @method init
         */
        $scope.init = function () {
            Page.setTitle('Domain');
        };

        /**
         * returns the list of the Domains.
         * If not allDomains then the list is filled with the currentDomain.
         *
         * @method getList
         * @return {Array} Returns the list of the Domains
         */
        $scope.getList = function () {
            if (!Domains.allDomainsSelected()) {
                var list = [];
                list.push(Domains.currentDomain());
                return list;
            } else {
                return Domains.getList();
            }
        };

        /**
         * create a new domain
         *
         * @method create
         */
        $scope.create = function () {
            var modalDefaults = {
                templateUrl: 'createView.html',
                resolve: {
                    data: function () {
                        return { name: "" };
                    }
                }
            };
            var modalInstance = ModalService.show(modalDefaults, {});
            modalInstance.result.then(function (data) {
                var item = {name: data.name};
                Domains.create(item);
            });
        };

        /**
         * edit an existing domain
         *
         * @method edit
         * @param domain {Object} domain-object
         */
        $scope.edit = function (domain) {
            DomainData.domain = domain;
            var modalDefaults = {
                templateUrl: 'editView.html',
                resolve: {
                    data: function () {
                        return { domain: domain };
                    }
                }
            };
            var modalOptions = {
                activeTab: 'general',
                tabClick: function (type) {
                    this.activeTab = type;
                }
            };
            var modalInstance = ModalService.show(modalDefaults, modalOptions);
            modalInstance.result.then(function (data) {
                Domains.edit(data.domain);
            });
        };

        /**
         * remove an existing domain
         *
         * @method remove
         * @param domain {Object} domain-object
         */
        $scope.remove = function (domain) {
            var modalOptions = {
                actionButtonText: 'Confirm',
                headerText: 'Delete domain?',
                bodyText: 'Are you sure you want to delete the domain "' + domain.name + '"?'
            };
            var modalInstance = ModalService.show({}, modalOptions);
            modalInstance.result.then(function (data) {
                Domains.remove(domain);
            });
        };
    }]);

    app.controller('DomainAliasCtrl', ['$scope', 'DomainAliasses', 'DomainData', function ($scope, DomainAliasses, DomainData) {

        /**
         * clears the view
         *
         * @method emptyView
         */
        var emptyView = function () {
            $scope.alias = {
                name: ""
            };
        }

        /**
         * initialises the controller-data
         *
         * @method init
         */
        $scope.init = function () {
            DomainAliasses.setDomain(DomainData.domain);
            DomainAliasses.refresh();
            emptyView();
        };

        /**
         * returns the list of the DomainAliasses
         *
         * @method getList
         * @return {Array} Returns the list of the DomainAliasses
         */
        $scope.getList = function () {
            return DomainAliasses.getList();
        };

        /**
         * create a new alias
         *
         * @method create
         * @param domain {Object} alais-object
         */
        $scope.create = function (alias) {
            DomainAliasses.create(alias);
            emptyView();
        };

        /**
         * remove an existing alias
         *
         * @method remove
         * @param alias {Object} alias-object
         */
        $scope.remove = function (alias) {
            DomainAliasses.remove(alias);
        };
    }]);

    /**
     * view-controller for the transports
     *
     * @class TransportCtrl
     */
    app.controller('TransportCtrl', ['$scope', 'ModalService', 'Page', 'Transports', function ($scope, ModalService, Page, Transports) {
        /**
         * initialises the controller-data
         *
         * @method init
         */
        $scope.init = function () {
            Page.setTitle('Transport');
            Transports.refresh();
        };

        /**
         * returns the list of the Transports
         *
         * @method getList
         * @return {Array} Returns the list of the Transports
         */
        $scope.getList = function () {
            return Transports.getList();
        };

        /**
         * create a new transport
         *
         * @method create
         */
        $scope.create = function () {
            var modalDefaults = {
                templateUrl: 'createView.html',
                resolve: {
                    data: function () {
                        return {
                            name: "",
                            destination: ""
                        };
                    }
                }
            };
            var modalInstance = ModalService.show(modalDefaults, {});
            modalInstance.result.then(function (data) {
                var item = {
                    name: data.name,
                    destination: data.destination
                };
                Transports.create(item);
            });
        };

        /**
         * edit an existing transport
         *
         * @method edit
         * @param transport {Object} transport-object
         */
        $scope.edit = function (transport) {
            var modalDefaults = {
                templateUrl: 'editView.html',
                resolve: {
                    data: function () {
                        return transport;
                    }
                }
            };
            var modalOptions = {};
            var modalInstance = ModalService.show(modalDefaults, modalOptions);
            modalInstance.result.then(function (data) {
                Transports.edit(data);
            });
        };

        /**
         * remove an existing transport
         *
         * @method remove
         * @param domain {Object} transport-object
         */
        $scope.remove = function (transport) {
            var modalOptions = {
                actionButtonText: 'Confirm',
                headerText: 'Delete transport?',
                bodyText: 'Are you sure you want to delete the transport "' + transport.name + '"?'
            };
            var modalInstance = ModalService.show({}, modalOptions);
            modalInstance.result.then(function (data) {
                Transports.remove(transport);
            });
        };
    }]);

    /**
     * Message-Class to transfer data between the user-Ctrl
     *
     * @class UserData
     */
    app.factory('UserData', function () {
        return {
            domain: null,
            user: null
        };
    });

    /**
     * view-controller for the user
     *
     * @class UserCtrl
     */
    app.controller('UserCtrl', ['$scope', 'SelectDomainService', 'ModalService', 'Page', 'Users', 'Domains', 'UserData', function ($scope, SelectDomainService, ModalService, Page, Users, Domains, UserData) {

        /**
         * on change Event for the Domains
         *
         * @method currentDomainChange
         */
        var currentDomainChange = function () {
            if (Domains.currentDomain() === Domains.ALL_DOMAINS) {
                var selectDomain = SelectDomainService.show();
                selectDomain.result.then(function (domain) {
                    Domains.setCurrentDomain(domain);
                    console.log(domain);
                });
            }
            console.log("test");
            Users.setDomain(Domains.currentDomain());
            Users.refresh();
        }

        var observer = {
            update: currentDomainChange,
            getName: function () {
                return "UserCtrl";
            }
        }

        /**
         * initialises the controller-data
         *
         * @method init
         */
        $scope.init = function () {
            Page.setTitle('User');
            currentDomainChange();
            Domains.registerCurrentDomainObserver(observer);
        };

        /**
         * destroys the controller-data
         *
         * @method onDestroy
         */
        $scope.$on('$destroy', function () {
            Domains.unregisterCurrentDomainObserver(observer);
        });

        /**
         * returns the list of the Users
         *
         * @method getList
         * @return {Array} Returns the list of the Users
         */
        $scope.getList = function () {
            return Users.getList();
        };

        /**
         * get the current domain
         *
         * @method getDomain
         * @return {Object} Returns the currentDomain
         */
        $scope.getDomain = function () {
            return Domains.currentDomain();
        };

        /**
         * create a new domain
         *
         * @method create
         */
        $scope.create = function () {
            var modalDefaults = {
                templateUrl: 'createView.html',
                resolve: {
                    data: function () {
                        return {
                            user: null,
                            domain: Domains.currentDomain()
                        };
                    }
                }
            };
            var modalInstance = ModalService.show(modalDefaults, {});
            modalInstance.result.then(function (data) {
                var item = {
                    name: data.user.name,
                    password: data.user.password,
                    quota: data.user.quota * 1024 * 1024
                };
                Users.create(item);
            });
        };

        /**
         * edit an existing user
         *
         * @method edit
         * @param user {Object} user-object
         */
        $scope.edit = function (user) {
            UserData.domain = Domains.currentDomain();
            UserData.user = user;
            var modalDefaults = {
                templateUrl: 'editView.html',
                resolve: {
                    data: function () {
                        return {
                            user: UserData.user,
                            domain: UserData.domain
                        };
                    }
                }
            };
            var modalOptions = {
                activeTab: 'general',
                tabClick: function (type) {
                    this.activeTab = type;
                },
                passwordChanged: false,
                newPasswordKeyPress: function (password) {
                    this.passwordChanged = (password != '');
                }
            };
            var modalInstance = ModalService.show(modalDefaults, modalOptions);
            modalInstance.result.then(function (data) {
                Users.edit(data.user);
            });
        };

        /**
         * remove an existing user
         *
         * @method remove
         * @param user {Object} user-object
         */
        $scope.remove = function (user) {
            var modalOptions = {
                actionButtonText: 'Confirm',
                headerText: 'Delete user?',
                bodyText: 'Are you sure you want to delete the user "' + user.name + '"?'
            };
            var modalInstance = ModalService.show({}, modalOptions);
            modalInstance.result.then(function (data) {
                Users.remove(user);
            });
        };
    }]);

    /**
     * view-controller for the user-aliasses
     *
     * @class UserAliasCtrl
     */
    app.controller('UserAliasCtrl', ['$scope', 'UserAliasses', 'UserData', function ($scope, UserAliasses, UserData) {

        /**
         * clears the view
         *
         * @method emptyView
         */
        var emptyView = function () {
            $scope.alias = {
                name: ""
            };
        }

        /**
         * initialises the controller-data
         *
         * @method init
         */
        $scope.init = function () {
            UserAliasses.setDomain(UserData.domain);
            UserAliasses.setUser(UserData.user);
            UserAliasses.refresh();
            emptyView();
        };

        /**
         * returns the list of the UserAliasses
         *
         * @method getList
         * @return {Array} Returns the list of the UserAliasses
         */
        $scope.getList = function () {
            return UserAliasses.getList();
        };

        /**
         * create a new alias
         *
         * @method create
         * @param domain {Object} alais-object
         */
        $scope.create = function (alias) {
            UserAliasses.create(alias);
            emptyView();
        };

        /**
         * remove an existing alias
         *
         * @method remove
         * @param alias {Object} alias-object
         */
        $scope.remove = function (alias) {
            UserAliasses.remove(alias);
        };
    }]);

    /**
     * view-controller for the summary
     *
     * @class SummaryCtrl
     */
    app.controller('SummaryCtrl', ['$scope', 'Page', 'Summaries', function ($scope, Page, Summaries) {

        /**
         * initialises the controller-data
         *
         * @method init
         */
        $scope.init = function () {
            Page.setTitle('Summary');
            Summaries.refresh();
        };

        /**
         * returns the list of the Summaries
         *
         * @method getList
         * @return {Array} Returns the list of the Summaries
         */
        $scope.getList = function () {
            return Summaries.getList();
        };
    }]);

    /**
     * view-controller for the api-keys
     *
     * @class ApiKeyCtrl
     */
    app.controller('ApiKeyCtrl', ['$scope', 'ModalService', 'Page', 'ApiKeys', function ($scope, ModalService, Page, ApiKeys) {
        /**
         * initialises the controller-data
         *
         * @method init
         */
        $scope.init = function () {
            Page.setTitle('ApiKey');
            ApiKeys.refresh();
        };

        /**
         * returns the list of the ApiKeys
         *
         * @method getList
         * @return {Array} Returns the list of the ApiKeys
         */
        $scope.getList = function () {
            return ApiKeys.getList();
        };

        /**
         * create a new api-key
         *
         * @method create
         */
        $scope.create = function () {
            var modalDefaults = {
                templateUrl: 'createView.html',
                resolve: {
                    data: function () {
                        return {
                            name: "",
                            destination: ""
                        };
                    }
                }
            };
            var modalInstance = ModalService.show(modalDefaults, {});
            modalInstance.result.then(function (data) {
                var item = {
                    //name: data.name,
                    //destination: data.destination
                };
                ApiKeys.create(item);
            });
        };

        /**
         * edit an existing api-key
         *
         * @method edit
         * @param apiKey {Object} api-key-object
         */
        $scope.edit = function (apiKey) {
            var modalDefaults = {
                templateUrl: 'editView.html',
                resolve: {
                    data: function () {
                        return apiKey;
                    }
                }
            };
            var modalOptions = {};
            var modalInstance = ModalService.show(modalDefaults, modalOptions);
            modalInstance.result.then(function (data) {
                ApiKeys.edit(data);
            });
        };

        /**
         * remove an existing api-key
         *
         * @method remove
         * @param apiKey {Object} api-key-object
         */
        $scope.remove = function (apiKey) {
            var modalOptions = {
                actionButtonText: 'Confirm',
                headerText: 'Delete api-key?',
                bodyText: 'Are you sure you want to delete the api-key "' + apiKey.access_token + '"?'
            };
            var modalInstance = ModalService.show({}, modalOptions);
            modalInstance.result.then(function (data) {
                ApiKeys.remove(apiKey);
            });
        };

        /**
         * transfers the api-key to the ImageName (valid,expired,inactive)
         *
         * @method imageName
         * @param apiKey {Object} api-key-object
         */
        $scope.imageName = function (apiKey) {

            if (ApiKeys.isExpired(apiKey)) {
                return "api_expired";
            } else if (!apiKey.active) {
                return "api_inactive";
            }

            return "api_valid";
        };
    }]);
});