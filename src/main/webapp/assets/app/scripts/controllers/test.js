/**
 * Created by belonovich on 28.04.2015.
 */
'use strict';

angular.module('assetsApp')
    .controller('TestCtrl', function ($scope,$http, $location) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });