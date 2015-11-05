/*jslint nomen: true, node: true plusplus: true */
/*global angular */

angular.module('portApp').controller('MainCtrl', function ($scope, $http) {
    'use strict';

    $scope.dSortBy = 'businessRank';
    $scope.dReverse = false;
    $scope.dSortName = false;
    $scope.dSortRank = true;
    $scope.dSortPriority = false;
    $scope.dSortPhase = false;
    
    $scope.products = {};
    $scope.productStatus = ["Not Started",
                            "In Progress",
                            "Follow-up",
                            "Complete",
                            "Not Applicable",
                            "No Data"];
    $scope.productsFound = false;

    //  Read the products collection out of the mongo database via the API.
    
    $http.get('/api/products').success(function (products) {
        $scope.products = products;
        if (products.length > 0) {
            $scope.productsFound = true;
        }
    });
    
    $scope.doSort = function (propName) {
        if (propName === $scope.dSortBy) {
            $scope.dReverse = !$scope.dReverse;
        } else {
            $scope.dReverse = false;
            $scope.dSortName = false;
            $scope.dSortPriority = false;
            $scope.dSortRank = false;
            $scope.dSortPhase = false;

            $scope.dSortBy = propName;

            switch (propName) {
            case "productName":
                $scope.dSortName = true;
                break;
            case "businessPriority":
                $scope.dSortPriority = true;
                break;
            case "currentPhase":
                $scope.dSortPhase = true;
                break;
            case "businessRank":
                $scope.dSortRank = true;
                break;
            default:
                break;
            }
        }
    };

});