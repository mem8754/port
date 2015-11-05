/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('editProduct', {
                url: '/editProduct/:id',
                templateUrl: 'app/editProduct/editProduct.html',
                controller: 'EditProductCtrl'
            });
    });