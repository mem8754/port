/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('profile', {
                url: '/profile',
                templateUrl: 'app/controllers/viewControllers/profile/profile.html',
                controller: 'ProfileCtrl'
            });
    });