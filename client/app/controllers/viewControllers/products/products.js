/*jslint node: true, nomen: true  */
/*global angular  */

'use strict';

angular.module('portApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('products', {
                url: '/products',
                templateUrl: 'app/controllers/viewControllers/products/products.html',
                controller: 'ProductsCtrl'
            });
    });