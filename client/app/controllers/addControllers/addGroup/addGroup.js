/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('addGroup', {
                url: '/addGroup',
                templateUrl: 'app/controllers/addControllers/addGroup/addGroup.html',
                controller: 'AddGroupCtrl'
            });
    });