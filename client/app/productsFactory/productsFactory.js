/*jslint node: true, nomen: true  */
/*global angular  */

(function () {
    'use strict';
    var productsFactory = function ($http) {
        
        var factory = {},
            users = null;
            
//  Services related to "products"
        
        factory.getProducts = function () {
            return $http.get('/api/products');
        };
        
        factory.getProduct = function (productId) {
            return $http.get('/api/products/' + productId);
        };
        
        factory.updateProduct = function (product) {
            return $http.put('/api/products/' + product._id, product);
        };

        factory.addProduct = function (product) {
            return $http.post('/api/products', product);
        };
        
        return factory;
    };

    productsFactory.$inject = ['$http'];
    
    angular.module('portApp').factory('productsFactory', productsFactory);
    
}());