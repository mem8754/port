/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('addProduct', {
                url: '/addProduct',
                templateUrl: 'app/controllers/addControllers/addProduct/addProduct.html',
                controller: 'AddProductCtrl'
            });
    });