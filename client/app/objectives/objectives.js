/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('objectives', {
                url: '/objectives',
                templateUrl: 'app/objectives/objectives.html',
                controller: 'ObjectivesCtrl'
            });
    });