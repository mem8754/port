/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('editMilestone', {
                url: '/editMilestone/:id',
                templateUrl: 'app/controllers/editControllers/editMilestone/editMilestone.html',
                controller: 'EditMilestoneCtrl'
            });
    });