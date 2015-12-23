/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('objectives', {
                url: '/objectives',
                templateUrl: 'app/controllers/viewControllers/objectives/objectives.html',
                controller: 'ObjectivesCtrl'
            });
    });