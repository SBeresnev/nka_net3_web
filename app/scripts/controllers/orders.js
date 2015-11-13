/**
 * Created by belonovich on 21.01.2015.
 */

'use strict';


angular.module('assetsApp')
    .controller('OrdersCtrl', function ($scope, $http, $location, DOMAIN, ordervar) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.showId = [];
        $scope.init = function () {
            $scope.showLoading = true;
            $http.get(DOMAIN + "/nka_net3/decl/get_journal")
                .then(function (res) {
                    $scope.orders = res.data;
                    $scope.showLoading = false;
                }).catch(function () {
                    $scope.showLoading = false;
                    alert("Ошибка сервера");
                });
        };

        $scope.getOrderById = function (id) {
            $location.path("/order/" + id);
        };

        $scope.newOrder = function () {
            $http.get(DOMAIN + "/nka_net3/decl/new_decl")
                .then(function (res) {
                    $location.path("/order/" + res.data.decl_id);
                }).catch(function () {
                    $scope.showLoading = false;
                    alert("Ошибка сервера");
                });
        };

        $scope.filterIdenticalSubject = function (element, index, array) {
            var result = true;
            if (element.declrepr_type == 2) {
                result = $scope.showId.indexOf(element.person.subjectId) == -1;
                $scope.showId.push(element.person.subjectId);
            }
            if (index + 1 == array.length) {
                $scope.showId = [];
            }
            return result;
        };

        $scope.getLast = function (item) {
            var compareItem = item[0];
            if (item.length > 1) {
                for (var i = 1; i < item.length; i++) {
                    compareItem = item[i].resolutionDate > compareItem.resolutionDate ? item[i] : compareItem;
                }
            }
            return compareItem;
        }
    });
