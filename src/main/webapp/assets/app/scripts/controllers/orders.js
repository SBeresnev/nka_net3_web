/**
 * Created by belonovich on 21.01.2015.
 */

'use strict';


angular.module('assetsApp')
  .controller('OrdersCtrl', function ($scope,$http, $location) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.getOrders = function () {
      $http.get('/data/orders.json')
        .then(function (res) {
          $scope.orders = res.data;
        });
    }
    $scope.orders = $scope.getOrders()

    $scope.getOrderById = function(id){
      $location.path("/order/"+id);
    }

    $scope.newOrder = function(){
      $location.path("/order/");
    }

  });
