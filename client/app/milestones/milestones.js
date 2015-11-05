/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('milestones', {
                url: '/milestones',
                templateUrl: 'app/milestones/milestones.html',
                controller: 'MilestonesCtrl'
            });
    });