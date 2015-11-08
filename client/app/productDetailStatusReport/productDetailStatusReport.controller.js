/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var ProductDetailStatusReportCtrl = function ($scope, $rootScope, $state, $log, $window, productsFactory, actionsFactory, groupsFactory, usersFactory) {

        $scope.pSortBy = 'productName';
        $scope.pReverse = false;
        $scope.pSortName = true;
        $scope.pSortPriority = false;
        $scope.pSortPhase = false;
        
        $scope.statusAvailable = false;
        $scope.products = null;
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

        
//=============================================================================================================
//  initializeStatusMatrix:
//      This function builds and returns a skeleton status matrix for products / groups / phases.
//
//  Inputs:
//      none.
//
//  $scope items:
//      $scope.products
//      $scope.opsGroups
//
//  Process steps:
//      -   loop through the $scope.products and $scope.opsGroups arrays to build matrix entries for each product / group combination.
//      -   populate each product / group entry with phase status values for each of the five phases.
//          --  initial value for each status entry is "5", which indicates "No Data"
//
//  Return value(s):    
//        matrix:
//            [{
//                groups  :
//                    [{
//                        groupIndex  :   Number,
//                        phases      :   [ Number ]
//                    }]
//            }]
//        
//  Output(s):          
//      none.
//=============================================================================================================
    
        
        function initializeStatusMatrix() {
            var i = 0,
                j = 0,
                k = 0,
                matrix = [];

            for (i = 0; i < $scope.products.length; i++) {      /*  process all the products  */
                matrix[i] = {};
                matrix[i].groups = [];

                for (j = 0; j < $scope.opsGroups.length; j++) { /*  process all the operational groups  */
                    matrix[i].groups[j] = {};
                    matrix[i].groups[j].groupIndex = j;
                    matrix[i].groups[j].phases = [];

                    for (k = 0; k < 5; k++) {                   /*  process five phases  */
                        matrix[i].groups[j].phases[k] = 5;      /*  set all status values to "no data" level  */
                    }
                }
            }
            
            return matrix;
        }
        
        
//=============================================================================================================
//  buildStatusMatrix:
//      This function creates and returns a status matrix for products / groups / phases.
//
//  Inputs:             
//      productStatus:
//          [{
//              productIndex: Number,
//              groups:
//                  [{
//                      groupIndex: Number,
//                      phases:
//                          [{
//                              phaseNum: Number,
//                              status: Number
//                          }]
//                  }]
//          }]
//
//  $scope items:
//      none.
//
//  Process steps:
//      -   loop through the productStatus array to process each product / group / phase combination.
//      -   update the status matrix for the referenced product index, group index, and phase number with the phase status value.
//
//  Return value(s):    
//        statusMatrix:
//            [{
//                groups  :
//                    [{
//                        groupIndex  :   Number,
//                        phases      :   [ Number ]
//                    }]
//            }]
//        
//  Output(s):          
//      none.
//=============================================================================================================

        function buildStatusMatrix(productStatus) {
            var i,
                j,
                k,
                productIdx,
                groupIdx,
                phaseIdx,
                statusMatrix = initializeStatusMatrix();
            
            for (i = 0; i < productStatus.length; i++) {
                
                for (j = 0; j < productStatus[i].groups.length; j++) {

                    for (k = 0; k < productStatus[i].groups[j].phases.length; k++) {

                        productIdx = productStatus[i].productIndex;
                        groupIdx = productStatus[i].groups[j].groupIndex;
                        phaseIdx = productStatus[i].groups[j].phases[k].phaseNum;
                        
                        statusMatrix[productIdx].groups[groupIdx].phases[phaseIdx] = productStatus[i].groups[j].phases[k].status;
                        
                    }
                }
            }
            return statusMatrix;
        }
        
        
//=============================================================================================================
//  productIndex:
//      This function returns a product Index for the input product ID.
//
//  Inputs:             
//      productId: ObjectId
//
//  $scope items:   
//      $scope.products
//
//  Process steps:
//      -   loop through $scope.products array to find the entry that contains the input productId.
//      -   return the index of the entry with the product ID, or "null" if the product ID was not found.
//
//  Return value(s):    
//        productIndex: Number (OR null, if product ID not found)
//        
//  Output(s):          
//      none.
//=============================================================================================================

        function productIndex(productId) {
            var i = 0;
            
            while (i < $scope.products.length && productId !== $scope.products[i]._id) {
                i++;
            }
            if (i < $scope.products.length) {
                return i;
            }
            return null;
        }
        
//=============================================================================================================
//  groupIndex:
//      This function returns a group Index for the input operational group ID.
//
//  Inputs:             
//      groupId: ObjectId
//
//  $scope items:   
//      $scope.opsGroups
//
//  Process steps:
//      -   loop through $scope.opsGroups array to find the entry that contains the input groupId.
//      -   return the index of the entry with the group ID, or "null" if the group ID was not found.
//
//  Return value(s):    
//        groupIndex: Number (OR null, if group ID not found)
//        
//  Output(s):          
//      none.
//=============================================================================================================

        function groupIndex(groupId) {
            var i = 0;
            while (i < $scope.opsGroups.length && groupId !== $scope.opsGroups[i]._id) {
                i++;
            }
            if (i < $scope.opsGroups.length) {
                return i;
            }
            return null;
        }
        
        
//=============================================================================================================
//  processPhaseActions:
//      This function processes an array of phase/status pairs, and returns an array containing a consolidated status value for each phase.
//
//  Inputs:             
//      productId: ObjectId
//
//  $scope items:   
//      $scope.products
//
//  Process steps:
//      -   loop through $scope.products array to find the entry that contains the input productId.
//      -   return the index of the entry with the product ID, or "null" if the product ID was not found.
//
//  Return value(s):    
//        productIndex: Number (OR null, if product ID not found)
//        
//  Output(s):          
//      none.
//=============================================================================================================

        function processPhaseActions(phaseActions) {
            var i = 0,
                j = -1,
                k = -1,
                phaseNo = null,
                phases = [];
            
            for (i = 0; i < phaseActions.length; i++) {
                
                if (phaseActions[i].phaseNum >= 0 && phaseActions[i].phaseNum <= 4) {
                    
                    if (phaseNo === null || phaseNo !== phaseActions[i].phaseNum) {
                        j++;
                        phaseNo = phaseActions[i].phaseNum;
                        phases[j] = {};
                        phases[j].phaseNum = phaseNo;
                        phases[j].status = phaseActions[i].status;
                    } else {
                        phases[j].status = Math.min(phaseActions[i].status, phases[j].status);
                    }
                }
            }
            
            return phases;
        }

        
        function processGroupActions(groupActions) {
            var i = 0,
                j = 0,
                k = 0,
                groupId = null,
                groups = [],
                phaseActions = null;
            
            for (i = 0; i < groupActions.length; i++) {
                
                if (groupIndex(groupActions[i].groupId) !== null) {
                    
                    if (!groupId || groupId !== groupActions[i].groupId) {
                        
                        if (phaseActions && phaseActions.length > 0) {
                            groups[j].phases = processPhaseActions(phaseActions);
                            j++;
                        }
                        
                        k = 0;
                        phaseActions = [];
                        
                        groupId = groupActions[i].groupId;
                        groups[j] = {};
                        groups[j].groupIndex = groupIndex(groupId);
                    }
                    
                    phaseActions[k] = {};
                    phaseActions[k].phaseNum = groupActions[i].phaseNum;
                    phaseActions[k].status = groupActions[i].status;
                    k++;
                        
                }
            }
            if (phaseActions && phaseActions.length > 0) {
                groups[j].phases = processPhaseActions(phaseActions);
            }
            
            return groups;
        }
        
        
        function processActions(actions) {
            var i = 0,
                j = 0,
                k = 0,
                productId = null,
                productActions = [],
                groupActions = null;
            
            for (i = 0; i < actions.length; i++) {
                if (productIndex(actions[i].productId) !== null) {
                    if (!productId || productId !== actions[i].productId) {
                        
                        if (groupActions && groupActions.length > 0) {
                            productActions[j].groups = processGroupActions(groupActions);
                            j++;
                        }

                        k = 0;
                        groupActions = [];
                        
                        productId = actions[i].productId;
                        productActions[j] = {};
                        productActions[j].productIndex = productIndex(productId);
                    }

                    groupActions[k] = {};
                    groupActions[k].groupId = actions[i].groupId;
                    groupActions[k].phaseNum = actions[i].phaseNum;
                    groupActions[k].status = actions[i].actionStatus;
                    k++;
                }
            }
            
            // we're done with the actions list; check for remaining group actions to be processed / added to the productActions structure.
            
            if (groupActions && groupActions.length > 0) {
                productActions[j].groups = processGroupActions(groupActions);
            }
            
            return productActions;
        }
        
            
        function integrateProductStatus(matrix) {
            var i;
            
            if ($scope.products.length !== matrix.length) {
                $window.alert("\nError integrating status data with product data, size mismatch.\n",
                              "Status = ", matrix.length, " entries, Products = ", $scope.products.length, " entries.\n");
            } else {
                for (i = 0; i < matrix.length; i++) {
                    $scope.products[i].groups = matrix[i].groups;
                }
            }
        }
        
        
        function init() {
            
             
            if ($rootScope.userAuthorized) {
                
                groupsFactory.getOpsGroups().error(function (data, status, headers, config) {
                    $log.warn('Server error getting Groups documents: ', status);
                }).success(function (opsGroups) {
                    $scope.opsGroups = opsGroups.objSort("opsId");
                });
                

                productsFactory.getActiveProducts().error(function (data, status, headers, config) {
                    $log.warn('Server error getting Products documents: ', status);
                }).success(function (products) {
                    $scope.products = products.objSort("productId");
                    
                    // Get the actions to populate the $scope.products.groupsStatus matrix
                    
                    actionsFactory.getActions().error(function (data, status, headers, config) {
                        $log.warn('Server error getting Actions documents: ', status);
                    }).success(function (actions) {
                        actions = actions.objSort("productId", "groupId", "phaseNum", "actionStatus");
                        
                        var productStatus = processActions(actions),
                            productMatrix = buildStatusMatrix(productStatus);
                        
                        integrateProductStatus(productMatrix);
                        
                        $scope.statusAvailable = true;
                    });
                });

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
                $scope.pSortPriority = false;
                $scope.pSortRank = false;
                $scope.pSortPhase = false;
                
                $scope.pSortBy = propName;
                
                switch (propName) {
                case "productName":
                    $scope.pSortName = true;
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
    
    ProductDetailStatusReportCtrl.$inject = ['$scope', '$rootScope', '$state', '$log', '$window', 'productsFactory', 'actionsFactory', 'groupsFactory', 'usersFactory'];

    angular.module('portApp').controller('ProductDetailStatusReportCtrl', ProductDetailStatusReportCtrl);
    
}());