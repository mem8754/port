/*jslint nomen: true, node: true, plusplus: true */
/*global angular */

(function () {
    'use strict';
    var ActionsCtrl = function ($scope, $rootScope, $state, $stateParams, $log, $window, actionsFactory, usersFactory, groupsFactory, productsFactory, objectivesFactory, milestonesFactory, statusFactory) {
        $rootScope.userAuthorized = true;
        $rootScope.userAuthenticated = true;
        
//=============================================================================================================
//  buildActionList:
//      This function builds a combined action list for the current product using provided objectives, milestones, and actions.
//
//  Inputs:             
//      $scope items: $scope.objectives, $scope.milestones, $scope.actions
//
//  Process steps:
//      -   loop through the milestones and actions arrays to find all actions with a matching milestone ID
//          --  for actions associated with the milestone, add the action.actionStatus and action._id parameters to the milestone object
//          --  base assumption is that there is only one action per milestone
//      -   loop through the objectives array, and attach each milestone for that objective to the objective object.
//          --  "push" the appropriate milestone record onto the objective record's "milestones" array
//          --  there can be multiple milestones per objective.
//
//  Return value(s):    
//      none.
//        
//  Output(s):          
//      updated $scope.objectives and $scope.milestones arrays.
//=============================================================================================================

        function buildActionList() {
            var i = 0,
                j = 0;
            
            for (i = 0; i < $scope.milestones.length; i++) {
                for (j = 0; j < $scope.actions.length; j++) {
                    if ($scope.milestones[i]._id === $scope.actions[j].milestoneId) {
                        $scope.milestones[i].milestoneStatus = $scope.actions[j].actionStatus;
                        $scope.milestones[i].actionId = $scope.actions[j]._id;
                        break;
                    }
                }
            }

            for (i = 0; i < $scope.objectives.length; i++) {
                $scope.objectives[i].milestones = [];
                for (j = 0; j < $scope.milestones.length; j++) {
                    if ($scope.milestones[j].objectiveId === $scope.objectives[i]._id) {
                        $scope.objectives[i].milestones.push($scope.milestones[j]);
                    }
                }
            }
        }

//=============================================================================================================
//  getOpsGroupIndex:
//      This function provides an index into the status array for a specific Group ID.
//
//  Inputs:             
//      Group ID
//
//  Process steps:
//      - loop through the $scope.opsGroups array to find a match for the provided Group ID
//          --  if found, return the associated index value incremented by 1 (leave index 0 for overall phase status)
//      - if the end of the $scope.opsGroups array is reached without finding a match, return "null".
//
//  Return value(s):    
//      Appropriate index value for the provided operational Group ID, or "null" if the group ID is not found.
//        
//  Output(s):          
//      none.
//=============================================================================================================
        
        function getOpsGroupIndex(id) {
            var i = 0;
            for (i = 0; i < $scope.opsGroups.length; i++) {
                if ($scope.opsGroups[i]._id === id) {
                    return i + 1;
                }
            }
            return null;
        }

//=============================================================================================================
//  updateProductStatus:
//      This function updates the product status record for a specific group / phase.
//
//  Inputs:             
//      Product ID, Group ID, and Phase Number to be updated.
//
//  Process steps:
//      - read the actions associated with this product for this group for the specified phase number
//          --  sort the records by the status value, so that the lowest status value is in the first array entry ([0])
//      - read the product status record for this product / phase number
//          --  if the status record does not yet exist, populate a template record
//      - convert the group ID into an index for this group into the status array (to store the group status)
//      - save the lowest status value into the product status array at the correct index
//      - update the overall product phase status (at index '0') with the lowest of the group status values (indices '1' - '6')
//      - save the new / update the revised product status record.
//
//  Return value(s):    
//      none.
//
//  Output(s):          
//      updated (or new) product Status record written to database.
//=============================================================================================================
        
        function updateProductStatus(productId, groupId, phaseNum) {

//  Read the actions associated with this product / group
            
            actionsFactory.getActionsByProductGroupPhase(productId, groupId, phaseNum).error(function (data, status, headers, config) {
                $window.alert("Server error reading product/group Actions documents, not retrieved. Status = ", status);
            }).success(function (productActions) {
                
// Sort the product actions for this group by phase number and action status level.
                
                productActions = productActions.objSort("actionStatus");
                
// Read the product status record (should be only one, at most) for this product and phase
                
                statusFactory.getStatusByProductAndPhase(productId, phaseNum).error(function (data, status, headers, config) {
                    $window.alert("Server error retrieving Products document, not retrieved. Status = ", status);
                }).success(function (productStatus) {
                    
                    var i = 0,
                        j = 0,
                        newStatus = false,
                        opsIndex = null;
                    
//  If the status record does not yet exist, populate a template status object.
                    
                    if (productStatus.length === 0) {
                        newStatus = true;
                        productStatus[0] = {};
                        productStatus[0].productId = productId;
                        productStatus[0].phase = phaseNum;
                        productStatus[0].status = [6, 6, 6, 6, 6, 6, 6];
                    }
//  Convert the Group ID to an index for this group in the status array.
                    
                    opsIndex = getOpsGroupIndex(groupId);            /*  Get this group's index into the OpsStatus array */
                    if (null !== opsIndex) {

//  The first "Action" status value is the lowest; that is the group's overall status for this phase of this product.
                        
                        productStatus[0].status[opsIndex] = productActions[0].actionStatus;
                        productStatus[0].status[0] = 6;

//  Set the first opsStatus entry (overall product phase status at index '0') to the lowest of the group status values.

                        for (j = 1; j < 7; j++) {
                            productStatus[0].status[0] = Math.min(productStatus[0].status[0], productStatus[0].status[j]);
                        }

// Save the new or updated product status object back to the database.

                        if (newStatus) {
                            statusFactory.addStatus(productStatus[0]).error(function (data, status, headers, config) {
                                $window.alert("Server error adding Status document, not added. Status = ", status);
                            }).success(function (data) {
                                $log.log("Status for Product ID " + productId + " / Phase " + phaseNum + " added.");
                            });
                        } else {
                            statusFactory.updateStatus(productStatus[0]).error(function (data, status, headers, config) {
                                $window.alert("Server error updating Status document, not updated. Status = ", status);
                            }).success(function (data) {
                                $log.log("Status for Product ID " + productId + " / Phase " + phaseNum + " updated.");
                            });
                        }
                    }
                });
            });
            
        }
        

//=============================================================================================================
//  init:
//      This function pulls the initial data required for this web page, putting the appropriate data into the $scope.
//
//  Inputs:             
//      Group ID is passed into this controller as a parameter ($stateParams.groupId).
//
//  Process steps:
//      -   get the available operational groups and build an array sorted by operational group number 
//          -- Group #1 in array index 0, group #2 in index 1, etc.
//      -   read the requested Group ID record from the database, and save the Group Name into the $scope.
//      -   read the product records from the database, and save them into the $scope.
//          --  if the status record does not yet exist, populate a template record
//      -   read the objectives records from the database, and save them in the $scope, sorted by phase and sequence number.
//      -   read the milestones records from the database, and save them in the $scope, sorted by phase, objective, and sequence.
//          --  if no milestones are available for this group, present a dialog to the user indicating so, and return to the Groups state.
//      -   save the new / update the revised product status record.
//
//  Return value(s):    
//      none.
//
//  Output(s):          
//      Adds data to the $scope: $scope.opsGroups, $scope.groupName, $scope.products, $scope.objectives, and $scope.milestones.
//=============================================================================================================
        
        function init() {
            $scope.groupId = $stateParams.groupId;
            $scope.groupName = "Undefined Group";
            $scope.statusValues = [{ name: 'Not Started', idx: 0 },
                                   { name: 'In Progress', idx: 1 },
                                   { name: 'Follow Up', idx: 2 },
                                   { name: 'Complete', idx: 3 },
                                   { name: 'Not Applicable', idx: 4}];
            
            if ($rootScope.userAuthorized) {
                groupsFactory.getOpsGroups().error(function (data, status, headers, config) {
                    $log.warn('Server error getting Groups documents: ', status);
                }).success(function (opsGroups) {
                    $scope.opsGroups = opsGroups.objSort("opsId");
                });
                
                groupsFactory.getGroup($scope.groupId).error(function (data, status, headers, config) {
                    $log.warn('Server error getting Group document: ', status);
                }).success(function (group) {
                    $scope.groupName = group.groupName;
                });
                
                productsFactory.getProducts().error(function (data, status, headers, config) {
                    $log.warn('Server error getting Products documents: ', status);
                }).success(function (products) {
                    $scope.products = products;
                    
                    objectivesFactory.getObjectives().error(function (data, status, headers, config) {
                        $log.warn('Server error getting Objectives documents: ', status);
                    }).success(function (objectives) {
                        $scope.objectives = objectives.objSort("productPhaseNum", "objectiveSequence");
                    });
                
                    milestonesFactory.getMilestonesByGroup($scope.groupId).error(function (data, status, headers, config) {
                        $log.warn('Server error getting Milestones documents: ', status);
                    }).success(function (milestones) {
                        if (milestones !== null && milestones.length > 0) {
                            $scope.milestones = milestones.objSort("phaseNum", "objectiveId", "milestoneSeq");
                        } else {
                            $window.alert("No Milestones are defined for this Group.\nPlease select a different Group, or add Milestones.\n");
                            $state.go("groups");
                        }
                    });
                    
                });
            } else {
                $window.alert("\nYou are not authorized to access this web site.\n (03.02)");
                $state.go("main");
            }
        }
 
//=============================================================================================================
//  refreshActions:
//      This function retrieves actions records once the user selects a product for updating. If no actions are available
//      then this function will prompt the user to add actions for this product based on defined group milestones.
//
//  Inputs:             
//      none.
//
//  Process steps:
//      -   get the available actions for this group and the user-selected product
//          -- Group #1 in array index 0, group #2 in index 1, etc.
//      -   If there are more milestones than defined actions, prompt the user to generate actions for this product.
//          --  if user confirms, add actions for milestones without actions defined:
//              --- loop through the milestones and find matching actions
//              --- if no action is found for a milestone, create an entry in a newActions array
//              --- post any new actions to the database
//              --- read actions from the database for this product / group again, and put the actions into the $scope.
//              --- call the "buildActionList" function to integrate the actions with the objectives and milestones.
//          --  if the user does not confirm adding the actions: 
//              --- move available actions into the $scope, and call "buildActionList" to integrate them with objectives / milestones.
//              --- if no actions are available, nothing will be presented to the user (via the $scope.actionsRetrieved flag set to false).
//      -   if # milestones === # actions, move the actions into the $scope and call "buildActionList" to integrate things.
//
//  Return value(s):    
//      none.
//
//  Output(s):          
//      available actions moved into $scope.actions; new actions created and included in $scope.actions. 
//      $scope.milestones and $scope.objectives updated via call to "buildActionList" function.
//=============================================================================================================
        
        $scope.refreshActions = function () {

            // this function refreshes the actions list when the product selection changes.  
            
            $scope.actionsRetrieved = false;
            
            actionsFactory.getActionsByProductAndGroup($scope.productId, $scope.groupId).error(function (data, status, headers, config) {
                $log.log("Server error retrieving Actions details for selected product/group: ", status);
            }).success(function (actions) {
                
                var i = 0,
                    j = 0,
                    k = 0,
                    actionFound = false,
                    newActions = [];

//  If no actions exist yet for this product / group, add actions for each milestone. Compile an array of actions, 
//  and batch add all at once by passing the array to the Factory.
                
                if (actions === null || actions.length < $scope.milestones.length) {
                    if ($window.confirm("\nAction(s) missing for this Product.  Add missing Actions now?\n")) {
                        
                        if (actions === null) {
                            $scope.actions = [];
                        } else {
                            $scope.actions = actions;
                        }

//  Loop through the milestones to find matching actions. 
                        
                        k = 0;
                        for (i = 0; i < $scope.milestones.length; i++) {
                            actionFound = false;
                            for (j = 0; j < $scope.actions.length; j++) {
                                if ($scope.actions[j].milestoneId === $scope.milestones[i]._id) {
                                    actionFound = true;
                                    break;
                                }
                            }

//  If no action was found for this milestone, create a new action.

                            if (!actionFound) {
                                newActions[k] = {};
                                newActions[k].productId = $scope.productId;
                                newActions[k].groupId = $scope.groupId;
                                newActions[k].milestoneId = $scope.milestones[i]._id;
                                newActions[k].phaseNum = $scope.milestones[i].phaseNum;
                                newActions[k].actionStatus = 0;
                                k += 1;
                            }
                        }

//  Post new actions to the database.

                        if (newActions.length > 0) {
                            actionsFactory.addAction(newActions).error(function (data, status, headers, config) {
                                $log.log("Server error adding new Actions details for Milestones: " + status);
                            }).success(function (data) {
                                $log.log("Added " + newActions.length + " Action(s) for this Product / Group.");
                                
//  Read all actions for this product / group again, to have the full set of actions for presentation. Move them into the $scope.
                                
                                actionsFactory.getActionsByProductAndGroup($scope.productId, $scope.groupId).error(function (data, status, headers, config) {
                                    $log.log("Server error retrieving new Actions details for selected product/group: ", status);
                                }).success(function (actions) {
                                    $scope.actions = actions;
                                    $scope.actionsRetrieved = true;
                                    buildActionList();
                                });

                            });
                        }
                    } else if (actions.length > 0) {
                        $scope.actions = actions;
                        $scope.actionsRetrieved = true;
                        buildActionList();
                        
//  if no actions are available for this product / group, let the user know, and return to the "groups" state.
                        
                    } else {
                        $window.alert("\nNo actions available to view/update for this product and group.\n");
                        $state.go("groups");
                    }
//  if all milestones have actions, move actions into $scope, call "buildActionList" to integrate actions with objectives/milestones.
                } else {
                    $scope.actions = actions;
                    $scope.actionsRetrieved = true;
                    buildActionList();
                }
                
            });
        };
        
//=============================================================================================================
//  updateActionStatus:
//      This function updates the status for a specific action entry when the user makes a change to the value.
//
//  Inputs:             
//      index to the action's Objective (objIdx)
//      index to the action's Milestone (msIdx)
//      Action ID for the action updated.
//      NOTE: the new value for the action is in the Objective record within the $scope.
//
//  Process steps:
//      -   retrieve the revised action status from the scope, using the indices provided from the web page.
//          -- Group #1 in array index 0, group #2 in index 1, etc.
//      -   retrieve the phase number for the updated action.
//      -   create an update record for this action's status, using action ID, action status, and action phase number
//          --  phase number should NOT be changing for an action, so it probably is not required in this update query
//      -   write the updated action record to the database via the Factory
//      -   call the "updateProductStatus" function to update the Product status record, passing product ID, group ID, and phase number.
//
//  Return value(s):    
//      none.
//
//  Output(s):          
//      updated Action status in the database. 
//      updated Product status in the database (accomplished via function call to updateProductStatus.)
//=============================================================================================================
        
        $scope.updateActionStatus = function (objIdx, msIdx, actionId) {
            var i = 0,
                j = 0,
                milestoneFound = false,
                status = 0,
                phaseNum = 0,
                actionChange = {};

            status = $scope.objectives[objIdx].milestones[msIdx].milestoneStatus;
            phaseNum = $scope.objectives[objIdx].productPhaseNum;
            
            actionChange._id = actionId;
            actionChange.actionStatus = status;
            actionChange.phaseNum = phaseNum;
            
            actionsFactory.updateAction(actionChange).error(function (data, status, headers, config) {
                $window.alert("Server error posting Action, not updated. Status = ", status);
            }).success(function (data) {
                $log.info("Status update for Action id: ", actionChange._id);
                
                updateProductStatus($scope.productId, $scope.groupId, phaseNum);
            });
        };
               
//=============================================================================================================
//  Placeholder function for authentication.
//=============================================================================================================

        function authenticateUser() {

    // Authorize this user if logged in email is found in Users.
            usersFactory.getUserByEmail($rootScope.user.email)
                .error(function (data, status, headers, config) {
                    $window.alert("\nUnable to authenticate user at this time.\n (03.03)");
                    $state.go("main");
                })
                .success(function (user) {
                    $rootScope.userAuthority = 1;
                    if (user.length === 1) {
                        if (user[0].admin) {
                            $rootScope.userAuthority = 3;
                        } else if (user[0].editor) {
                            $rootScope.userAuthority = 2;
                        }
                        
                        $rootScope.userAuthorized = true;
                        $rootScope.userAuthenticated = true;
                        $rootScope.userId = user[0]._id;
                        init();
                    } else {
                        $window.alert("\nYou are not authorized to access this web site. (03.01)\n");
                        $state.go("main");
                    }
                });
        }

        
        if (!$rootScope.userAuthenticated) {
            authenticateUser();  // request user authentication with factory.
        } else {
            init();
        }
        
        
    };
    
    ActionsCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$window', 'actionsFactory', 'usersFactory', 'groupsFactory', 'productsFactory', 'objectivesFactory', 'milestonesFactory', 'statusFactory'];

    angular.module('portApp').controller('ActionsCtrl', ActionsCtrl);
    
}());