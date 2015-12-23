/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('editUser', {
                url: '/editUser/:id',
                templateUrl: 'app/controllers/editControllers/editUser/editUser.html',
                controller: 'EditUserCtrl'
            });
    });