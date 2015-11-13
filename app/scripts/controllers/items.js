/**
 * Created by belonovich on 26.02.2015.
 */
'use strict';

angular.module('assetsApp')
    .controller('ItemsCtrl', function ($scope,$http, $location) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });
