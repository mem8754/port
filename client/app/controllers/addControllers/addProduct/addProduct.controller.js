/*jslint node: true, nomen: true, plusplus: true  */
/*global angular */

(function () {
    'use strict';

    var AddProductCtrl = function ($scope, $rootScope, $state, $stateParams, $log, $window, productsFactory, usersFactory, groupsFactory, Auth) {
    
        function init() {
            
            if (!Auth.isEditor()) {
                $window.alert("\nYou must have Admin or Editor authority to perform this action.\n");
                $state.go('products');
            }

            var i = 0;
            $scope.product = {};
            $scope.users = null;

                    
            // get the users collection (to find Product Managers)

            usersFactory.getUsers().error(function (data, status, headers, config) {
                $log.warn('Server error getting users: ', status);
            }).success(function (users) {
                $scope.users = users;

                // find the product manager group id

                groupsFactory.getGroups().error(function (data, status, headers, config) {
                    $log.warn('Server error getting groups: ', status);
                }).success(function (groups) {
                    var i = 0,
                        pmGroupId = null;

                    // loop through group collection to find Product Management group, save that _id

                    for (i = 0; i < groups.length; i++) {
                        if (groups[i].groupName === "Product Management") {
                            pmGroupId = groups[i]._id;
                            break;
                        }
                    }
                    if (null !== pmGroupId) {

                        // loop through the users collection backwards, drop any user not in PM group. 
                        // really meant to do this for "add product", but will go with this for now, remove later.

                        for (i = $scope.users.length - 1; i > -1; i--) {
                            if ($scope.users[i].groupId !== pmGroupId) {
                                $scope.users.splice(i, 1);
                            }
                        }
                        
                        if (pmGroupId !== $rootScope.currentUser.groupId || !$rootScope.currentUser.admin) {
                            $window.alert("\nYou must be a Product Mgr or have Admin authority to add a product to the database.\n");
                            $state.go('products');
                        }
                    }
                });         /*  end of "success" method for "getGroups"    */
            });             /*  end of "success" method for "getUsers"     */
        }
   
        init();
        
        /*  post the new product record to the "rounds" Factory */
        
        $scope.addProduct = function () {
            productsFactory.addProduct($scope.product).error(function (data, status, headers, config) {
                $window.alert("Server error " + status + " adding product.");
            }).success(function (data) {
                $state.go('products');
            });
        };
    };
    
    AddProductCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$window', 'productsFactory', 'usersFactory', 'groupsFactory', 'Auth'];

    angular.module('portApp')
        .controller('AddProductCtrl', AddProductCtrl);
    
}());