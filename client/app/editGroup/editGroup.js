/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('editGroup', {
                url: '/editGroup/:id',
                templateUrl: 'app/editGroup/editGroup.html',
                controller: 'EditGroupCtrl'
            });
    });