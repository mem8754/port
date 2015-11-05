/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var ProductSummaryReportCtrl = function ($scope, $rootScope, $state, $log, $window, productsFactory, actionsFactory, usersFactory) {

        $scope.pSortBy = 'productName';
        $scope.pReverse = false;
        $scope.pSortName = true;
        $scope.pSortManager = false;
        $scope.pSortPriority = false;
        $scope.pSortPhase = false;
        
        $scope.products = null;
        $scope.productManagers = null;
        $rootScope.userAuthorized = true;
        $rootScope.userAuthenticated = true;
        
        function updateStatus() {
            actionsFactory.getActions().error(function (data, status, headers, config) {
                $log.warn('Server error getting product documents: ', status);
            }).success(function (actions) {
                var i = 0,
                    j = 0,
                    k = 0;
                actions = actions.objSort("productId", "phaseNum", "groupNum", "-actionStatus");
                for (i = 0; i < $scope.products.length; i++) {
                    for (j = 0; j < 5; j++) {
                        for (k = 0; k < actions.length; k++) {
                            
                        }
                    }
                }
            });
        }
        
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
                        
                        var i = 0,
                            j = 0;
                        $scope.users = users;

                        // loop through the products and insert the owning PM's name

                        for (i = 0; i < $scope.products.length; i++) {
                            
                            // find PM user and insert name into product documentß
                            for (j = 0; j < $scope.users.length; j++) {
                                if ($scope.products[i].productManager === $scope.users[j]._id) {
                                    $scope.products[i].pmName = $scope.users[j].firstName;
                                    break;
                                }
                            }       /*  end of inner loop (looping through users)     */
                            
                        }           /*  end of outer loop (looping through products)  */

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
                case "currentPhase":
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
    
    ProductSummaryReportCtrl.$inject = ['$scope', '$rootScope', '$state', '$log', '$window', 'productsFactory', 'usersFactory'];

    angular.module('portApp').controller('ProductSummaryReportCtrl', ProductSummaryReportCtrl);
    
}());