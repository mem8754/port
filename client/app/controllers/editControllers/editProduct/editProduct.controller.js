/*jslint node: true, nomen: true, plusplus: true */
/*global angular */

(function () {
    'use strict';

    var EditProductCtrl = function ($scope, $rootScope, $state, $stateParams, $log, $window, productsFactory, usersFactory, groupsFactory, Auth) {
    
        
        function init() {
            
            if (!Auth.isEditor()) {
                $window.alert("\nYou must have Admin or Edit authority to update Products.\n");
                $state.go('milestones');
            }
            
            var i = 0,
                j = 0,
                pmGroupId = null,
                productId = $stateParams.id;

            $scope.users = null;
            
            productsFactory.getProduct(productId).error(function (data, status, headers, config) {
                $window.alert("System error reading product details: ", status);
            }).success(function (product) {
                $scope.product = product;
                $scope.origProduct = product;
            });
            
            groupsFactory.getGroups().error(function (data, status, headers, config) {
                $log.warn("Edit Product - server error reading groups: ", status);
            }).success(function (groups) {
                usersFactory.getUsers().error(function (data, status, headers, config) {
                    $log.warn("Edit Product - server error reading users: ", status);
                }).success(function (users) {
                    for (i = 0; i < groups.length; i++) {
                        if (groups[i].groupName === "Product Management") {
                            pmGroupId = groups[i]._id;
                            break;
                        }
                    }
                    
                    if (null !== pmGroupId) {
            
                        if (pmGroupId !== $rootScope.currentUser.groupId || !$rootScope.currentUser.admin) {
                            $window.alert("\nYou must be a Product Mgr or have Admin authority to edit a Product.\n");
                            $state.go('products');
                        }
                        for (i = users.length - 1; i >= 0; i--) {
                            if (users[i].groupId !== pmGroupId) {
                                users.splice(i, 1);
                            }
                        }
                        $scope.users = users;
                    }
                });
            });
        }
   
        init();
        
        /*  post a round to the "rounds" Factory */
        
        $scope.updateProduct = function () {
            
            productsFactory.updateProduct($scope.product).error(function (data, status, headers, config) {
                $window.alert("System error updating product in database.");
            }).success(function (data) {
                $state.go('products');
            });
        };
    };
    
    EditProductCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$window', 'productsFactory', 'usersFactory', 'groupsFactory', 'Auth'];

    angular.module('portApp').controller('EditProductCtrl', EditProductCtrl);
    
}());