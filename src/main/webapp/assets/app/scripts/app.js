'use strict';

/**
 * @ngdoc overview
 * @name assetsApp
 * @description
 * # assetsApp
 *
 * Main module of the application.
 */
angular
    .module('assetsApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'angularBootstrapNavTree'
    ])
    .config(function ($routeProvider, $httpProvider) {
        $httpProvider.defaults.useXDomain = true;

        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/orders', {
                templateUrl: 'views/orders.html',
                controller: 'OrdersCtrl'
            })
            .when('/order/:id', {
                templateUrl: 'views/order.html',
                controller: 'OrderCtrl'
            })
            .when('/order', {
                templateUrl: 'views/order.html',
                controller: 'OrderCtrl'
            })
            .when('/object', {
                templateUrl: 'views/object.html',
                controller: 'ObjectCtrl'
            })
            .when('/doc', {
                templateUrl: 'views/doc.html',
                controller: 'DocCtrl'
            })
            .otherwise({
                redirectTo: '#/'
            });
    })
    .run(function ($timeout, $location, $rootScope) {
        $rootScope.text = {
            general: "ГЛАВНАЯ",
            settings: "НАСТРОЙКИ",
            exit: "ВЫХОД",
            technicalSupport: "Тех поддержка"
        }

    })
    .directive('modal', function () {
        return {
            template: '<div class="modal fade">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h4 class="modal-title">{{ title }}</h4>' +
            '</div>' +
            '<div class="modal-body" ng-transclude>'+
            '</div></div>' +
            '</div>' +
            '</div>',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                scope.title = attrs.title;
                scope.$watch(attrs.visible, function (value) {
                    if (value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function () {
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = true;
                    });
                });

                $(element).on('hidden.bs.modal', function () {
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = false;
                    });
                });
            }
        };
    })

