/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var ProductSummaryReportCtrl = function ($scope, $rootScope, $state, $log, $window, productsFactory, actionsFactory, usersFactory) {

        $scope.pSortBy = 'businessRank';
        $scope.pReverse = false;
        $scope.pSortName = false;
        $scope.pSortManager = false;
        $scope.pSortPriority = false;
        $scope.pSortPhase = false;
        $scope.pSortRank = true;
        
        $scope.statusAvailable = false;
        $scope.products = null;
        $scope.productManagers = null;
        $scope.stat = [
            "Not Started",
            "In Progress",
            "Follow Up",
            "Complete",
            "Not Applicable",
            "No Data"
        ];

        $rootScope.userAuthorized = true;
        $rootScope.userAuthenticated = true;
        
        
        function init() {
            
             
            if ($rootScope.userAuthorized) {
                productsFactory.getActiveProducts().error(function (data, status, headers, config) {
                    $log.warn('Server error getting Products documents: ', status);
                }).success(function (products) {
                    var i = 0,
                        j = 0;
                    
                    $scope.products = products.objSort("productId");
                    
                    // build a product status matrix
                    
                    $scope.phaseStatus = [];
                    
                    for (i = 0; i < $scope.products.length; i++) {
                        $scope.phaseStatus[i] = {};
                        $scope.phaseStatus[i].productId = $scope.products[i]._id;
                        $scope.phaseStatus[i].status = [];
                        for (j = 0; j < 5; j++) {
                            $scope.phaseStatus[i].status[j] = 5;
                        }
                    }
                    
                    // Get the actions to populate the $scope.phaseStatus matrix
                    
                    actionsFactory.getActions().error(function (data, status, headers, config) {
                        $log.warn('Server error getting Actions documents: ', status);
                    }).success(function (actions) {
                            
                        actions = actions.objSort("productId", "phaseNum", "actionStatus");
                        
                        //  set up loop control variables to trigger changes on first loop pass
                        
                        var val = 0,
                            i = 0,
                            j = 0,
                            prodId = actions[actions.length - 1].productId,  /* set "current" product ID to the last product ID in the actions list  */
                            phNum = 5;                                       /* and phase number to an out of range value  */
                        
                        for (i = 0; i < actions.length; i++) {
                            if (actions[i].productId !== prodId || actions[i].phaseNum !== phNum) {
                                prodId = actions[i].productId;
                                phNum = actions[i].phaseNum;
                                val = actions[i].actionStatus;

                                //  loop through the product status matrix to find this product ID
                                
                                for (j = 0; j < $scope.phaseStatus.length; j++) {
                                    if ($scope.phaseStatus[j].productId === prodId) {
                                        if (val < $scope.phaseStatus[j].status[phNum]) {       /*  if this status value is lower than the current matrix value   */
                                            $scope.phaseStatus[j].status[phNum] = val;         /*  replace matrix entry with this value                          */
                                        }
                                        break;
                                    }
                                }
                                
                            }
                        }
                        
                        for (i = 0; i < $scope.products.length; i++) {
                            if ($scope.products[i]._id !== $scope.phaseStatus[i].productId) {
                                $window.alert("Oops! Product ID mismatch: ", $scope.phaseStatus[i].productId, " - Index: ", i);
                            } else {
                                $scope.products[i].phaseStatus = $scope.phaseStatus[i].status;
                            }
                            $scope.statusAvailable = true;
                        }
                    });
                });
                    
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
    
    ProductSummaryReportCtrl.$inject = ['$scope', '$rootScope', '$state', '$log', '$window', 'productsFactory', 'actionsFactory', 'usersFactory'];

    angular.module('portApp').controller('ProductSummaryReportCtrl', ProductSummaryReportCtrl);
    
}());
