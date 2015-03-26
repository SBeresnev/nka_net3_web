/**
 * Created by belonovich on 21.01.2015.
 */

'use strict';


angular.module('assetsApp')
  .controller('OrdersCtrl', function ($scope,$http, $location, DOMAIN, ordervar) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.init = function(){
      $scope.showLoading = true;
      $http.get(DOMAIN+"/nka_net3/decl/get_journal")
          .then(function (res) {
            $scope.orders = res.data;
            $scope.showLoading = false;
          });
    };
    $scope.getOrders = function () {
      $http.get('/data/orders.json')
        .then(function (res) {
          $scope.orders = res.data;
        });
    };

    $scope.getOrderById = function(id){
      $location.path("/order/"+id);
    };

    $scope.newOrder = function(){
      $http.get(DOMAIN+"/nka_net3/decl/new_decl")
          .then(function (res) {
            $location.path("/order/"+res.data);
          });
    };

      $scope.getLast = function(item){
        var compareItem = item[0];
        if(item.length > 1){
          for(var i = 1; i < item.length; i++){
            compareItem = item[i].resolutionDate > compareItem.resolutionDate ? item[i] : compareItem;
          }
        }
        return compareItem;
      }
  });
