/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('addMilestone', {
                url: '/addMilestone/:id',
                templateUrl: 'app/controllers/addControllers/addMilestone/addMilestone.html',
                controller: 'AddMilestoneCtrl'
            });
    });