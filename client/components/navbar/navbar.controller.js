/*global angular  */

angular.module('portApp')
    .controller('NavbarCtrl', function ($scope, Auth, $location) {
        'use strict';
        $scope.reportsMenu = [
            {
                'title': 'Product Dashboard',
                'link': '/'
            },
            {
                'title': 'Product Summary Report',
                'link': '/report/productSummary'
            },
            {
                'title': 'Product Manager Status Report',
                'link': '/report/opsStatus'
            },
            {
                title: 'Product Detail Report',
                link: '/report/detailStatus'
            },
            {
                title: 'Group Operational Status Report',
                link: '/report/groupStatus'
            }];
        $scope.menu = [
            {
                'title': 'Products',
                'link': '/products'
            },
            {
                'title': 'Ops Readiness',
                'link': '/opsReadiness'
            },
            {
                'title': 'Milestones',
                'link': '/milestones'
            }];
        $scope.authMenu = [
            {
                'title': 'Objectives',
                'link': '/objectives'
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
    
        $scope.logout = function () {
            Auth.logout(function (err) {
                if (!err) {
                    $location.path('/home');
                }
            });
        };

    });