/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('editObjective', {
                url: '/editObjective/:id',
                templateUrl: 'app/editObjective/editObjective.html',
                controller: 'EditObjectiveCtrl'
            });
    });