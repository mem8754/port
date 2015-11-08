/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var ProductsCtrl = function ($scope, $rootScope, $state, $log, $window, productsFactory, usersFactory, groupsFactory) {

        $scope.pSortBy = 'productRank';
        $scope.pReverse = false;
        $scope.pSortName = false;
        $scope.pSortManager = false;
        $scope.pSortPriority = false;
        $scope.pSortPhase = false;
        $scope.pSortRank = true;
        
        $scope.products = null;
        $scope.productManagers = null;
        $rootScope.userAuthorized = true;
        $rootScope.userAuthenticated = true;
        
        
        function init() {
            if ($rootScope.userAuthorized) {
                productsFactory.getProducts().error(function (data, status, headers, config) {
                    $log.warn('Server error getting product documents: ', status);
                }).success(function (products) {
                    $scope.products = products;
                    
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
                                j = 0,
                                pmGroup = null;

                            // loop through group collection to find pm group, save that _id

                            for (i = 0; i < groups.length; i++) {
                                if (groups[i].groupName === "Product Management") {
                                    pmGroup = groups[i]._id;
                                    break;
                                }
                            }
                            if (null !== pmGroup) {

                                // loop through the users collection backwards, drop any user not in PM group. 
                                // really meant to do this for "add product", but will go with this for now, remove later.

                                for (i = $scope.users.length - 1; i > -1; i--) {
                                    if ($scope.users[i].groupId !== pmGroup) {
                                        $scope.users.splice(i, 1);
                                    }
                                }
                                
                                // loop through the products and insert the PM name
                                
                                for (i = 0; i < $scope.products.length; i++) {
                                    for (j = 0; j < $scope.users.length; j++) {
                                        if ($scope.products[i].productManager === $scope.users[j]._id) {
                                            $scope.products[i].pmName = $scope.users[j].lastName;
                                            break;
                                        }
                                    }       /*  end of inner loop (looping through users)     */
                                }           /*  end of outer loop (looping through products)  */
                            }
                        });         /*  end of "success" method for "getGroups"    */
                    });             /*  end of "success" method for "getUsers"     */
                });                 /*  end of "success" method for "getProducts"  */
            } else {
                $window.alert("\nYou are not authorized to access this web site.\n (02.02)");
                $state.go("main");
            }
        }
        
        function authenticateUser() {

    // Authorize this user if logged in email is found in Players.
            usersFactory.getUserByEmail($rootScope.user.email)
                .error(function (data, status, headers, config) {
                    $window.alert("\nUnable to authenticate user at this time.\n (02.03)");
                    $state.go("main");
                })
                .success(function (user) {
                    $rootScope.userAuthenticated = true;
                    $rootScope.userAuthority = 1;
                    if (user.length === 1) {
                        if (user[0].admin) {
                            $rootScope.userAuthority = 3;
                        } else if (user[0].editor) {
                            $rootScope.userAuthority = 2;
                        }
                        
                        $rootScope.userAuthorized = true;
                        $rootScope.userId = user[0]._id;
                        init();
                    } else {
                        $window.alert("\nYou are not authorized to access this web site. (02.01)\n");
                        $state.go("main");
                    }
                });
        }

        
        if (!$rootScope.userAuthenticated) {
            authenticateUser();  // request user authentication with factory.
        } else {
            init();
        }
        
        
        $scope.doSort = function (propName) {
            if (propName === $scope.pSortBy) {
                $scope.pReverse = !$scope.pReverse;
            } else {
                $scope.pReverse = false;
                $scope.pSortName = false;
                $scope.pSortManager = false;
                $scope.pSortPriority = false;
                $scope.pSortRank = false;
                $scope.pSortPhase = false;
                
                $scope.pSortBy = propName;
                
                switch (propName) {
                case "productName":
                    $scope.pSortName = true;
                    break;
                case "pmName":
                    $scope.pSortManager = true;
                    break;
                case "businessPriority":
                    $scope.pSortPriority = true;
                    break;
                case "phase":
                    $scope.pSortPhase = true;
                    break;
                case "businessRank":
                    $scope.pSortRank = true;
                    break;
                default:
                    break;
                }
            }
        };
    };
    
    ProductsCtrl.$inject = ['$scope', '$rootScope', '$state', '$log', '$window', 'productsFactory', 'usersFactory', 'groupsFactory'];

    angular.module('portApp').controller('ProductsCtrl', ProductsCtrl);
    
}());