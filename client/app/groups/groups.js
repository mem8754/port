/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('groups', {
                url: '/groups',
                templateUrl: 'app/groups/groups.html',
                controller: 'GroupsCtrl'
            });
    });