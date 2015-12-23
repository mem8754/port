/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('actions', {
                url: '/actions/:groupId',
                templateUrl: 'app/controllers/viewControllers/actions/actions.html',
                controller: 'ActionsCtrl'
            });
    });