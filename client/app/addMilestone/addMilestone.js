/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('addMilestone', {
                url: '/addMilestone/:id',
                templateUrl: 'app/addMilestone/addMilestone.html',
                controller: 'AddMilestoneCtrl'
            });
    });