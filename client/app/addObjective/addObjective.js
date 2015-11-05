/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('addObjective', {
                url: '/addObjective',
                templateUrl: 'app/addObjective/addObjective.html',
                controller: 'AddObjectiveCtrl'
            });
    });