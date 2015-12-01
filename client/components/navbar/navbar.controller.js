/*global angular  */

angular.module('portApp')
    .controller('NavbarCtrl', function ($scope, $location) {
        'use strict';
        $scope.menu = [
            {
                'title': 'Home',
                'link': '/home'
            },
            {
                'title': 'Reports',
                'link': '/reports'
            },
            {
                'title': 'Products',
                'link': '/products'
            },
            {
                'title': 'Ops Readiness',
                'link': '/opsReadiness'
            },
            {
                'title': 'Objectives',
                'link': '/objectives'
            },
            {
                'title': 'Milestones',
                'link': '/milestones'
            },
            {
                'title': 'Groups',
                'link': '/groups'
            },
            {
                'title': 'Users',
                'link': '/users'
            }];

        $scope.isCollapsed = true;

        $scope.isActive = function (route) {
            return route === $location.path();
        };
    });