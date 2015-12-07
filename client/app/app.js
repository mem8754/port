/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

var portApp = angular.module('portApp', [ 'ngCookies', 'ngResource', 'ngSanitize', 'ui.router' ]);
    
portApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $locationProvider.html5Mode(true);
    
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/home/home.html',
            controller: 'HomeCtrl'
        
        });
});